import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { BlogPostHeader } from "@/components/public/BlogPostHeader";
import { RelatedPosts } from "@/components/public/RelatedPosts";
import { getPublishedPost, getRelatedPosts, getPublishedBlogSlugs } from "@/lib/blog";
import { renderMarkdown } from "@/lib/markdown";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  try {
    const slugs = await getPublishedBlogSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    // No DB at build time → render slugs on demand instead of failing the build.
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) return { title: "Post not found" };
  return {
    title: `${post.title} — Syed Ahammad`,
    description: post.excerpt,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      type: "article",
      url: `/blog/${slug}`,
      title: `${post.title} — Syed Ahammad`,
      description: post.excerpt,
      publishedTime: post.publishedAt,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) notFound();

  const related = await getRelatedPosts(post.slug, post.tag);

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
