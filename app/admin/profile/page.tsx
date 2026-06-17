import type { Metadata } from "next";
import { ProfileEditor } from "@/components/admin/ProfileEditor";
import { getProfile } from "@/lib/profile";

export const metadata: Metadata = {
  title: "Profile — Admin · syed.dev",
};

export const dynamic = "force-dynamic";

export default async function AdminProfilePage() {
  const profile = await getProfile();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      <header className="flex flex-col gap-3">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-teal">
          / profile
        </p>
        <h1 className="font-display text-3xl font-semibold text-foreground md:text-4xl">
          Site profile
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted">
          The single source of truth for your bio, facts, skills, socials, and
          FAQ. Saving updates the public pages.
        </p>
      </header>

      <ProfileEditor initial={profile} />
    </div>
  );
}
