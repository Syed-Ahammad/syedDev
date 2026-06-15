type Highlight = {
  label: string;
  value: string;
  caption: string;
};

const HIGHLIGHTS: Highlight[] = [
  { label: "Building", value: "5+", caption: "years shipping production software" },
  { label: "Shipped", value: "5", caption: "live products across UAE and remote clients" },
  { label: "Stack", value: "MERN", caption: "Next.js · MongoDB · TypeScript end-to-end" },
  { label: "Style", value: "Solo", caption: "design, build, deploy — no handoffs" },
];

export function Highlights() {
  return (
    <section
      aria-labelledby="highlights-heading"
      className="border-y border-border px-6 py-12 md:px-12 md:py-16"
    >
      <h2 id="highlights-heading" className="sr-only">
        What I bring
      </h2>

      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {HIGHLIGHTS.map((item) => (
          <li
            key={item.label}
            className="flex flex-col gap-2 border-l border-border pl-5"
          >
            <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-teal">
              {item.label}
            </span>
            <span className="font-display text-3xl font-semibold text-foreground md:text-4xl">
              {item.value}
            </span>
            <span className="text-sm leading-relaxed text-muted">{item.caption}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
