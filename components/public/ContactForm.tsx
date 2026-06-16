"use client";

import { useId, useState, type FormEvent } from "react";

type Status = "idle" | "submitting" | "success" | "error";

type Values = {
  name: string;
  email: string;
  projectType: string;
  message: string;
};

type FieldErrors = Partial<Record<keyof Values, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PROJECT_TYPES = [
  "Web app or dashboard",
  "Landing page or storefront",
  "Inventory or POS tool",
  "Integration or API work",
  "Something else",
];

function validate(values: Values): FieldErrors {
  const errors: FieldErrors = {};
  if (values.name.trim().length < 2) errors.name = "Please enter your name.";
  if (!EMAIL_RE.test(values.email.trim()))
    errors.email = "Enter a valid email — I'll only use it to reply.";
  if (values.message.trim().length < 20)
    errors.message = "Tell me a bit more — at least 20 characters helps.";
  return errors;
}

export function ContactForm() {
  const nameId = useId();
  const emailId = useId();
  const typeId = useId();
  const messageId = useId();
  const statusId = useId();

  const [values, setValues] = useState<Values>({
    name: "",
    email: "",
    projectType: "",
    message: "",
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
      setBanner("Please fix the highlighted fields and try again.");
      return;
    }
    setErrors({});
    setStatus("submitting");
    setBanner("");
    await new Promise((resolve) => setTimeout(resolve, 600));
    setStatus("success");
    setBanner("Thanks — I'll reply within 24 hours.");
    setValues({ name: "", email: "", projectType: "", message: "" });
  }

  const submitting = status === "submitting";

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="border-t border-border px-6 py-20 md:px-12 md:py-24"
    >
      <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-teal">
            / let&apos;s talk
          </p>
          <h2
            id="contact-heading"
            className="font-display text-3xl font-semibold text-foreground md:text-4xl"
          >
            Have a project in mind?
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-muted">
            Tell me what you&apos;re trying to build. I&apos;ll reply with honest scope,
            timeline, and a clear next step — usually within 24 hours.
          </p>
          <a
            href="mailto:hello@syed.dev"
            className="mt-6 inline-flex font-mono text-xs uppercase tracking-[0.14em] text-coral transition-colors hover:text-foreground"
          >
            hello@syed.dev →
          </a>
        </div>

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
                inputMode="email"
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
            id={typeId}
            label="Project type"
            optional
            error={undefined}
            input={
              <select
                id={typeId}
                name="projectType"
                value={values.projectType}
                onChange={(e) => set("projectType", e.target.value)}
                disabled={submitting}
                className={fieldClass}
              >
                <option value="">Pick the closest match…</option>
                {PROJECT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            }
          />

          <Field
            id={messageId}
            label="Tell me about it"
            error={errors.message}
            input={
              <textarea
                id={messageId}
                name="message"
                required
                rows={5}
                value={values.message}
                onChange={(e) => set("message", e.target.value)}
                disabled={submitting}
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? `${messageId}-err` : undefined}
                className={`${fieldClass} min-h-[120px] resize-y`}
              />
            }
          />

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex h-12 items-center justify-center rounded-full bg-coral px-6 font-mono text-xs uppercase tracking-[0.14em] text-background transition-colors hover:bg-coral/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral disabled:opacity-60"
          >
            {submitting ? "Sending…" : "Send message →"}
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
      </div>
    </section>
  );
}

const fieldClass =
  "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral disabled:opacity-60 aria-[invalid=true]:border-coral";

type FieldProps = {
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
  input: React.ReactNode;
};

function Field({ id, label, optional, error, input }: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.14em] text-muted"
      >
        <span>{label}</span>
        {optional && <span className="text-muted/70">optional</span>}
      </label>
      {input}
      {error && (
        <p id={`${id}-err`} className="text-xs text-coral">
          {error}
        </p>
      )}
    </div>
  );
}
