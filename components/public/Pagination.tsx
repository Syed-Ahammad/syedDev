import Link from "next/link";

type Props = {
  page: number;
  totalPages: number;
  basePath: string;
  searchParams: Record<string, string | undefined>;
};

export function Pagination({ page, totalPages, basePath, searchParams }: Props) {
  if (totalPages <= 1) return null;

  function hrefFor(target: number) {
    const next = new URLSearchParams();
    for (const [k, v] of Object.entries(searchParams)) {
      if (k === "page") continue;
      if (v) next.set(k, v);
    }
    if (target > 1) next.set("page", String(target));
    const qs = next.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  }

  const prevPage = Math.max(1, page - 1);
  const nextPage = Math.min(totalPages, page + 1);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      aria-label="Pagination"
      className="mt-10 flex items-center justify-between gap-4"
    >
      <Link
        href={hrefFor(prevPage)}
        aria-disabled={page === 1}
        aria-label="Previous page"
        className={navLinkClass(page === 1)}
      >
        ← Prev
      </Link>

      <ul className="flex items-center gap-1">
        {pages.map((p) => (
          <li key={p}>
            <Link
              href={hrefFor(p)}
              aria-current={p === page ? "page" : undefined}
              className={pageLinkClass(p === page)}
            >
              {p}
            </Link>
          </li>
        ))}
      </ul>

      <Link
        href={hrefFor(nextPage)}
        aria-disabled={page === totalPages}
        aria-label="Next page"
        className={navLinkClass(page === totalPages)}
      >
        Next →
      </Link>
    </nav>
  );
}

function navLinkClass(disabled: boolean) {
  return [
    "rounded-full border border-border px-4 py-2 font-mono text-xs uppercase tracking-[0.14em] transition-colors",
    disabled
      ? "pointer-events-none text-muted/40"
      : "text-muted hover:border-coral hover:text-coral",
  ].join(" ");
}

function pageLinkClass(current: boolean) {
  return [
    "inline-flex h-9 w-9 items-center justify-center rounded-full font-mono text-xs transition-colors",
    current
      ? "bg-coral text-background"
      : "text-muted hover:bg-surface hover:text-foreground",
  ].join(" ");
}
