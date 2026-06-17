import { dbConnect } from "@/lib/db";
import { Endorsement, type EndorsementStatus } from "@/models/Endorsement";
import { Project } from "@/models/Project";
import { Profile } from "@/models/Profile";
import { ENDORSEMENT_STATUSES } from "@/lib/validations";
import type { UserEndorsement } from "@/types";

/** The skills Syed lists on his profile — the only valid endorsement targets. */
export async function getProfileSkills(): Promise<string[]> {
  await dbConnect();
  const profile = await Profile.findById("singleton").select("skills").lean();
  return profile?.skills ?? [];
}

export type EndorsableProject = { id: string; slug: string; name: string };

/** Published projects an endorsement can be attached to. */
export async function getEndorsableProjects(): Promise<EndorsableProject[]> {
  await dbConnect();
  const docs = await Project.find({ status: { $ne: "draft" } })
    .sort({ order: 1 })
    .select("slug name")
    .lean();
  return docs.map((p) => ({ id: String(p._id), slug: p.slug, name: p.name }));
}

type PopulatedProject = { slug: string; name: string } | null;

/** A user's own endorsements (all statuses), newest first. */
export async function fetchUserEndorsements(
  userId: string,
): Promise<UserEndorsement[]> {
  await dbConnect();
  const docs = await Endorsement.find({ userId })
    .sort({ createdAt: -1 })
    .populate<{ projectId: PopulatedProject }>("projectId", "slug name")
    .lean();

  return docs.map((doc) => ({
    id: String(doc._id),
    projectSlug: doc.projectId?.slug ?? "",
    projectName: doc.projectId?.name ?? "",
    skill: doc.skill,
    text: doc.text,
    status: doc.status,
    submittedAt: doc.createdAt.toISOString(),
  }));
}

// — Admin moderation —————————————————————————————————————————————————————————

const ADMIN_ENDORSEMENTS_PAGE_SIZE = 10;

export type AdminEndorsementItem = {
  id: string;
  skill: string;
  text: string;
  endorserName: string;
  endorserRole: string;
  status: EndorsementStatus;
  submittedAt: string;
};

export type EndorsementListParams = {
  status?: EndorsementStatus;
  page: number;
};

type PopulatedUser = { name: string; email: string } | null;

type LeanAdminEndorsement = {
  _id: unknown;
  skill: string;
  text: string;
  status: EndorsementStatus;
  createdAt: Date;
  userId: PopulatedUser;
};

// No job-title field exists on User, so the endorser's email fills the
// secondary line — it's what an admin needs to identify who endorsed.
const mapAdminEndorsement = (doc: LeanAdminEndorsement): AdminEndorsementItem => ({
  id: String(doc._id),
  skill: doc.skill,
  text: doc.text,
  endorserName: doc.userId?.name ?? "Unknown user",
  endorserRole: doc.userId?.email ?? "",
  status: doc.status,
  submittedAt: doc.createdAt.toISOString(),
});

export function parseEndorsementListParams(sp: URLSearchParams): EndorsementListParams {
  const statusRaw = sp.get("status") ?? "";
  const status = (ENDORSEMENT_STATUSES as readonly string[]).includes(statusRaw)
    ? (statusRaw as EndorsementStatus)
    : undefined;
  const page = Math.max(1, Number.parseInt(sp.get("page") ?? "1", 10) || 1);
  return { status, page };
}

/** Paginated moderation queue, optionally filtered by status. */
export async function fetchAdminEndorsements(params: EndorsementListParams): Promise<{
  items: AdminEndorsementItem[];
  total: number;
  page: number;
  totalPages: number;
}> {
  await dbConnect();
  const filter = params.status ? { status: params.status } : {};

  const total = await Endorsement.countDocuments(filter);
  const totalPages = Math.max(1, Math.ceil(total / ADMIN_ENDORSEMENTS_PAGE_SIZE));
  const page = Math.min(params.page, totalPages);

  const docs = await Endorsement.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * ADMIN_ENDORSEMENTS_PAGE_SIZE)
    .limit(ADMIN_ENDORSEMENTS_PAGE_SIZE)
    .populate<{ userId: PopulatedUser }>("userId", "name email")
    .lean();

  return { items: docs.map(mapAdminEndorsement), total, page, totalPages };
}

/** Every endorsement, newest first — feeds the queue UI's client-side tabs. */
export async function fetchAllAdminEndorsements(): Promise<AdminEndorsementItem[]> {
  await dbConnect();
  const docs = await Endorsement.find()
    .sort({ createdAt: -1 })
    .populate<{ userId: PopulatedUser }>("userId", "name email")
    .lean();
  return docs.map(mapAdminEndorsement);
}

/**
 * Set an endorsement's status, keeping the attached project's denormalized
 * `endorsementCount` in sync. The count only tracks *approved* endorsements
 * that target a project, so we apply the delta atomically via `$inc`.
 */
export async function setEndorsementStatus(
  id: string,
  status: EndorsementStatus,
): Promise<{ id: string; status: EndorsementStatus } | null> {
  await dbConnect();
  const existing = await Endorsement.findById(id).select("status projectId").lean();
  if (!existing) return null;

  const updated = await Endorsement.findByIdAndUpdate(id, { status }, { new: true })
    .select("status")
    .lean();
  if (!updated) return null;

  const wasCounted = existing.status === "approved" && Boolean(existing.projectId);
  const isCounted = status === "approved" && Boolean(existing.projectId);
  const delta = (isCounted ? 1 : 0) - (wasCounted ? 1 : 0);
  if (delta !== 0 && existing.projectId) {
    await Project.updateOne(
      { _id: existing.projectId },
      { $inc: { endorsementCount: delta } },
    );
  }

  return { id, status: updated.status };
}
