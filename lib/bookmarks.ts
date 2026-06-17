import { dbConnect } from "@/lib/db";
import { Bookmark } from "@/models/Bookmark";
// Ensure the Project model is registered before populate runs.
import "@/models/Project";
import type { Bookmark as BookmarkView } from "@/types";

export type UserBookmarkItem = BookmarkView & { projectId: string };

type PopulatedProject = {
  _id: unknown;
  slug: string;
  name: string;
  tagline?: string;
  type?: string;
  stack?: string[];
};

/** A user's bookmarks (newest first) with their project details populated. */
export async function fetchUserBookmarks(
  userId: string,
): Promise<UserBookmarkItem[]> {
  await dbConnect();
  const docs = await Bookmark.find({ userId })
    .sort({ createdAt: -1 })
    .populate<{ projectId: PopulatedProject | null }>(
      "projectId",
      "slug name tagline type stack",
    )
    .lean();

  const items: UserBookmarkItem[] = [];
  for (const doc of docs) {
    const project = doc.projectId;
    if (!project) continue; // project was deleted — drop the orphaned bookmark
    items.push({
      id: String(doc._id),
      projectId: String(project._id),
      projectSlug: project.slug,
      projectName: project.name,
      projectTagline: project.tagline ?? "",
      projectType: project.type ?? "",
      stack: project.stack ?? [],
      bookmarkedAt: doc.createdAt.toISOString(),
    });
  }
  return items;
}
