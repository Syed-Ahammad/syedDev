import type { Metadata } from "next";
import { BlogManager } from "@/components/admin/BlogManager";
import { fetchAdminPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog — Admin · syed.dev",
};

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const { items: posts } = await fetchAdminPosts(1);

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
          Draft new posts here — they save as drafts and appear below. Publishing
          and editing existing posts run through the blog API.
        </p>
      </header>

      <BlogManager posts={posts} />
    </div>
  );
}
