import { z } from "zod";

/**
 * Shared validation rules. Used by both client forms and API route handlers so
 * the contract is defined exactly once (see AGENTS.md convention #4).
 */

export const LEAD_SOURCES = ["portfolio", "newsletter", "quote-request"] as const;

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

export const loginSchema = z.object({
  email: z.string().trim().pipe(z.email("Enter a valid email.")),
  password: z.string().min(1, "Enter your password."),
});

export type LoginInput = z.infer<typeof loginSchema>;
