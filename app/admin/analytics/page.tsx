import type { Metadata } from "next";
import { SignupsChart } from "@/components/admin/SignupsChart";
import { LeadsPieChart } from "@/components/admin/LeadsPieChart";
import { EndorsementsBarChart } from "@/components/admin/EndorsementsBarChart";
import { getAnalytics } from "@/lib/analytics";

export const metadata: Metadata = {
  title: "Analytics — Admin · syed.dev",
};

export const dynamic = "force-dynamic";

const WEEKS = 8;

export default async function AdminAnalyticsPage() {
  const { signups, leadSources, endorsementsByProject } =
    await getAnalytics(WEEKS);

  const totalSignups = signups.reduce((acc, p) => acc + p.value, 0);
  const totalLeads = leadSources.reduce((acc, s) => acc + s.count, 0);
  const totalEndorsements = endorsementsByProject.reduce(
    (acc, e) => acc + e.count,
    0,
  );

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <header className="flex flex-col gap-3">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-teal">
          / analytics
        </p>
        <h1 className="font-display text-3xl font-semibold text-foreground md:text-4xl">
          The numbers behind the site
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted">
          Live from the database. There&apos;s no traffic tracking yet, so the
          trend line shows new account signups instead of page views.
        </p>
      </header>

      <ChartPanel
        eyebrow={`weekly signups · last ${WEEKS} weeks`}
        title="New accounts"
        meta={`${totalSignups} signup${totalSignups === 1 ? "" : "s"} in the window`}
      >
        <SignupsChart data={signups} />
      </ChartPanel>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartPanel
          eyebrow="lead sources"
          title="Where briefs come from"
          meta={
            leadSources.length > 0
              ? `${totalLeads} leads across ${leadSources.length} channel${leadSources.length === 1 ? "" : "s"}`
              : "No leads yet"
          }
        >
          {leadSources.length > 0 ? (
            <LeadsPieChart data={leadSources} />
          ) : (
            <EmptyChart label="No leads to chart yet." />
          )}
        </ChartPanel>

        <ChartPanel
          eyebrow="endorsements"
          title="Per project"
          meta={
            endorsementsByProject.length > 0
              ? `${totalEndorsements} approved across ${endorsementsByProject.length} project${endorsementsByProject.length === 1 ? "" : "s"}`
              : "No approved endorsements yet"
          }
        >
          {endorsementsByProject.length > 0 ? (
            <EndorsementsBarChart data={endorsementsByProject} />
          ) : (
            <EmptyChart label="No approved endorsements to chart yet." />
          )}
        </ChartPanel>
      </div>
    </div>
  );
}

type PanelProps = {
  eyebrow: string;
  title: string;
  meta: string;
  children: React.ReactNode;
};

function ChartPanel({ eyebrow, title, meta, children }: PanelProps) {
  return (
    <section
      aria-label={title}
      className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-6"
    >
      <div className="flex flex-col gap-1">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-coral">
          {eyebrow}
        </p>
        <h2 className="font-display text-lg font-semibold text-foreground">
          {title}
        </h2>
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted">
          {meta}
        </p>
      </div>
      {children}
    </section>
  );
}

function EmptyChart({ label }: { label: string }) {
  return (
    <div className="flex h-[260px] items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted">
      {label}
    </div>
  );
}
