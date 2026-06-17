import type {
  EndorsementByProject,
  LeadBreakdown,
  VisitPoint,
} from "@/types";

export const MOCK_VISITS: VisitPoint[] = [
  { label: "Apr 06", visits: 412 },
  { label: "Apr 13", visits: 498 },
  { label: "Apr 20", visits: 466 },
  { label: "Apr 27", visits: 553 },
  { label: "May 04", visits: 612 },
  { label: "May 11", visits: 671 },
  { label: "May 18", visits: 645 },
  { label: "May 25", visits: 728 },
  { label: "Jun 01", visits: 802 },
  { label: "Jun 08", visits: 884 },
  { label: "Jun 15", visits: 921 },
];

export const MOCK_LEAD_SOURCES: LeadBreakdown[] = [
  { source: "Contact form", count: 4 },
  { source: "Upwork", count: 2 },
  { source: "Referral", count: 1 },
  { source: "LinkedIn", count: 1 },
];

export const MOCK_ENDORSEMENTS_BY_PROJECT: EndorsementByProject[] = [
  { project: "Dirham", count: 14 },
  { project: "Groceri", count: 11 },
  { project: "e-Markeet", count: 9 },
  { project: "Restaurant POS", count: 7 },
  { project: "Cafe loyalty", count: 5 },
];

export const ADMIN_STATS = {
  projects: 12,
  leads: MOCK_LEAD_SOURCES.reduce((acc, s) => acc + s.count, 0),
  endorsements: MOCK_ENDORSEMENTS_BY_PROJECT.reduce(
    (acc, e) => acc + e.count,
    0,
  ),
  visits: MOCK_VISITS.reduce((acc, v) => acc + v.visits, 0),
};
