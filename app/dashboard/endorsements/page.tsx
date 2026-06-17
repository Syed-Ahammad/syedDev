import type { Metadata } from "next";
import { EndorsementForm } from "@/components/dashboard/EndorsementForm";
import { EndorsementList } from "@/components/dashboard/EndorsementList";
import { MOCK_PROJECTS } from "@/lib/mock-projects";
import { MOCK_USER_ENDORSEMENTS } from "@/lib/mock-user-endorsements";

export const metadata: Metadata = {
  title: "Endorsements — syed.dev",
};

export default function DashboardEndorsementsPage() {
  const projects = MOCK_PROJECTS.filter((p) => p.status !== "draft").map(
    (p) => ({ slug: p.slug, name: p.name }),
  );
  const endorsements = [...MOCK_USER_ENDORSEMENTS].sort((a, b) =>
    b.submittedAt.localeCompare(a.submittedAt),
  );

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
      <header className="flex flex-col gap-3">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-teal">
          / endorsements
        </p>
        <h1 className="font-display text-3xl font-semibold text-foreground md:text-4xl">
          Endorse what you&apos;ve actually used
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted">
          Approved endorsements appear on the project page and the wall on the
          home page. You&apos;ll see status updates here.
        </p>
      </header>

      <EndorsementForm projects={projects} />

      <section aria-label="Your endorsements" className="flex flex-col gap-4">
        <h2 className="font-display text-xl font-semibold text-foreground">
          Your endorsements
        </h2>
        <EndorsementList endorsements={endorsements} />
      </section>
    </div>
  );
}
