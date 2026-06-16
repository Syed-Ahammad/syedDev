import Link from "next/link";
import { ThemeToggle } from "@/components/public/ThemeToggle";

export function AdminTopbar() {
  return (
    <header
      aria-label="Admin top bar"
      className="sticky top-0 z-40 flex h-[57px] items-center justify-between gap-4 border-b border-border bg-background/80 px-6 backdrop-blur-md lg:px-8"
    >
      <div className="flex items-center gap-3">
        <Link
          href="/admin"
          className="flex items-baseline gap-2 font-display text-base font-semibold text-foreground lg:hidden"
        >
          syed<span className="text-coral">.</span>dev
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-teal">
            admin
          </span>
        </Link>
        <span
          aria-label="Authentication is still mocked"
          className="hidden items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-amber-500 sm:inline-flex"
        >
          <span aria-hidden="true">⚠</span>
          Mock session · auth wires in phase 3
        </span>
      </div>

      <div className="flex items-center gap-3">
        <div
          aria-label="Signed in as"
          className="hidden flex-col items-end leading-tight sm:flex"
        >
          <span className="font-display text-sm font-medium text-foreground">
            Syed Ahammad
          </span>
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted">
            admin@syed.dev
          </span>
        </div>
        <span
          aria-hidden="true"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-coral font-display text-sm font-semibold text-background"
        >
          SA
        </span>
        <ThemeToggle />
        <Link
          href="/"
          className="hidden rounded-full border border-border px-3 py-1.5 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted transition-colors hover:border-coral hover:text-coral sm:inline-flex"
        >
          Sign out
        </Link>
      </div>
    </header>
  );
}
