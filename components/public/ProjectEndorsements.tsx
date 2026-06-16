import Link from "next/link";
import { EndorsementCard } from "./EndorsementCard";
import type { Endorsement, Project } from "@/types";

type Props = {
  project: Project;
  endorsements: Endorsement[];
};

export function ProjectEndorsements({ project, endorsements }: Props) {
  return (
    <section
      aria-labelledby="endorsements-heading"
      className="mt-20 flex flex-col gap-8"
    >
      <div className="flex flex-col gap-3">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-teal">
          / endorsements
        </p>
        <h2
          id="endorsements-heading"
          className="font-display text-3xl font-semibold text-foreground md:text-4xl"
        >
          Skills people vouch for on {project.name}
        </h2>
      </div>

      {endorsements.length === 0 ? (
        <div className="rounded-2xl border border-border bg-surface p-8 text-center">
          <p className="text-sm text-muted">
            No endorsements yet for this project.{" "}
            <Link
              href="/login"
              className="text-coral transition-opacity hover:opacity-80"
            >
              Sign in to endorse a skill →
            </Link>
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {endorsements.map((e) => (
            <li key={e.id}>
              <EndorsementCard endorsement={e} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
