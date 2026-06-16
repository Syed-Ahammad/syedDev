import type { Metadata } from "next";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { BlogCard } from "@/components/public/BlogCard";
import { BlogTagFilters } from "@/components/public/BlogTagFilters";
import { MOCK_BLOG_POSTS } from "@/lib/mock-blog";

export const metadata: Metadata = {
  title: "Blog — Syed Ahammad",
  description:
    "Notes from what I'm building — stack decisions, career reflections, and backend lessons I wish I'd learned sooner.",
};

type PageProps = {
  searchParams: Promise<{ tag?: string }>;
};

export default async function BlogIndexPage({ searchParams }: PageProps) {
  const raw = await searchParams;
  const activeTag = (raw.tag ?? "").trim();

  const tags = Array.from(new Set(MOCK_BLOG_POSTS.map((p) => p.tag))).sort();

  const filtered = MOCK_BLOG_POSTS.filter(
    (p) => activeTag === "" || p.tag === activeTag,
  );

  const sorted = [...filtered].sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt),
  );

  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col px-6 py-12 md:px-12 md:py-16">
        <div className="mx-auto w-full max-w-6xl">
          <header className="mb-10 max-w-2xl">
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-teal">
              / blog
            </p>
            <h1 className="font-display text-4xl font-semibold text-foreground md:text-5xl">
              Notes from what I&apos;m building
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted">
              Stack decisions, career reflections, and the backend lessons I wish I&apos;d
              learned sooner. Filter by tag or browse the latest.
            </p>
          </header>

          <BlogTagFilters tags={tags} activeTag={activeTag} />

          <p
            className="mt-6 font-mono text-xs uppercase tracking-[0.14em] text-muted"
            aria-live="polite"
          >
            Showing {sorted.length}
            {sorted.length === 1 ? " post" : " posts"}
            {activeTag ? ` tagged "${activeTag}"` : ""}
          </p>

          {sorted.length === 0 ? (
            <EmptyState />
          ) : (
            <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sorted.map((post) => (
                <li key={post.slug}>
                  <BlogCard post={post} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

function EmptyState() {
  return (
    <div className="mt-8 rounded-2xl border border-border bg-surface p-12 text-center">
      <p className="font-display text-xl font-semibold text-foreground">
        No posts under that tag yet
      </p>
      <p className="mt-2 text-sm text-muted">
        Pick a different tag or browse everything.
      </p>
    </div>
  );
}
