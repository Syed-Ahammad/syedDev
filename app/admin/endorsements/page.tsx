import type { Metadata } from "next";
import { EndorsementModeration } from "@/components/admin/EndorsementModeration";
import { fetchAllAdminEndorsements } from "@/lib/endorsements";

export const metadata: Metadata = {
  title: "Endorsements — Admin · syed.dev",
};

export const dynamic = "force-dynamic";

export default async function AdminEndorsementsPage() {
  const endorsements = await fetchAllAdminEndorsements();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <header className="flex flex-col gap-3">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-teal">
          / endorsements
        </p>
        <h1 className="font-display text-3xl font-semibold text-foreground md:text-4xl">
          Moderation queue
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted">
          Approve or reject endorsements before they appear on the public site.
          Changes are saved immediately.
        </p>
      </header>

      <EndorsementModeration initial={endorsements} />
    </div>
  );
}
