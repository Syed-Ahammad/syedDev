"use client";

import { useId, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { UserProfile } from "@/types";

type Props = {
  initial: UserProfile;
};

type Values = {
  name: string;
  bio: string;
  avatarUrl: string;
  newsletter: boolean;
  endorsementUpdates: boolean;
  quoteReplies: boolean;
};

type FieldErrors = Partial<Record<"name" | "bio" | "avatarUrl", string>>;
type Status = "idle" | "submitting" | "success" | "error";

const URL_RE = /^https?:\/\/.+\..+/i;

function toValues(profile: UserProfile): Values {
  return {
    name: profile.name,
    bio: profile.bio,
    avatarUrl: profile.avatarUrl,
    newsletter: profile.notifications.newsletter,
    endorsementUpdates: profile.notifications.endorsementUpdates,
    quoteReplies: profile.notifications.quoteReplies,
  };
}

function validate(values: Values): FieldErrors {
  const errors: FieldErrors = {};
  if (values.name.trim().length < 2) errors.name = "Name is too short.";
  if (values.bio.trim().length > 280)
    errors.bio = "Bio should be 280 characters or fewer.";
  if (values.avatarUrl && !URL_RE.test(values.avatarUrl.trim()))
    errors.avatarUrl = "Avatar URL should start with http(s)://";
  return errors;
}

export function ProfileForm({ initial }: Props) {
  const router = useRouter();
  const [values, setValues] = useState<Values>(toValues(initial));
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [banner, setBanner] = useState("");
  const [uploading, setUploading] = useState(false);

  const nameId = useId();
  const emailId = useId();
  const bioId = useId();
  const avatarId = useId();
  const bannerId = useId();

  function setField<K extends keyof Values>(key: K, value: Values[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (key in errors)
      setErrors((prev) => ({ ...prev, [key as keyof FieldErrors]: undefined }));
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
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name.trim(),
          bio: values.bio.trim(),
          image: values.avatarUrl.trim(),
          notifications: {
            newsletter: values.newsletter,
            endorsementUpdates: values.endorsementUpdates,
            quoteReplies: values.quoteReplies,
          },
        }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.success) {
        throw new Error(json?.error ?? "Could not save your profile.");
      }
      setStatus("success");
      setBanner("Profile saved.");
      toast.success("Profile saved.");
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not save your profile.";
      setStatus("error");
      setBanner(message);
      toast.error(message);
    }
  }

  async function onAvatarChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setStatus("idle");
    setBanner("");
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/user/avatar", { method: "POST", body });
      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.success) {
        throw new Error(json?.error ?? "Upload failed.");
      }
      setField("avatarUrl", json.data.url);
      toast.success("Avatar uploaded.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed.";
      setStatus("error");
      setBanner(message);
      toast.error(message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      aria-label="Edit profile"
      aria-describedby={banner ? bannerId : undefined}
      className="flex flex-col gap-6 rounded-2xl border border-border bg-surface p-6"
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Field id={nameId} label="Name" error={errors.name}>
          <input
            id={nameId}
            value={values.name}
            onChange={(e) => setField("name", e.target.value)}
            className={fieldClass}
            aria-invalid={!!errors.name}
            autoComplete="name"
          />
        </Field>

        <Field id={emailId} label="Email (read-only)">
          <input
            id={emailId}
            value={initial.email}
            disabled
            className={`${fieldClass} cursor-not-allowed opacity-70`}
          />
        </Field>
      </div>

      <Field id={avatarId} label="Avatar" error={errors.avatarUrl}>
        <input
          id={avatarId}
          value={values.avatarUrl}
          onChange={(e) => setField("avatarUrl", e.target.value)}
          placeholder="https://… or upload below"
          className={fieldClass}
          aria-invalid={!!errors.avatarUrl}
          inputMode="url"
        />
        <input
          type="file"
          accept="image/*"
          onChange={onAvatarChange}
          disabled={uploading || status === "submitting"}
          aria-label="Upload an avatar image"
          className={fieldClass}
        />
        {uploading && <p className="text-xs text-muted">Uploading…</p>}
        {values.avatarUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={values.avatarUrl}
            alt="Avatar preview"
            className="mt-1 h-16 w-16 rounded-full border border-border object-cover"
          />
        )}
      </Field>

      <Field id={bioId} label="Bio" error={errors.bio}>
        <textarea
          id={bioId}
          rows={4}
          value={values.bio}
          onChange={(e) => setField("bio", e.target.value)}
          className={`${fieldClass} resize-y`}
          aria-invalid={!!errors.bio}
        />
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted">
          {values.bio.length} / 280
        </p>
      </Field>

      <fieldset className="flex flex-col gap-3 rounded-xl border border-border bg-background p-4">
        <legend className="px-1 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted">
          Notifications
        </legend>
        <Checkbox
          label="Monthly newsletter"
          hint="Short notes when I ship something or write a build log."
          checked={values.newsletter}
          onChange={(c) => setField("newsletter", c)}
        />
        <Checkbox
          label="Endorsement updates"
          hint="Tell me when one of my endorsements is approved or rejected."
          checked={values.endorsementUpdates}
          onChange={(c) => setField("endorsementUpdates", c)}
        />
        <Checkbox
          label="Quote replies"
          hint="Email me when Syed replies to a brief I've sent."
          checked={values.quoteReplies}
          onChange={(c) => setField("quoteReplies", c)}
        />
      </fieldset>

      <button
        type="submit"
        disabled={status === "submitting" || uploading}
        className="inline-flex h-11 self-end items-center justify-center rounded-full bg-coral px-5 font-mono text-xs uppercase tracking-[0.14em] text-background transition-colors hover:bg-coral/90 disabled:opacity-60"
      >
        {status === "submitting" ? "Saving…" : "Save changes"}
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

type CheckboxProps = {
  label: string;
  hint: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

function Checkbox({ label, hint, checked, onChange }: CheckboxProps) {
  const id = useId();
  return (
    <div className="flex items-start gap-3">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 h-4 w-4 cursor-pointer accent-coral"
      />
      <label htmlFor={id} className="flex flex-col gap-0.5 text-sm">
        <span className="font-medium text-foreground">{label}</span>
        <span className="text-xs leading-relaxed text-muted">{hint}</span>
      </label>
    </div>
  );
}
