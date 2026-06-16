import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { MobileNav } from "./MobileNav";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  return (
    <nav
      aria-label="Primary"
      className="sticky top-0 z-50 flex w-full items-center justify-between gap-4 border-b border-border bg-background/70 px-6 py-4 backdrop-blur-md md:px-8"
    >
      <Link
        href="/"
        className="font-display text-base font-bold tracking-tight text-foreground"
      >
        syed<span className="text-coral">.</span>dev
      </Link>

      <ul className="hidden items-center gap-6 text-sm md:flex">
        {NAV_LINKS.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-muted transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-3 md:gap-4">
        <span
          aria-label="Available for new work"
          className="hidden items-center gap-2 rounded-full border border-border px-3 py-1.5 font-mono text-[0.7rem] text-teal sm:inline-flex"
        >
          <span className="relative inline-block h-1.5 w-1.5 rounded-full bg-teal">
            <span
              aria-hidden="true"
              className="absolute inset-0 animate-ping rounded-full bg-teal/60"
            />
          </span>
          Available for work
        </span>

        <Link
          href="/login"
          className="rounded-full bg-coral px-4 py-1.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          Login
        </Link>

        <ThemeToggle />
        <MobileNav links={NAV_LINKS} />
      </div>
    </nav>
  );
}
