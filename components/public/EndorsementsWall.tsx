import Link from "next/link";
import { EndorsementCard } from "./EndorsementCard";
import { MOCK_ENDORSEMENTS } from "@/lib/mock-endorsements";

export function EndorsementsWall() {
  const endorsements = MOCK_ENDORSEMENTS.slice(0, 8);

  return (
    <section
      aria-labelledby="endorsements-heading"
      className="border-t border-border px-6 py-20 md:px-12 md:py-24"
    >
      <div className="mb-12 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-teal">
            / endorsements
          </p>
          <h2
            id="endorsements-heading"
            className="font-display text-3xl font-semibold text-foreground md:text-4xl"
          >
            What people I&apos;ve worked with say
          </h2>
        </div>
        <Link
          href="/register"
          className="font-mono text-xs uppercase tracking-[0.14em] text-muted transition-colors hover:text-coral"
        >
          endorse a skill →
        </Link>
      </div>

      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {endorsements.map((endorsement) => (
          <li key={endorsement.id}>
            <EndorsementCard endorsement={endorsement} />
          </li>
        ))}
      </ul>
    </section>
  );
}
