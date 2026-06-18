"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { AdminProjectItem } from "@/lib/projects";

type Props = {
  projects: AdminProjectItem[];
  onEdit: (project: AdminProjectItem) => void;
};

type Status = AdminProjectItem["status"];

const STATUS_LABEL: Record<Status, string> = {
  live: "Live",
  "in-progress": "In progress",
  draft: "Draft",
};

const STATUS_CLASS: Record<Status, string> = {
  live: "border-teal/40 bg-teal/10 text-teal",
  "in-progress": "border-amber-500/40 bg-amber-500/10 text-amber-500",
  draft: "border-border bg-background text-muted",
};

export function ProjectTable({ projects, onEdit }: Props) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function mutate(id: string, init: RequestInit, successMessage: string) {
    if (busyId) return;
    setBusyId(id);
    setError("");
    try {
      const res = await fetch(`/api/admin/projects/${id}`, init);
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

  function toggleStatus(project: AdminProjectItem) {
    const next: Status = project.status === "draft" ? "live" : "draft";
    void mutate(
      project.id,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      },
      next === "live" ? `"${project.name}" published.` : `"${project.name}" archived.`,
    );
  }

  function remove(project: AdminProjectItem) {
    if (!window.confirm(`Delete "${project.name}"? This can't be undone.`)) return;
    void mutate(project.id, { method: "DELETE" }, `"${project.name}" deleted.`);
  }

  if (projects.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-surface p-12 text-center">
        <p className="font-display text-lg font-semibold text-foreground">
          No projects yet
        </p>
        <p className="mt-1 text-sm text-muted">
          Use “+ New project” above to add your first case study.
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
              <th scope="col" className={headerClass}>
                Project
              </th>
              <th scope="col" className={headerClass}>
                Type
              </th>
              <th scope="col" className={headerClass}>
                Stack
              </th>
              <th scope="col" className={headerClass}>
                Status
              </th>
              <th scope="col" className={`${headerClass} text-right`}>
                Order
              </th>
              <th scope="col" className={`${headerClass} text-right`}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className="border-b border-border last:border-b-0">
                <td className="px-5 py-4">
                  <div className="flex flex-col gap-1">
                    <span className="font-display text-sm font-medium text-foreground">
                      {project.name}
                    </span>
                    <span className="text-xs leading-snug text-muted">
                      {project.tagline}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-muted">{project.type}</td>
                <td className="px-5 py-4">
                  <ul className="flex flex-wrap gap-1.5">
                    {project.stack.map((s) => (
                      <li
                        key={s}
                        className="rounded-full border border-border bg-background px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted"
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[0.65rem] uppercase tracking-[0.14em] ${STATUS_CLASS[project.status]}`}
                  >
                    {STATUS_LABEL[project.status]}
                  </span>
                </td>
                <td className="px-5 py-4 text-right font-mono text-xs text-muted">
                  #{project.order}
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="inline-flex gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(project)}
                      disabled={busyId !== null}
                      className={actionClass}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleStatus(project)}
                      disabled={busyId !== null}
                      className={actionClass}
                    >
                      {project.status === "draft" ? "Publish" : "Archive"}
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(project)}
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
