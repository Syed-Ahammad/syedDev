import type { Endorsement } from "@/types";

export const MOCK_ENDORSEMENTS: Endorsement[] = [
  {
    id: "e1",
    skill: "Next.js",
    text: "Shipped our admin dashboard in two weeks — App Router, server components, the whole thing. Clean code, sensible commits, and it just worked on launch day.",
    endorserName: "Rashed Al-Mansoori",
    endorserRole: "Founder, Mansoori Trading",
  },
  {
    id: "e2",
    skill: "MongoDB",
    text: "Modeled our inventory and purchasing system without over-engineering. Indexes were thought through; nothing slowed down as we crossed 50k SKUs.",
    endorserName: "Priya Nair",
    endorserRole: "Ops Manager, Coastal Foods",
  },
  {
    id: "e3",
    skill: "TypeScript",
    text: "Took our untyped Express codebase and migrated it to strict TS over a sprint. Caught three latent bugs along the way and left the team comfortable maintaining it.",
    endorserName: "Daniel Okafor",
    endorserRole: "Tech Lead, Brightline",
  },
  {
    id: "e4",
    skill: "React",
    text: "Communicates trade-offs clearly — when to use a server component, when client. Reviews are honest and the patterns he picks scale with the product.",
    endorserName: "Sara Haddad",
    endorserRole: "Product Designer, Linear Studio",
  },
  {
    id: "e5",
    skill: "Node.js",
    text: "Built an order-processing pipeline that handles our peak Friday traffic without retries piling up. Logging and error handling were thought through from day one.",
    endorserName: "Mohammed Iqbal",
    endorserRole: "CTO, Groceri",
  },
  {
    id: "e6",
    skill: "NextAuth",
    text: "Wired up credentials + Google OAuth with the right session shape on both server and edge. No flaky redirects, no leaked tokens — exactly what you want from auth.",
    endorserName: "Lina Petrova",
    endorserRole: "Senior Engineer, Voltspark",
  },
  {
    id: "e7",
    skill: "Tailwind CSS",
    text: "Took our messy stylesheet and gave us a tidy design-token system in Tailwind v4. The site finally looks consistent in light and dark mode.",
    endorserName: "Tomás Reyes",
    endorserRole: "Frontend Lead, Mileta",
  },
  {
    id: "e8",
    skill: "REST APIs",
    text: "Documented every endpoint with a Zod schema and matching tests. Onboarding the next developer took a day instead of a week.",
    endorserName: "Aisha Mahmoud",
    endorserRole: "Engineering Manager, Saheel Labs",
  },
];
