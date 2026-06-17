type Props = {
  label: string;
  value: string;
  trend?: string;
  hint?: string;
};

export function StatCard({ label, value, trend, hint }: Props) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-5">
      <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-teal">
        {label}
      </span>
      <span className="font-display text-3xl font-semibold text-foreground md:text-4xl">
        {value}
      </span>
      {(trend || hint) && (
        <div className="flex flex-col gap-1">
          {trend && (
            <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-coral">
              {trend}
            </span>
          )}
          {hint && <span className="text-xs leading-relaxed text-muted">{hint}</span>}
        </div>
      )}
    </div>
  );
}
