import type { ProjectDetail } from "@/types";

export const MOCK_PROJECT_DETAILS: Record<string, ProjectDetail> = {
  dirham: {
    problem:
      "UAE freelancers juggle invoices in spreadsheets and miss VAT filings — the data is everywhere, the deadline is one.",
    approach:
      "A small Next.js app that ingests invoices, classifies expenses, and renders a quarterly VAT-ready report. Per-user data isolation, sensible defaults, and an export that the accountant actually wants.",
    outcome:
      "Live with ~40 paying freelancers. Average filing prep dropped from an afternoon to ten minutes.",
    year: 2025,
    role: "Solo founder + sole developer",
    links: [
      { label: "Visit site", href: "https://dirham.example" },
      { label: "Case study", href: "/blog/dirham-launch" },
    ],
  },
  groceri: {
    problem:
      "A neighbourhood grocer wanted online orders without the per-order fee of large delivery platforms.",
    approach:
      "Customer storefront + admin dashboard for products, stock and orders. Mongoose models tuned for fast catalog reads; orders are pushed straight to WhatsApp for fulfilment.",
    outcome:
      "Three stores live, ~120 orders/week. The owner ships the same day and keeps full margin.",
    year: 2025,
    role: "Lead developer",
    links: [{ label: "Visit site", href: "https://groceri.example" }],
  },
  "e-markeet": {
    problem:
      "Selling digital downloads (PDFs, presets, templates) cleanly without a marketplace cut.",
    approach:
      "Stripe checkout, signed-URL delivery, and a minimal catalog. Files live in Vercel Blob; access tokens expire so links can't be re-shared.",
    outcome:
      "Powers a small creator's storefront — 200+ paid downloads, zero leaked links.",
    year: 2024,
    role: "Solo developer",
  },
  "restaurant-pos": {
    problem:
      "Mid-size restaurants juggled a paper-and-Excel flow between front-of-house, kitchen, and stock.",
    approach:
      "Single React dashboard for orders, kitchen tickets, and stock decrements. Built from real hospitality operations — I'd actually run the floor.",
    outcome:
      "Used daily by two restaurants. Wait time dropped, stock variance is now visible per shift.",
    year: 2023,
    role: "Lead developer",
  },
  "hotel-inventory": {
    problem:
      "A hotel group had no audit trail from purchase order to consumption — finance and ops were arguing over the same numbers.",
    approach:
      "Procure-to-consume system with PO, GRN, three-way match, and VAT-ready postings. Mongo aggregations power monthly close.",
    outcome:
      "Closes the books in 2 days instead of 8. Auditors stopped raising the same finding.",
    year: 2024,
    role: "Lead developer",
  },
  "cafe-loyalty": {
    problem:
      "Independent cafés want repeat customers but can't justify a native loyalty app.",
    approach:
      "QR-code stamp cards rendered as a tiny web app — no install. Birthday rewards run on a Vercel cron.",
    outcome:
      "Pilot with two cafés. Early data shows ~22% return rate on stamped customers.",
    year: 2026,
    role: "Solo developer",
  },
  skillbase: {
    problem:
      "Trades hiring is word-of-mouth — there's no searchable place to see who's actually done the work.",
    approach:
      "Profiles + skill endorsements moderated by an admin queue. Search filters by skill and city; rate-limited to keep spam down.",
    outcome:
      "In closed beta with a small Dubai network. First moderation queue cleared in 24h.",
    year: 2026,
    role: "Solo founder + developer",
  },
  "stockwatch-api": {
    problem:
      "A retailer's Shopify, warehouse SQL and POS each thought they were the source of truth on stock.",
    approach:
      "TypeScript REST API in front of webhooks from each system, with reconciliation and an audit log. Idempotent writes so retries don't double-count.",
    outcome:
      "Stock variance between systems dropped from ~6% to under 1% in a month.",
    year: 2024,
    role: "Backend developer",
  },
  "menu-board": {
    problem:
      "Restaurants run multiple TVs across locations and update prices via USB sticks.",
    approach:
      "Single CMS, lightweight player web app on each screen, instant price push via revalidation. Works on cheap Android TV sticks.",
    outcome:
      "Live in a 4-location chain. Price update window dropped from a day to a minute.",
    year: 2025,
    role: "Solo developer",
  },
  "freelance-brief": {
    problem:
      "Cold inbound from my Upwork and Fiverr pages was poorly qualified — wrong budgets, wrong scope.",
    approach:
      "Single-page brief form with budget filter and time-zone-aware scheduling. Lead is routed straight to my calendar only if it clears the floor.",
    outcome:
      "Qualified-lead rate up ~3×. Most discovery calls now lead to a quote.",
    year: 2025,
    role: "Solo developer",
  },
  "syed-dev": {
    problem:
      "I needed a single place that's both a portfolio and a live demo of what I build — credentials and code in one URL.",
    approach:
      "Next.js 16, App Router, server components by default. Community layer (endorsements, bookmarks, quotes) sits on top of the portfolio without getting in the way of recruiters.",
    outcome:
      "In active build. Each section ships on its own with lint, tests, and an e2e check before commit.",
    year: 2026,
    role: "Solo developer",
    links: [{ label: "GitHub", href: "https://github.com/syedahammad/syed-dev" }],
  },
  "ops-notebook": {
    problem:
      "Kitchen and store opening/closing checklists were paper — signed, lost, and never reviewed.",
    approach:
      "Mobile-first checklist per shift, cash-count step, manager sign-off. Daily roll-up emailed to the operator.",
    outcome:
      "Sketch stage — first kitchen pilots next quarter.",
    year: 2026,
    role: "Solo developer",
  },
};
