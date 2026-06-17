import type { Metadata } from "next";
import { UserTable } from "@/components/admin/UserTable";
import { MOCK_USERS } from "@/lib/mock-users";

export const metadata: Metadata = {
  title: "Users — Admin · syed.dev",
};

export default function AdminUsersPage() {
  const users = [...MOCK_USERS].sort(
    (a, b) => new Date(b.lastActiveAt).getTime() - new Date(a.lastActiveAt).getTime(),
  );

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
          Manage roles, suspend abusive accounts, or delete with cascade. Action
          buttons hook up at step 3.20.
        </p>
      </header>

      <UserTable users={users} />
    </div>
  );
}
