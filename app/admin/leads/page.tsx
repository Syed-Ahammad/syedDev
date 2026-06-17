import type { Metadata } from "next";
import { LeadTable } from "@/components/admin/LeadTable";
import { MOCK_LEADS } from "@/lib/mock-leads";
import type { LeadStatus } from "@/types";

export const metadata: Metadata = {
  title: "Leads — Admin · syed.dev",
};

type PageProps = {
  searchParams: Promise<{ status?: string }>;
};

const STATUSES: { value: LeadStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "responded", label: "Responded" },
  { value: "won", label: "Won" },
  { value: "archived", label: "Archived" },
];

export default async function AdminLeadsPage({ searchParams }: PageProps) {
  const raw = await searchParams;
  const active = (raw.status ?? "all") as LeadStatus | "all";

  const filtered =
    active === "all"
      ? MOCK_LEADS
      : MOCK_LEADS.filter((lead) => lead.status === active);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <header className="flex flex-col gap-3">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-teal">
          / leads
        </p>
        <h1 className="font-display text-3xl font-semibold text-foreground md:text-4xl">
          Incoming briefs
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted">
          Triage contact requests. The triage actions are stubs until /api/admin/leads
          is wired in Phase 3.
        </p>
      </header>

      <nav aria-label="Filter leads by status">
        <ul className="flex flex-wrap gap-2">
          {STATUSES.map((status) => {
            const isActive = status.value === active;
            const href = status.value === "all" ? "/admin/leads" : `/admin/leads?status=${status.value}`;
            return (
              <li key={status.value}>
                <a
                  href={href}
                  aria-current={isActive ? "page" : undefined}
                  className={`inline-flex items-center rounded-full border px-3 py-1.5 font-mono text-[0.7rem] uppercase tracking-[0.14em] transition-colors ${
                    isActive
                      ? "border-coral bg-coral/10 text-coral"
                      : "border-border text-muted hover:border-coral hover:text-foreground"
                  }`}
                >
                  {status.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      <p
        className="font-mono text-xs uppercase tracking-[0.14em] text-muted"
        aria-live="polite"
      >
        Showing {filtered.length}
        {filtered.length === 1 ? " lead" : " leads"}
        {active === "all" ? "" : ` marked "${active}"`}
      </p>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-border bg-surface p-12 text-center">
          <p className="font-display text-lg font-semibold text-foreground">
            No leads with that status
          </p>
          <p className="mt-1 text-sm text-muted">Try a different filter.</p>
        </div>
      ) : (
        <LeadTable leads={filtered} />
      )}
    </div>
  );
}
