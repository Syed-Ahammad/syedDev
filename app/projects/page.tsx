import type { Metadata } from "next";
import { Suspense } from "react";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import {
  ProjectsBrowser,
  ProjectsBrowserSkeleton,
} from "@/components/public/ProjectsBrowser";
import { parseProjectParams } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projects — Syed Ahammad",
  description:
    "Everything I've built so far — products shipped, projects in progress, and ideas being sketched.",
  alternates: { canonical: "/projects" },
};

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ProjectsPage({ searchParams }: PageProps) {
  const raw = await searchParams;
  const sp = new URLSearchParams();
  for (const [key, value] of Object.entries(raw)) {
    if (typeof value === "string") sp.set(key, value);
  }
  const params = parseProjectParams(sp);

  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col px-6 py-12 md:px-12 md:py-16">
        <div className="mx-auto w-full max-w-6xl">
          <header className="mb-10 max-w-2xl">
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-teal">
              / projects
            </p>
            <h1 className="font-display text-4xl font-semibold text-foreground md:text-5xl">
              Everything I&apos;ve built so far
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted">
              Products I&apos;ve shipped, projects in progress, and ideas being sketched.
              Filter by type, sort by status, or search for what it does.
            </p>
          </header>

          <Suspense key={JSON.stringify(params)} fallback={<ProjectsBrowserSkeleton />}>
            <ProjectsBrowser params={params} />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
