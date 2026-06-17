import type { Metadata } from "next";
import Link from "next/link";
import { StatCard } from "@/components/admin/StatCard";
import { ADMIN_STATS } from "@/lib/mock-analytics";
import { MOCK_LEADS } from "@/lib/mock-leads";

export const metadata: Metadata = {
  title: "Admin overview — syed.dev",
};

const DATE = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
});

export default function AdminOverviewPage() {
  const recentLeads = MOCK_LEADS.slice(0, 4);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
      <header className="flex flex-col gap-3">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-teal">
          / overview
        </p>
        <h1 className="font-display text-3xl font-semibold text-foreground md:text-4xl">
          Last 30 days at a glance
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted">
          All numbers below are mock — they swap to real data once the API routes
          land in Phase 3.
        </p>
      </header>

      <section
        aria-labelledby="admin-stats-heading"
        className="flex flex-col gap-4"
      >
        <h2 id="admin-stats-heading" className="sr-only">
          Headline stats
        </h2>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <li>
            <StatCard
              label="Projects"
              value={String(ADMIN_STATS.projects)}
              trend="2 published this month"
              hint="Includes drafts and archived case studies."
            />
          </li>
          <li>
            <StatCard
              label="Leads"
              value={String(ADMIN_STATS.leads)}
              trend="+3 vs prior 30 days"
              hint="New contact requests across all sources."
            />
          </li>
          <li>
            <StatCard
              label="Endorsements"
              value={String(ADMIN_STATS.endorsements)}
              trend="4 awaiting review"
              hint="Skill endorsements from logged-in users."
            />
          </li>
          <li>
            <StatCard
              label="Visits"
              value={ADMIN_STATS.visits.toLocaleString("en-GB")}
              trend="+18% week over week"
              hint="Unique sessions across the public site."
            />
          </li>
        </ul>
      </section>

      <section
        aria-labelledby="admin-recent-heading"
        className="flex flex-col gap-4"
      >
        <div className="flex items-end justify-between gap-4">
          <h2
            id="admin-recent-heading"
            className="font-display text-xl font-semibold text-foreground"
          >
            Recent leads
          </h2>
          <Link
            href="/admin/leads"
            className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-coral transition-colors hover:text-foreground"
          >
            See all →
          </Link>
        </div>
        <ul className="flex flex-col divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface">
          {recentLeads.map((lead) => (
            <li
              key={lead.id}
              className="flex flex-col gap-2 px-5 py-4 md:flex-row md:items-center md:justify-between"
            >
              <div className="flex flex-col gap-1">
                <span className="font-display text-sm font-medium text-foreground">
                  {lead.name}
                </span>
                <span className="text-xs leading-relaxed text-muted">
                  {lead.projectType} · via {lead.source}
                </span>
              </div>
              <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted">
                {DATE.format(new Date(lead.receivedAt))}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
