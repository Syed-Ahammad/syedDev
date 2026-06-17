import { dbConnect } from "@/lib/db";
import { BlogPost, type IBlogPost } from "@/models/BlogPost";
import type { BlogPost as BlogPostItem } from "@/types";

export const ADMIN_BLOG_PAGE_SIZE = 10;
export const BLOG_PAGE_SIZE = 9;

/** ~200 wpm reading estimate, floored at 1 minute. */
export function readMinutes(body: string): number {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

type LeanPost = IBlogPost & { _id: unknown };

// `body` is included because the read-time estimate is derived from it.
const PUBLIC_FIELDS = "slug title excerpt tag body publishedAt createdAt";

const toPublicPost = (doc: LeanPost): BlogPostItem => ({
  slug: doc.slug,
  title: doc.title,
  excerpt: doc.excerpt ?? "",
  tag: doc.tag ?? "",
  publishedAt: (doc.publishedAt ?? doc.createdAt).toISOString(),
  readMinutes: readMinutes(doc.body),
  body: doc.body,
});

/** All published posts, newest first, optionally filtered by tag. */
export async function getPublishedPosts(tag?: string): Promise<BlogPostItem[]> {
  await dbConnect();
  const filter: Record<string, unknown> = { published: true };
  if (tag) filter.tag = tag;
  const docs = await BlogPost.find(filter)
    .sort({ publishedAt: -1, createdAt: -1 })
    .select(PUBLIC_FIELDS)
    .lean();
  return docs.map(toPublicPost);
}

/** One published post by slug (drafts are invisible to the public). */
export async function getPublishedPost(slug: string): Promise<BlogPostItem | null> {
  await dbConnect();
  const doc = await BlogPost.findOne({ slug, published: true })
    .select(PUBLIC_FIELDS)
    .lean();
  return doc ? toPublicPost(doc) : null;
}

/** Other published posts sharing a tag (for the detail page footer). */
export async function getRelatedPosts(
  slug: string,
  tag: string,
  limit = 3,
): Promise<BlogPostItem[]> {
  if (!tag) return [];
  await dbConnect();
  const docs = await BlogPost.find({ published: true, tag, slug: { $ne: slug } })
    .sort({ publishedAt: -1, createdAt: -1 })
    .limit(limit)
    .select(PUBLIC_FIELDS)
    .lean();
  return docs.map(toPublicPost);
}

export async function getPublishedBlogSlugs(): Promise<string[]> {
  await dbConnect();
  const docs = await BlogPost.find({ published: true }).select("slug").lean();
  return docs.map((d) => d.slug);
}

export async function getPublishedTags(): Promise<string[]> {
  await dbConnect();
  const tags = await BlogPost.distinct("tag", { published: true });
  return (tags as (string | null)[])
    .filter((t): t is string => Boolean(t))
    .sort((a, b) => a.localeCompare(b));
}

/** Paginated published list — backs GET /api/blog. */
export async function fetchPublishedPostsPage(params: {
  tag?: string;
  page: number;
}): Promise<{
  items: BlogPostItem[];
  total: number;
  page: number;
  totalPages: number;
}> {
  await dbConnect();
  const filter: Record<string, unknown> = { published: true };
  if (params.tag) filter.tag = params.tag;

  const total = await BlogPost.countDocuments(filter);
  const totalPages = Math.max(1, Math.ceil(total / BLOG_PAGE_SIZE));
  const page = Math.min(Math.max(1, params.page), totalPages);

  const docs = await BlogPost.find(filter)
    .sort({ publishedAt: -1, createdAt: -1 })
    .skip((page - 1) * BLOG_PAGE_SIZE)
    .limit(BLOG_PAGE_SIZE)
    .select(PUBLIC_FIELDS)
    .lean();

  return { items: docs.map(toPublicPost), total, page, totalPages };
}

export type AdminBlogItem = BlogPostItem & { id: string; published: boolean };

/** Admin list including drafts, paginated, newest-created first. */
export async function fetchAdminPosts(page: number): Promise<{
  items: AdminBlogItem[];
  total: number;
  page: number;
  totalPages: number;
}> {
  await dbConnect();
  const total = await BlogPost.countDocuments();
  const totalPages = Math.max(1, Math.ceil(total / ADMIN_BLOG_PAGE_SIZE));
  const current = Math.min(Math.max(1, page), totalPages);

  const docs = await BlogPost.find()
    .sort({ createdAt: -1 })
    .skip((current - 1) * ADMIN_BLOG_PAGE_SIZE)
    .limit(ADMIN_BLOG_PAGE_SIZE)
    .lean();

  const items = docs.map((doc) => ({
    ...toPublicPost(doc),
    id: String(doc._id),
    published: doc.published,
  }));
  return { items, total, page: current, totalPages };
}
