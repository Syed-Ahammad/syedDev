import type { Metadata } from "next";
import { ProjectManager } from "@/components/admin/ProjectManager";
import { fetchAdminProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projects — Admin · syed.dev",
};

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const { items } = await fetchAdminProjects(1);

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
        </p>
      </header>

      <ProjectManager projects={items} />
    </div>
  );
}
