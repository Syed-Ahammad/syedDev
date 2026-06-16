import Link from "next/link";

type Props = {
  eyebrow: string;
  title: string;
  subtitle: string;
  altPrompt: string;
  altLabel: string;
  altHref: string;
};

export function AuthHero({
  eyebrow,
  title,
  subtitle,
  altPrompt,
  altLabel,
  altHref,
}: Props) {
  return (
    <header className="flex flex-col gap-4 text-center md:text-left">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-teal">
        {eyebrow}
      </p>
      <h1 className="font-display text-3xl font-semibold leading-tight text-foreground md:text-4xl">
        {title}
      </h1>
      <p className="text-sm leading-relaxed text-muted md:text-base">{subtitle}</p>
      <p className="text-sm text-muted">
        {altPrompt}{" "}
        <Link
          href={altHref}
          className="font-medium text-coral underline-offset-4 transition-colors hover:underline"
        >
          {altLabel}
        </Link>
      </p>
    </header>
  );
}
