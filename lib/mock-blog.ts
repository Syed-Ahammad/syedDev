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
    body: `Next.js 16 ships with a lot of small breaking changes that don't shout at you in the console. They just quietly produce the wrong shape, and you trace it back two hours later.

## Async params are the new normal

Every dynamic route handler now receives \`params\` as a Promise. You await it before you read it. Forget once and TypeScript will let you ship a page that returns "undefined" everywhere.

\`\`\`ts
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // ...
}
\`\`\`

The migration codemod handles most of this, but anything you wrote by hand after the upgrade is on you.

## Turbopack is the default — own your config

Webpack-only loaders silently no-op. If you had a clever \`next.config.ts\` from the v13 era, half of it is doing nothing now. Read your build logs end to end the first time.

## Tailwind v4 is PostCSS-only here

No more \`tailwind.config.ts\`. Theme tokens move to \`app/globals.css\` under \`@theme\`. The dark-mode variant is opt-in via \`@custom-variant\`. I rebuilt the design tokens twice before I read this.

## What still feels great

Server components by default still pays for itself. Most of the public site renders zero client JS. The bits that need state — theme toggle, project filters — are tagged and stay small. That separation is the part I'd keep even if I switched frameworks tomorrow.`,
  },
  {
    slug: "from-hospitality-ops-to-fullstack",
    title: "From hospitality ops to full-stack dev — the path so far",
    excerpt:
      "I spent five years counting stock and reconciling invoices before I wrote my first useState. Why that background still shapes the code I ship today.",
    tag: "Career",
    publishedAt: "2026-04-14",
    readMinutes: 5,
    body: `I didn't take the standard route into software. Before the React docs were my homepage, my homepage was a spreadsheet of beverage costs for a Dubai hotel group.

## What hospitality taught me about software

A kitchen run sheet and a deployment pipeline have more in common than you'd think. Both fall over the same way: somebody made an undocumented assumption, somebody else trusted it, the cost compounds quietly until a busy Friday makes it visible.

The habits that survived the career switch:

- Write the boring runbook before you need it
- Trust the inventory count, not the memory of the count
- When something breaks at peak load, fix the process, not the person

## The first six months of code

I cleaned up SQL reports first. Then small dashboards. Then a stock-take app that replaced a clipboard. Each thing was small enough to ship in a week and immediately useful to a real coworker — that feedback loop is what pulled me through the abstract bits I would have otherwise quit over.

## What I look for in projects now

Boring infrastructure, interesting users. A POS that runs reliably for one cafe owner beats a clever side project that nobody opens twice. That bias shows up everywhere on this site — the projects I'm proudest of are the ones whose owners DM me about a bug, because it means they're still using them.`,
  },
  {
    slug: "mongodb-indexes-i-wish-i-had",
    title: "MongoDB indexes I wish I'd added on day one",
    excerpt:
      "Three index decisions that turned out to be load-bearing across every project I've shipped — and one I regret leaving for later.",
    tag: "Backend",
    publishedAt: "2026-03-02",
    readMinutes: 7,
    body: `Every Mongo project I've shipped has hit the same wall: queries are fast in dev, fine in staging, then a real user opens the admin panel and the request hangs for nine seconds.

The fix is almost always an index that should have been there from commit one.

## The three I add by default

- A compound index on \`(status, createdAt)\` for any "list recent active X" admin page
- A text index on user-facing search fields (\`name\`, \`tagline\`, etc.)
- A unique index on every "natural key" — \`slug\`, \`email\`, anything you look up by

\`\`\`js
ProjectSchema.index({ status: 1, createdAt: -1 });
ProjectSchema.index({ name: "text", tagline: "text" });
ProjectSchema.index({ slug: 1 }, { unique: true });
\`\`\`

## The one I regret leaving for later

A TTL index on session-like collections. I once let an \`endorsementSubmissions\` collection grow to 400k docs because I figured "we'll add cleanup later." Later was three months. The cleanup migration locked the collection for eleven minutes.

If a doc has a natural expiry, add the TTL when you create the model. Future-you will thank present-you.

## What I'd skip

Premature indexes on fields nobody filters by. Every index costs you on writes. Add them when the EXPLAIN output asks for them, not before. The point of this list isn't "more indexes" — it's "the small handful that are obviously load-bearing the moment you sketch the data model."`,
  },
];
