import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

describe("test toolchain", () => {
  it("runs arithmetic", () => {
    expect(2 + 2).toBe(4);
  });

  it("renders a React node via jsdom", () => {
    render(<h1>syed.dev</h1>);
    expect(screen.getByRole("heading", { name: "syed.dev" })).toBeInTheDocument();
  });
});
