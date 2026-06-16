type Step = {
  year: string;
  title: string;
  body: string;
};

const STEPS: Step[] = [
  {
    year: "2019",
    title: "Hospitality floors in Dubai",
    body: "Started in front-of-house at a hotel group. Learned what bad software looks like at 11pm on a Friday — and how good operators route around it.",
  },
  {
    year: "2021",
    title: "Inventory and purchasing lead",
    body: "Promoted into stock control across three outlets. Built my first tools in spreadsheets, then in Google Apps Script, then in Node. The spreadsheets won fewer arguments than the scripts.",
  },
  {
    year: "2023",
    title: "First production MERN build",
    body: "Shipped a restaurant POS replacement for a former colleague. Two outlets, real money through it, no rollback. That project taught me more about testing than any course did.",
  },
  {
    year: "2025",
    title: "Full-time freelance",
    body: "Now building Next.js / MongoDB products for small UAE businesses and remote clients — usually solo, end to end, with a public commit history as part of the deliverable.",
  },
];

export function AboutJourney() {
  return (
    <section
      aria-labelledby="about-journey-heading"
      className="border-t border-border px-6 py-20 md:px-12 md:py-24"
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-12">
        <div className="flex flex-col gap-3">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-teal">
            / how I got here
          </p>
          <h2
            id="about-journey-heading"
            className="font-display text-3xl font-semibold text-foreground md:text-4xl"
          >
            The path was not a straight line
          </h2>
        </div>

        <ol className="flex flex-col">
          {STEPS.map((step, i) => (
            <li
              key={step.year}
              className="grid grid-cols-[auto_1fr] gap-6 border-l border-border pb-10 pl-8 last:pb-0 md:grid-cols-[120px_1fr] md:gap-10"
            >
              <span className="font-mono text-xs uppercase tracking-[0.18em] text-coral">
                {step.year}
              </span>
              <div className="flex flex-col gap-2">
                <h3 className="font-display text-lg font-semibold text-foreground">
                  {String(i + 1).padStart(2, "0")} · {step.title}
                </h3>
                <p className="max-w-[60ch] text-sm leading-relaxed text-muted">
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
