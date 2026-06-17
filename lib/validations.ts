import { z } from "zod";

/**
 * Shared validation rules. Used by both client forms and API route handlers so
 * the contract is defined exactly once (see AGENTS.md convention #4).
 */

export const LEAD_SOURCES = ["portfolio", "newsletter", "quote-request"] as const;
export const LEAD_STATUSES = ["new", "read", "replied", "closed"] as const;

export const leadUpdateSchema = z.object({
  status: z.enum(LEAD_STATUSES),
});

export type LeadUpdateInput = z.infer<typeof leadUpdateSchema>;

export const leadSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name."),
  email: z
    .string()
    .trim()
    .pipe(z.email("Enter a valid email — I'll only use it to reply.")),
  message: z.string().trim().min(10, "Tell me a bit more about your project."),
  projectType: z.string().trim().max(120).optional(),
  source: z.enum(LEAD_SOURCES).optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;

export const bookmarkSchema = z.object({
  projectId: z.string().min(1, "projectId is required."),
});

export type BookmarkInput = z.infer<typeof bookmarkSchema>;

export const endorsementSchema = z.object({
  skill: z.string().trim().min(1, "Pick a skill."),
  text: z
    .string()
    .trim()
    .min(20, "Tell me a bit more — at least 20 characters.")
    .max(500, "Keep it under 500 characters."),
  projectId: z.string().optional(),
});

export type EndorsementInput = z.infer<typeof endorsementSchema>;

export const ENDORSEMENT_STATUSES = ["pending", "approved", "rejected"] as const;

export const endorsementModerationSchema = z.object({
  status: z.enum(ENDORSEMENT_STATUSES),
});

export type EndorsementModerationInput = z.infer<typeof endorsementModerationSchema>;

export const loginSchema = z.object({
  email: z.string().trim().pipe(z.email("Enter a valid email.")),
  password: z.string().min(1, "Enter your password."),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const PROJECT_STATUSES = ["live", "in-progress", "draft"] as const;

const projectFields = {
  name: z.string().trim().min(1, "Name is required."),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be kebab-case (e.g. my-project)."),
  tagline: z.string().trim().optional(),
  description: z.string().trim().optional(),
  type: z.string().trim().optional(),
  stack: z.array(z.string().trim()).optional(),
  status: z.enum(PROJECT_STATUSES).optional(),
  problem: z.string().optional(),
  approach: z.string().optional(),
  outcome: z.string().optional(),
  year: z.number().int().optional(),
  role: z.string().optional(),
  links: z
    .array(z.object({ label: z.string().min(1), href: z.string().min(1) }))
    .optional(),
  liveUrl: z.string().trim().optional(),
  repoUrl: z.string().trim().optional(),
  image: z.string().trim().optional(),
  gallery: z.array(z.string().trim()).optional(),
  keyInfo: z
    .array(z.object({ label: z.string().min(1), value: z.string().min(1) }))
    .optional(),
  order: z.number().int().optional(),
};

export const projectCreateSchema = z.object(projectFields);
export const projectUpdateSchema = z.object(projectFields).partial();

export type ProjectCreateInput = z.infer<typeof projectCreateSchema>;
export type ProjectUpdateInput = z.infer<typeof projectUpdateSchema>;

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name."),
  email: z.string().trim().pipe(z.email("Enter a valid email.")),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .regex(/[0-9]/, "Password must include at least one number."),
});

export type RegisterInput = z.infer<typeof registerSchema>;
