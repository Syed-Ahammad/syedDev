import type { Metadata } from "next";
import { EndorsementForm } from "@/components/dashboard/EndorsementForm";
import { EndorsementList } from "@/components/dashboard/EndorsementList";
import { auth } from "@/lib/auth";
import {
  getProfileSkills,
  getEndorsableProjects,
  fetchUserEndorsements,
} from "@/lib/endorsements";

export const metadata: Metadata = {
  title: "Endorsements — syed.dev",
};

export const dynamic = "force-dynamic";

export default async function DashboardEndorsementsPage() {
  const session = await auth();
  const [skills, projects, endorsements] = await Promise.all([
    getProfileSkills(),
    getEndorsableProjects(),
    session?.user ? fetchUserEndorsements(session.user.id) : Promise.resolve([]),
  ]);

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

      <EndorsementForm projects={projects} skills={skills} />

      <section aria-label="Your endorsements" className="flex flex-col gap-4">
        <h2 className="font-display text-xl font-semibold text-foreground">
          Your endorsements
        </h2>
        <EndorsementList endorsements={endorsements} />
      </section>
    </div>
  );
}
