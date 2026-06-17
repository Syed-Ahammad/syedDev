import type { Metadata } from "next";
import Link from "next/link";
import { BookmarkCard } from "@/components/dashboard/BookmarkCard";
import { auth } from "@/lib/auth";
import { fetchUserBookmarks } from "@/lib/bookmarks";

export const metadata: Metadata = {
  title: "Bookmarks — syed.dev",
};

export const dynamic = "force-dynamic";

export default async function BookmarksPage() {
  const session = await auth();
  const bookmarks = session?.user
    ? await fetchUserBookmarks(session.user.id)
    : [];

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <header className="flex flex-col gap-3">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-teal">
          / bookmarks
        </p>
        <h1 className="font-display text-3xl font-semibold text-foreground md:text-4xl">
          Projects you&apos;ve saved
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted">
          Bookmark anything that gives you ideas for your own builds.
        </p>
      </header>

      {bookmarks.length === 0 ? (
        <div className="flex flex-col items-start gap-4 rounded-2xl border border-dashed border-border bg-surface p-8">
          <h2 className="font-display text-lg font-semibold text-foreground">
            Nothing bookmarked yet
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-muted">
            Browse the projects index and tap the bookmark on anything you want
            to come back to. It&apos;ll show up here.
          </p>
          <Link
            href="/projects"
            className="inline-flex h-10 items-center justify-center rounded-full bg-coral px-5 font-mono text-xs uppercase tracking-[0.14em] text-background transition-colors hover:bg-coral/90"
          >
            Browse projects →
          </Link>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {bookmarks.map((bm) => (
            <li key={bm.id}>
              <BookmarkCard bookmark={bm} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
