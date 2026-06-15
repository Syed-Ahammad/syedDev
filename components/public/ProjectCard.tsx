import Link from "next/link";
import type { Project } from "@/types";

type Props = {
  project: Project;
  index: number;
};

export function ProjectCard({ project, index }: Props) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group flex h-full min-h-[260px] flex-col gap-5 rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-coral"
    >
      <div className="flex items-start justify-between">
        <span className="font-mono text-xs text-coral">
          {String(index).padStart(2, "0")}
        </span>
        <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-teal">
          {project.type}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-foreground">
          {project.name}
          <span
            aria-hidden="true"
            className="text-coral opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100"
          >
            →
          </span>
        </h3>
        <p className="text-sm leading-relaxed text-muted">{project.tagline}</p>
      </div>

      <div className="mt-auto flex flex-wrap gap-2">
        {project.stack.slice(0, 3).map((tech) => (
          <span
            key={tech}
            className="rounded-full border border-border px-3 py-1 font-mono text-[0.7rem] text-muted"
          >
            {tech}
          </span>
        ))}
      </div>
    </Link>
  );
}
