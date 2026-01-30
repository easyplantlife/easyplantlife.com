import { render, screen } from "@testing-library/react";
import { Heading } from "@/components/ui/Heading";

/**
 * Heading Component Tests
 *
 * Tests for the reusable Heading component following TDD approach.
 * Verifies semantic HTML output, levels 1-6, color variants, and className support.
 */

describe("Heading Component", () => {
  describe("Rendering", () => {
    it("renders children correctly", () => {
      render(<Heading level={1}>Hello World</Heading>);
      expect(screen.getByRole("heading")).toHaveTextContent("Hello World");
    });

    it("renders as a heading element", () => {
      render(<Heading level={1}>Heading</Heading>);
      expect(screen.getByRole("heading")).toBeInTheDocument();
    });
  });

  describe("Heading Levels", () => {
    it("renders h1 when level={1}", () => {
      render(<Heading level={1}>H1 Heading</Heading>);
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe("H1");
    });

    it("renders h2 when level={2}", () => {
      render(<Heading level={2}>H2 Heading</Heading>);
      const heading = screen.getByRole("heading", { level: 2 });
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe("H2");
    });

    it("renders h3 when level={3}", () => {
      render(<Heading level={3}>H3 Heading</Heading>);
      const heading = screen.getByRole("heading", { level: 3 });
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe("H3");
    });

    it("renders h4 when level={4}", () => {
      render(<Heading level={4}>H4 Heading</Heading>);
      const heading = screen.getByRole("heading", { level: 4 });
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe("H4");
    });

    it("renders h5 when level={5}", () => {
      render(<Heading level={5}>H5 Heading</Heading>);
      const heading = screen.getByRole("heading", { level: 5 });
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe("H5");
    });

    it("renders h6 when level={6}", () => {
      render(<Heading level={6}>H6 Heading</Heading>);
      const heading = screen.getByRole("heading", { level: 6 });
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe("H6");
    });
  });

  describe("Styling", () => {
    it("applies heading font family", () => {
      render(<Heading level={1}>Styled Heading</Heading>);
      const heading = screen.getByRole("heading");
      expect(heading).toHaveClass("font-heading");
    });

    it("applies correct font size for h1", () => {
      render(<Heading level={1}>H1</Heading>);
      const heading = screen.getByRole("heading");
      expect(heading).toHaveClass("text-5xl");
    });

    it("applies correct font size for h2", () => {
      render(<Heading level={2}>H2</Heading>);
      const heading = screen.getByRole("heading");
      expect(heading).toHaveClass("text-4xl");
    });

    it("applies correct font size for h3", () => {
      render(<Heading level={3}>H3</Heading>);
      const heading = screen.getByRole("heading");
      expect(heading).toHaveClass("text-3xl");
    });

    it("applies correct font size for h4", () => {
      render(<Heading level={4}>H4</Heading>);
      const heading = screen.getByRole("heading");
      expect(heading).toHaveClass("text-2xl");
    });

    it("applies correct font size for h5", () => {
      render(<Heading level={5}>H5</Heading>);
      const heading = screen.getByRole("heading");
      expect(heading).toHaveClass("text-xl");
    });

    it("applies correct font size for h6", () => {
      render(<Heading level={6}>H6</Heading>);
      const heading = screen.getByRole("heading");
      expect(heading).toHaveClass("text-lg");
    });

    it("applies tight line height for headings", () => {
      render(<Heading level={1}>Heading</Heading>);
      const heading = screen.getByRole("heading");
      expect(heading).toHaveClass("leading-tight");
    });
  });

  describe("Color Variants", () => {
    it("renders with default color", () => {
      render(<Heading level={1}>Default</Heading>);
      const heading = screen.getByRole("heading");
      expect(heading).toHaveClass("text-text");
    });

    it("renders with secondary color variant", () => {
      render(
        <Heading level={1} color="secondary">
          Secondary
        </Heading>
      );
      const heading = screen.getByRole("heading");
      expect(heading).toHaveClass("text-text-secondary");
    });

    it("renders with accent color variant", () => {
      render(
        <Heading level={1} color="accent">
          Accent
        </Heading>
      );
      const heading = screen.getByRole("heading");
      expect(heading).toHaveClass("text-text-accent");
    });

    it("renders with inverse color variant", () => {
      render(
        <Heading level={1} color="inverse">
          Inverse
        </Heading>
      );
      const heading = screen.getByRole("heading");
      expect(heading).toHaveClass("text-text-inverse");
    });
  });

  describe("Custom ClassName", () => {
    it("accepts and applies custom className", () => {
      render(
        <Heading level={1} className="custom-class">
          Custom
        </Heading>
      );
      const heading = screen.getByRole("heading");
      expect(heading).toHaveClass("custom-class");
    });

    it("preserves default styles when custom className is added", () => {
      render(
        <Heading level={1} className="custom-class">
          Custom
        </Heading>
      );
      const heading = screen.getByRole("heading");
      expect(heading).toHaveClass("font-heading");
      expect(heading).toHaveClass("custom-class");
    });
  });

  describe("HTML Attributes", () => {
    it("passes through additional HTML attributes", () => {
      render(
        <Heading level={1} data-testid="custom-heading" id="my-heading">
          Attributed
        </Heading>
      );
      const heading = screen.getByRole("heading");
      expect(heading).toHaveAttribute("data-testid", "custom-heading");
      expect(heading).toHaveAttribute("id", "my-heading");
    });
  });
});
