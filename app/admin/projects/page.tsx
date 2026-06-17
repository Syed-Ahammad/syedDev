import type { Metadata } from "next";
import { ProjectTable } from "@/components/admin/ProjectTable";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { MOCK_PROJECTS } from "@/lib/mock-projects";

export const metadata: Metadata = {
  title: "Projects — Admin · syed.dev",
};

export default function AdminProjectsPage() {
  const projects = [...MOCK_PROJECTS].sort((a, b) => a.order - b.order);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <header className="flex flex-col gap-3">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-teal">
          / projects
        </p>
        <h1 className="font-display text-3xl font-semibold text-foreground md:text-4xl">
          Project catalog
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted">
          Add, edit, and order the case studies that appear on the public site.
          Persistence wires in at step 3.11.
        </p>
      </header>

      <ProjectForm />

      <ProjectTable projects={projects} />
    </div>
  );
}
