import Link from "next/link";
import { getProfile } from "@/lib/profile";

const FALLBACK_HEADLINE =
  "I build fast, reliable web apps businesses run on.";
const FALLBACK_SUBLINE =
  "Next.js & MERN-stack developer with a background in inventory and operations — so I build software that actually fits how a business works, not just how it looks.";

export async function Hero() {
  const profile = await getProfile();
  const headline = profile.headline || FALLBACK_HEADLINE;
  const subline = profile.subline || FALLBACK_SUBLINE;

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative flex min-h-[65vh] w-full flex-col justify-center px-6 py-20 md:min-h-[70vh] md:px-12"
    >
      <p className="mb-6 font-mono text-xs uppercase tracking-[0.18em] text-coral">
        {"// Full-stack developer · Dubai"}
      </p>

      <h1
        id="hero-heading"
        className="max-w-[18ch] font-display text-[clamp(2.5rem,8vw,6rem)] font-bold leading-[1.04] tracking-tight text-foreground"
      >
        {headline}
      </h1>

      <p className="mt-7 max-w-[54ch] text-base leading-relaxed text-muted md:text-lg">
        {subline}
      </p>

      {profile.availability && (
        <p className="mt-6 inline-flex w-fit items-center gap-2 rounded-full border border-teal/40 bg-teal/10 px-3 py-1 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-teal">
          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-teal" />
          Available for new projects
        </p>
      )}

      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
        <Link
          href="/contact"
          className="group inline-flex items-center justify-center gap-2 rounded-lg bg-coral px-7 py-3.5 font-display text-sm font-medium text-background transition-transform hover:-translate-y-0.5"
        >
          Start a project
          <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
            →
          </span>
        </Link>

        <Link
          href="/projects"
          className="inline-flex items-center justify-center rounded-lg border border-border px-7 py-3.5 font-display text-sm font-medium text-foreground transition-colors hover:border-teal hover:text-teal"
        >
          See my work
        </Link>

        {profile.cvUrl && (
          <a
            href={profile.cvUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center justify-center rounded-lg border border-border px-7 py-3.5 font-display text-sm font-medium text-foreground transition-colors hover:border-coral hover:text-coral"
          >
            Download CV
          </a>
        )}
      </div>
    </section>
  );
}
