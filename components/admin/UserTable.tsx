import type { AdminUser } from "@/types";

type Props = {
  users: AdminUser[];
};

const JOINED = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

function relative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.round(diff / 60_000);
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.round(hr / 24);
  if (day < 30) return `${day}d ago`;
  const mo = Math.round(day / 30);
  return `${mo}mo ago`;
}

export function UserTable({ users }: Props) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-background/40">
            <th className={headerClass}>User</th>
            <th className={headerClass}>Role</th>
            <th className={headerClass}>Status</th>
            <th className={headerClass}>Joined</th>
            <th className={headerClass}>Last active</th>
            <th className={`${headerClass} text-right`}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-border last:border-b-0">
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className={`flex h-9 w-9 items-center justify-center rounded-full font-display text-sm font-semibold text-background ${
                      user.role === "admin" ? "bg-coral" : "bg-teal"
                    }`}
                  >
                    {user.name
                      .split(" ")
                      .map((p) => p[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()}
                  </span>
                  <div className="flex flex-col">
                    <span className="font-display text-sm font-medium text-foreground">
                      {user.name}
                    </span>
                    <span className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted">
                      {user.email}
                    </span>
                  </div>
                </div>
              </td>
              <td className="px-5 py-4">
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[0.65rem] uppercase tracking-[0.14em] ${
                    user.role === "admin"
                      ? "border-coral/40 bg-coral/10 text-coral"
                      : "border-border bg-background text-muted"
                  }`}
                >
                  {user.role}
                </span>
              </td>
              <td className="px-5 py-4">
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[0.65rem] uppercase tracking-[0.14em] ${
                    user.status === "active"
                      ? "border-teal/40 bg-teal/10 text-teal"
                      : "border-amber-500/40 bg-amber-500/10 text-amber-500"
                  }`}
                >
                  {user.status}
                </span>
              </td>
              <td className="px-5 py-4 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted">
                {JOINED.format(new Date(user.joinedAt))}
              </td>
              <td className="px-5 py-4 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted">
                {relative(user.lastActiveAt)}
              </td>
              <td className="px-5 py-4 text-right">
                <div className="inline-flex gap-2">
                  <button
                    type="button"
                    className="rounded-md border border-border px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted transition-colors hover:border-coral hover:text-coral"
                  >
                    {user.status === "active" ? "Suspend" : "Reinstate"}
                  </button>
                  <button
                    type="button"
                    className="rounded-md border border-border px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted transition-colors hover:border-coral hover:text-coral"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const headerClass =
  "px-5 py-3 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted";
