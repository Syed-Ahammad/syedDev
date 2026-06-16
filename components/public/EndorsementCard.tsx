import type { Endorsement } from "@/types";

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

type Props = {
  endorsement: Endorsement;
};

export function EndorsementCard({ endorsement }: Props) {
  return (
    <article className="flex h-full min-h-[260px] flex-col justify-between rounded-2xl border border-border bg-surface p-6">
      <div>
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.14em] text-coral">
          {endorsement.skill}
        </p>
        <blockquote className="text-sm leading-relaxed text-foreground">
          “{endorsement.text}”
        </blockquote>
      </div>
      <footer className="mt-6 flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background font-display text-sm font-semibold text-teal"
        >
          {initials(endorsement.endorserName)}
        </span>
        <div className="leading-tight">
          <p className="font-display text-sm font-semibold text-foreground">
            {endorsement.endorserName}
          </p>
          <p className="text-xs text-muted">{endorsement.endorserRole}</p>
        </div>
      </footer>
    </article>
  );
}
