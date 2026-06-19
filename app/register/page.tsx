import type { Metadata } from "next";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { AuthHero } from "@/components/public/AuthHero";
import { RegisterForm } from "@/components/public/RegisterForm";

export const metadata: Metadata = {
  title: "Create an account — Syed Ahammad",
  description:
    "Register to bookmark projects, endorse work, and follow up on quote requests.",
  alternates: { canonical: "/register" },
};

export default function RegisterPage() {
  return (
    <>
      <Navbar />
      <main className="flex flex-1 items-start justify-center px-6 py-16 md:px-12 md:py-24">
        <div className="grid w-full max-w-5xl gap-12 lg:grid-cols-[1fr_1fr] lg:items-start">
          <AuthHero
            eyebrow="/ create account"
            title="One account, the whole community layer."
            subtitle="Bookmark the projects you find useful, endorse the skills you've worked with, and send quote requests in a couple of clicks."
            altPrompt="Already have an account?"
            altLabel="Sign in →"
            altHref="/login"
          />
          <RegisterForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
