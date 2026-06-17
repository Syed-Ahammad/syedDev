import { getProfile } from "@/lib/profile";

const FALLBACK_STACK = [
  "Next.js",
  "React",
  "Node.js",
  "MongoDB",
  "TypeScript",
  "Tailwind",
  "Mongoose",
  "NextAuth",
  "Vercel",
  "REST APIs",
];

export async function StackStrip() {
  const { skills } = await getProfile();
  const stack = skills.length > 0 ? skills : FALLBACK_STACK;

  return (
    <section
      aria-label="Tech stack"
      className="overflow-hidden border-b border-border py-6"
    >
      <div className="flex w-max gap-3 motion-safe:animate-[var(--animate-marquee)] motion-reduce:[animation:none]">
        <StackList stack={stack} />
        <StackList stack={stack} ariaHidden />
      </div>
    </section>
  );
}

function StackList({
  stack,
  ariaHidden = false,
}: {
  stack: string[];
  ariaHidden?: boolean;
}) {
  return (
    <ul
      aria-hidden={ariaHidden || undefined}
      className="flex shrink-0 gap-3 pr-3 font-mono text-xs text-muted"
    >
      {stack.map((tech) => (
        <li
          key={tech}
          className="whitespace-nowrap rounded-full border border-border px-4 py-2"
        >
          {tech}
        </li>
      ))}
    </ul>
  );
}
