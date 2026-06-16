import { ProjectCard } from "./ProjectCard";
import type { Project } from "@/types";

type Props = {
  projects: Project[];
};

export function RelatedProjects({ projects }: Props) {
  if (projects.length === 0) return null;

  return (
    <section
      aria-labelledby="related-heading"
      className="mt-20 flex flex-col gap-8"
    >
      <div className="flex flex-col gap-3">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-teal">
          / related
        </p>
        <h2
          id="related-heading"
          className="font-display text-3xl font-semibold text-foreground md:text-4xl"
        >
          Other projects in the same space
        </h2>
      </div>

      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => (
          <li key={p.slug}>
            <ProjectCard project={p} index={i + 1} />
          </li>
        ))}
      </ul>
    </section>
  );
}
