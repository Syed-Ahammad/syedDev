import type { ProjectDetail } from "@/types";

type Section = { title: string; body: string };

type Props = {
  detail: ProjectDetail;
};

export function ProjectOverview({ detail }: Props) {
  const sections: Section[] = [
    { title: "The problem", body: detail.problem },
    { title: "My approach", body: detail.approach },
    { title: "Outcome", body: detail.outcome },
  ];

  return (
    <section aria-labelledby="overview-heading" className="flex flex-col gap-8">
      <h2 id="overview-heading" className="sr-only">
        Overview
      </h2>
      {sections.map((s) => (
        <div key={s.title} className="flex flex-col gap-3">
          <h3 className="font-mono text-xs uppercase tracking-[0.18em] text-coral">
            {s.title}
          </h3>
          <p className="text-base leading-relaxed text-foreground">{s.body}</p>
        </div>
      ))}
    </section>
  );
}
