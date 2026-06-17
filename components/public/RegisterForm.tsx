"use client";

import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { z } from "zod";
import { registerSchema } from "@/lib/validations";

type Outcome = "idle" | "success" | "error";

// Extend the shared server schema with a client-only confirm-password match.
const registerFormSchema = registerSchema
  .extend({ confirm: z.string() })
  .refine((d) => d.password === d.confirm, {
    message: "Passwords do not match.",
    path: ["confirm"],
  });

type RegisterFormValues = z.infer<typeof registerFormSchema>;

export function RegisterForm() {
  const nameId = useId();
  const emailId = useId();
  const passwordId = useId();
  const confirmId = useId();
  const statusId = useId();

  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: { name: "", email: "", password: "", confirm: "" },
  });

  const [outcome, setOutcome] = useState<Outcome>("idle");
  const [banner, setBanner] = useState("");

  async function onValid(data: RegisterFormValues) {
    setOutcome("idle");
    setBanner("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok || !body?.success) {
        throw new Error(body?.error ?? "Registration failed. Please try again.");
      }

      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      if (result?.error) {
        setOutcome("success");
        setBanner("Account created — please sign in.");
        router.push("/login");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setOutcome("error");
      setBanner(err instanceof Error ? err.message : "Registration failed.");
    }
  }

  function onInvalid() {
    setOutcome("error");
    setBanner("Fix the highlighted fields and try again.");
  }

  const submitting = isSubmitting;

  return (
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
        id={passwordId}
        label="Password"
        hint="At least 8 characters, including a number."
        error={errors.password?.message}
        input={
          <input
            id={passwordId}
            type="password"
            autoComplete="new-password"
            disabled={submitting}
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? `${passwordId}-err` : undefined}
            className={fieldClass}
            {...register("password")}
          />
        }
      />

      <Field
        id={confirmId}
        label="Confirm password"
        error={errors.confirm?.message}
        input={
          <input
            id={confirmId}
            type="password"
            autoComplete="new-password"
            disabled={submitting}
            aria-invalid={!!errors.confirm}
            aria-describedby={errors.confirm ? `${confirmId}-err` : undefined}
            className={fieldClass}
            {...register("confirm")}
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
          outcome === "error" ? "text-coral" : "text-teal"
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
