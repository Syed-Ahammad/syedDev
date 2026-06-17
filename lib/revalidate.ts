import { revalidatePath } from "next/cache";

/**
 * On-demand revalidation for the static public surfaces, per the
 * "Caching & revalidation" table in docs/api-structure.md. Admin and dashboard
 * pages are `force-dynamic`, so only the public pages need invalidating after
 * an admin write. Call these from route handlers after a successful mutation.
 */

export function revalidateProject(slug?: string) {
  revalidatePath("/"); // home featured-projects grid
  revalidatePath("/projects"); // listing
  if (slug) revalidatePath(`/projects/${slug}`); // affected detail page
}

export function revalidateBlog(slug?: string) {
  revalidatePath("/"); // home blog preview
  revalidatePath("/blog"); // listing
  if (slug) revalidatePath(`/blog/${slug}`); // affected post
}

export function revalidateEndorsements(projectSlug?: string) {
  revalidatePath("/"); // testimonials wall
  if (projectSlug) revalidatePath(`/projects/${projectSlug}`);
}

export function revalidateProfile() {
  revalidatePath("/"); // hero / stats / faq driven by the profile
  revalidatePath("/about"); // about page bio + facts
}
