import type { Metadata } from "next";
import { VisitsChart } from "@/components/admin/VisitsChart";
import { LeadsPieChart } from "@/components/admin/LeadsPieChart";
import { EndorsementsBarChart } from "@/components/admin/EndorsementsBarChart";
import {
  MOCK_ENDORSEMENTS_BY_PROJECT,
  MOCK_LEAD_SOURCES,
  MOCK_VISITS,
} from "@/lib/mock-analytics";

export const metadata: Metadata = {
  title: "Analytics — Admin · syed.dev",
};

export default function AdminAnalyticsPage() {
  const totalVisits = MOCK_VISITS.reduce((acc, v) => acc + v.visits, 0);
  const totalLeads = MOCK_LEAD_SOURCES.reduce((acc, s) => acc + s.count, 0);
  const totalEndorsements = MOCK_ENDORSEMENTS_BY_PROJECT.reduce(
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
          Charts run on mock data. They&apos;ll switch to /api/admin/analytics in
          Phase 3 — same shape, real values.
        </p>
      </header>

      <ChartPanel
        eyebrow="weekly visits"
        title="Traffic"
        meta={`${totalVisits.toLocaleString("en-GB")} sessions over 11 weeks`}
      >
        <VisitsChart data={MOCK_VISITS} />
      </ChartPanel>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartPanel
          eyebrow="lead sources"
          title="Where briefs come from"
          meta={`${totalLeads} leads across ${MOCK_LEAD_SOURCES.length} channels`}
        >
          <LeadsPieChart data={MOCK_LEAD_SOURCES} />
        </ChartPanel>

        <ChartPanel
          eyebrow="endorsements"
          title="Per project"
          meta={`${totalEndorsements} approved endorsements`}
        >
          <EndorsementsBarChart data={MOCK_ENDORSEMENTS_BY_PROJECT} />
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
