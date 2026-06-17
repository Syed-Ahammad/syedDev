import Link from "next/link";

type Props = {
  label: string;
  value: string;
  hint: string;
  href: string;
};

export function StatCard({ label, value, hint, href }: Props) {
  return (
    <Link
      href={href}
      className="flex h-full flex-col gap-3 rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-teal"
    >
      <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-teal">
        {label}
      </span>
      <span className="font-display text-3xl font-semibold text-foreground md:text-4xl">
        {value}
      </span>
      <span className="text-xs leading-relaxed text-muted">{hint}</span>
      <span className="mt-auto pt-2 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-coral">
        Open →
      </span>
    </Link>
  );
}
