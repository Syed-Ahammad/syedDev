import Link from "next/link";

export function AboutCta() {
  return (
    <section
      aria-labelledby="about-cta-heading"
      className="border-t border-border px-6 py-20 md:px-12 md:py-24"
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col items-start gap-8 md:flex-row md:items-end md:justify-between">
        <div className="flex max-w-2xl flex-col gap-4">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-teal">
            / next step
          </p>
          <h2
            id="about-cta-heading"
            className="font-display text-3xl font-semibold text-foreground md:text-4xl"
          >
            If any of this sounds like the right fit, let&apos;s talk.
          </h2>
          <p className="text-base leading-relaxed text-muted">
            I take on one or two new projects a quarter and reply to every serious
            enquiry within 24 hours.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-coral px-6 py-3 font-display text-sm font-medium text-background transition-transform hover:-translate-y-0.5"
          >
            Start a conversation
            <span aria-hidden="true">→</span>
          </Link>
          <Link
            href="/projects"
            className="inline-flex items-center justify-center rounded-lg border border-border px-6 py-3 font-display text-sm font-medium text-foreground transition-colors hover:border-teal hover:text-teal"
          >
            See the work first
          </Link>
        </div>
      </div>
    </section>
  );
}
