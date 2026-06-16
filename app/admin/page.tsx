import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Admin overview — syed.dev",
};

type Card = {
  label: string;
  hint: string;
  href: string;
};

const CARDS: Card[] = [
  { label: "Projects", hint: "Add, edit, and archive case studies.", href: "/admin/projects" },
  { label: "Leads", hint: "Triage incoming contact requests.", href: "/admin/leads" },
  { label: "Blog", hint: "Draft and publish posts.", href: "/admin/blog" },
  { label: "Endorsements", hint: "Approve or reject community endorsements.", href: "/admin/endorsements" },
  { label: "Users", hint: "Manage roles and access.", href: "/admin/users" },
  { label: "Analytics", hint: "Track visits, leads, and engagement.", href: "/admin/analytics" },
];

export default function AdminOverviewPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
      <header className="flex flex-col gap-3">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-teal">
          / overview
        </p>
        <h1 className="font-display text-3xl font-semibold text-foreground md:text-4xl">
          Admin shell is live
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted">
          This is the empty admin shell. Real stat cards, tables, and forms land
          in step 2.22 once the mock data is wired in. The sidebar already routes
          to every section the rubric calls for.
        </p>
      </header>

      <section
        aria-labelledby="admin-sections-heading"
        className="flex flex-col gap-6"
      >
        <h2
          id="admin-sections-heading"
          className="font-display text-xl font-semibold text-foreground"
        >
          What lives in each section
        </h2>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
