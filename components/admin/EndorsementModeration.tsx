"use client";

import { useState } from "react";
import type { Endorsement, EndorsementStatus } from "@/types";

type Props = {
  initial: Endorsement[];
};

const DATE = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
});

export function EndorsementModeration({ initial }: Props) {
  const [items, setItems] = useState<Endorsement[]>(initial);
  const [tab, setTab] = useState<EndorsementStatus>("pending");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const counts = {
    pending: items.filter((e) => e.status === "pending").length,
    approved: items.filter((e) => e.status === "approved").length,
    rejected: items.filter((e) => e.status === "rejected").length,
  };

  const visible = items.filter((e) => e.status === tab);

  // Optimistically flip the status, persist via the API, roll back on failure.
  async function update(id: string, next: EndorsementStatus) {
    const current = items.find((e) => e.id === id);
    if (!current || current.status === next || busyId) return;
    const prevStatus = current.status;

    setBusyId(id);
    setError("");
    setItems((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: next } : e)),
    );

    try {
      const res = await fetch(`/api/admin/endorsements/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.success) {
        throw new Error(json?.error ?? "Couldn't update that endorsement.");
      }
    } catch (e) {
      setItems((prev) =>
        prev.map((it) => (it.id === id ? { ...it, status: prevStatus } : it)),
      );
      setError(
        e instanceof Error ? e.message : "Couldn't update that endorsement.",
      );
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div
        role="tablist"
        aria-label="Endorsement status"
        className="inline-flex w-fit gap-1 rounded-full border border-border bg-surface p-1"
      >
        {(["pending", "approved", "rejected"] as const).map((status) => {
          const isActive = status === tab;
          return (
            <button
              key={status}
              role="tab"
              type="button"
              aria-selected={isActive}
              onClick={() => setTab(status)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-mono text-[0.7rem] uppercase tracking-[0.14em] transition-colors ${
                isActive
                  ? "bg-coral text-background"
                  : "text-muted hover:text-foreground"
              }`}
            >
              <span>{status}</span>
              <span
                className={`rounded-full px-1.5 py-0.5 text-[0.65rem] ${
                  isActive ? "bg-background/30 text-background" : "bg-background text-muted"
                }`}
              >
                {counts[status]}
              </span>
            </button>
          );
        })}
      </div>

      {error && (
        <p role="alert" className="text-sm text-coral">
          {error}
        </p>
      )}

      {visible.length === 0 ? (
        <div className="rounded-2xl border border-border bg-surface p-12 text-center">
          <p className="font-display text-lg font-semibold text-foreground">
            Queue is clear
          </p>
          <p className="mt-1 text-sm text-muted">
            Nothing to review under &quot;{tab}&quot;.
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {visible.map((endorsement) => (
            <li
              key={endorsement.id}
              className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-coral">
                    {endorsement.skill}
                  </span>
                  <span className="font-display text-sm font-medium text-foreground">
                    {endorsement.endorserName}
                  </span>
                  <span className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted">
                    {endorsement.endorserRole}
                  </span>
                </div>
                <span className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted">
                  {DATE.format(new Date(endorsement.submittedAt))}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-muted">
                &ldquo;{endorsement.text}&rdquo;
              </p>
              <div className="flex flex-wrap gap-2 border-t border-border pt-4">
                {tab !== "approved" && (
                  <button
                    type="button"
                    onClick={() => update(endorsement.id, "approved")}
                    disabled={busyId !== null}
                    className="inline-flex h-9 items-center justify-center rounded-full bg-teal px-4 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-background transition-opacity hover:opacity-90 disabled:opacity-50"
                  >
                    Approve
                  </button>
                )}
                {tab !== "rejected" && (
                  <button
                    type="button"
                    onClick={() => update(endorsement.id, "rejected")}
                    disabled={busyId !== null}
                    className="inline-flex h-9 items-center justify-center rounded-full border border-border px-4 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted transition-colors hover:border-coral hover:text-coral disabled:opacity-50"
                  >
                    Reject
                  </button>
                )}
                {tab !== "pending" && (
                  <button
                    type="button"
                    onClick={() => update(endorsement.id, "pending")}
                    disabled={busyId !== null}
                    className="inline-flex h-9 items-center justify-center rounded-full border border-border px-4 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted transition-colors hover:border-coral hover:text-coral disabled:opacity-50"
                  >
                    Move to pending
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
