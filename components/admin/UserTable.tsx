"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { AdminUser, UserRole } from "@/types";

type Props = {
  users: AdminUser[];
  currentUserId: string;
};

const JOINED = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

function relative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.round(diff / 60_000);
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.round(hr / 24);
  if (day < 30) return `${day}d ago`;
  const mo = Math.round(day / 30);
  return `${mo}mo ago`;
}

export function UserTable({ users, currentUserId }: Props) {
  const router = useRouter();
  const [items, setItems] = useState<AdminUser[]>(users);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  // Optimistically apply `optimistic`, PATCH, roll back on failure.
  async function patchUser(
    id: string,
    patch: { role?: UserRole; suspended?: boolean },
    optimistic: Partial<AdminUser>,
  ) {
    if (busyId) return;
    const prev = items;
    setBusyId(id);
    setError("");
    setItems((list) =>
      list.map((u) => (u.id === id ? { ...u, ...optimistic } : u)),
    );
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.success) {
        throw new Error(json?.error ?? "Couldn't update that user.");
      }
      router.refresh();
    } catch (e) {
      setItems(prev);
      setError(e instanceof Error ? e.message : "Couldn't update that user.");
    } finally {
      setBusyId(null);
    }
  }

  async function remove(user: AdminUser) {
    if (busyId) return;
    if (
      !window.confirm(
        `Delete ${user.name}? This also removes their bookmarks and endorsements.`,
      )
    )
      return;
    const prev = items;
    setBusyId(user.id);
    setError("");
    setItems((list) => list.filter((u) => u.id !== user.id));
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "DELETE",
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.success) {
        throw new Error(json?.error ?? "Couldn't delete that user.");
      }
      router.refresh();
    } catch (e) {
      setItems(prev);
      setError(e instanceof Error ? e.message : "Couldn't delete that user.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {error && (
        <p role="alert" className="text-sm text-coral">
          {error}
        </p>
      )}

      <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-background/40">
              <th className={headerClass}>User</th>
              <th className={headerClass}>Role</th>
              <th className={headerClass}>Status</th>
              <th className={headerClass}>Joined</th>
              <th className={headerClass}>Last active</th>
              <th className={`${headerClass} text-right`}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((user) => {
              const isSelf = user.id === currentUserId;
              const disabled = busyId !== null || isSelf;
              const nextRole: UserRole =
                user.role === "admin" ? "user" : "admin";
              const willSuspend = user.status === "active";
              return (
                <tr
                  key={user.id}
                  className="border-b border-border last:border-b-0"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span
                        aria-hidden="true"
                        className={`flex h-9 w-9 items-center justify-center rounded-full font-display text-sm font-semibold text-background ${
                          user.role === "admin" ? "bg-coral" : "bg-teal"
                        }`}
                      >
                        {user.name
                          .split(" ")
                          .map((p) => p[0])
                          .slice(0, 2)
                          .join("")
                          .toUpperCase()}
                      </span>
                      <div className="flex flex-col">
                        <span className="font-display text-sm font-medium text-foreground">
                          {user.name}
                          {isSelf && (
                            <span className="ml-2 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-teal">
                              you
                            </span>
                          )}
                        </span>
                        <span className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted">
                          {user.email}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[0.65rem] uppercase tracking-[0.14em] ${
                        user.role === "admin"
                          ? "border-coral/40 bg-coral/10 text-coral"
                          : "border-border bg-background text-muted"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[0.65rem] uppercase tracking-[0.14em] ${
                        user.status === "active"
                          ? "border-teal/40 bg-teal/10 text-teal"
                          : "border-amber-500/40 bg-amber-500/10 text-amber-500"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted">
                    {JOINED.format(new Date(user.joinedAt))}
                  </td>
                  <td className="px-5 py-4 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted">
                    {relative(user.lastActiveAt)}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="inline-flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          patchUser(
                            user.id,
                            { role: nextRole },
                            { role: nextRole },
                          )
                        }
                        disabled={disabled}
                        className={actionClass}
                      >
                        {user.role === "admin" ? "Make user" : "Make admin"}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          patchUser(
                            user.id,
                            { suspended: willSuspend },
                            { status: willSuspend ? "suspended" : "active" },
                          )
                        }
                        disabled={disabled}
                        className={actionClass}
                      >
                        {willSuspend ? "Suspend" : "Reinstate"}
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(user)}
                        disabled={disabled}
                        className={actionClass}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const headerClass =
  "px-5 py-3 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted";

const actionClass =
  "rounded-md border border-border px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted transition-colors hover:border-coral hover:text-coral disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border disabled:hover:text-muted";
