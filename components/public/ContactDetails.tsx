type Detail = {
  label: string;
  value: string;
  href?: string;
  external?: boolean;
};

const DETAILS: Detail[] = [
  {
    label: "Email",
    value: "hello@syed.dev",
    href: "mailto:hello@syed.dev",
  },
  {
    label: "Based in",
    value: "Dubai, UAE · GMT+4",
  },
  {
    label: "Reply window",
    value: "Within 24 hours",
  },
  {
    label: "Booking",
    value: "Q3 2026 onwards",
  },
];

const CHANNELS = [
  { href: "https://www.linkedin.com/", label: "LinkedIn" },
  { href: "https://github.com/", label: "GitHub" },
  { href: "https://www.upwork.com/", label: "Upwork" },
];

export function ContactDetails() {
  return (
    <section
      aria-labelledby="contact-details-heading"
      className="border-t border-border bg-surface px-6 py-16 md:px-12 md:py-20"
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
        <div className="flex max-w-2xl flex-col gap-3">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-teal">
            / the basics
          </p>
          <h2
            id="contact-details-heading"
            className="font-display text-2xl font-semibold text-foreground md:text-3xl"
          >
            How to reach me
          </h2>
        </div>

        <dl className="grid grid-cols-1 gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
          {DETAILS.map((detail) => (
            <div key={detail.label} className="flex flex-col gap-2 border-l border-border pl-5">
              <dt className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-coral">
                {detail.label}
              </dt>
              <dd className="text-base font-medium text-foreground">
                {detail.href ? (
                  <a
                    href={detail.href}
                    className="transition-colors hover:text-coral"
                  >
                    {detail.value}
                  </a>
                ) : (
                  detail.value
                )}
              </dd>
            </div>
          ))}
        </dl>

        <div className="flex flex-col gap-3 border-t border-border pt-6 md:flex-row md:items-center md:gap-6">
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted">
            / elsewhere
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {CHANNELS.map((c) => (
              <li key={c.href}>
                <a
                  href={c.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-muted transition-colors hover:text-foreground"
                >
                  {c.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
