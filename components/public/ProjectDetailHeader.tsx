import Link from "next/link";
import type { Project } from "@/types";
import { ProjectStatusBadge } from "./ProjectStatusBadge";

type Props = {
  project: Project;
};

export function ProjectDetailHeader({ project }: Props) {
  return (
    <header className="mb-12 flex flex-col gap-6">
      <Link
        href="/projects"
        className="inline-flex w-fit items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-muted transition-colors hover:text-coral"
      >
        <span aria-hidden="true">←</span> all projects
      </Link>

      <div className="flex flex-wrap items-center gap-3">
        <span className="font-mono text-xs uppercase tracking-[0.18em] text-teal">
          / {project.type}
        </span>
        <ProjectStatusBadge status={project.status} />
      </div>

      <div className="flex flex-col gap-4">
        <h1 className="font-display text-4xl font-semibold text-foreground md:text-5xl">
          {project.name}
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted md:text-lg">
          {project.tagline}
        </p>
      </div>
    </header>
  );
}
