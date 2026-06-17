import { describe, it, expect } from "vitest";
import {
  leadSchema,
  loginSchema,
  registerSchema,
  leadUpdateSchema,
  projectCreateSchema,
  projectUpdateSchema,
  bookmarkSchema,
  endorsementSchema,
  endorsementModerationSchema,
  blogCreateSchema,
  blogUpdateSchema,
  quoteRequestSchema,
  profileUpdateSchema,
} from "@/lib/validations";

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

describe("loginSchema", () => {
  it("accepts a valid email + password", () => {
    expect(
      loginSchema.safeParse({ email: "a@b.com", password: "secret" }).success,
    ).toBe(true);
  });

  it("rejects an invalid email", () => {
    expect(
      loginSchema.safeParse({ email: "nope", password: "secret" }).success,
    ).toBe(false);
  });

  it("rejects an empty password", () => {
    expect(
      loginSchema.safeParse({ email: "a@b.com", password: "" }).success,
    ).toBe(false);
  });
});

describe("registerSchema", () => {
  const valid = { name: "Aisha", email: "aisha@example.com", password: "pass1234" };

  it("accepts a valid registration", () => {
    expect(registerSchema.safeParse(valid).success).toBe(true);
  });

  it("requires a password of at least 8 characters", () => {
    expect(
      registerSchema.safeParse({ ...valid, password: "pass123" }).success,
    ).toBe(false);
  });

  it("requires at least one number in the password", () => {
    expect(
      registerSchema.safeParse({ ...valid, password: "password" }).success,
    ).toBe(false);
  });

  it("rejects a name shorter than 2 characters", () => {
    expect(registerSchema.safeParse({ ...valid, name: "A" }).success).toBe(false);
  });
});

describe("projectCreateSchema", () => {
  const valid = { name: "Dirham", slug: "dirham" };

  it("accepts the minimum required fields", () => {
    expect(projectCreateSchema.safeParse(valid).success).toBe(true);
  });

  it("requires a name", () => {
    expect(projectCreateSchema.safeParse({ slug: "dirham" }).success).toBe(false);
  });

  it("rejects a non-kebab-case slug", () => {
    expect(
      projectCreateSchema.safeParse({ ...valid, slug: "Not Kebab" }).success,
    ).toBe(false);
  });

  it("rejects an unknown status", () => {
    expect(
      projectCreateSchema.safeParse({ ...valid, status: "archived" }).success,
    ).toBe(false);
  });
});

describe("projectUpdateSchema", () => {
  it("allows a partial update (e.g. status only)", () => {
    expect(projectUpdateSchema.safeParse({ status: "live" }).success).toBe(true);
    expect(projectUpdateSchema.safeParse({}).success).toBe(true);
  });
});

describe("endorsementSchema", () => {
  const valid = { skill: "Next.js", text: "Used it on three shipped projects and it held up." };

  it("accepts a valid endorsement (project optional)", () => {
    expect(endorsementSchema.safeParse(valid).success).toBe(true);
    expect(
      endorsementSchema.safeParse({ ...valid, projectId: "abc" }).success,
    ).toBe(true);
  });

  it("rejects text shorter than 20 or longer than 500 characters", () => {
    expect(endorsementSchema.safeParse({ ...valid, text: "too short" }).success).toBe(
      false,
    );
    expect(
      endorsementSchema.safeParse({ ...valid, text: "x".repeat(501) }).success,
    ).toBe(false);
  });

  it("requires a skill", () => {
    expect(endorsementSchema.safeParse({ ...valid, skill: "" }).success).toBe(false);
  });
});

describe("blogCreateSchema", () => {
  const valid = {
    title: "Indexes I add on day one",
    excerpt: "The handful of MongoDB indexes that turn out to be load-bearing.",
    tag: "Backend",
    body: "x".repeat(80),
  };

  it("accepts a valid post", () => {
    expect(blogCreateSchema.safeParse(valid).success).toBe(true);
  });

  it("requires a title of at least 4 characters", () => {
    expect(blogCreateSchema.safeParse({ ...valid, title: "Hi" }).success).toBe(false);
  });

  it("requires an excerpt, a tag, and a long-enough body", () => {
    expect(blogCreateSchema.safeParse({ ...valid, excerpt: "short" }).success).toBe(
      false,
    );
    expect(blogCreateSchema.safeParse({ ...valid, tag: "" }).success).toBe(false);
    expect(blogCreateSchema.safeParse({ ...valid, body: "too short" }).success).toBe(
      false,
    );
  });
});

describe("blogUpdateSchema", () => {
  it("allows a partial update (e.g. published only) and an empty object", () => {
    expect(blogUpdateSchema.safeParse({ published: true }).success).toBe(true);
    expect(blogUpdateSchema.safeParse({}).success).toBe(true);
  });

  it("rejects a non-kebab-case slug", () => {
    expect(blogUpdateSchema.safeParse({ slug: "Not Kebab" }).success).toBe(false);
  });
});

describe("endorsementModerationSchema", () => {
  it("accepts pending, approved, and rejected", () => {
    for (const status of ["pending", "approved", "rejected"]) {
      expect(endorsementModerationSchema.safeParse({ status }).success).toBe(true);
    }
  });

  it("rejects unknown statuses", () => {
    expect(endorsementModerationSchema.safeParse({ status: "deleted" }).success).toBe(
      false,
    );
    expect(endorsementModerationSchema.safeParse({}).success).toBe(false);
  });
});

describe("quoteRequestSchema", () => {
  const valid = {
    title: "Bakery storefront",
    projectType: "Landing page or storefront",
    budget: "AED 5k – 10k",
    timeline: "3–4 weeks",
    brief: "We run a JLT bakery and want a pickup-ordering storefront with WhatsApp.",
  };

  it("accepts a complete brief", () => {
    expect(quoteRequestSchema.safeParse(valid).success).toBe(true);
  });

  it("requires a title, type, budget, timeline, and a 40+ char brief", () => {
    expect(quoteRequestSchema.safeParse({ ...valid, title: "Hi" }).success).toBe(false);
    expect(quoteRequestSchema.safeParse({ ...valid, projectType: "" }).success).toBe(
      false,
    );
    expect(quoteRequestSchema.safeParse({ ...valid, budget: "" }).success).toBe(false);
    expect(quoteRequestSchema.safeParse({ ...valid, timeline: "" }).success).toBe(false);
    expect(quoteRequestSchema.safeParse({ ...valid, brief: "too short" }).success).toBe(
      false,
    );
  });
});

describe("profileUpdateSchema", () => {
  it("allows partial updates (name only, notifications only, empty)", () => {
    expect(profileUpdateSchema.safeParse({ name: "Aisha" }).success).toBe(true);
    expect(
      profileUpdateSchema.safeParse({
        notifications: {
          newsletter: false,
          endorsementUpdates: true,
          quoteReplies: false,
        },
      }).success,
    ).toBe(true);
    expect(profileUpdateSchema.safeParse({}).success).toBe(true);
  });

  it("rejects a too-short name and an over-long bio", () => {
    expect(profileUpdateSchema.safeParse({ name: "A" }).success).toBe(false);
    expect(
      profileUpdateSchema.safeParse({ bio: "x".repeat(281) }).success,
    ).toBe(false);
  });
});

describe("bookmarkSchema", () => {
  it("requires a non-empty projectId", () => {
    expect(bookmarkSchema.safeParse({ projectId: "abc123" }).success).toBe(true);
    expect(bookmarkSchema.safeParse({ projectId: "" }).success).toBe(false);
    expect(bookmarkSchema.safeParse({}).success).toBe(false);
  });
});

describe("leadUpdateSchema", () => {
  it("accepts the known lead statuses", () => {
    for (const status of ["new", "read", "replied", "closed"]) {
      expect(leadUpdateSchema.safeParse({ status }).success).toBe(true);
    }
  });

  it("rejects unknown statuses", () => {
    expect(leadUpdateSchema.safeParse({ status: "won" }).success).toBe(false);
  });
});
