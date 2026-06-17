import type { Bookmark } from "@/types";

export const MOCK_BOOKMARKS: Bookmark[] = [
  {
    id: "bm-01",
    projectSlug: "dirham",
    projectName: "Dirham",
    projectTagline:
      "VAT and expense tracker for UAE freelancers — logs income, calculates VAT, and exports clean reports at filing time.",
    projectType: "SaaS",
    stack: ["Next.js", "MongoDB", "TypeScript"],
    bookmarkedAt: "2026-05-22T09:14:00Z",
  },
  {
    id: "bm-02",
    projectSlug: "groceri",
    projectName: "Groceri",
    projectTagline:
      "Grocery ordering with a customer storefront and an admin dashboard for products, stock and orders.",
    projectType: "Marketplace",
    stack: ["Next.js", "MongoDB", "Tailwind"],
    bookmarkedAt: "2026-05-30T18:42:00Z",
  },
  {
    id: "bm-03",
    projectSlug: "restaurant-pos",
    projectName: "Restaurant POS",
    projectTagline:
      "Order-taking, kitchen flow and live stock control in one dashboard — built from real hospitality operations.",
    projectType: "Internal tool",
    stack: ["React", "Node.js", "MongoDB"],
    bookmarkedAt: "2026-06-04T13:08:00Z",
  },
  {
    id: "bm-04",
    projectSlug: "hotel-inventory",
    projectName: "Hotel Inventory",
    projectTagline:
      "Procure-to-consume system: purchase orders, goods receipts, 3-way match and VAT-ready records.",
    projectType: "Enterprise",
    stack: ["React", "Node.js", "MongoDB"],
    bookmarkedAt: "2026-06-11T07:55:00Z",
  },
];
