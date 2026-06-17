import { dbConnect } from "@/lib/db";
import { Endorsement } from "@/models/Endorsement";
import { Project } from "@/models/Project";
import { Profile } from "@/models/Profile";
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
