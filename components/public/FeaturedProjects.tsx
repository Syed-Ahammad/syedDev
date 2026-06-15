import Link from "next/link";
import { ProjectCard } from "./ProjectCard";
import { MOCK_PROJECTS } from "@/lib/mock-projects";

export function FeaturedProjects() {
  const featured = MOCK_PROJECTS.slice(0, 4);

  return (
    <section
      aria-labelledby="featured-heading"
      className="px-6 py-20 md:px-12 md:py-24"
    >
      <div className="mb-12 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-teal">
            / selected work
          </p>
          <h2
            id="featured-heading"
            className="font-display text-3xl font-semibold text-foreground md:text-4xl"
          >
            Projects I&apos;ve built
          </h2>
        </div>
        <Link
          href="/projects"
          className="font-mono text-xs uppercase tracking-[0.14em] text-muted transition-colors hover:text-coral"
        >
          view all →
        </Link>
      </div>

      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {featured.map((project, i) => (
          <li key={project.slug}>
            <ProjectCard project={project} index={i + 1} />
          </li>
        ))}
      </ul>
    </section>
  );
}
