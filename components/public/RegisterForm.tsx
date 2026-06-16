"use client";

import { useId, useState, type FormEvent } from "react";

type Status = "idle" | "submitting" | "success" | "error";

type Values = {
  name: string;
  email: string;
  password: string;
  confirm: string;
};

type FieldErrors = Partial<Record<keyof Values, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: Values): FieldErrors {
  const errors: FieldErrors = {};
  if (values.name.trim().length < 2) errors.name = "Please enter your name.";
  if (!EMAIL_RE.test(values.email.trim())) errors.email = "Enter a valid email.";
  if (values.password.length < 8)
    errors.password = "Password must be at least 8 characters.";
  if (values.confirm !== values.password)
    errors.confirm = "Passwords do not match.";
  return errors;
}

export function RegisterForm() {
  const nameId = useId();
  const emailId = useId();
  const passwordId = useId();
  const confirmId = useId();
  const statusId = useId();

  const [values, setValues] = useState<Values>({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [banner, setBanner] = useState("");

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
    setBanner("Account details look good — registration lands when auth is wired.");
    setValues({ name: "", email: "", password: "", confirm: "" });
  }

  const submitting = status === "submitting";

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      aria-describedby={banner ? statusId : undefined}
      className="flex flex-col gap-5 rounded-2xl border border-border bg-surface p-6 md:p-8"
    >
      <Field
        id={nameId}
        label="Your name"
        error={errors.name}
        input={
          <input
            id={nameId}
            name="name"
            type="text"
            autoComplete="name"
            required
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            disabled={submitting}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? `${nameId}-err` : undefined}
            className={fieldClass}
          />
        }
      />

      <Field
        id={emailId}
        label="Email"
        error={errors.email}
        input={
          <input
            id={emailId}
            name="email"
            type="email"
            autoComplete="email"
            required
            value={values.email}
            onChange={(e) => set("email", e.target.value)}
            disabled={submitting}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? `${emailId}-err` : undefined}
            className={fieldClass}
          />
        }
      />

      <Field
        id={passwordId}
        label="Password"
        hint="At least 8 characters."
        error={errors.password}
        input={
          <input
            id={passwordId}
            name="password"
            type="password"
            autoComplete="new-password"
            required
            value={values.password}
            onChange={(e) => set("password", e.target.value)}
            disabled={submitting}
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? `${passwordId}-err` : undefined}
            className={fieldClass}
          />
        }
      />

      <Field
        id={confirmId}
        label="Confirm password"
        error={errors.confirm}
        input={
          <input
            id={confirmId}
            name="confirm"
            type="password"
            autoComplete="new-password"
            required
            value={values.confirm}
            onChange={(e) => set("confirm", e.target.value)}
            disabled={submitting}
            aria-invalid={!!errors.confirm}
            aria-describedby={errors.confirm ? `${confirmId}-err` : undefined}
            className={fieldClass}
          />
        }
      />

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex h-12 items-center justify-center rounded-full bg-coral px-6 font-mono text-xs uppercase tracking-[0.14em] text-background transition-colors hover:bg-coral/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral disabled:opacity-60"
      >
        {submitting ? "Creating account…" : "Create account →"}
      </button>

      <p
        id={statusId}
        role="status"
        aria-live="polite"
        className={`min-h-[1.25rem] text-sm ${
          status === "error" ? "text-coral" : "text-teal"
        }`}
      >
        {banner}
      </p>
    </form>
  );
}

const fieldClass =
  "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral disabled:opacity-60 aria-[invalid=true]:border-coral";

type FieldProps = {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  input: React.ReactNode;
};

function Field({ id, label, hint, error, input }: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="font-mono text-xs uppercase tracking-[0.14em] text-muted"
      >
        {label}
      </label>
      {input}
      {hint && !error && <p className="text-xs text-muted">{hint}</p>}
      {error && (
        <p id={`${id}-err`} className="text-xs text-coral">
          {error}
        </p>
      )}
    </div>
  );
}
