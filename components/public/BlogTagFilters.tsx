import Link from "next/link";

type Props = {
  tags: string[];
  activeTag: string;
};

export function BlogTagFilters({ tags, activeTag }: Props) {
  return (
    <nav aria-label="Filter posts by tag" className="flex flex-wrap gap-2">
      <TagChip label="All" href="/blog" active={activeTag === ""} />
      {tags.map((tag) => (
        <TagChip
          key={tag}
          label={tag}
          href={`/blog?tag=${encodeURIComponent(tag)}`}
          active={activeTag === tag}
        />
      ))}
    </nav>
  );
}

function TagChip({
  label,
  href,
  active,
}: {
  label: string;
  href: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`rounded-full border px-4 py-1.5 font-mono text-xs uppercase tracking-[0.14em] transition-colors ${
        active
          ? "border-coral bg-coral/10 text-coral"
          : "border-border bg-surface text-muted hover:border-coral hover:text-coral"
      }`}
    >
      {label}
    </Link>
  );
}
