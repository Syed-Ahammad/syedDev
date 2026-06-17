"use client";

import { useId, useState, type FormEvent } from "react";

type Props = {
  projects: { slug: string; name: string }[];
};

type Values = {
  projectSlug: string;
  skill: string;
  text: string;
};

type FieldErrors = Partial<Record<keyof Values, string>>;
type Status = "idle" | "submitting" | "success" | "error";

const EMPTY: Values = { projectSlug: "", skill: "", text: "" };

function validate(values: Values): FieldErrors {
  const errors: FieldErrors = {};
  if (!values.projectSlug) errors.projectSlug = "Pick a project.";
  if (values.skill.trim().length < 2)
    errors.skill = "Skill needs at least 2 characters.";
  if (values.text.trim().length < 40)
    errors.text = "Tell me a bit more — at least 40 characters.";
  return errors;
}

export function EndorsementForm({ projects }: Props) {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [banner, setBanner] = useState("");

  const projectId = useId();
  const skillId = useId();
  const textId = useId();
  const bannerId = useId();

  function set<K extends keyof Values>(key: K, value: Values[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
    if (status !== "idle") {
      setStatus("idle");
      setBanner("");
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fieldErrors = validate(values);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      setStatus("error");
      setBanner("Fix the highlighted fields and try again.");
      return;
    }
    setErrors({});
    setStatus("submitting");
    setBanner("");
    await new Promise((resolve) => setTimeout(resolve, 600));
    setStatus("success");
    setBanner(
      "Thanks — your endorsement is queued for review. It'll show up on the project once approved.",
    );
    setValues(EMPTY);
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      aria-label="New endorsement"
      aria-describedby={banner ? bannerId : undefined}
      className="flex flex-col gap-5 rounded-2xl border border-border bg-surface p-6"
    >
      <h2 className="font-display text-lg font-semibold text-foreground">
        Endorse a project
      </h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field id={projectId} label="Project" error={errors.projectSlug}>
          <select
            id={projectId}
            value={values.projectSlug}
            onChange={(e) => set("projectSlug", e.target.value)}
            className={fieldClass}
            aria-invalid={!!errors.projectSlug}
          >
            <option value="">Pick a project…</option>
            {projects.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.name}
              </option>
            ))}
          </select>
        </Field>

        <Field id={skillId} label="Skill" error={errors.skill}>
          <input
            id={skillId}
            value={values.skill}
            onChange={(e) => set("skill", e.target.value)}
            placeholder="e.g. Kitchen workflow"
            className={fieldClass}
            aria-invalid={!!errors.skill}
          />
        </Field>
      </div>

      <Field id={textId} label="Your endorsement" error={errors.text}>
        <textarea
          id={textId}
          rows={5}
          value={values.text}
          onChange={(e) => set("text", e.target.value)}
          placeholder="Share what worked for you — keep it specific."
          className={`${fieldClass} resize-y`}
          aria-invalid={!!errors.text}
        />
      </Field>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex h-11 self-end items-center justify-center rounded-full bg-coral px-5 font-mono text-xs uppercase tracking-[0.14em] text-background transition-colors hover:bg-coral/90 disabled:opacity-60"
      >
        {status === "submitting" ? "Sending…" : "Submit endorsement"}
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
  "w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral aria-[invalid=true]:border-coral";

type FieldProps = {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
};

function Field({ id, label, error, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted"
      >
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-coral">{error}</p>}
    </div>
  );
}
