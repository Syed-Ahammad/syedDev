import { describe, it, expect } from "vitest";
import { User } from "@/models/User";
import { Project } from "@/models/Project";
import { Lead } from "@/models/Lead";

// Defining a Mongoose model registers the schema on the default connection but
// needs no live database, so these assertions run safely in CI.

describe("User model", () => {
  it("enforces role and provider enums with sensible defaults", () => {
    expect(User.schema.path("role").options.enum).toEqual(["user", "admin"]);
    expect(User.schema.path("role").options.default).toBe("user");
    expect(User.schema.path("provider").options.enum).toEqual([
      "credentials",
      "google",
    ]);
    expect(User.schema.path("provider").options.default).toBe("credentials");
  });

  it("requires name + email and caps bio length", () => {
    expect(User.schema.path("name").isRequired).toBe(true);
    expect(User.schema.path("email").isRequired).toBe(true);
    expect(User.schema.path("bio").options.maxlength).toBe(280);
  });

  it("declares the partial unique OAuth index", () => {
    const hasPartialIndex = User.schema
      .indexes()
      .some(([, opts]) => Boolean(opts?.partialFilterExpression));
    expect(hasPartialIndex).toBe(true);
  });
});

describe("Project model", () => {
  it("enforces the status enum and numeric defaults", () => {
    expect(Project.schema.path("status").options.enum).toEqual([
      "live",
      "in-progress",
      "draft",
    ]);
    expect(Project.schema.path("status").options.default).toBe("draft");
    expect(Project.schema.path("order").options.default).toBe(0);
    expect(Project.schema.path("views").options.default).toBe(0);
    expect(Project.schema.path("endorsementCount").options.default).toBe(0);
  });

  it("requires a unique slug and declares a text index", () => {
    expect(Project.schema.path("slug").isRequired).toBe(true);
    const hasTextIndex = Project.schema
      .indexes()
      .some(([fields]) => Object.values(fields).includes("text"));
    expect(hasTextIndex).toBe(true);
  });

  it("carries the detail-page narrative and key-info fields", () => {
    for (const field of ["problem", "approach", "outcome", "role"]) {
      expect(Project.schema.path(field).instance).toBe("String");
    }
    expect(Project.schema.path("year").instance).toBe("Number");
    expect(Project.schema.path("links").instance).toBe("Array");
  });
});

describe("Lead model", () => {
  it("requires the core fields and enforces status + source enums", () => {
    expect(Lead.schema.path("name").isRequired).toBe(true);
    expect(Lead.schema.path("email").isRequired).toBe(true);
    expect(Lead.schema.path("message").isRequired).toBe(true);
    expect(Lead.schema.path("status").options.enum).toEqual([
      "new",
      "read",
      "replied",
      "closed",
    ]);
    expect(Lead.schema.path("source").options.enum).toEqual([
      "portfolio",
      "newsletter",
      "quote-request",
    ]);
  });
});
