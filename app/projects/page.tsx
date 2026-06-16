import type { Metadata } from "next";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { ProjectCard } from "@/components/public/ProjectCard";
import { ProjectsFilters } from "@/components/public/ProjectsFilters";
import { Pagination } from "@/components/public/Pagination";
import { MOCK_PROJECTS } from "@/lib/mock-projects";
import type { ProjectStatus } from "@/types";

export const metadata: Metadata = {
  title: "Projects — Syed Ahammad",
  description:
    "Everything I've built so far — products shipped, projects in progress, and ideas being sketched.",
};

const PAGE_SIZE = 8;

const SORTS = [
  { key: "recent", label: "Most recent" },
  { key: "alpha", label: "A → Z" },
  { key: "status", label: "Live first" },
] as const;
type SortKey = (typeof SORTS)[number]["key"];

const STATUS_ORDER: Record<ProjectStatus, number> = {
  live: 0,
  "in-progress": 1,
  draft: 2,
};

type PageProps = {
  searchParams: Promise<{
    q?: string;
    type?: string;
    sort?: string;
    page?: string;
  }>;
};

export default async function ProjectsPage({ searchParams }: PageProps) {
  const raw = await searchParams;
  const q = (raw.q ?? "").trim();
  const type = raw.type ?? "";
  const sort: SortKey = SORTS.some((s) => s.key === raw.sort)
    ? (raw.sort as SortKey)
    : "recent";
  const page = Math.max(1, Number.parseInt(raw.page ?? "1", 10) || 1);

  const types = Array.from(new Set(MOCK_PROJECTS.map((p) => p.type))).sort();
  const qLower = q.toLowerCase();
  const filtered = MOCK_PROJECTS.filter((p) => {
    const matchQ =
      qLower === "" ||
      p.name.toLowerCase().includes(qLower) ||
      p.tagline.toLowerCase().includes(qLower);
    const matchType = type === "" || p.type === type;
    return matchQ && matchType;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "alpha") return a.name.localeCompare(b.name);
    if (sort === "status") return STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
    return a.order - b.order;
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const offset = (safePage - 1) * PAGE_SIZE;
  const items = sorted.slice(offset, offset + PAGE_SIZE);

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
            Showing {items.length} of {sorted.length}
            {sorted.length === 1 ? " project" : " projects"}
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
            page={safePage}
            totalPages={totalPages}
            basePath="/projects"
            searchParams={{ q, type, sort }}
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
