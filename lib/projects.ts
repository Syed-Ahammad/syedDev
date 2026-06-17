import type { QueryFilter, Types } from "mongoose";
import { dbConnect } from "@/lib/db";
import { Project, type IProject } from "@/models/Project";
import type {
  Project as ProjectListItem,
  ProjectDetail,
} from "@/types";

/** A single project record carrying its id plus list + detail fields. */
export type ProjectWithDetail = ProjectListItem & ProjectDetail & { id: string };

type ProjectDoc = IProject & { _id: Types.ObjectId };

const LIST_FIELDS = "slug name tagline type stack status order";
const DETAIL_FIELDS = `${LIST_FIELDS} problem approach outcome year role links`;

export const PROJECT_SORTS = ["recent", "endorsed", "alpha", "status"] as const;
export type ProjectSort = (typeof PROJECT_SORTS)[number];

export const DEFAULT_LIMIT = 8;
export const MAX_LIMIT = 24;

export type ProjectQueryParams = {
  q: string;
  stack: string[];
  type: string;
  sort: ProjectSort;
  page: number;
  limit: number;
};

export type ProjectListResult = {
  items: ProjectListItem[];
  total: number;
  page: number;
  totalPages: number;
};

/** Normalize raw URL search params into a clamped, validated query. */
export function parseProjectParams(sp: URLSearchParams): ProjectQueryParams {
  const sortRaw = sp.get("sort") ?? "recent";
  const sort: ProjectSort = (PROJECT_SORTS as readonly string[]).includes(sortRaw)
    ? (sortRaw as ProjectSort)
    : "recent";

  const limitRaw =
    Number.parseInt(sp.get("limit") ?? String(DEFAULT_LIMIT), 10) || DEFAULT_LIMIT;

  return {
    q: (sp.get("q") ?? "").trim(),
    stack: (sp.get("stack") ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    type: (sp.get("type") ?? "").trim(),
    sort,
    page: Math.max(1, Number.parseInt(sp.get("page") ?? "1", 10) || 1),
    limit: Math.min(MAX_LIMIT, Math.max(1, limitRaw)),
  };
}

/** Build the Mongo filter. Public listing always hides drafts. */
export function buildProjectFilter(
  params: ProjectQueryParams,
): QueryFilter<IProject> {
  const filter: QueryFilter<IProject> = { status: { $ne: "draft" } };
  if (params.q) filter.$text = { $search: params.q };
  if (params.type) filter.type = params.type;
  if (params.stack.length) filter.stack = { $in: params.stack };
  return filter;
}

/**
 * Sort spec per option. `status` sorts the enum strings descending so that
 * "live" > "in-progress" > "draft" — which matches the curated display order —
 * with `order` as the tie-breaker.
 */
export function sortSpecFor(sort: ProjectSort): Record<string, 1 | -1> {
  switch (sort) {
    case "alpha":
      return { name: 1 };
    case "status":
      return { status: -1, order: 1 };
    case "endorsed":
      return { endorsementCount: -1, order: 1 };
    case "recent":
    default:
      return { order: 1 };
  }
}

/** Query projects from MongoDB with search, filter, sort and pagination. */
export async function fetchProjects(
  params: ProjectQueryParams,
): Promise<ProjectListResult> {
  await dbConnect();
  const filter = buildProjectFilter(params);

  const total = await Project.countDocuments(filter);
  const totalPages = Math.max(1, Math.ceil(total / params.limit));
  const page = Math.min(params.page, totalPages);

  const items = await Project.find(filter)
    .sort(sortSpecFor(params.sort))
    .skip((page - 1) * params.limit)
    .limit(params.limit)
    .select(LIST_FIELDS)
    .lean<ProjectListItem[]>();

  return { items, total, page, totalPages };
}

/** Shape a raw project doc into the detail record, filling missing fields with
 *  safe fallbacks so the UI never renders "undefined". */
function mapDetail(doc: ProjectDoc): ProjectWithDetail {
  return {
    id: String(doc._id),
    slug: doc.slug,
    name: doc.name,
    tagline: doc.tagline ?? "",
    type: doc.type ?? "",
    stack: doc.stack ?? [],
    status: doc.status,
    order: doc.order,
    problem: doc.problem ?? "",
    approach: doc.approach ?? "",
    outcome: doc.outcome ?? "",
    year: doc.year ?? new Date().getFullYear(),
    role: doc.role ?? "",
    links: doc.links ?? [],
  };
}

/**
 * One published (non-draft) project by slug. Read-only — used by the page and
 * metadata. The view counter lives in `getProjectBySlugCountingView`.
 */
export async function getProjectBySlug(
  slug: string,
): Promise<ProjectWithDetail | null> {
  await dbConnect();
  const doc = await Project.findOne({ slug, status: { $ne: "draft" } })
    .select(DETAIL_FIELDS)
    .lean<ProjectDoc | null>();
  return doc ? mapDetail(doc) : null;
}

/**
 * Like `getProjectBySlug` but atomically increments `views` — for the public
 * GET /api/projects/[slug] route handler.
 */
export async function getProjectBySlugCountingView(
  slug: string,
): Promise<ProjectWithDetail | null> {
  await dbConnect();
  const doc = await Project.findOneAndUpdate(
    { slug, status: { $ne: "draft" } },
    { $inc: { views: 1 } },
    { new: true },
  )
    .select(DETAIL_FIELDS)
    .lean<ProjectDoc | null>();
  return doc ? mapDetail(doc) : null;
}

/** Up to `limit` other published projects of the same type. */
export async function getRelatedProjects(
  project: Pick<ProjectListItem, "slug" | "type">,
  limit = 3,
): Promise<ProjectListItem[]> {
  await dbConnect();
  return Project.find({
    type: project.type,
    slug: { $ne: project.slug },
    status: { $ne: "draft" },
  })
    .sort({ order: 1 })
    .limit(limit)
    .select(LIST_FIELDS)
    .lean<ProjectListItem[]>();
}

export const ADMIN_PROJECTS_PAGE_SIZE = 10;

export type AdminProjectItem = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  type: string;
  stack: string[];
  status: IProject["status"];
  order: number;
  endorsementCount: number;
  views: number;
};

/** All projects incl. drafts, paginated, for the admin table. */
export async function fetchAdminProjects(page: number): Promise<{
  items: AdminProjectItem[];
  total: number;
  page: number;
  totalPages: number;
}> {
  await dbConnect();
  const total = await Project.countDocuments({});
  const totalPages = Math.max(1, Math.ceil(total / ADMIN_PROJECTS_PAGE_SIZE));
  const safePage = Math.min(Math.max(1, page), totalPages);

  const docs = await Project.find({})
    .sort({ order: 1 })
    .skip((safePage - 1) * ADMIN_PROJECTS_PAGE_SIZE)
    .limit(ADMIN_PROJECTS_PAGE_SIZE)
    .select("slug name tagline type stack status order endorsementCount views")
    .lean();

  const items: AdminProjectItem[] = docs.map((p) => ({
    id: String(p._id),
    slug: p.slug,
    name: p.name,
    tagline: p.tagline ?? "",
    type: p.type ?? "",
    stack: p.stack ?? [],
    status: p.status,
    order: p.order,
    endorsementCount: p.endorsementCount,
    views: p.views,
  }));

  return { items, total, page: safePage, totalPages };
}

/** Slugs of all published projects, for generateStaticParams. */
export async function getPublishedSlugs(): Promise<string[]> {
  await dbConnect();
  const docs = await Project.find({ status: { $ne: "draft" } })
    .select("slug")
    .lean<{ slug: string }[]>();
  return docs.map((d) => d.slug);
}

/** Distinct, sorted project types for the filter chips (drafts excluded). */
export async function getProjectTypes(): Promise<string[]> {
  await dbConnect();
  const types = await Project.distinct("type", { status: { $ne: "draft" } });
  return (types as string[]).filter(Boolean).sort();
}
