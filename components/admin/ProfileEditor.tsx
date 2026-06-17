"use client";

import { useId, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { AdminProfile } from "@/types";

type Props = {
  initial: AdminProfile;
};

type Status = "idle" | "submitting" | "success" | "error";

// Pairs are edited as one "left | right" line each — simple and robust for an
// admin-only screen. Incomplete lines are dropped on submit.
function pairsToText(items: { a: string; b: string }[]): string {
  return items.map((p) => `${p.a} | ${p.b}`).join("\n");
}

function textToPairs(text: string): { a: string; b: string }[] {
  return text
    .split("\n")
    .map((line) => {
      const i = line.indexOf("|");
      const a = (i === -1 ? line : line.slice(0, i)).trim();
      const b = (i === -1 ? "" : line.slice(i + 1)).trim();
      return { a, b };
    })
    .filter((p) => p.a && p.b);
}

const splitLines = (text: string) =>
  text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

const splitList = (text: string) =>
  text
    .split(/[\n,]/)
    .map((l) => l.trim())
    .filter(Boolean);

export function ProfileEditor({ initial }: Props) {
  const router = useRouter();
  const [headline, setHeadline] = useState(initial.headline);
  const [subline, setSubline] = useState(initial.subline);
  const [cvUrl, setCvUrl] = useState(initial.cvUrl);
  const [availability, setAvailability] = useState(initial.availability);
  const [about, setAbout] = useState(initial.about.join("\n"));
  const [skills, setSkills] = useState(initial.skills.join(", "));
  const [facts, setFacts] = useState(
    pairsToText(initial.facts.map((f) => ({ a: f.label, b: f.value }))),
  );
  const [socials, setSocials] = useState(
    pairsToText(initial.socials.map((s) => ({ a: s.label, b: s.url }))),
  );
  const [faq, setFaq] = useState(
    pairsToText(initial.faq.map((f) => ({ a: f.q, b: f.a }))),
  );

  const [status, setStatus] = useState<Status>("idle");
  const [banner, setBanner] = useState("");

  const headlineId = useId();
  const sublineId = useId();
  const cvId = useId();
  const aboutId = useId();
  const skillsId = useId();
  const factsId = useId();
  const socialsId = useId();
  const faqId = useId();
  const availId = useId();
  const bannerId = useId();

  function touch() {
    if (status !== "idle") {
      setStatus("idle");
      setBanner("");
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setBanner("");

    const payload = {
      headline: headline.trim(),
      subline: subline.trim(),
      cvUrl: cvUrl.trim(),
      availability,
      about: splitLines(about),
      skills: splitList(skills),
      facts: textToPairs(facts).map((p) => ({ label: p.a, value: p.b })),
      socials: textToPairs(socials).map((p) => ({ label: p.a, url: p.b })),
      faq: textToPairs(faq).map((p) => ({ q: p.a, a: p.b })),
    };

    try {
      const res = await fetch("/api/admin/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.success) {
        throw new Error(json?.error ?? "Could not save the profile.");
      }
      setStatus("success");
      setBanner("Profile saved.");
      router.refresh();
    } catch (err) {
      setStatus("error");
      setBanner(err instanceof Error ? err.message : "Could not save the profile.");
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      aria-label="Edit site profile"
      aria-describedby={banner ? bannerId : undefined}
      className="flex flex-col gap-6 rounded-2xl border border-border bg-surface p-6"
    >
      <Field id={headlineId} label="Headline">
        <input
          id={headlineId}
          value={headline}
          onChange={(e) => (setHeadline(e.target.value), touch())}
          className={fieldClass}
        />
      </Field>

      <Field id={sublineId} label="Subline" hint="Shown under the headline on the home hero.">
        <textarea
          id={sublineId}
          rows={2}
          value={subline}
          onChange={(e) => (setSubline(e.target.value), touch())}
          className={`${fieldClass} resize-y`}
        />
      </Field>

      <Field id={aboutId} label="About" hint="One paragraph per line.">
        <textarea
          id={aboutId}
          rows={4}
          value={about}
          onChange={(e) => (setAbout(e.target.value), touch())}
          className={`${fieldClass} resize-y`}
        />
      </Field>

      <Field id={skillsId} label="Skills" hint="Comma or newline separated.">
        <textarea
          id={skillsId}
          rows={2}
          value={skills}
          onChange={(e) => (setSkills(e.target.value), touch())}
          className={`${fieldClass} resize-y`}
        />
      </Field>

      <Field
        id={factsId}
        label="Facts"
        hint="One per line as “Label | Value”."
      >
        <textarea
          id={factsId}
          rows={3}
          value={facts}
          onChange={(e) => (setFacts(e.target.value), touch())}
          className={`${fieldClass} resize-y font-mono text-xs`}
        />
      </Field>

      <Field
        id={socialsId}
        label="Socials"
        hint="One per line as “Label | https://url”."
      >
        <textarea
          id={socialsId}
          rows={3}
          value={socials}
          onChange={(e) => (setSocials(e.target.value), touch())}
          className={`${fieldClass} resize-y font-mono text-xs`}
        />
      </Field>

      <Field id={faqId} label="FAQ" hint="One per line as “Question | Answer”.">
        <textarea
          id={faqId}
          rows={4}
          value={faq}
          onChange={(e) => (setFaq(e.target.value), touch())}
          className={`${fieldClass} resize-y font-mono text-xs`}
        />
      </Field>

      <Field id={cvId} label="CV URL">
        <input
          id={cvId}
          value={cvUrl}
          onChange={(e) => (setCvUrl(e.target.value), touch())}
          placeholder="https://…"
          className={fieldClass}
          inputMode="url"
        />
      </Field>

      <div className="flex items-center gap-3">
        <input
          id={availId}
          type="checkbox"
          checked={availability}
          onChange={(e) => (setAvailability(e.target.checked), touch())}
          className="h-4 w-4 cursor-pointer accent-coral"
        />
        <label htmlFor={availId} className="text-sm text-foreground">
          Available for work
        </label>
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex h-11 self-end items-center justify-center rounded-full bg-coral px-5 font-mono text-xs uppercase tracking-[0.14em] text-background transition-colors hover:bg-coral/90 disabled:opacity-60"
      >
        {status === "submitting" ? "Saving…" : "Save profile"}
      </button>

      <p
        id={bannerId}
        role="status"
        aria-live="polite"
        className={`min-h-[1.25rem] text-sm ${status === "error" ? "text-coral" : "text-teal"}`}
      >
        {banner}
      </p>
    </form>
  );
}

const fieldClass =
  "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral";

type FieldProps = {
  id: string;
  label: string;
  hint?: string;
  children: React.ReactNode;
};

function Field({ id, label, hint, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted"
      >
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-muted">{hint}</p>}
    </div>
  );
}
