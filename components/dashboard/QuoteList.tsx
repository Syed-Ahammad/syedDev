import type { QuoteRequest } from "@/types";

const STATUS_TONE: Record<QuoteRequest["status"], string> = {
  new: "border-coral/30 bg-coral/10 text-coral",
  "in-review": "border-amber-500/30 bg-amber-500/10 text-amber-500",
  responded: "border-teal/30 bg-teal/10 text-teal",
  closed: "border-border bg-background text-muted",
};

const STATUS_LABEL: Record<QuoteRequest["status"], string> = {
  new: "New · awaiting first response",
  "in-review": "In review",
  responded: "Responded",
  closed: "Closed",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

type Props = {
  quotes: QuoteRequest[];
};

export function QuoteList({ quotes }: Props) {
  if (quotes.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-border bg-surface p-6 text-sm text-muted">
        No quote requests yet. Use the form above to send your first brief.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-4">
      {quotes.map((q) => (
        <li
          key={q.id}
          className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-5"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-col">
              <span className="font-display text-base font-semibold text-foreground">
                {q.title}
              </span>
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-teal">
                {q.projectType}
              </span>
            </div>
            <span
              className={`inline-flex items-center rounded-full border px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-[0.14em] ${STATUS_TONE[q.status]}`}
            >
              {STATUS_LABEL[q.status]}
            </span>
          </div>

          <dl className="grid grid-cols-1 gap-3 text-xs text-muted sm:grid-cols-3">
            <div className="flex flex-col gap-1">
              <dt className="font-mono uppercase tracking-[0.14em]">Budget</dt>
              <dd className="text-foreground">{q.budget}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="font-mono uppercase tracking-[0.14em]">Timeline</dt>
              <dd className="text-foreground">{q.timeline}</dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="font-mono uppercase tracking-[0.14em]">Sent</dt>
              <dd className="text-foreground">{formatDate(q.submittedAt)}</dd>
            </div>
          </dl>

          <p className="text-sm leading-relaxed text-muted">{q.brief}</p>

          {q.reply && (
            <div className="rounded-xl border border-teal/30 bg-teal/5 p-4">
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-teal">
                Reply from Syed
              </p>
              <p className="mt-2 text-sm leading-relaxed text-foreground">
                {q.reply}
              </p>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
