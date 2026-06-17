"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  bookmarkId: string;
  projectName: string;
};

export function RemoveBookmarkButton({ bookmarkId, projectName }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function remove() {
    setBusy(true);
    try {
      const res = await fetch(`/api/user/bookmarks/${bookmarkId}`, {
        method: "DELETE",
      });
      if (res.ok) router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={remove}
      disabled={busy}
      aria-label={`Remove ${projectName} bookmark`}
      className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted transition-colors hover:text-coral disabled:opacity-50"
    >
      {busy ? "Removing…" : "Remove"}
    </button>
  );
}
