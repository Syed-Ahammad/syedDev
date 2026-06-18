import type { Metadata } from "next";
import { Suspense } from "react";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { BlogBrowser, BlogBrowserSkeleton } from "@/components/public/BlogBrowser";

export const metadata: Metadata = {
  title: "Blog — Syed Ahammad",
  description:
    "Notes from what I'm building — stack decisions, career reflections, and backend lessons I wish I'd learned sooner.",
};

type PageProps = {
  searchParams: Promise<{ tag?: string }>;
};

export default async function BlogIndexPage({ searchParams }: PageProps) {
  const raw = await searchParams;
  const activeTag = (raw.tag ?? "").trim();

  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col px-6 py-12 md:px-12 md:py-16">
        <div className="mx-auto w-full max-w-6xl">
          <header className="mb-10 max-w-2xl">
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-teal">
              / blog
            </p>
            <h1 className="font-display text-4xl font-semibold text-foreground md:text-5xl">
              Notes from what I&apos;m building
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted">
              Stack decisions, career reflections, and the backend lessons I wish I&apos;d
              learned sooner. Filter by tag or browse the latest.
            </p>
          </header>

          <Suspense key={activeTag} fallback={<BlogBrowserSkeleton />}>
            <BlogBrowser activeTag={activeTag} />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
