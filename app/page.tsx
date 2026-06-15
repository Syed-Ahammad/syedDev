import { Navbar } from "@/components/public/Navbar";
import { Hero } from "@/components/public/Hero";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col">
        <Hero />
      </main>
    </>
  );
}
