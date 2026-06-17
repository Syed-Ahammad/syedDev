import type { BlogPost } from "@/types";

type Props = {
  posts: BlogPost[];
};

const DATE = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export function BlogTable({ posts }: Props) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-surface">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-background/40">
            <th className={headerClass}>Post</th>
            <th className={headerClass}>Tag</th>
            <th className={headerClass}>Published</th>
            <th className={headerClass}>Read time</th>
            <th className={`${headerClass} text-right`}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.slug} className="border-b border-border last:border-b-0">
              <td className="px-5 py-4">
                <div className="flex flex-col gap-1">
                  <span className="font-display text-sm font-medium text-foreground">
                    {post.title}
                  </span>
                  <span className="max-w-[44ch] text-xs leading-snug text-muted">
                    {post.excerpt}
                  </span>
                </div>
              </td>
              <td className="px-5 py-4">
                <span className="inline-flex items-center rounded-full border border-border bg-background px-2.5 py-0.5 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted">
                  {post.tag}
                </span>
              </td>
              <td className="px-5 py-4 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted">
                {DATE.format(new Date(post.publishedAt))}
              </td>
              <td className="px-5 py-4 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted">
                {post.readMinutes} min
              </td>
              <td className="px-5 py-4 text-right">
                <div className="inline-flex gap-2">
                  <button
                    type="button"
                    className="rounded-md border border-border px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted transition-colors hover:border-coral hover:text-coral"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="rounded-md border border-border px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted transition-colors hover:border-coral hover:text-coral"
                  >
                    Unpublish
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
