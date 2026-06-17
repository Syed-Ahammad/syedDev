import type { Metadata } from "next";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { ProjectCard } from "@/components/public/ProjectCard";
import { ProjectsFilters } from "@/components/public/ProjectsFilters";
import { Pagination } from "@/components/public/Pagination";
import { fetchProjects, getProjectTypes, parseProjectParams } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projects — Syed Ahammad",
  description:
    "Everything I've built so far — products shipped, projects in progress, and ideas being sketched.",
};

const SORTS = [
  { key: "recent", label: "Most recent" },
  { key: "endorsed", label: "Most endorsed" },
  { key: "alpha", label: "A → Z" },
  { key: "status", label: "Live first" },
] as const;

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ProjectsPage({ searchParams }: PageProps) {
  const raw = await searchParams;
  const sp = new URLSearchParams();
  for (const [key, value] of Object.entries(raw)) {
    if (typeof value === "string") sp.set(key, value);
  }
  const params = parseProjectParams(sp);

  const [{ items, total, page, totalPages }, types] = await Promise.all([
    fetchProjects(params),
    getProjectTypes(),
  ]);

  const offset = (page - 1) * params.limit;
  const { q, type, sort } = params;
  const stack = params.stack.join(",");

  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col px-6 py-12 md:px-12 md:py-16">
        <div className="mx-auto w-full max-w-6xl">
          <header className="mb-10 max-w-2xl">
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-teal">
              / projects
            </p>
            <h1 className="font-display text-4xl font-semibold text-foreground md:text-5xl">
              Everything I&apos;ve built so far
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted">
              Products I&apos;ve shipped, projects in progress, and ideas being sketched.
              Filter by type, sort by status, or search for what it does.
            </p>
          </header>

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
        </div>
      </main>
      <Footer />
    </>
  );
}

function EmptyState() {
  return (
    <div className="mt-8 rounded-2xl border border-border bg-surface p-12 text-center">
      <p className="font-display text-xl font-semibold text-foreground">
        No matches
      </p>
      <p className="mt-2 text-sm text-muted">
        Try a different search term or clear the type filter.
      </p>
    </div>
  );
}
