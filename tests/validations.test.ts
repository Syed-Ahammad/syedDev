import { describe, it, expect } from "vitest";
import { leadSchema } from "@/lib/validations";

const valid = {
  name: "Omar Al-Rashid",
  email: "omar@example.com",
  message: "We run two cafes in JLT and need an online ordering flow.",
};

describe("leadSchema", () => {
  it("accepts a valid lead and trims whitespace", () => {
    const result = leadSchema.safeParse({ ...valid, name: "  Omar  " });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.name).toBe("Omar");
  });

  it("rejects a name shorter than 2 characters", () => {
    const result = leadSchema.safeParse({ ...valid, name: "O" });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = leadSchema.safeParse({ ...valid, email: "not-an-email" });
    expect(result.success).toBe(false);
  });

  it("rejects a message shorter than 10 characters", () => {
    const result = leadSchema.safeParse({ ...valid, message: "too short" });
    expect(result.success).toBe(false);
  });

  it("treats projectType as optional", () => {
    expect(leadSchema.safeParse(valid).success).toBe(true);
    expect(
      leadSchema.safeParse({ ...valid, projectType: "Web app" }).success,
    ).toBe(true);
  });

  it("only allows known sources", () => {
    expect(
      leadSchema.safeParse({ ...valid, source: "portfolio" }).success,
    ).toBe(true);
    expect(
      leadSchema.safeParse({ ...valid, source: "spam" }).success,
    ).toBe(false);
  });
});
