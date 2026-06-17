import type { Metadata } from "next";
import Link from "next/link";
import { StatCard } from "@/components/admin/StatCard";
import { getAdminStats } from "@/lib/stats";
import { fetchLeads } from "@/lib/leads";

export const metadata: Metadata = {
  title: "Admin overview — syed.dev",
};

export const dynamic = "force-dynamic";

const DATE = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
});

export default async function AdminOverviewPage() {
  const [stats, leads] = await Promise.all([
    getAdminStats(),
    fetchLeads({ page: 1 }),
  ]);
  const recentLeads = leads.items.slice(0, 4);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
      <header className="flex flex-col gap-3">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-teal">
          / overview
        </p>
        <h1 className="font-display text-3xl font-semibold text-foreground md:text-4xl">
          Site at a glance
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted">
          Live counts straight from the database. Traffic charts arrive with the
          analytics view.
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
              value={String(stats.projects.total)}
              trend={`${stats.projects.published} live`}
              hint="Includes drafts and in-progress case studies."
            />
          </li>
          <li>
            <StatCard
              label="Leads"
              value={String(stats.leads.total)}
              trend={`${stats.leads.unread} unread`}
              hint="Contact requests across all sources."
            />
          </li>
          <li>
            <StatCard
              label="Endorsements"
              value={String(stats.endorsements.total)}
              trend={`${stats.endorsements.pending} awaiting review`}
              hint="Skill endorsements from logged-in users."
            />
          </li>
          <li>
            <StatCard
              label="Users"
              value={String(stats.users.total)}
              trend={`${stats.users.suspended} suspended`}
              hint="Registered accounts (user + admin)."
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
        {recentLeads.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border bg-surface p-6 text-sm text-muted">
            No leads yet — they&apos;ll show up here as they come in.
          </p>
        ) : (
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
                    {lead.projectType || "Enquiry"} · via {lead.source}
                  </span>
                </div>
                <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted">
                  {DATE.format(new Date(lead.createdAt))}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
