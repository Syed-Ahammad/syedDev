import { Navbar } from "@/components/public/Navbar";
import { Hero } from "@/components/public/Hero";
import { Highlights } from "@/components/public/Highlights";
import { StackStrip } from "@/components/public/StackStrip";
import { FeaturedProjects } from "@/components/public/FeaturedProjects";
import { Services } from "@/components/public/Services";
import { Stats } from "@/components/public/Stats";
import { EndorsementsWall } from "@/components/public/EndorsementsWall";
import { BlogPreview } from "@/components/public/BlogPreview";
import { Faq } from "@/components/public/Faq";
import { Newsletter } from "@/components/public/Newsletter";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col">
        <Hero />
        <Highlights />
        <StackStrip />
        <FeaturedProjects />
        <Services />
        <Stats />
        <EndorsementsWall />
        <BlogPreview />
        <Faq />
        <Newsletter />
      </main>
    </>
  );
}
