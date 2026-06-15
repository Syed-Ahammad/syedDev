import type { Project } from "@/types";

export const MOCK_PROJECTS: Project[] = [
  {
    slug: "dirham",
    name: "Dirham",
    tagline:
      "VAT and expense tracker for UAE freelancers — logs income, calculates VAT, and exports clean reports at filing time.",
    type: "SaaS",
    stack: ["Next.js", "MongoDB", "TypeScript"],
    status: "live",
    order: 1,
  },
  {
    slug: "groceri",
    name: "Groceri",
    tagline:
      "Grocery ordering with a customer storefront and an admin dashboard for products, stock and orders.",
    type: "Marketplace",
    stack: ["Next.js", "MongoDB", "Tailwind"],
    status: "live",
    order: 2,
  },
  {
    slug: "e-markeet",
    name: "E-Markeet",
    tagline:
      "Digital products store — checkout, instant delivery, and a clean catalog for downloadable goods.",
    type: "E-commerce",
    stack: ["Next.js", "MongoDB", "Stripe"],
    status: "live",
    order: 3,
  },
  {
    slug: "restaurant-pos",
    name: "Restaurant POS",
    tagline:
      "Order-taking, kitchen flow and live stock control in one dashboard — built from real hospitality operations.",
    type: "Internal tool",
    stack: ["React", "Node.js", "MongoDB"],
    status: "live",
    order: 4,
  },
  {
    slug: "hotel-inventory",
    name: "Hotel Inventory",
    tagline:
      "Procure-to-consume system: purchase orders, goods receipts, 3-way match and VAT-ready records.",
    type: "Enterprise",
    stack: ["React", "Node.js", "MongoDB"],
    status: "live",
    order: 5,
  },
];
