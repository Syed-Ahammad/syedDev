import type { Metadata } from "next";
import { BlogTable } from "@/components/admin/BlogTable";
import { BlogForm } from "@/components/admin/BlogForm";
import { MOCK_BLOG_POSTS } from "@/lib/mock-blog";

export const metadata: Metadata = {
  title: "Blog — Admin · syed.dev",
};

export default function AdminBlogPage() {
  const posts = [...MOCK_BLOG_POSTS].sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt),
  );

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <header className="flex flex-col gap-3">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-teal">
          / blog
        </p>
        <h1 className="font-display text-3xl font-semibold text-foreground md:text-4xl">
          Post manager
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted">
          Draft and publish posts. Persistence and the rich Markdown editor wire
          in at step 3.17.
        </p>
      </header>

      <BlogForm />

      <BlogTable posts={posts} />
    </div>
  );
}
