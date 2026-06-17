import type { Metadata } from "next";
import { EndorsementModeration } from "@/components/admin/EndorsementModeration";
import { MOCK_ENDORSEMENTS } from "@/lib/mock-endorsements";

export const metadata: Metadata = {
  title: "Endorsements — Admin · syed.dev",
};

export default function AdminEndorsementsPage() {
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
          State changes are in-memory until /api/admin/endorsements is wired in
          Phase 3.
        </p>
      </header>

      <EndorsementModeration initial={MOCK_ENDORSEMENTS} />
    </div>
  );
}
