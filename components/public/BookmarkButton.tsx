"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type Props = {
  projectId: string;
};

type BookmarkItem = { id: string; projectId: string };

export function BookmarkButton({ projectId }: Props) {
  const { status } = useSession();
  const router = useRouter();
  const [bookmarkId, setBookmarkId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // On load (when signed in), find whether this project is already bookmarked.
  useEffect(() => {
    if (status !== "authenticated") return;
    let active = true;
    fetch("/api/user/bookmarks")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (!active || !json?.success) return;
        const match = (json.data.items as BookmarkItem[]).find(
          (item) => item.projectId === projectId,
        );
        setBookmarkId(match ? match.id : null);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [status, projectId]);

  async function toggle() {
    if (status !== "authenticated") {
      router.push("/login");
      return;
    }
    setBusy(true);
    try {
      if (bookmarkId) {
        const res = await fetch(`/api/user/bookmarks/${bookmarkId}`, {
          method: "DELETE",
        });
        if (res.ok) setBookmarkId(null);
      } else {
        const res = await fetch("/api/user/bookmarks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projectId }),
        });
        const json = await res.json().catch(() => null);
        if (res.ok && json?.success) setBookmarkId(json.data.id);
      }
    } finally {
      setBusy(false);
    }
  }

  const saved = Boolean(bookmarkId);

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      aria-pressed={saved}
      className="inline-flex w-fit items-center gap-2 rounded-full border border-border px-4 py-2 font-mono text-xs uppercase tracking-[0.14em] text-muted transition-colors hover:border-coral hover:text-coral disabled:opacity-60"
    >
      {saved ? "★ Bookmarked" : "☆ Bookmark"}
    </button>
  );
}
