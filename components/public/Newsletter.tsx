"use client";

import { useId, useState, type FormEvent } from "react";

type Status = "idle" | "submitting" | "success" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function Newsletter() {
  const emailId = useId();
  const messageId = useId();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!EMAIL_RE.test(email.trim())) {
      setStatus("error");
      setMessage("That doesn't look like a valid email address.");
      return;
    }
    setStatus("submitting");
    setMessage("");
    await new Promise((resolve) => setTimeout(resolve, 500));
    setStatus("success");
    setMessage("Thanks — I'll only email when there's something worth reading.");
    setEmail("");
  }

  const disabled = status === "submitting";

  return (
    <section
      aria-labelledby="newsletter-heading"
      className="border-t border-border bg-surface px-6 py-20 md:px-12 md:py-24"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-6 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-teal">
          / build journal
        </p>
        <h2
          id="newsletter-heading"
          className="font-display text-3xl font-semibold text-foreground md:text-4xl"
        >
          Short notes when I ship something new
        </h2>
        <p className="text-base leading-relaxed text-muted">
          One or two emails a month. New posts, small lessons from real projects, and the
          occasional behind-the-scenes from what I&apos;m building. Unsubscribe any time.
        </p>

        <form
          onSubmit={onSubmit}
          noValidate
          className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-stretch sm:justify-center"
          aria-describedby={message ? messageId : undefined}
        >
          <label htmlFor={emailId} className="sr-only">
            Email address
          </label>
          <input
            id={emailId}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status !== "idle") {
                setStatus("idle");
                setMessage("");
              }
            }}
            disabled={disabled}
            aria-invalid={status === "error"}
            className="h-12 min-w-0 flex-1 rounded-full border border-border bg-background px-5 text-sm text-foreground placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral disabled:opacity-60 sm:max-w-sm"
          />
          <button
            type="submit"
            disabled={disabled}
            className="inline-flex h-12 items-center justify-center rounded-full bg-coral px-6 font-mono text-xs uppercase tracking-[0.14em] text-background transition-colors hover:bg-coral/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral disabled:opacity-60"
          >
            {disabled ? "Sending…" : "Subscribe"}
          </button>
        </form>

        <p
          id={messageId}
          role="status"
          aria-live="polite"
          className={`min-h-[1.25rem] text-sm ${
            status === "error" ? "text-coral" : "text-teal"
          }`}
        >
          {message}
        </p>
      </div>
    </section>
  );
}
