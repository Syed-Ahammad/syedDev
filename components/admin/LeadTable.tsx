import type { Lead, LeadStatus } from "@/types";

type Props = {
  leads: Lead[];
};

const STATUS_LABEL: Record<LeadStatus, string> = {
  new: "New",
  responded: "Responded",
  won: "Won",
  archived: "Archived",
};

const STATUS_CLASS: Record<LeadStatus, string> = {
  new: "border-coral/40 bg-coral/10 text-coral",
  responded: "border-amber-500/40 bg-amber-500/10 text-amber-500",
  won: "border-teal/40 bg-teal/10 text-teal",
  archived: "border-border bg-background text-muted",
};

const DATE = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
});

export function LeadTable({ leads }: Props) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
      <table className="w-full min-w-[820px] text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-background/40">
            <th className={headerClass}>Contact</th>
            <th className={headerClass}>Type</th>
            <th className={headerClass}>Source</th>
            <th className={headerClass}>Received</th>
            <th className={headerClass}>Status</th>
            <th className={`${headerClass} text-right`}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id} className="border-b border-border last:border-b-0 align-top">
              <td className="px-5 py-4">
                <div className="flex flex-col gap-1">
                  <span className="font-display text-sm font-medium text-foreground">
                    {lead.name}
                  </span>
                  <a
                    href={`mailto:${lead.email}`}
                    className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted transition-colors hover:text-coral"
                  >
                    {lead.email}
                  </a>
                  <span className="mt-1 max-w-[36ch] text-xs leading-snug text-muted line-clamp-2">
                    {lead.message}
                  </span>
                </div>
              </td>
              <td className="px-5 py-4 text-sm text-muted">{lead.projectType}</td>
              <td className="px-5 py-4 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted">
                {lead.source}
              </td>
              <td className="px-5 py-4 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted">
                {DATE.format(new Date(lead.receivedAt))}
              </td>
              <td className="px-5 py-4">
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[0.65rem] uppercase tracking-[0.14em] ${STATUS_CLASS[lead.status]}`}
                >
                  {STATUS_LABEL[lead.status]}
                </span>
              </td>
              <td className="px-5 py-4 text-right">
                <div className="inline-flex gap-2">
                  <button
                    type="button"
                    className="rounded-md border border-border px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted transition-colors hover:border-coral hover:text-coral"
                  >
                    Reply
                  </button>
                  <button
                    type="button"
                    className="rounded-md border border-border px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted transition-colors hover:border-coral hover:text-coral"
                  >
                    Archive
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const headerClass =
  "px-5 py-3 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted";
