import { ProjectCard } from "@/components/public/ProjectCard";
import { ProjectsFilters } from "@/components/public/ProjectsFilters";
import { ProjectCardSkeleton } from "@/components/public/ProjectCardSkeleton";
import { Pagination } from "@/components/public/Pagination";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  fetchProjects,
  getProjectTypes,
  type ProjectQueryParams,
} from "@/lib/projects";

const SORTS = [
  { key: "recent", label: "Most recent" },
  { key: "endorsed", label: "Most endorsed" },
  { key: "alpha", label: "A → Z" },
  { key: "status", label: "Live first" },
] as const;

// Async server component holding every DB read for the projects index, so the
// page can stream it behind a <Suspense> while the static header renders first.
export async function ProjectsBrowser({ params }: { params: ProjectQueryParams }) {
  const [{ items, total, page, totalPages }, types] = await Promise.all([
    fetchProjects(params),
    getProjectTypes(),
  ]);

  const offset = (page - 1) * params.limit;
  const { q, type, sort } = params;
  const stack = params.stack.join(",");

  return (
    <>
      <ProjectsFilters
        types={types}
        sorts={SORTS.map((s) => ({ key: s.key, label: s.label }))}
        activeType={type}
        activeSort={sort}
        initialQuery={q}
      />

      <p
        className="mt-6 font-mono text-xs uppercase tracking-[0.14em] text-muted"
        aria-live="polite"
      >
        Showing {items.length} of {total}
        {total === 1 ? " project" : " projects"}
      </p>

      {items.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((project, i) => (
            <li key={project.slug}>
              <ProjectCard project={project} index={offset + i + 1} />
            </li>
          ))}
        </ul>
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        basePath="/projects"
        searchParams={{ q, type, sort, stack: stack || undefined }}
      />
    </>
  );
}

// Streamed-in fallback: filter chips + a grid of card skeletons.
export function ProjectsBrowserSkeleton() {
  return (
    <>
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-24 rounded-full" />
        ))}
      </div>
      <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <li key={i}>
            <ProjectCardSkeleton />
          </li>
        ))}
      </ul>
    </>
  );
}

function EmptyState() {
  return (
    <div className="mt-8 rounded-2xl border border-border bg-surface p-12 text-center">
      <p className="font-display text-xl font-semibold text-foreground">No matches</p>
      <p className="mt-2 text-sm text-muted">
        Try a different search term or clear the type filter.
      </p>
    </div>
  );
}
