import type { Metadata } from "next";
import { ProfileForm } from "@/components/dashboard/ProfileForm";
import { MOCK_USER_PROFILE } from "@/lib/mock-user-profile";

export const metadata: Metadata = {
  title: "Profile — syed.dev",
};

export default function DashboardProfilePage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      <header className="flex flex-col gap-3">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-teal">
          / profile
        </p>
        <h1 className="font-display text-3xl font-semibold text-foreground md:text-4xl">
          Your account
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted">
          Update the basics and choose which notifications you actually want.
          Avatar upload lands in Phase 3 with Vercel Blob.
        </p>
      </header>

      <ProfileForm initial={MOCK_USER_PROFILE} />
    </div>
  );
}
