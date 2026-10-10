import { render, screen } from "@testing-library/react";
import { ArrowLink } from "@/components/ui/ArrowLink";

jest.mock("@/lib/analytics/events", () => ({
  trackOutboundClick: jest.fn(),
}));

describe("ArrowLink", () => {
  it("renders an internal link with a right arrow", () => {
    render(<ArrowLink href="/blog">Read the blog</ArrowLink>);
    const link = screen.getByRole("link", { name: "Read the blog" });
    expect(link).toHaveAttribute("href", "/blog");
    expect(link).not.toHaveAttribute("target");
    expect(link.textContent).toContain("→");
  });

  it("renders an external link with a diagonal arrow in a new tab", () => {
    render(
      <ArrowLink href="https://medium.com/@easyplantlife">
        Read on Medium
      </ArrowLink>
    );
    const link = screen.getByRole("link", { name: "Read on Medium" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(link.textContent).toContain("↗");
  });

  it("hides the arrow glyph from assistive tech", () => {
    render(<ArrowLink href="/books">See the books</ArrowLink>);
    const arrow = screen.getByText("→");
    expect(arrow).toHaveAttribute("aria-hidden", "true");
  });

  it("uses the accent color and bold weight", () => {
    render(<ArrowLink href="/about">More</ArrowLink>);
    const link = screen.getByRole("link");
    expect(link.className).toContain("text-accent");
    expect(link.className).toContain("font-semibold");
  });
});
