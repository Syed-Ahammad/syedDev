import Link from "next/link";
import { BlogCard } from "./BlogCard";
import { MOCK_BLOG_POSTS } from "@/lib/mock-blog";

export function BlogPreview() {
  const posts = [...MOCK_BLOG_POSTS]
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, 3);

  return (
    <section
      aria-labelledby="blog-heading"
      className="border-t border-border px-6 py-20 md:px-12 md:py-24"
    >
      <div className="mb-12 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-teal">
            / build journal
          </p>
          <h2
            id="blog-heading"
            className="font-display text-3xl font-semibold text-foreground md:text-4xl"
          >
            Notes from what I&apos;m building
          </h2>
        </div>
        <Link
          href="/blog"
          className="font-mono text-xs uppercase tracking-[0.14em] text-muted transition-colors hover:text-coral"
        >
          read all posts →
        </Link>
      </div>

      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <li key={post.slug}>
            <BlogCard post={post} />
          </li>
        ))}
      </ul>
    </section>
  );
}
