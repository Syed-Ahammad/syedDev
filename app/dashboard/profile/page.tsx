import type { Metadata } from "next";
import { ProfileForm } from "@/components/dashboard/ProfileForm";
import { auth } from "@/lib/auth";
import { getUserProfile } from "@/lib/user-profile";

export const metadata: Metadata = {
  title: "Profile — syed.dev",
};

export const dynamic = "force-dynamic";

export default async function DashboardProfilePage() {
  const session = await auth();
  const profile = session?.user ? await getUserProfile(session.user.id) : null;

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
        </p>
      </header>

      {profile ? (
        <ProfileForm initial={profile} />
      ) : (
        <p className="rounded-2xl border border-dashed border-border bg-surface p-6 text-sm text-muted">
          We couldn&apos;t load your profile. Try signing out and back in.
        </p>
      )}
    </div>
  );
}
