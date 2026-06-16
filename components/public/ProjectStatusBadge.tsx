import type { ProjectStatus } from "@/types";

const STYLES: Record<ProjectStatus, { label: string; className: string }> = {
  live: {
    label: "Live",
    className: "border-teal/40 bg-teal/10 text-teal",
  },
  "in-progress": {
    label: "In progress",
    className: "border-gold/40 bg-gold/10 text-gold",
  },
  draft: {
    label: "Sketch",
    className: "border-border bg-surface text-muted",
  },
};

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  const { label, className } = STYLES[status];
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 font-mono text-[0.7rem] uppercase tracking-[0.14em] ${className}`}
    >
      {label}
    </span>
  );
}
