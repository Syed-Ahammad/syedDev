import type { Metadata } from "next";
import Link from "next/link";
import { StatCard } from "@/components/dashboard/StatCard";
import { MOCK_BOOKMARKS } from "@/lib/mock-bookmarks";
import { MOCK_QUOTES } from "@/lib/mock-quotes";
import { MOCK_USER_ENDORSEMENTS } from "@/lib/mock-user-endorsements";
import { MOCK_USER_PROFILE } from "@/lib/mock-user-profile";

export const metadata: Metadata = {
  title: "Your dashboard — syed.dev",
};

const STATUS_TONE: Record<string, string> = {
  new: "border-coral/30 bg-coral/10 text-coral",
  "in-review": "border-amber-500/30 bg-amber-500/10 text-amber-500",
  responded: "border-teal/30 bg-teal/10 text-teal",
  closed: "border-border bg-background text-muted",
  pending: "border-amber-500/30 bg-amber-500/10 text-amber-500",
  approved: "border-teal/30 bg-teal/10 text-teal",
  rejected: "border-border bg-background text-muted",
};

const DAY_MS = 1000 * 60 * 60 * 24;

function relativeDays(iso: string): string {
  const days = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / DAY_MS));
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 14) return `${days} days ago`;
  return `${Math.floor(days / 7)} weeks ago`;
}

export default function DashboardOverviewPage() {
  const profile = MOCK_USER_PROFILE;
  const bookmarkCount = MOCK_BOOKMARKS.length;
  const pendingEndorsements = MOCK_USER_ENDORSEMENTS.filter(
    (e) => e.status === "pending",
  ).length;
  const openQuotes = MOCK_QUOTES.filter(
    (q) => q.status === "new" || q.status === "in-review",
  ).length;

  const recentBookmarks = [...MOCK_BOOKMARKS]
    .sort((a, b) => b.bookmarkedAt.localeCompare(a.bookmarkedAt))
    .slice(0, 3);

  const latestQuote = [...MOCK_QUOTES].sort((a, b) =>
    b.submittedAt.localeCompare(a.submittedAt),
  )[0];

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
      <header className="flex flex-col gap-3">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-teal">
          / overview
        </p>
        <h1 className="font-display text-3xl font-semibold text-foreground md:text-4xl">
          Welcome back, {profile.name}.
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted">
          Three quick stats below — open each section for the full list. Numbers
          and entries are mock data; they switch to live API responses in
          Phase 3.
        </p>
      </header>

      <section aria-label="At a glance" className="flex flex-col gap-4">
        <h2 className="font-display text-xl font-semibold text-foreground">
          At a glance
        </h2>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <li>
            <StatCard
              label="bookmarks"
              value={String(bookmarkCount)}
              hint="Projects you've saved for later."
              href="/dashboard/bookmarks"
            />
          </li>
          <li>
            <StatCard
              label="endorsements"
              value={String(pendingEndorsements)}
              hint="Awaiting review on the admin side."
              href="/dashboard/endorsements"
            />
          </li>
          <li>
            <StatCard
              label="open quotes"
              value={String(openQuotes)}
              hint="Briefs with no final reply yet."
              href="/dashboard/quotes"
            />
          </li>
        </ul>
      </section>

      <section
        aria-label="Recent bookmarks"
        className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-6"
      >
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-display text-lg font-semibold text-foreground">
            Recent bookmarks
          </h2>
          <Link
            href="/dashboard/bookmarks"
            className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-coral transition-colors hover:text-foreground"
          >
            See all →
          </Link>
        </div>
        <ul className="flex flex-col divide-y divide-border">
          {recentBookmarks.map((bm) => (
            <li key={bm.id} className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0">
              <Link
                href={`/projects/${bm.projectSlug}`}
                className="font-display text-base font-medium text-foreground transition-colors hover:text-coral"
              >
                {bm.projectName}
              </Link>
              <p className="line-clamp-2 text-sm leading-relaxed text-muted">
                {bm.projectTagline}
              </p>
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted">
                Saved {relativeDays(bm.bookmarkedAt)}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {latestQuote && (
        <section
          aria-label="Latest quote request"
          className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-6"
        >
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-display text-lg font-semibold text-foreground">
              Latest quote request
            </h2>
            <span
              className={`inline-flex items-center rounded-full border px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-[0.14em] ${STATUS_TONE[latestQuote.status]}`}
            >
              {latestQuote.status.replace("-", " ")}
            </span>
          </div>
          <p className="font-display text-base font-medium text-foreground">
            {latestQuote.title}
          </p>
          <p className="text-sm leading-relaxed text-muted">{latestQuote.brief}</p>
          <Link
            href="/dashboard/quotes"
            className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-coral transition-colors hover:text-foreground"
          >
            Open quote requests →
          </Link>
        </section>
      )}
    </div>
  );
}
