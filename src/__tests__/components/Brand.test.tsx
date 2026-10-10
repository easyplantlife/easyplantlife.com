import { render, screen } from "@testing-library/react";
import { Brand } from "@/components/Brand";

describe("Brand", () => {
  it("links home with an accessible name", () => {
    render(<Brand />);
    const link = screen.getByRole("link", { name: /easy plant life, home/i });
    expect(link).toHaveAttribute("href", "/");
  });

  it("renders the mark as decorative and the wordmark as text", () => {
    render(<Brand />);
    const img = document.querySelector("img");
    expect(img).toHaveAttribute("alt", "");
    expect(img).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByText("Easy Plant Life")).toBeInTheDocument();
  });

  it("renders a smaller mark in the small size", () => {
    render(<Brand size="sm" />);
    expect(document.querySelector("img")).toHaveAttribute("width", "28");
  });
});
