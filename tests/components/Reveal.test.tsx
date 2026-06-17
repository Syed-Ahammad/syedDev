import { describe, it, expect, beforeAll, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Reveal } from "@/components/ui/Reveal";

beforeAll(() => {
  class FakeIO {
    constructor() {}
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  }
  vi.stubGlobal("IntersectionObserver", FakeIO);
});

describe("Reveal", () => {
  it("renders children with a data-reveal hook for the reduced-motion CSS guard", () => {
    render(
      <Reveal>
        <p>visible to assistive tech immediately</p>
      </Reveal>,
    );

    const text = screen.getByText(/visible to assistive tech immediately/i);
    expect(text).toBeInTheDocument();

    const wrapper = text.parentElement;
    expect(wrapper).toHaveAttribute("data-reveal");
  });
});
