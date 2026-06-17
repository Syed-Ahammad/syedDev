import type { QuoteRequest } from "@/types";

export const MOCK_QUOTES: QuoteRequest[] = [
  {
    id: "q-01",
    title: "Bakery storefront + WhatsApp checkout",
    projectType: "Landing page or storefront",
    budget: "AED 8k – 12k",
    timeline: "4 weeks",
    brief:
      "We run a small bakery in JLT and want a clean storefront where customers can place pickup orders and pay on collection. WhatsApp confirmation instead of card payment for now.",
    status: "responded",
    submittedAt: "2026-05-18T09:22:00Z",
    reply:
      "Looks like a great fit. I can deliver the storefront + ordering flow in 3 weeks; sending a scoped proposal tonight.",
  },
  {
    id: "q-02",
    title: "Internal stock & purchase tracker",
    projectType: "Inventory or POS tool",
    budget: "AED 20k – 30k",
    timeline: "8–10 weeks",
    brief:
      "Two warehouses, ~6,000 SKUs. Need a tool to manage purchase orders, goods receipts and a 3-way match with invoices. Should export VAT-ready ledgers.",
    status: "in-review",
    submittedAt: "2026-06-02T14:51:00Z",
  },
  {
    id: "q-03",
    title: "Shopify ↔ POS sync API",
    projectType: "Integration or API work",
    budget: "AED 6k – 10k",
    timeline: "3 weeks",
    brief:
      "Webhook-driven sync between our Shopify store and an on-prem POS. Two-way stock updates, with a small retry queue for downtime.",
    status: "new",
    submittedAt: "2026-06-14T11:07:00Z",
  },
];
