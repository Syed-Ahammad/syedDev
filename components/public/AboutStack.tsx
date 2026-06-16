type Group = {
  label: string;
  items: string[];
};

const GROUPS: Group[] = [
  {
    label: "Frontend",
    items: ["Next.js 16", "React 19", "TypeScript", "Tailwind v4", "React Hook Form"],
  },
  {
    label: "Backend",
    items: ["Node.js", "MongoDB Atlas", "Mongoose", "NextAuth", "Zod"],
  },
  {
    label: "Infra",
    items: ["Vercel", "Upstash Redis", "Vercel Blob", "GitHub Actions"],
  },
  {
    label: "Tooling",
    items: ["Vitest", "Playwright", "ESLint", "Conventional Commits"],
  },
];

export function AboutStack() {
  return (
    <section
      aria-labelledby="about-stack-heading"
      className="border-t border-border px-6 py-20 md:px-12 md:py-24"
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-12">
        <div className="flex max-w-2xl flex-col gap-3">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-teal">
            / stack
          </p>
          <h2
            id="about-stack-heading"
            className="font-display text-3xl font-semibold text-foreground md:text-4xl"
          >
            Tools I reach for first
          </h2>
          <p className="max-w-[60ch] text-base leading-relaxed text-muted">
            Boring by design — battle-tested pieces I&apos;ve shipped to production
            more than once. I&apos;ll happily learn something new when the project
            asks for it, but I won&apos;t make a client pay for my curiosity.
          </p>
        </div>

        <dl className="grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {GROUPS.map((group) => (
            <div key={group.label} className="flex flex-col gap-4 border-l border-border pl-5">
              <dt className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-coral">
                {group.label}
              </dt>
              <dd>
                <ul className="flex flex-col gap-2 text-sm text-foreground">
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
