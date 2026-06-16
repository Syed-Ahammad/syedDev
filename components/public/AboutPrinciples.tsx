type Principle = {
  title: string;
  body: string;
};

const PRINCIPLES: Principle[] = [
  {
    title: "Ship the vertical slice first",
    body: "A single end-to-end feature that touches every layer beats four half-built ones. The first deploy is the day the project becomes real.",
  },
  {
    title: "Operations before aesthetics",
    body: "Pretty buttons matter less than the till closing on time. I start from the workflow and let the interface follow.",
  },
  {
    title: "Write it twice before abstracting",
    body: "Three similar lines beat a premature helper. I let patterns earn their reuse before I name them.",
  },
  {
    title: "Build in public, commit often",
    body: "Small, conventional commits and a public roadmap. If the history reads well, the next person — including future me — can move quickly.",
  },
];

export function AboutPrinciples() {
  return (
    <section
      aria-labelledby="about-principles-heading"
      className="border-t border-border bg-surface px-6 py-20 md:px-12 md:py-24"
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-12">
        <div className="flex max-w-2xl flex-col gap-3">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-teal">
            / how I work
          </p>
          <h2
            id="about-principles-heading"
            className="font-display text-3xl font-semibold text-foreground md:text-4xl"
          >
            Four things I keep coming back to
          </h2>
        </div>

        <ul className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {PRINCIPLES.map((p, i) => (
            <li
              key={p.title}
              className="flex flex-col gap-4 rounded-2xl border border-border bg-background p-6 transition-colors hover:border-coral md:p-8"
            >
              <span className="font-mono text-xs text-coral">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display text-lg font-semibold text-foreground">
                {p.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted">{p.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
