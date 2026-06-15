import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "@/components/public/ThemeProvider";
import { ThemeToggle } from "@/components/public/ThemeToggle";

function renderToggle() {
  return render(
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>,
  );
}

describe("ThemeToggle", () => {
  it("renders an accessible toggle button after mount", async () => {
    renderToggle();
    const button = await screen.findByRole("button", { name: /switch to .* mode/i });
    expect(button).toBeInTheDocument();
  });

  it("flips the label when clicked", async () => {
    const user = userEvent.setup();
    renderToggle();
    const button = await screen.findByRole("button", { name: /switch to light mode/i });
    await user.click(button);
    expect(
      await screen.findByRole("button", { name: /switch to dark mode/i }),
    ).toBeInTheDocument();
  });
});
