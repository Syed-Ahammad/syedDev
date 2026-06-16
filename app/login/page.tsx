import type { Metadata } from "next";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { AuthHero } from "@/components/public/AuthHero";
import { LoginForm } from "@/components/public/LoginForm";

export const metadata: Metadata = {
  title: "Sign in — Syed Ahammad",
  description:
    "Sign in to manage bookmarks, endorsements and quote requests. Demo accounts available.",
};

export default function LoginPage() {
  return (
    <>
      <Navbar />
      <main className="flex flex-1 items-start justify-center px-6 py-16 md:px-12 md:py-24">
        <div className="grid w-full max-w-5xl gap-12 lg:grid-cols-[1fr_1fr] lg:items-start">
          <AuthHero
            eyebrow="/ sign in"
            title="Welcome back."
            subtitle="Sign in to bookmark projects, endorse work and follow up on quote requests."
            altPrompt="New here?"
            altLabel="Create an account →"
            altHref="/register"
          />
          <LoginForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
