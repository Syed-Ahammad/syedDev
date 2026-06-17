import type { Metadata } from "next";
import { QuoteForm } from "@/components/dashboard/QuoteForm";
import { QuoteList } from "@/components/dashboard/QuoteList";
import { MOCK_QUOTES } from "@/lib/mock-quotes";

export const metadata: Metadata = {
  title: "Quote requests — syed.dev",
};

export default function DashboardQuotesPage() {
  const quotes = [...MOCK_QUOTES].sort((a, b) =>
    b.submittedAt.localeCompare(a.submittedAt),
  );

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
      <header className="flex flex-col gap-3">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-teal">
          / quote requests
        </p>
        <h1 className="font-display text-3xl font-semibold text-foreground md:text-4xl">
          Briefs and where they stand
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted">
          Send a new brief or check the status of one already in. Replies arrive
          here and as email once notifications turn on in Phase 3.
        </p>
      </header>

      <QuoteForm />

      <section aria-label="Your quote requests" className="flex flex-col gap-4">
        <h2 className="font-display text-xl font-semibold text-foreground">
          Submitted briefs
        </h2>
        <QuoteList quotes={quotes} />
      </section>
    </div>
  );
}
