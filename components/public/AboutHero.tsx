import { getProfile } from "@/lib/profile";

const FALLBACK_ABOUT = [
  "I'm Syed — a full-stack developer based in Dubai. Before code I spent five years on the floor of hospitality and retail operations, which is why my software tends to be opinionated about workflows: I've felt the friction of bad tools at the till, and I'd rather build the version that disappears into the day.",
];

const FALLBACK_FACTS = [
  { label: "Based in", value: "Dubai, UAE" },
  { label: "Working", value: "GMT+4 · async friendly" },
  { label: "Stack", value: "Next.js · MongoDB · TS" },
  { label: "Available", value: "From Q3 2026" },
];

export async function AboutHero() {
  const profile = await getProfile();
  const about = profile.about.length > 0 ? profile.about : FALLBACK_ABOUT;
  const facts = profile.facts.length > 0 ? profile.facts : FALLBACK_FACTS;

  return (
    <section
      aria-labelledby="about-hero-heading"
      className="px-6 pb-12 pt-16 md:px-12 md:pb-20 md:pt-24"
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-teal">
          / about
        </p>
        <h1
          id="about-hero-heading"
          className="max-w-[20ch] font-display text-4xl font-semibold leading-[1.1] tracking-tight text-foreground md:text-6xl"
        >
          I write code that fits how the{" "}
          <span className="text-coral">business actually runs.</span>
        </h1>
        <div className="flex max-w-[60ch] flex-col gap-4">
          {about.map((paragraph, i) => (
            <p
              key={i}
              className="text-base leading-relaxed text-muted md:text-lg"
            >
              {paragraph}
            </p>
          ))}
        </div>

        <dl className="grid grid-cols-2 gap-x-6 gap-y-4 border-t border-border pt-6 md:grid-cols-4 md:gap-x-10">
          {facts.map((fact) => (
            <Meta key={fact.label} label={fact.label} value={fact.value} />
          ))}
        </dl>
      </div>
    </section>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted">
        {label}
      </dt>
      <dd className="font-display text-sm font-medium text-foreground md:text-base">
        {value}
      </dd>
    </div>
  );
}
