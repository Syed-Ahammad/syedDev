type Service = {
  title: string;
  description: string;
};

const SERVICES: Service[] = [
  {
    title: "Web apps & dashboards",
    description:
      "Full-stack builds with Next.js and MongoDB — from idea to deployed, with admin panels and auth done right.",
  },
  {
    title: "Business & inventory tools",
    description:
      "POS, stock, purchasing and reporting systems. I know operations, so the workflow actually makes sense.",
  },
  {
    title: "Landing pages & storefronts",
    description:
      "Fast, responsive, conversion-focused sites — restaurants, products, services — with payments built in.",
  },
  {
    title: "Integrations & APIs",
    description:
      "Stripe, NextAuth, file uploads, third-party APIs wired into your existing stack with tests and clear docs.",
  },
];

export function Services() {
  return (
    <section
      aria-labelledby="services-heading"
      className="border-t border-border px-6 py-20 md:px-12 md:py-24"
    >
      <div className="mb-12">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-teal">
          / services
        </p>
        <h2
          id="services-heading"
          className="font-display text-3xl font-semibold text-foreground md:text-4xl"
        >
          How I can help
        </h2>
      </div>

      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {SERVICES.map((service, i) => (
          <li
            key={service.title}
            className="flex h-full min-h-[220px] flex-col gap-4 rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-coral"
          >
            <span className="font-mono text-xs text-coral">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="font-display text-lg font-semibold text-foreground">
              {service.title}
            </h3>
            <p className="text-sm leading-relaxed text-muted">{service.description}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
