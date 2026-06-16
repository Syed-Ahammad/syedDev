import Link from "next/link";
import type { BlogPost } from "@/types";

const FORMATTER = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

function formatDate(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : FORMATTER.format(d);
}

type Props = {
  post: BlogPost;
};

export function BlogPostHeader({ post }: Props) {
  return (
    <header className="mb-12 flex flex-col gap-4 border-b border-border pb-10">
      <Link
        href="/blog"
        className="self-start font-mono text-xs uppercase tracking-[0.14em] text-muted transition-colors hover:text-coral"
      >
        ← all posts
      </Link>
      <div className="flex flex-wrap items-center gap-3 font-mono text-xs uppercase tracking-[0.14em]">
        <Link
          href={`/blog?tag=${encodeURIComponent(post.tag)}`}
          className="text-coral transition-opacity hover:opacity-80"
        >
          {post.tag}
        </Link>
        <span aria-hidden="true" className="text-muted">
          ·
        </span>
        <time dateTime={post.publishedAt} className="text-muted">
          {formatDate(post.publishedAt)}
        </time>
        <span aria-hidden="true" className="text-muted">
          ·
        </span>
        <span className="text-muted">{post.readMinutes} min read</span>
      </div>
      <h1 className="font-display text-4xl font-semibold text-foreground md:text-5xl">
        {post.title}
      </h1>
      <p className="max-w-3xl text-lg leading-relaxed text-muted">{post.excerpt}</p>
    </header>
  );
}
