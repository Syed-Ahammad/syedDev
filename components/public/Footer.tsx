import Link from "next/link";

const SITE_LINKS = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
];

const CONNECT_LINKS = [
  { href: "https://github.com/", label: "GitHub" },
  { href: "https://www.linkedin.com/", label: "LinkedIn" },
  { href: "https://www.upwork.com/", label: "Upwork" },
  { href: "mailto:hello@syed.dev", label: "Email" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background px-6 py-16 md:px-12">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <Link
            href="/"
            className="font-display text-xl font-semibold text-foreground"
          >
            syed<span className="text-coral">.</span>dev
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
            Full-stack developer in Dubai. Building fast, reliable web apps with Next.js
            and MongoDB — and a public build journal alongside every project.
          </p>
        </div>

        <nav aria-label="Site" className="flex flex-col gap-3 text-sm">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-teal">
            / site
          </p>
          {SITE_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted transition-colors hover:text-coral"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <nav aria-label="Connect" className="flex flex-col gap-3 text-sm">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-teal">
            / connect
          </p>
          {CONNECT_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noreferrer noopener" : undefined}
              className="text-muted transition-colors hover:text-coral"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>

      <div className="mx-auto mt-12 flex max-w-6xl flex-col gap-2 border-t border-border pt-6 font-mono text-xs uppercase tracking-[0.14em] text-muted md:flex-row md:items-center md:justify-between">
        <p>© {year} Syed Ahammad · Built with Next.js</p>
        <p>Made in Dubai</p>
      </div>
    </footer>
  );
}
