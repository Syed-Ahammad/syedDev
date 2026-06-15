import Link from "next/link";

export function Hero() {
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
        className="max-w-[16ch] font-display text-[clamp(2.5rem,8vw,6rem)] font-bold leading-[1.04] tracking-tight text-foreground"
      >
        I build <span className="text-coral">fast,</span> reliable web apps businesses run on.
      </h1>

      <p className="mt-7 max-w-[54ch] text-base leading-relaxed text-muted md:text-lg">
        Next.js &amp; MERN-stack developer with a background in inventory and operations — so I
        build software that actually fits how a business works, not just how it looks.
      </p>

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
      </div>
    </section>
  );
}
