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
  {
    slug: "cafe-loyalty",
    name: "Cafe Loyalty",
    tagline:
      "QR-code stamp cards and birthday rewards for independent coffee shops — no app install needed.",
    type: "SaaS",
    stack: ["Next.js", "MongoDB", "Tailwind"],
    status: "in-progress",
    order: 6,
  },
  {
    slug: "skillbase",
    name: "Skillbase",
    tagline:
      "Endorsements and credentials directory for trades — plumbers, electricians, fit-out crews — searchable by skill.",
    type: "Marketplace",
    stack: ["Next.js", "MongoDB", "NextAuth"],
    status: "in-progress",
    order: 7,
  },
  {
    slug: "stockwatch-api",
    name: "Stockwatch API",
    tagline:
      "REST endpoints to sync stock levels between Shopify, a warehouse SQL DB and a POS — webhook-driven.",
    type: "API",
    stack: ["Node.js", "TypeScript", "REST"],
    status: "live",
    order: 8,
  },
  {
    slug: "menu-board",
    name: "Menu Board",
    tagline:
      "Digital menu boards for restaurants — single CMS, multiple TVs, instant price updates per location.",
    type: "Internal tool",
    stack: ["Next.js", "MongoDB", "Tailwind"],
    status: "live",
    order: 9,
  },
  {
    slug: "freelance-brief",
    name: "Freelance Brief",
    tagline:
      "Single-page landing that turns a developer pitch into a bookable discovery call with budget filters.",
    type: "Landing",
    stack: ["Next.js", "Tailwind"],
    status: "live",
    order: 10,
  },
  {
    slug: "syed-dev",
    name: "syed.dev",
    tagline:
      "This site — portfolio plus a small community layer for endorsements, bookmarks and quotes.",
    type: "Portfolio",
    stack: ["Next.js", "MongoDB", "NextAuth", "Tailwind"],
    status: "in-progress",
    order: 11,
  },
  {
    slug: "ops-notebook",
    name: "Ops Notebook",
    tagline:
      "Daily ops checklist for kitchens and stores — opening, closing, cash count, signed off on each shift.",
    type: "Internal tool",
    stack: ["React", "Node.js", "MongoDB"],
    status: "draft",
    order: 12,
  },
];
