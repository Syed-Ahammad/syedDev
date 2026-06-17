"use client";

import { useId, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

type Values = {
  title: string;
  projectType: string;
  budget: string;
  timeline: string;
  brief: string;
};

type FieldErrors = Partial<Record<keyof Values, string>>;
type Status = "idle" | "submitting" | "success" | "error";

const PROJECT_TYPES = [
  "Web app or dashboard",
  "Landing page or storefront",
  "Inventory or POS tool",
  "Integration or API work",
  "Something else",
];

const BUDGETS = [
  "Under AED 5k",
  "AED 5k – 10k",
  "AED 10k – 20k",
  "AED 20k – 40k",
  "AED 40k +",
];

const TIMELINES = ["1–2 weeks", "3–4 weeks", "1–2 months", "2+ months"];

const EMPTY: Values = {
  title: "",
  projectType: "",
  budget: "",
  timeline: "",
  brief: "",
};

function validate(values: Values): FieldErrors {
  const errors: FieldErrors = {};
  if (values.title.trim().length < 4)
    errors.title = "Give it a short title — at least 4 characters.";
  if (!values.projectType) errors.projectType = "Pick a project type.";
  if (!values.budget) errors.budget = "Pick a budget range.";
  if (!values.timeline) errors.timeline = "Pick a timeline.";
  if (values.brief.trim().length < 40)
    errors.brief = "Brief should be at least 40 characters.";
  return errors;
}

export function QuoteForm() {
  const router = useRouter();
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [banner, setBanner] = useState("");

  const titleId = useId();
  const typeId = useId();
  const budgetId = useId();
  const timelineId = useId();
  const briefId = useId();
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
    try {
      const res = await fetch("/api/user/quote-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: values.title.trim(),
          projectType: values.projectType,
          budget: values.budget,
          timeline: values.timeline,
          brief: values.brief.trim(),
        }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.success) {
        throw new Error(json?.error ?? "Could not send your brief.");
      }
      setStatus("success");
      setBanner(`Brief "${values.title}" sent — I'll reply here soon.`);
      setValues(EMPTY);
      router.refresh();
    } catch (err) {
      setStatus("error");
      setBanner(err instanceof Error ? err.message : "Could not send your brief.");
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      aria-label="New quote request"
      aria-describedby={banner ? bannerId : undefined}
      className="flex flex-col gap-5 rounded-2xl border border-border bg-surface p-6"
    >
      <h2 className="font-display text-lg font-semibold text-foreground">
        Send a new brief
      </h2>

      <Field id={titleId} label="Title" error={errors.title}>
        <input
          id={titleId}
          value={values.title}
          onChange={(e) => set("title", e.target.value)}
          placeholder="e.g. Storefront + WhatsApp checkout"
          className={fieldClass}
          aria-invalid={!!errors.title}
        />
      </Field>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Field id={typeId} label="Project type" error={errors.projectType}>
          <select
            id={typeId}
            value={values.projectType}
            onChange={(e) => set("projectType", e.target.value)}
            className={fieldClass}
            aria-invalid={!!errors.projectType}
          >
            <option value="">Pick a type…</option>
            {PROJECT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>

        <Field id={budgetId} label="Budget" error={errors.budget}>
          <select
            id={budgetId}
            value={values.budget}
            onChange={(e) => set("budget", e.target.value)}
            className={fieldClass}
            aria-invalid={!!errors.budget}
          >
            <option value="">Pick a range…</option>
            {BUDGETS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </Field>

        <Field id={timelineId} label="Timeline" error={errors.timeline}>
          <select
            id={timelineId}
            value={values.timeline}
            onChange={(e) => set("timeline", e.target.value)}
            className={fieldClass}
            aria-invalid={!!errors.timeline}
          >
            <option value="">Pick a window…</option>
            {TIMELINES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field id={briefId} label="Brief" error={errors.brief}>
        <textarea
          id={briefId}
          rows={6}
          value={values.brief}
          onChange={(e) => set("brief", e.target.value)}
          placeholder="What are you building, who is it for, and what does success look like?"
          className={`${fieldClass} resize-y`}
          aria-invalid={!!errors.brief}
        />
      </Field>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex h-11 self-end items-center justify-center rounded-full bg-coral px-5 font-mono text-xs uppercase tracking-[0.14em] text-background transition-colors hover:bg-coral/90 disabled:opacity-60"
      >
        {status === "submitting" ? "Sending…" : "Send brief"}
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
