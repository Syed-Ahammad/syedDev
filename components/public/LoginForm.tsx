"use client";

import { useId, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import { toast } from "sonner";

type Status = "idle" | "submitting" | "success" | "error";

type Values = {
  email: string;
  password: string;
};

type FieldErrors = Partial<Record<keyof Values, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const DEMO_USER = {
  email: process.env.NEXT_PUBLIC_DEMO_USER_EMAIL ?? "demo@syed.dev",
  password: process.env.NEXT_PUBLIC_DEMO_USER_PASSWORD ?? "demo-user-pass",
};

const DEMO_ADMIN = {
  email: process.env.NEXT_PUBLIC_DEMO_ADMIN_EMAIL ?? "admin@syed.dev",
  password: process.env.NEXT_PUBLIC_DEMO_ADMIN_PASSWORD ?? "demo-admin-pass",
};

function validate(values: Values): FieldErrors {
  const errors: FieldErrors = {};
  if (!EMAIL_RE.test(values.email.trim())) errors.email = "Enter a valid email.";
  if (values.password.length < 6)
    errors.password = "Password must be at least 6 characters.";
  return errors;
}

export function LoginForm() {
  const emailId = useId();
  const passwordId = useId();
  const statusId = useId();

  const [values, setValues] = useState<Values>({ email: "", password: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [banner, setBanner] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function set<K extends keyof Values>(key: K, value: Values[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
    if (status !== "idle") {
      setStatus("idle");
      setBanner("");
    }
  }

  const router = useRouter();

  async function doSignIn(email: string, password: string) {
    setStatus("submitting");
    setBanner("");
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (!result || result.error) {
        setStatus("error");
        setBanner("Wrong email or password.");
        toast.error("Wrong email or password.");
        return;
      }
      // Send admins to the admin panel, everyone else to their dashboard.
      const session = await getSession();
      toast.success("Signed in.");
      router.push(session?.user?.role === "admin" ? "/admin" : "/dashboard");
      router.refresh();
    } catch {
      setStatus("error");
      setBanner("Couldn't reach the sign-in service. Please try again.");
      toast.error("Couldn't reach the sign-in service. Please try again.");
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
    await doSignIn(values.email, values.password);
  }

  function fillDemo(which: "user" | "admin") {
    const creds = which === "user" ? DEMO_USER : DEMO_ADMIN;
    setValues(creds);
    void doSignIn(creds.email, creds.password);
  }

  const submitting = status === "submitting";

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      aria-describedby={banner ? statusId : undefined}
      className="flex flex-col gap-5 rounded-2xl border border-border bg-surface p-6 md:p-8"
    >
      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={() => fillDemo("user")}
          disabled={submitting}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border bg-background px-5 font-mono text-xs uppercase tracking-[0.14em] text-foreground transition-colors hover:border-teal hover:text-teal disabled:opacity-60"
        >
          ▸ Demo user (read-only dashboard)
        </button>
        <button
          type="button"
          onClick={() => fillDemo("admin")}
          disabled={submitting}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border bg-background px-5 font-mono text-xs uppercase tracking-[0.14em] text-foreground transition-colors hover:border-teal hover:text-teal disabled:opacity-60"
        >
          ▸ Demo admin (full panel)
        </button>
      </div>

      <Divider label="or sign in with" />

      <button
        type="button"
        disabled={submitting}
        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        className="inline-flex h-11 items-center justify-center gap-3 rounded-full border border-border bg-background px-5 text-sm font-medium text-foreground transition-colors hover:border-coral disabled:opacity-60"
      >
        <GoogleGlyph />
        Continue with Google
      </button>

      <Divider label="or your email" />

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
        error={errors.password}
        input={
          <div className="relative">
            <input
              id={passwordId}
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={values.password}
              onChange={(e) => set("password", e.target.value)}
              disabled={submitting}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? `${passwordId}-err` : undefined}
              className={`${fieldClass} pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              disabled={submitting}
              aria-pressed={showPassword}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute inset-y-0 right-0 flex items-center px-3.5 text-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:text-coral disabled:opacity-60"
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
        }
      />

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex h-12 items-center justify-center rounded-full bg-coral px-6 font-mono text-xs uppercase tracking-[0.14em] text-background transition-colors hover:bg-coral/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral disabled:opacity-60"
      >
        {submitting ? "Signing in…" : "Sign in →"}
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
  error?: string;
  input: React.ReactNode;
};

function Field({ id, label, error, input }: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="font-mono text-xs uppercase tracking-[0.14em] text-muted"
      >
        {label}
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

function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3" aria-hidden="true">
      <span className="h-px flex-1 bg-border" />
      <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-muted">
        {label}
      </span>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}

function EyeIcon() {
  return (
    <svg
      aria-hidden="true"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      aria-hidden="true"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9.9 4.24A9.1 9.1 0 0 1 12 5c6.5 0 10 7 10 7a13.2 13.2 0 0 1-1.67 2.68" />
      <path d="M6.06 6.06C3.5 7.6 2 12 2 12s3.5 7 10 7a9.7 9.7 0 0 0 4.94-1.06" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
      <path d="M2 2l20 20" />
    </svg>
  );
}

function GoogleGlyph() {
  return (
    <svg
      aria-hidden="true"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.17-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.55-1.85.87-3.04.87-2.34 0-4.32-1.58-5.03-3.7H.92v2.33A9 9 0 0 0 9 18Z"
      />
      <path
        fill="#FBBC05"
        d="M3.97 10.73a5.4 5.4 0 0 1 0-3.46V4.94H.92a9 9 0 0 0 0 8.12l3.05-2.33Z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.45 3.44 1.34l2.58-2.58A9 9 0 0 0 .92 4.94l3.05 2.33C4.68 5.16 6.66 3.58 9 3.58Z"
      />
    </svg>
  );
}
