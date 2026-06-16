import { BlogCard } from "./BlogCard";
import type { BlogPost } from "@/types";

type Props = {
  posts: BlogPost[];
};

export function RelatedPosts({ posts }: Props) {
  if (posts.length === 0) return null;

  return (
    <section
      aria-labelledby="related-posts-heading"
      className="mt-20 flex flex-col gap-8 border-t border-border pt-12"
    >
      <div className="flex flex-col gap-3">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-teal">
          / keep reading
        </p>
        <h2
          id="related-posts-heading"
          className="font-display text-3xl font-semibold text-foreground md:text-4xl"
        >
          More posts in the same vein
        </h2>
      </div>

      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
          <li key={p.slug}>
            <BlogCard post={p} />
          </li>
        ))}
      </ul>
    </section>
  );
}
