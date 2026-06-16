import Link from "next/link";
import type { BlogPost } from "@/types";

const FORMATTER = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

function formatDate(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : FORMATTER.format(d);
}

type Props = {
  post: BlogPost;
};

export function BlogCard({ post }: Props) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex h-full min-h-[260px] flex-col justify-between rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-coral"
    >
      <div>
        <div className="mb-4 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.14em]">
          <span className="text-coral">{post.tag}</span>
          <span aria-hidden="true" className="text-muted">
            ·
          </span>
          <span className="text-muted">{post.readMinutes} min read</span>
        </div>
        <h3 className="font-display text-lg font-semibold text-foreground transition-colors group-hover:text-coral md:text-xl">
          {post.title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted">{post.excerpt}</p>
      </div>
      <footer className="mt-6 flex items-center justify-between font-mono text-xs uppercase tracking-[0.14em] text-muted">
        <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
        <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
          →
        </span>
      </footer>
    </Link>
  );
}
