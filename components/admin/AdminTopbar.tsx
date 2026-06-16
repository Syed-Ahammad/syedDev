import Link from "next/link";
import { ThemeToggle } from "@/components/public/ThemeToggle";
import { ProfileDropdown } from "@/components/ui/ProfileDropdown";

const MENU_ITEMS = [
  { label: "View profile", href: "/admin/profile" },
  { label: "Switch to user view", href: "/dashboard" },
  { label: "Visit public site", href: "/" },
];

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
        <ThemeToggle />
        <ProfileDropdown
          name="Syed Ahammad"
          email="admin@syed.dev"
          initials="SA"
          accent="coral"
          items={MENU_ITEMS}
        />
      </div>
    </header>
  );
}
