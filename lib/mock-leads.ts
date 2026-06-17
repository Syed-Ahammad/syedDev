import type { Lead } from "@/types";

export const MOCK_LEADS: Lead[] = [
  {
    id: "lead-08",
    name: "Maya Daher",
    email: "maya@florabox.ae",
    projectType: "Landing page or storefront",
    message:
      "We're a Dubai-based florist looking for a checkout that handles same-day delivery slots — currently using WhatsApp orders. Need it before Mother's Day.",
    status: "new",
    source: "Contact form",
    receivedAt: "2026-06-15T10:42:00Z",
  },
  {
    id: "lead-07",
    name: "Tariq Idris",
    email: "tariq@idris-clinics.com",
    projectType: "Web app or dashboard",
    message:
      "Family clinic chain in Sharjah — three branches. Need a unified appointment + records dashboard. Existing system is paper.",
    status: "new",
    source: "Contact form",
    receivedAt: "2026-06-14T08:12:00Z",
  },
  {
    id: "lead-06",
    name: "Reema Saleh",
    email: "reema.s@brewlab.co",
    projectType: "Inventory or POS tool",
    message:
      "Coffee roastery in JLT. Need stock tracking across green beans, roasted batches, and retail packs. POS integration ideal.",
    status: "responded",
    source: "Upwork",
    receivedAt: "2026-06-12T14:30:00Z",
  },
  {
    id: "lead-05",
    name: "Felix Howard",
    email: "felix@howard-bikes.com",
    projectType: "Integration or API work",
    message:
      "Shopify store with custom bike-builder. Existing Bubble app needs migrating to Next.js + a clean checkout API.",
    status: "responded",
    source: "Referral",
    receivedAt: "2026-06-09T17:05:00Z",
  },
  {
    id: "lead-04",
    name: "Anya Lebedev",
    email: "anya@lebedev-design.studio",
    projectType: "Landing page or storefront",
    message:
      "Interior design studio rebrand — need a fast portfolio with case studies, scheduling, and an Instagram feed embed.",
    status: "won",
    source: "Contact form",
    receivedAt: "2026-06-04T11:25:00Z",
  },
  {
    id: "lead-03",
    name: "Owen Park",
    email: "owen.park@kettlecorp.io",
    projectType: "Web app or dashboard",
    message:
      "Internal time-off + leave balance tool for our 40-person team. Slack login required.",
    status: "won",
    source: "LinkedIn",
    receivedAt: "2026-05-29T09:14:00Z",
  },
  {
    id: "lead-02",
    name: "Sami Qureshi",
    email: "sami@qureshi-textiles.com",
    projectType: "Something else",
    message:
      "Probably not a fit but worth asking — looking for a partner to build a B2B catalog with bulk-order quoting.",
    status: "archived",
    source: "Contact form",
    receivedAt: "2026-05-21T19:48:00Z",
  },
  {
    id: "lead-01",
    name: "Cassia Vega",
    email: "cassia@vegaverse.dev",
    projectType: "Integration or API work",
    message:
      "Just exploring options. Want to add Stripe + invoicing to an existing PHP app. Timeline flexible.",
    status: "archived",
    source: "Upwork",
    receivedAt: "2026-05-15T12:10:00Z",
  },
];
