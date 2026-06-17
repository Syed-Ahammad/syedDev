import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { ProjectDetailHeader } from "@/components/public/ProjectDetailHeader";
import { ProjectOverview } from "@/components/public/ProjectOverview";
import { ProjectKeyInfo } from "@/components/public/ProjectKeyInfo";
import { ProjectEndorsements } from "@/components/public/ProjectEndorsements";
import { RelatedProjects } from "@/components/public/RelatedProjects";
import { BookmarkButton } from "@/components/public/BookmarkButton";
import {
  getProjectBySlug,
  getRelatedProjects,
  getPublishedSlugs,
} from "@/lib/projects";
import { MOCK_ENDORSEMENTS } from "@/lib/mock-endorsements";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  try {
    const slugs = await getPublishedSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    // No DB at build time → render slugs on demand instead of failing the build.
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project not found" };
  return {
    title: `${project.name} — Syed Ahammad`,
    description: project.tagline,
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  // Endorsements stay on mock data until step 3.16 wires the public endpoint.
  const matchTerms = new Set(
    [project.type, ...project.stack].map((s) => s.toLowerCase()),
  );
  const endorsements = MOCK_ENDORSEMENTS.filter(
    (e) => e.status === "approved" && matchTerms.has(e.skill.toLowerCase()),
  ).slice(0, 3);

  const related = await getRelatedProjects(project);

  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col px-6 py-12 md:px-12 md:py-16">
        <div className="mx-auto w-full max-w-6xl">
          <ProjectDetailHeader project={project} />

          <div className="mb-10">
            <BookmarkButton projectId={project.id} />
          </div>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_280px] md:gap-12">
            <ProjectOverview detail={project} />
            <ProjectKeyInfo project={project} detail={project} />
          </div>

          <ProjectEndorsements project={project} endorsements={endorsements} />
          <RelatedProjects projects={related} />
        </div>
      </main>
      <Footer />
    </>
  );
}
