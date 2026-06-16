"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, type ChangeEvent } from "react";

type Props = {
  types: string[];
  sorts: { key: string; label: string }[];
  activeType: string;
  activeSort: string;
  initialQuery: string;
};

const RESET_KEYS = ["q", "type", "sort"] as const;

export function ProjectsFilters({
  types,
  sorts,
  activeType,
  activeSort,
  initialQuery,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  function pushUrl(updates: Record<string, string | undefined>) {
    const next = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(updates)) {
      if (v == null || v === "") next.delete(k);
      else next.set(k, v);
    }
    if (RESET_KEYS.some((k) => k in updates)) {
      next.delete("page");
    }
    const qs = next.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  function onSearchChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => pushUrl({ q: value }), 250);
  }

  function onTypeClick(type: string) {
    pushUrl({ type: type === activeType ? undefined : type });
  }

  function onSortChange(event: ChangeEvent<HTMLSelectElement>) {
    pushUrl({ sort: event.target.value });
  }

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-border bg-surface p-5 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <label className="flex w-full items-center gap-3 md:max-w-md">
          <span className="sr-only">Search projects</span>
          <input
            type="search"
            name="q"
            defaultValue={initialQuery}
            onChange={onSearchChange}
            placeholder="Search by name or what it does…"
            className="h-11 w-full rounded-full border border-border bg-background px-5 text-sm text-foreground placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral"
          />
        </label>

        <label className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.14em] text-muted">
          Sort
          <select
            value={activeSort}
            onChange={onSortChange}
            className="h-11 rounded-full border border-border bg-background px-4 text-xs uppercase tracking-[0.14em] text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral"
          >
            {sorts.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <ul
        aria-label="Filter by type"
        className="flex flex-wrap gap-2"
      >
        <li>
          <button
            type="button"
            onClick={() => pushUrl({ type: undefined })}
            aria-pressed={activeType === ""}
            className={chipClass(activeType === "")}
          >
            All
          </button>
        </li>
        {types.map((t) => (
          <li key={t}>
            <button
              type="button"
              onClick={() => onTypeClick(t)}
              aria-pressed={activeType === t}
              className={chipClass(activeType === t)}
            >
              {t}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function chipClass(active: boolean) {
  return [
    "rounded-full border px-3 py-1.5 font-mono text-xs uppercase tracking-[0.14em] transition-colors",
    active
      ? "border-coral bg-coral text-background"
      : "border-border bg-background text-muted hover:border-coral hover:text-coral",
  ].join(" ");
}
