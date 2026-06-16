import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { ProjectDetailHeader } from "@/components/public/ProjectDetailHeader";
import { ProjectOverview } from "@/components/public/ProjectOverview";
import { ProjectKeyInfo } from "@/components/public/ProjectKeyInfo";
import { ProjectEndorsements } from "@/components/public/ProjectEndorsements";
import { RelatedProjects } from "@/components/public/RelatedProjects";
import { MOCK_PROJECTS } from "@/lib/mock-projects";
import { MOCK_PROJECT_DETAILS } from "@/lib/mock-project-details";
import { MOCK_ENDORSEMENTS } from "@/lib/mock-endorsements";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return MOCK_PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = MOCK_PROJECTS.find((p) => p.slug === slug);
  if (!project) return { title: "Project not found" };
  return {
    title: `${project.name} — Syed Ahammad`,
    description: project.tagline,
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = MOCK_PROJECTS.find((p) => p.slug === slug);
  if (!project) notFound();

  const detail = MOCK_PROJECT_DETAILS[slug];
  if (!detail) notFound();

  const matchTerms = new Set(
    [project.type, ...project.stack].map((s) => s.toLowerCase()),
  );
  const endorsements = MOCK_ENDORSEMENTS.filter((e) =>
    matchTerms.has(e.skill.toLowerCase()),
  ).slice(0, 3);

  const related = MOCK_PROJECTS.filter(
    (p) => p.type === project.type && p.slug !== project.slug,
  ).slice(0, 3);

  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col px-6 py-12 md:px-12 md:py-16">
        <div className="mx-auto w-full max-w-6xl">
          <ProjectDetailHeader project={project} />

          <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_280px] md:gap-12">
            <ProjectOverview detail={detail} />
            <ProjectKeyInfo project={project} detail={detail} />
          </div>

          <ProjectEndorsements project={project} endorsements={endorsements} />
          <RelatedProjects projects={related} />
        </div>
      </main>
      <Footer />
    </>
  );
}
