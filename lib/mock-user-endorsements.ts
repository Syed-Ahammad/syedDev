import type { UserEndorsement } from "@/types";

export const MOCK_USER_ENDORSEMENTS: UserEndorsement[] = [
  {
    id: "ue-01",
    projectSlug: "dirham",
    projectName: "Dirham",
    skill: "Tax form UX",
    text:
      "Filed my Q1 VAT return in under ten minutes using Dirham — the wizard caught two expense categories I'd have missed manually. Best fintech UX I've used this year.",
    status: "approved",
    submittedAt: "2026-05-08T16:32:00Z",
  },
  {
    id: "ue-02",
    projectSlug: "restaurant-pos",
    projectName: "Restaurant POS",
    skill: "Kitchen workflow",
    text:
      "Used this during a busy Friday brunch shift. Tickets moved through the kitchen pass without a single lost order. The live stock counter is exactly what we needed.",
    status: "approved",
    submittedAt: "2026-05-21T10:11:00Z",
  },
  {
    id: "ue-03",
    projectSlug: "groceri",
    projectName: "Groceri",
    skill: "Admin dashboard",
    text:
      "Set up our product catalog in an afternoon. Bulk import worked first try and the low-stock alerts kept us from running out of milk twice last week.",
    status: "pending",
    submittedAt: "2026-06-13T19:48:00Z",
  },
];
