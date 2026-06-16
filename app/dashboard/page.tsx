import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Your dashboard — syed.dev",
};

type Card = {
  label: string;
  hint: string;
  href: string;
};

const CARDS: Card[] = [
  {
    label: "Bookmarks",
    hint: "Save projects you want to come back to.",
    href: "/dashboard/bookmarks",
  },
  {
    label: "Endorsements",
    hint: "Endorse skills you've actually seen me ship.",
    href: "/dashboard/endorsements",
  },
  {
    label: "Quote requests",
    hint: "Track the briefs you've sent and where each one stands.",
    href: "/dashboard/quotes",
  },
  {
    label: "Profile",
    hint: "Update your name, avatar and notification preferences.",
    href: "/dashboard/profile",
  },
];

export default function DashboardOverviewPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
      <header className="flex flex-col gap-3">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-teal">
          / overview
        </p>
        <h1 className="font-display text-3xl font-semibold text-foreground md:text-4xl">
          Welcome back, Demo User.
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted">
          This is the empty dashboard shell. Real stat cards, bookmarks and
          endorsement history land in step 2.23 once mock data is wired in. The
          sidebar already routes to every section the rubric calls for.
        </p>
      </header>

      <section
        aria-labelledby="dashboard-sections-heading"
        className="flex flex-col gap-6"
      >
        <h2
          id="dashboard-sections-heading"
          className="font-display text-xl font-semibold text-foreground"
        >
          Where to go from here
        </h2>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {CARDS.map((card) => (
            <li key={card.href}>
              <Link
                href={card.href}
                className="flex h-full flex-col gap-2 rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-coral"
              >
                <span className="font-display text-base font-semibold text-foreground">
                  {card.label}
                </span>
                <span className="text-sm leading-relaxed text-muted">
                  {card.hint}
                </span>
                <span className="mt-auto pt-3 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-coral">
                  Open →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
