import { getProfile } from "@/lib/profile";

type Item = {
  question: string;
  answer: string;
};

const FALLBACK_ITEMS: Item[] = [
  {
    question: "What's a typical project timeline?",
    answer:
      "Small marketing sites: 1–2 weeks. Full dashboards or storefronts: 4–8 weeks. I share a weekly demo so you always know what's done and what's next.",
  },
  {
    question: "Which stack do you work in?",
    answer:
      "Next.js + TypeScript on the front, Node and MongoDB on the back, Tailwind for styling, NextAuth for auth, Vercel for hosting. I'll happily slot into an existing MERN codebase too.",
  },
  {
    question: "Do you take on long-term retainers?",
    answer:
      "Yes — once a project is live I usually keep a small retainer slot open for ongoing changes, bug fixes, and small features. Month-to-month, no lock-in.",
  },
  {
    question: "Where are you based, and which time zones do you cover?",
    answer:
      "Dubai (GST, UTC+4). I overlap comfortably with the Gulf, Europe, India, and East Africa, and async-friendly with US clients.",
  },
  {
    question: "How do you price work?",
    answer:
      "Fixed price for clearly scoped projects, day-rate for retainers and discovery. I send a written quote before any work starts — no surprises on the invoice.",
  },
  {
    question: "Can you take over an existing codebase?",
    answer:
      "Often. I'll start with a paid 1–2 day audit so we both know what we're walking into, then propose either a refactor plan or a clean rewrite — whichever serves the business better.",
  },
];

export async function Faq() {
  const { faq } = await getProfile();
  const items: Item[] =
    faq.length > 0
      ? faq.map((f) => ({ question: f.q, answer: f.a }))
      : FALLBACK_ITEMS;

  return (
    <section
      aria-labelledby="faq-heading"
      className="border-t border-border px-6 py-20 md:px-12 md:py-24"
    >
      <div className="mb-12">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-teal">
          / faq
        </p>
        <h2
          id="faq-heading"
          className="font-display text-3xl font-semibold text-foreground md:text-4xl"
        >
          Questions I hear a lot
        </h2>
      </div>

      <div className="mx-auto max-w-3xl divide-y divide-border rounded-2xl border border-border bg-surface">
        {items.map((item) => (
          <details key={item.question} className="group p-6">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-base font-semibold text-foreground transition-colors marker:hidden hover:text-coral [&::-webkit-details-marker]:hidden">
              <span>{item.question}</span>
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                className="h-4 w-4 shrink-0 text-muted transition-transform group-open:rotate-180"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m5 7 5 5 5-5" />
              </svg>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-muted">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
