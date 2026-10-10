import { render, screen } from "@testing-library/react";
import { Eyebrow } from "@/components/ui/Eyebrow";

describe("Eyebrow", () => {
  it("renders a paragraph by default", () => {
    render(<Eyebrow>From the blog</Eyebrow>);
    const el = screen.getByText("From the blog");
    expect(el.tagName).toBe("P");
  });

  it("can render as a span", () => {
    render(<Eyebrow as="span">Books</Eyebrow>);
    expect(screen.getByText("Books").tagName).toBe("SPAN");
  });

  it("uses uppercase tracking and the accent color", () => {
    render(<Eyebrow>Label</Eyebrow>);
    const el = screen.getByText("Label");
    expect(el.className).toContain("uppercase");
    expect(el.className).toContain("text-accent");
  });

  it("supports a muted tone", () => {
    render(<Eyebrow tone="muted">What does not</Eyebrow>);
    expect(screen.getByText("What does not").className).toContain("text-faint");
  });

  it("merges custom classes", () => {
    render(<Eyebrow className="mb-4">Label</Eyebrow>);
    expect(screen.getByText("Label").className).toContain("mb-4");
  });
});
