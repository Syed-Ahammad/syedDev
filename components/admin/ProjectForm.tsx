"use client";

import { useId, useState, type FormEvent } from "react";

type Values = {
  name: string;
  tagline: string;
  type: string;
  stack: string;
  status: "draft" | "in-progress" | "live";
};

type FieldErrors = Partial<Record<keyof Values, string>>;

type Status = "idle" | "submitting" | "success" | "error";

const TYPES = [
  "SaaS",
  "Marketplace",
  "E-commerce",
  "Internal tool",
  "Mobile app",
  "Landing page",
];

const EMPTY: Values = {
  name: "",
  tagline: "",
  type: "",
  stack: "",
  status: "draft",
};

function validate(values: Values): FieldErrors {
  const errors: FieldErrors = {};
  if (values.name.trim().length < 2) errors.name = "Name is too short.";
  if (values.tagline.trim().length < 20)
    errors.tagline = "Tagline should be at least 20 characters.";
  if (!values.type) errors.type = "Pick a project type.";
  if (values.stack.trim().length < 2)
    errors.stack = "List at least one stack item.";
  return errors;
}

export function ProjectForm() {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [banner, setBanner] = useState("");

  const nameId = useId();
  const taglineId = useId();
  const typeId = useId();
  const stackId = useId();
  const statusFieldId = useId();
  const statusBannerId = useId();

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
      `Project "${values.name}" looks good — persistence lands when /api/admin/projects is wired.`,
    );
    setValues(EMPTY);
  }

  if (!open) {
    return (
      <div className="flex items-center justify-end">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex h-10 items-center justify-center rounded-full bg-coral px-5 font-mono text-xs uppercase tracking-[0.14em] text-background transition-colors hover:bg-coral/90"
        >
          + New project
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      aria-describedby={banner ? statusBannerId : undefined}
      aria-label="New project"
      className="flex flex-col gap-5 rounded-2xl border border-border bg-surface p-6"
    >
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-display text-lg font-semibold text-foreground">
          New project
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

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field id={nameId} label="Name" error={errors.name}>
          <input
            id={nameId}
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            className={fieldClass}
            aria-invalid={!!errors.name}
          />
        </Field>

        <Field id={typeId} label="Type" error={errors.type}>
          <select
            id={typeId}
            value={values.type}
            onChange={(e) => set("type", e.target.value)}
            className={fieldClass}
            aria-invalid={!!errors.type}
          >
            <option value="">Pick a type…</option>
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>

        <Field id={stackId} label="Stack (comma separated)" error={errors.stack}>
          <input
            id={stackId}
            value={values.stack}
            onChange={(e) => set("stack", e.target.value)}
            placeholder="Next.js, MongoDB"
            className={fieldClass}
            aria-invalid={!!errors.stack}
          />
        </Field>

        <Field id={statusFieldId} label="Status">
          <select
            id={statusFieldId}
            value={values.status}
            onChange={(e) =>
              set("status", e.target.value as Values["status"])
            }
            className={fieldClass}
          >
            <option value="draft">Draft</option>
            <option value="in-progress">In progress</option>
            <option value="live">Live</option>
          </select>
        </Field>
      </div>

      <Field id={taglineId} label="Tagline" error={errors.tagline}>
        <textarea
          id={taglineId}
          rows={3}
          value={values.tagline}
          onChange={(e) => set("tagline", e.target.value)}
          className={`${fieldClass} resize-y`}
          aria-invalid={!!errors.tagline}
        />
      </Field>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex h-11 self-end items-center justify-center rounded-full bg-coral px-5 font-mono text-xs uppercase tracking-[0.14em] text-background transition-colors hover:bg-coral/90 disabled:opacity-60"
      >
        {status === "submitting" ? "Saving…" : "Save project"}
      </button>

      <p
        id={statusBannerId}
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
