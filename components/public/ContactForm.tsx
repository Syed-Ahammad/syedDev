"use client";

import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { leadSchema, type LeadInput } from "@/lib/validations";

type Outcome = "idle" | "success" | "error";

const PROJECT_TYPES = [
  "Web app or dashboard",
  "Landing page or storefront",
  "Inventory or POS tool",
  "Integration or API work",
  "Something else",
];

export function ContactForm() {
  const nameId = useId();
  const emailId = useId();
  const typeId = useId();
  const messageId = useId();
  const statusId = useId();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
    defaultValues: { name: "", email: "", projectType: "", message: "" },
  });

  const [outcome, setOutcome] = useState<Outcome>("idle");
  const [banner, setBanner] = useState("");

  async function onValid(data: LeadInput) {
    setOutcome("idle");
    setBanner("");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, source: "portfolio" }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok || !body?.success) {
        throw new Error(body?.error ?? "Something went wrong. Please try again.");
      }
      setOutcome("success");
      setBanner("Thanks — I'll reply within 24 hours.");
      reset();
    } catch (err) {
      setOutcome("error");
      setBanner(
        err instanceof Error ? err.message : "Something went wrong. Please try again.",
      );
    }
  }

  function onInvalid() {
    setOutcome("error");
    setBanner("Please fix the highlighted fields and try again.");
  }

  const submitting = isSubmitting;

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
          onSubmit={handleSubmit(onValid, onInvalid)}
          noValidate
          aria-describedby={banner ? statusId : undefined}
          className="flex flex-col gap-5 rounded-2xl border border-border bg-surface p-6 md:p-8"
        >
          <Field
            id={nameId}
            label="Your name"
            error={errors.name?.message}
            input={
              <input
                id={nameId}
                type="text"
                autoComplete="name"
                disabled={submitting}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? `${nameId}-err` : undefined}
                className={fieldClass}
                {...register("name")}
              />
            }
          />

          <Field
            id={emailId}
            label="Email"
            error={errors.email?.message}
            input={
              <input
                id={emailId}
                type="email"
                inputMode="email"
                autoComplete="email"
                disabled={submitting}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? `${emailId}-err` : undefined}
                className={fieldClass}
                {...register("email")}
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
                disabled={submitting}
                className={fieldClass}
                {...register("projectType")}
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
            error={errors.message?.message}
            input={
              <textarea
                id={messageId}
                rows={5}
                disabled={submitting}
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? `${messageId}-err` : undefined}
                className={`${fieldClass} min-h-[120px] resize-y`}
                {...register("message")}
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
              outcome === "error" ? "text-coral" : "text-teal"
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
