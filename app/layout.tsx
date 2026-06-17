import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/public/ThemeProvider";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://syed.dev";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Syed Ahammad — Full-stack developer in Dubai",
  description:
    "Portfolio and project log for Syed Ahammad — Next.js, MongoDB, and the build journal behind every shipped product.",
  applicationName: "syed.dev",
  authors: [{ name: "Syed Ahammad", url: SITE_URL }],
  creator: "Syed Ahammad",
  keywords: [
    "Syed Ahammad",
    "full-stack developer",
    "Dubai",
    "Next.js",
    "MongoDB",
    "TypeScript",
    "React",
    "freelance developer UAE",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "Syed Ahammad — Full-stack developer in Dubai",
    description:
      "Portfolio + community layer. Next.js, MongoDB, real shipped products, and a public build journal.",
    siteName: "syed.dev",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Syed Ahammad — Full-stack developer in Dubai",
    description:
      "Portfolio + community layer. Next.js, MongoDB, real shipped products, and a public build journal.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f1ea" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1622" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
