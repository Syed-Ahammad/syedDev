import type { Metadata } from "next";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { ContactHero } from "@/components/public/ContactHero";
import { ContactDetails } from "@/components/public/ContactDetails";
import { ContactForm } from "@/components/public/ContactForm";

export const metadata: Metadata = {
  title: "Contact — Syed Ahammad",
  description:
    "Get in touch about a project, an audit, or a build review. I reply to every serious enquiry within 24 hours.",
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col">
        <ContactHero />
        <ContactDetails />
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
