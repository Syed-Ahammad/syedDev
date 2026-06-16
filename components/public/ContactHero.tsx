export function ContactHero() {
  return (
    <section
      aria-labelledby="contact-hero-heading"
      className="px-6 pb-12 pt-16 md:px-12 md:pb-20 md:pt-24"
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-teal">
          / contact
        </p>
        <h1
          id="contact-hero-heading"
          className="max-w-[22ch] font-display text-4xl font-semibold leading-[1.1] tracking-tight text-foreground md:text-6xl"
        >
          Let&apos;s start something{" "}
          <span className="text-coral">useful.</span>
        </h1>
        <p className="max-w-[60ch] text-base leading-relaxed text-muted md:text-lg">
          Tell me a little about what you&apos;re trying to build — the problem,
          the people who&apos;ll use it, and the rough shape of timeline you&apos;re
          working with. I&apos;ll come back with honest scope, a price band, and a
          clear first milestone.
        </p>
      </div>
    </section>
  );
}
