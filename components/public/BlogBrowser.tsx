import { BlogCard } from "@/components/public/BlogCard";
import { BlogTagFilters } from "@/components/public/BlogTagFilters";
import { CardGridSkeleton } from "@/components/ui/skeletons";
import { Skeleton } from "@/components/ui/Skeleton";
import { getPublishedPosts, getPublishedTags } from "@/lib/blog";

// Async server component holding the blog index DB reads, streamed behind a
// <Suspense> so the static header paints first.
export async function BlogBrowser({ activeTag }: { activeTag: string }) {
  const [sorted, tags] = await Promise.all([
    getPublishedPosts(activeTag || undefined),
    getPublishedTags(),
  ]);

  return (
    <>
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
    </>
  );
}

export function BlogBrowserSkeleton() {
  return (
    <>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-24 rounded-full" />
        ))}
      </div>
      <div className="mt-6">
        <CardGridSkeleton count={6} />
      </div>
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
