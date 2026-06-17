import { dbConnect } from "@/lib/db";
import { Project } from "@/models/Project";
import { Lead } from "@/models/Lead";
import { Endorsement } from "@/models/Endorsement";
import { User } from "@/models/User";
import type { AdminStats } from "@/types";

// Headline counts for the admin overview. One round-trip per metric, run in
// parallel. There's no real visit tracking yet (analytics lands in 3.22), so
// the fourth card reports registered users instead of fabricating traffic.
export async function getAdminStats(): Promise<AdminStats> {
  await dbConnect();

  const [
    projects,
    published,
    leads,
    unread,
    endorsements,
    pending,
    users,
    suspended,
  ] = await Promise.all([
    Project.countDocuments({}),
    Project.countDocuments({ status: "live" }),
    Lead.countDocuments({}),
    Lead.countDocuments({ status: "new" }),
    Endorsement.countDocuments({}),
    Endorsement.countDocuments({ status: "pending" }),
    User.countDocuments({}),
    User.countDocuments({ suspended: true }),
  ]);

  return {
    projects: { total: projects, published },
    leads: { total: leads, unread },
    endorsements: { total: endorsements, pending },
    users: { total: users, suspended },
  };
}
