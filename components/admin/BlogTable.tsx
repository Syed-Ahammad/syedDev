"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { AdminBlogItem } from "@/lib/blog";

type Props = {
  posts: AdminBlogItem[];
  onEdit: (post: AdminBlogItem) => void;
};

const DATE = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export function BlogTable({ posts, onEdit }: Props) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function mutate(id: string, init: RequestInit, successMessage: string) {
    if (busyId) return;
    setBusyId(id);
    setError("");
    try {
      const res = await fetch(`/api/admin/blog/${id}`, init);
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.success) {
        throw new Error(json?.error ?? "Action failed.");
      }
      toast.success(successMessage);
      router.refresh();
    } catch (e) {
      const message = e instanceof Error ? e.message : "Action failed.";
      setError(message);
      toast.error(message);
    } finally {
      setBusyId(null);
    }
  }

  function togglePublish(post: AdminBlogItem) {
    void mutate(
      post.id,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !post.published }),
      },
      post.published ? `"${post.title}" unpublished.` : `"${post.title}" published.`,
    );
  }

  function remove(post: AdminBlogItem) {
    if (!window.confirm(`Delete "${post.title}"? This can't be undone.`)) return;
    void mutate(post.id, { method: "DELETE" }, `"${post.title}" deleted.`);
  }

  if (posts.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-surface p-12 text-center">
        <p className="font-display text-lg font-semibold text-foreground">
          No posts yet
        </p>
        <p className="mt-1 text-sm text-muted">
          Use “+ New post” above to draft your first article.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {error && (
        <p role="alert" className="text-sm text-coral">
          {error}
        </p>
      )}
      <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-background/40">
              <th className={headerClass}>Post</th>
              <th className={headerClass}>Tag</th>
              <th className={headerClass}>Status</th>
              <th className={headerClass}>Read time</th>
              <th className={`${headerClass} text-right`}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-b border-border last:border-b-0">
                <td className="px-5 py-4">
                  <div className="flex flex-col gap-1">
                    <span className="font-display text-sm font-medium text-foreground">
                      {post.title}
                    </span>
                    <span className="max-w-[44ch] text-xs leading-snug text-muted">
                      {post.excerpt}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className="inline-flex items-center rounded-full border border-border bg-background px-2.5 py-0.5 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted">
                    {post.tag}
                  </span>
                </td>
                <td className="px-5 py-4">
                  {post.published ? (
                    <span className="inline-flex items-center rounded-full border border-teal/40 bg-teal/10 px-2.5 py-0.5 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-teal">
                      {DATE.format(new Date(post.publishedAt))}
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full border border-border bg-background px-2.5 py-0.5 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted">
                      Draft
                    </span>
                  )}
                </td>
                <td className="px-5 py-4 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted">
                  {post.readMinutes} min
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="inline-flex gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(post)}
                      disabled={busyId !== null}
                      className={actionClass}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => togglePublish(post)}
                      disabled={busyId !== null}
                      className={actionClass}
                    >
                      {post.published ? "Unpublish" : "Publish"}
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(post)}
                      disabled={busyId !== null}
                      className={`${actionClass} hover:border-coral hover:text-coral`}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const headerClass =
  "px-5 py-3 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted";

const actionClass =
  "rounded-md border border-border px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted transition-colors hover:border-coral hover:text-coral disabled:opacity-50";
