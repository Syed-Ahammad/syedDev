import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { UserTable } from "@/components/admin/UserTable";
import { fetchAdminUsers, parseUserListParams } from "@/lib/users";

export const metadata: Metadata = {
  title: "Users — Admin · syed.dev",
};

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ role?: string; page?: string }>;
};

export default async function AdminUsersPage({ searchParams }: PageProps) {
  const raw = await searchParams;
  const sp = new URLSearchParams();
  if (raw.role) sp.set("role", raw.role);
  if (raw.page) sp.set("page", raw.page);

  const session = await auth();
  const { items } = await fetchAdminUsers(parseUserListParams(sp));

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <header className="flex flex-col gap-3">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-teal">
          / users
        </p>
        <h1 className="font-display text-3xl font-semibold text-foreground md:text-4xl">
          User directory
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted">
          Manage roles, suspend abusive accounts, or delete with cascade.
          Deleting a user also removes their bookmarks and endorsements.
        </p>
      </header>

      <UserTable users={items} currentUserId={session?.user?.id ?? ""} />
    </div>
  );
}
