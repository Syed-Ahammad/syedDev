"use client";

import { useState } from "react";
import { ProjectForm } from "./ProjectForm";
import { ProjectTable } from "./ProjectTable";
import type { AdminProjectItem } from "@/lib/projects";

type Props = {
  projects: AdminProjectItem[];
};

// Coordinates the create/edit form with the table so "Edit" can prefill it.
export function ProjectManager({ projects }: Props) {
  const [editing, setEditing] = useState<AdminProjectItem | null>(null);

  return (
    <div className="flex flex-col gap-8">
      <ProjectForm
        key={editing?.id ?? "new"}
        editing={editing}
        onClose={() => setEditing(null)}
      />
      <ProjectTable projects={projects} onEdit={setEditing} />
    </div>
  );
}
