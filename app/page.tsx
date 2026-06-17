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
import { ContactForm } from "@/components/public/ContactForm";
import { Footer } from "@/components/public/Footer";
import { Reveal } from "@/components/ui/Reveal";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col">
        <Hero />
        <Reveal>
          <Highlights />
        </Reveal>
        <Reveal>
          <StackStrip />
        </Reveal>
        <Reveal>
          <FeaturedProjects />
        </Reveal>
        <Reveal>
          <Services />
        </Reveal>
        <Reveal>
          <Stats />
        </Reveal>
        <Reveal>
          <EndorsementsWall />
        </Reveal>
        <Reveal>
          <BlogPreview />
        </Reveal>
        <Reveal>
          <Faq />
        </Reveal>
        <Reveal>
          <Newsletter />
        </Reveal>
        <Reveal>
          <ContactForm />
        </Reveal>
      </main>
      <Footer />
    </>
  );
}
