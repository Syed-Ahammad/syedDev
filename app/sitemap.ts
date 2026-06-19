import type { MetadataRoute } from "next";
import { getPublishedSlugs } from "@/lib/projects";
import { getPublishedBlogSlugs } from "@/lib/blog";
import { MOCK_PROJECTS } from "@/lib/mock-projects";
import { MOCK_BLOG_POSTS } from "@/lib/mock-blog";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://syed.dev";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/projects`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/login`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/register`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  // Pull live published slugs; fall back to the mock data if the DB is
  // unreachable (e.g. building without MONGODB_URI) so the build never fails.
  let projectSlugs: string[];
  let blogSlugs: string[];
  try {
    [projectSlugs, blogSlugs] = await Promise.all([
      getPublishedSlugs(),
      getPublishedBlogSlugs(),
    ]);
  } catch {
    projectSlugs = MOCK_PROJECTS.filter((p) => p.status !== "draft").map((p) => p.slug);
    blogSlugs = MOCK_BLOG_POSTS.map((p) => p.slug);
  }

  const projectRoutes: MetadataRoute.Sitemap = projectSlugs.map((slug) => ({
    url: `${SITE_URL}/projects/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const blogRoutes: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${SITE_URL}/blog/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...projectRoutes, ...blogRoutes];
}
