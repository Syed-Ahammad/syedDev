import type { Metadata } from "next";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { AboutHero } from "@/components/public/AboutHero";
import { AboutJourney } from "@/components/public/AboutJourney";
import { AboutPrinciples } from "@/components/public/AboutPrinciples";
import { AboutStack } from "@/components/public/AboutStack";
import { AboutCta } from "@/components/public/AboutCta";

export const metadata: Metadata = {
  title: "About — Syed Ahammad",
  description:
    "Full-stack developer in Dubai with a background in hospitality and inventory operations. The story, the principles, and the stack I work in.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col">
        <AboutHero />
        <AboutJourney />
        <AboutPrinciples />
        <AboutStack />
        <AboutCta />
      </main>
      <Footer />
    </>
  );
}
