"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Item = {
  href: string;
  label: string;
  glyph: string;
};

const ITEMS: Item[] = [
  { href: "/dashboard", label: "Overview", glyph: "◆" },
  { href: "/dashboard/bookmarks", label: "Bookmarks", glyph: "❐" },
  { href: "/dashboard/endorsements", label: "Endorsements", glyph: "★" },
  { href: "/dashboard/quotes", label: "Quote requests", glyph: "✉" },
  { href: "/dashboard/profile", label: "Profile", glyph: "◉" },
];

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      aria-label="Dashboard"
      className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col gap-8 border-r border-border bg-surface px-5 py-8 lg:flex"
    >
      <Link
        href="/dashboard"
        className="flex items-baseline gap-2 px-2 font-display text-base font-semibold text-foreground"
      >
        syed<span className="text-coral">.</span>dev
        <span className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-teal">
          you
        </span>
      </Link>

      <nav aria-label="Dashboard sections" className="flex-1">
        <ul className="flex flex-col gap-1">
          {ITEMS.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                    active
                      ? "bg-coral/10 text-coral"
                      : "text-muted hover:bg-background hover:text-foreground"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`font-mono text-xs ${active ? "text-coral" : "text-muted"}`}
                  >
                    {item.glyph}
                  </span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <Link
        href="/"
        className="rounded-lg border border-border bg-background px-3 py-2.5 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted transition-colors hover:border-coral hover:text-coral"
      >
        ← back to site
      </Link>
    </aside>
  );
}

export function MobileDashboardNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Dashboard sections (mobile)"
      className="sticky top-[57px] z-30 border-b border-border bg-surface lg:hidden"
    >
      <ul className="flex gap-1 overflow-x-auto px-4 py-3">
        {ITEMS.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <li key={item.href} className="shrink-0">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs ${
                  active
                    ? "border-coral bg-coral/10 text-coral"
                    : "border-border text-muted hover:text-foreground"
                }`}
              >
                <span aria-hidden="true" className="font-mono">
                  {item.glyph}
                </span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
