import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { BlogPostHeader } from "@/components/public/BlogPostHeader";
import { RelatedPosts } from "@/components/public/RelatedPosts";
import { MOCK_BLOG_POSTS } from "@/lib/mock-blog";
import { renderMarkdown } from "@/lib/markdown";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return MOCK_BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = MOCK_BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) return { title: "Post not found" };
  return {
    title: `${post.title} — Syed Ahammad`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = MOCK_BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) notFound();

  const related = MOCK_BLOG_POSTS.filter(
    (p) => p.slug !== post.slug && p.tag === post.tag,
  ).slice(0, 3);

  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col px-6 py-12 md:px-12 md:py-16">
        <article className="mx-auto w-full max-w-3xl">
          <BlogPostHeader post={post} />
          <div className="blog-body">{renderMarkdown(post.body)}</div>
        </article>
        <div className="mx-auto mt-4 w-full max-w-6xl">
          <RelatedPosts posts={related} />
        </div>
      </main>
      <Footer />
    </>
  );
}
