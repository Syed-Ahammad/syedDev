import { Navbar } from "@/components/public/Navbar";
import { Hero } from "@/components/public/Hero";
import { Highlights } from "@/components/public/Highlights";
import { StackStrip } from "@/components/public/StackStrip";
import { FeaturedProjects } from "@/components/public/FeaturedProjects";
import { Services } from "@/components/public/Services";
import { Stats } from "@/components/public/Stats";

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
      </main>
    </>
  );
}
