import { describe, it, expect } from "vitest";
import { parseLeadListParams, buildLeadFilter } from "@/lib/leads";

const parse = (qs: string) => parseLeadListParams(new URLSearchParams(qs));

describe("parseLeadListParams", () => {
  it("defaults to no status filter and page 1", () => {
    expect(parse("")).toEqual({ status: undefined, page: 1 });
  });

  it("keeps a valid status and ignores an unknown one", () => {
    expect(parse("status=replied").status).toBe("replied");
    expect(parse("status=won").status).toBeUndefined();
  });

  it("clamps page to >= 1", () => {
    expect(parse("page=5").page).toBe(5);
    expect(parse("page=-2").page).toBe(1);
    expect(parse("page=abc").page).toBe(1);
  });
});

describe("buildLeadFilter", () => {
  it("filters by status when present, otherwise matches all", () => {
    expect(buildLeadFilter({ status: "new", page: 1 })).toEqual({ status: "new" });
    expect(buildLeadFilter({ page: 1 })).toEqual({});
  });
});
