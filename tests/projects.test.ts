import { describe, it, expect } from "vitest";
import {
  parseProjectParams,
  buildProjectFilter,
  sortSpecFor,
  DEFAULT_LIMIT,
  MAX_LIMIT,
} from "@/lib/projects";

const parse = (qs: string) => parseProjectParams(new URLSearchParams(qs));

describe("parseProjectParams", () => {
  it("applies defaults for an empty query", () => {
    expect(parse("")).toEqual({
      q: "",
      stack: [],
      type: "",
      sort: "recent",
      page: 1,
      limit: DEFAULT_LIMIT,
    });
  });

  it("parses comma-separated stack and trims values", () => {
    expect(parse("stack=Next.js,%20MongoDB%20,").stack).toEqual([
      "Next.js",
      "MongoDB",
    ]);
  });

  it("falls back to 'recent' for an unknown sort", () => {
    expect(parse("sort=banana").sort).toBe("recent");
    expect(parse("sort=endorsed").sort).toBe("endorsed");
  });

  it("clamps limit to [1, MAX_LIMIT] and page to >= 1", () => {
    expect(parse("limit=999").limit).toBe(MAX_LIMIT);
    expect(parse("limit=1").limit).toBe(1);
    expect(parse("limit=0").limit).toBe(DEFAULT_LIMIT);
    expect(parse("limit=abc").limit).toBe(DEFAULT_LIMIT);
    expect(parse("page=-3").page).toBe(1);
    expect(parse("page=4").page).toBe(4);
  });
});

describe("buildProjectFilter", () => {
  it("always excludes drafts", () => {
    expect(buildProjectFilter(parse("")).status).toEqual({ $ne: "draft" });
  });

  it("adds text search, type and stack constraints when present", () => {
    const filter = buildProjectFilter(parse("q=vat&type=SaaS&stack=Next.js,MongoDB"));
    expect(filter.$text).toEqual({ $search: "vat" });
    expect(filter.type).toBe("SaaS");
    expect(filter.stack).toEqual({ $in: ["Next.js", "MongoDB"] });
  });

  it("omits optional constraints when absent", () => {
    const filter = buildProjectFilter(parse(""));
    expect(filter.$text).toBeUndefined();
    expect(filter.type).toBeUndefined();
    expect(filter.stack).toBeUndefined();
  });
});

describe("sortSpecFor", () => {
  it("maps each sort to a deterministic spec", () => {
    expect(sortSpecFor("recent")).toEqual({ order: 1 });
    expect(sortSpecFor("alpha")).toEqual({ name: 1 });
    expect(sortSpecFor("status")).toEqual({ status: -1, order: 1 });
    expect(sortSpecFor("endorsed")).toEqual({ endorsementCount: -1, order: 1 });
  });
});
