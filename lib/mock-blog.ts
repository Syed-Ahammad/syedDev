import type { BlogPost } from "@/types";

export const MOCK_BLOG_POSTS: BlogPost[] = [
  {
    slug: "shipping-portfolio-in-next-16",
    title: "Shipping a portfolio in Next.js 16 — the parts that bit me",
    excerpt:
      "Server components are easy until they aren't. A short tour of the App Router rough edges I hit rebuilding this site from scratch.",
    tag: "Stack notes",
    publishedAt: "2026-05-22",
    readMinutes: 6,
  },
  {
    slug: "from-hospitality-ops-to-fullstack",
    title: "From hospitality ops to full-stack dev — the path so far",
    excerpt:
      "I spent five years counting stock and reconciling invoices before I wrote my first useState. Why that background still shapes the code I ship today.",
    tag: "Career",
    publishedAt: "2026-04-14",
    readMinutes: 5,
  },
  {
    slug: "mongodb-indexes-i-wish-i-had",
    title: "MongoDB indexes I wish I'd added on day one",
    excerpt:
      "Three index decisions that turned out to be load-bearing across every project I've shipped — and one I regret leaving for later.",
    tag: "Backend",
    publishedAt: "2026-03-02",
    readMinutes: 7,
  },
];
