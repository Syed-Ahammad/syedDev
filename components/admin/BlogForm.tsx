"use client";

import { useId, useState, type FormEvent } from "react";

type Values = {
  title: string;
  excerpt: string;
  tag: string;
  body: string;
};

type FieldErrors = Partial<Record<keyof Values, string>>;
type Status = "idle" | "submitting" | "success" | "error";

const TAGS = ["Engineering", "Backend", "Career", "Operations"];

const EMPTY: Values = { title: "", excerpt: "", tag: "", body: "" };

function validate(values: Values): FieldErrors {
  const errors: FieldErrors = {};
  if (values.title.trim().length < 4) errors.title = "Title is too short.";
  if (values.excerpt.trim().length < 30)
    errors.excerpt = "Excerpt should be at least 30 characters.";
  if (!values.tag) errors.tag = "Pick a tag.";
  if (values.body.trim().length < 80)
    errors.body = "Body should be at least 80 characters.";
  return errors;
}

export function BlogForm() {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [banner, setBanner] = useState("");

  const titleId = useId();
  const excerptId = useId();
  const tagId = useId();
  const bodyId = useId();
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
      `Draft saved for "${values.title}" — persistence lands when /api/admin/blog is wired.`,
    );
    setValues(EMPTY);
  }

  if (!open) {
    return (
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex h-10 items-center justify-center rounded-full bg-coral px-5 font-mono text-xs uppercase tracking-[0.14em] text-background transition-colors hover:bg-coral/90"
        >
          + New post
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      aria-label="New blog post"
      aria-describedby={banner ? bannerId : undefined}
      className="flex flex-col gap-5 rounded-2xl border border-border bg-surface p-6"
    >
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-display text-lg font-semibold text-foreground">
          New post
        </h3>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setValues(EMPTY);
            setErrors({});
            setStatus("idle");
            setBanner("");
          }}
          className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted transition-colors hover:text-coral"
        >
          Cancel
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-[2fr_1fr]">
        <Field id={titleId} label="Title" error={errors.title}>
          <input
            id={titleId}
            value={values.title}
            onChange={(e) => set("title", e.target.value)}
            className={fieldClass}
            aria-invalid={!!errors.title}
          />
        </Field>

        <Field id={tagId} label="Tag" error={errors.tag}>
          <select
            id={tagId}
            value={values.tag}
            onChange={(e) => set("tag", e.target.value)}
            className={fieldClass}
            aria-invalid={!!errors.tag}
          >
            <option value="">Pick a tag…</option>
            {TAGS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field id={excerptId} label="Excerpt" error={errors.excerpt}>
        <textarea
          id={excerptId}
          rows={2}
          value={values.excerpt}
          onChange={(e) => set("excerpt", e.target.value)}
          className={`${fieldClass} resize-y`}
          aria-invalid={!!errors.excerpt}
        />
      </Field>

      <Field id={bodyId} label="Body (Markdown)" error={errors.body}>
        <textarea
          id={bodyId}
          rows={8}
          value={values.body}
          onChange={(e) => set("body", e.target.value)}
          className={`${fieldClass} resize-y font-mono`}
          aria-invalid={!!errors.body}
        />
      </Field>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex h-11 self-end items-center justify-center rounded-full bg-coral px-5 font-mono text-xs uppercase tracking-[0.14em] text-background transition-colors hover:bg-coral/90 disabled:opacity-60"
      >
        {status === "submitting" ? "Saving…" : "Save draft"}
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
