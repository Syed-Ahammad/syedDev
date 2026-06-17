import type { UserEndorsement } from "@/types";

const STATUS_TONE: Record<UserEndorsement["status"], string> = {
  pending: "border-amber-500/30 bg-amber-500/10 text-amber-500",
  approved: "border-teal/30 bg-teal/10 text-teal",
  rejected: "border-border bg-background text-muted",
};

const STATUS_LABEL: Record<UserEndorsement["status"], string> = {
  pending: "Pending review",
  approved: "Approved · live on the wall",
  rejected: "Not approved",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

type Props = {
  endorsements: UserEndorsement[];
};

export function EndorsementList({ endorsements }: Props) {
  if (endorsements.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-border bg-surface p-6 text-sm text-muted">
        You haven&apos;t left any endorsements yet. Use the form above to share
        feedback on a project you&apos;ve actually used.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-4">
      {endorsements.map((e) => (
        <li
          key={e.id}
          className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-5"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-col">
              <span className="font-display text-base font-semibold text-foreground">
                {e.projectName}
              </span>
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-teal">
                {e.skill}
              </span>
            </div>
            <span
              className={`inline-flex items-center rounded-full border px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-[0.14em] ${STATUS_TONE[e.status]}`}
            >
              {STATUS_LABEL[e.status]}
            </span>
          </div>
          <p className="text-sm leading-relaxed text-muted">{e.text}</p>
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted">
            Submitted {formatDate(e.submittedAt)}
          </span>
        </li>
      ))}
    </ul>
  );
}
