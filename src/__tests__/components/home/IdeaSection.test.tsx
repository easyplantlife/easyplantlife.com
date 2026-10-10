import { render, screen } from "@testing-library/react";
import { IdeaSection } from "@/components/home/IdeaSection";

describe("IdeaSection", () => {
  it("renders a section labelled by its heading", () => {
    render(<IdeaSection />);
    const section = screen.getByTestId("idea-section");
    expect(section.tagName).toBe("SECTION");
    expect(section).toHaveAttribute("aria-labelledby", "idea-title");
    expect(screen.getByRole("region", { name: /simplicity/i })).toBe(section);
  });

  it("renders the eyebrow", () => {
    render(<IdeaSection />);
    expect(screen.getByText("The idea")).toBeInTheDocument();
  });

  it("renders the three values as one h2 on separate lines", () => {
    render(<IdeaSection />);
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveAttribute("id", "idea-title");
    expect(heading.textContent).toBe(
      "Simplicity over optimization.\nSustainability over perfection.\nCalm over urgency."
    );
    expect(heading.className).toContain("whitespace-pre-line");
  });

  it("does not use a grid of value cards", () => {
    render(<IdeaSection />);
    expect(screen.getAllByRole("heading")).toHaveLength(1);
  });

  it("links to the about page", () => {
    render(<IdeaSection />);
    const link = screen.getByRole("link", {
      name: "More about why this exists",
    });
    expect(link).toHaveAttribute("href", "/about");
  });

  it("explains the idea in two short paragraphs", () => {
    render(<IdeaSection />);
    expect(screen.getByText(/most days are average/i)).toBeInTheDocument();
    expect(
      screen.getByText(/the version that survives real life/i)
    ).toBeInTheDocument();
  });
});
