import Link from "next/link";
import type { Bookmark } from "@/types";

const DAY_MS = 1000 * 60 * 60 * 24;

function relativeDays(iso: string): string {
  const days = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / DAY_MS));
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 14) return `${days} days ago`;
  return `${Math.floor(days / 7)} weeks ago`;
}

type Props = {
  bookmark: Bookmark;
};

export function BookmarkCard({ bookmark }: Props) {
  return (
    <article className="flex h-full flex-col gap-3 rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-teal">
            {bookmark.projectType}
          </span>
          <Link
            href={`/projects/${bookmark.projectSlug}`}
            className="font-display text-lg font-semibold text-foreground transition-colors hover:text-coral"
          >
            {bookmark.projectName}
          </Link>
        </div>
        <span className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted">
          {relativeDays(bookmark.bookmarkedAt)}
        </span>
      </div>
      <p className="line-clamp-3 text-sm leading-relaxed text-muted">
        {bookmark.projectTagline}
      </p>
      <ul className="flex flex-wrap gap-1.5">
        {bookmark.stack.map((s) => (
          <li
            key={s}
            className="rounded-full border border-border bg-background px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted"
          >
            {s}
          </li>
        ))}
      </ul>
      <div className="mt-auto flex items-center justify-between gap-3 pt-2">
        <Link
          href={`/projects/${bookmark.projectSlug}`}
          className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-coral transition-colors hover:text-foreground"
        >
          View project →
        </Link>
        <button
          type="button"
          aria-label={`Remove ${bookmark.projectName} bookmark`}
          className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted transition-colors hover:text-coral"
        >
          Remove
        </button>
      </div>
    </article>
  );
}
