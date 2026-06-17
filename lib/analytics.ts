import { dbConnect } from "@/lib/db";
import { User } from "@/models/User";
import { Lead, type LeadSource } from "@/models/Lead";
import { Endorsement } from "@/models/Endorsement";
import type {
  AnalyticsData,
  EndorsementByProject,
  LeadBreakdown,
  TimeSeriesPoint,
} from "@/types";

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

const WEEK_LABEL = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
});

const SOURCE_LABELS: Record<LeadSource, string> = {
  portfolio: "Portfolio",
  newsletter: "Newsletter",
  "quote-request": "Quote request",
};

// `range` arrives as e.g. "8w"; we treat it as a number of weeks (4–26, default 8).
export function parseAnalyticsRange(sp: URLSearchParams): number {
  const raw = Number.parseInt((sp.get("range") ?? "").replace(/\D/g, ""), 10);
  if (!Number.isFinite(raw) || raw <= 0) return 8;
  return Math.min(26, Math.max(4, raw));
}

export async function getAnalytics(weeks: number): Promise<AnalyticsData> {
  await dbConnect();

  const now = Date.now();
  const since = new Date(now - weeks * WEEK_MS);

  const [users, leadGroups, endorsementGroups] = await Promise.all([
    User.find({ createdAt: { $gte: since } })
      .select("createdAt")
      .lean(),
    Lead.aggregate<{ _id: LeadSource; count: number }>([
      { $group: { _id: "$source", count: { $sum: 1 } } },
    ]),
    Endorsement.aggregate<{ count: number; project: string }>([
      { $match: { status: "approved", projectId: { $ne: null } } },
      { $group: { _id: "$projectId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 6 },
      {
        $lookup: {
          from: "projects",
          localField: "_id",
          foreignField: "_id",
          as: "project",
        },
      },
      { $unwind: "$project" },
      { $project: { _id: 0, count: 1, project: "$project.name" } },
    ]),
  ]);

  // Bucket signups into contiguous 7-day windows so empty weeks render as zero.
  const signups: TimeSeriesPoint[] = [];
  for (let i = 0; i < weeks; i++) {
    const start = now - (weeks - i) * WEEK_MS;
    const end = start + WEEK_MS;
    const value = users.filter((u) => {
      const t = new Date(u.createdAt).getTime();
      return t >= start && t < end;
    }).length;
    signups.push({ label: WEEK_LABEL.format(new Date(start)), value });
  }

  const leadSources: LeadBreakdown[] = leadGroups
    .map((g) => ({
      source: SOURCE_LABELS[g._id] ?? String(g._id),
      count: g.count,
    }))
    .sort((a, b) => b.count - a.count);

  const endorsementsByProject: EndorsementByProject[] = endorsementGroups.map(
    (g) => ({ project: g.project, count: g.count }),
  );

  return { signups, leadSources, endorsementsByProject };
}
