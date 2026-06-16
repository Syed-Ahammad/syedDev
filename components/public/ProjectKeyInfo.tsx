import type { Project, ProjectDetail } from "@/types";

type Props = {
  project: Project;
  detail: ProjectDetail;
};

export function ProjectKeyInfo({ project, detail }: Props) {
  return (
    <aside
      aria-labelledby="key-info-heading"
      className="flex h-fit flex-col gap-6 rounded-2xl border border-border bg-surface p-6"
    >
      <h2
        id="key-info-heading"
        className="font-mono text-xs uppercase tracking-[0.18em] text-teal"
      >
        Key info
      </h2>

      <dl className="flex flex-col gap-5 text-sm">
        <Row label="Year" value={String(detail.year)} />
        <Row label="Role" value={detail.role} />
        <Row label="Type" value={project.type} />
        <div>
          <dt className="mb-2 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted">
            Stack
          </dt>
          <dd className="flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-border px-3 py-1 font-mono text-[0.7rem] text-foreground"
              >
                {tech}
              </span>
            ))}
          </dd>
        </div>
        {detail.links && detail.links.length > 0 ? (
          <div>
            <dt className="mb-2 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted">
              Links
            </dt>
            <dd className="flex flex-col gap-2">
              {detail.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-coral transition-opacity hover:opacity-80"
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    link.href.startsWith("http") ? "noopener noreferrer" : undefined
                  }
                >
                  {link.label} →
                </a>
              ))}
            </dd>
          </div>
        ) : null}
      </dl>
    </aside>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="mb-1 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted">
        {label}
      </dt>
      <dd className="text-foreground">{value}</dd>
    </div>
  );
}
