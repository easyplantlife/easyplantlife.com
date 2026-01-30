import { render, screen } from "@testing-library/react";
import { Text } from "@/components/ui/Text";

/**
 * Text Component Tests
 *
 * Tests for the reusable Text component following TDD approach.
 * Verifies size variants, semantic HTML (p, span), color variants, and className support.
 */

describe("Text Component", () => {
  describe("Rendering", () => {
    it("renders children correctly", () => {
      render(<Text>Hello World</Text>);
      expect(screen.getByText("Hello World")).toBeInTheDocument();
    });

    it("renders as a paragraph element by default", () => {
      render(<Text>Paragraph text</Text>);
      const text = screen.getByText("Paragraph text");
      expect(text.tagName).toBe("P");
    });
  });

  describe("Semantic HTML Tags", () => {
    it("renders as paragraph when as='p'", () => {
      render(<Text as="p">Paragraph</Text>);
      const text = screen.getByText("Paragraph");
      expect(text.tagName).toBe("P");
    });

    it("renders as span when as='span'", () => {
      render(<Text as="span">Span text</Text>);
      const text = screen.getByText("Span text");
      expect(text.tagName).toBe("SPAN");
    });
  });

  describe("Size Variants", () => {
    it("renders with base size by default", () => {
      render(<Text>Default size</Text>);
      const text = screen.getByText("Default size");
      expect(text).toHaveClass("text-base");
    });

    it("renders with xs size", () => {
      render(<Text size="xs">Extra small</Text>);
      const text = screen.getByText("Extra small");
      expect(text).toHaveClass("text-xs");
    });

    it("renders with sm size", () => {
      render(<Text size="sm">Small</Text>);
      const text = screen.getByText("Small");
      expect(text).toHaveClass("text-sm");
    });

    it("renders with base size explicitly", () => {
      render(<Text size="base">Base</Text>);
      const text = screen.getByText("Base");
      expect(text).toHaveClass("text-base");
    });

    it("renders with lg size", () => {
      render(<Text size="lg">Large</Text>);
      const text = screen.getByText("Large");
      expect(text).toHaveClass("text-lg");
    });

    it("renders with xl size", () => {
      render(<Text size="xl">Extra large</Text>);
      const text = screen.getByText("Extra large");
      expect(text).toHaveClass("text-xl");
    });

    it("renders with 2xl size", () => {
      render(<Text size="2xl">2XL</Text>);
      const text = screen.getByText("2XL");
      expect(text).toHaveClass("text-2xl");
    });
  });

  describe("Styling", () => {
    it("applies body font family", () => {
      render(<Text>Styled text</Text>);
      const text = screen.getByText("Styled text");
      expect(text).toHaveClass("font-body");
    });

    it("applies relaxed line height for body text", () => {
      render(<Text>Body text</Text>);
      const text = screen.getByText("Body text");
      expect(text).toHaveClass("leading-relaxed");
    });
  });

  describe("Color Variants", () => {
    it("renders with default color", () => {
      render(<Text>Default color</Text>);
      const text = screen.getByText("Default color");
      expect(text).toHaveClass("text-text");
    });

    it("renders with secondary color variant", () => {
      render(<Text color="secondary">Secondary</Text>);
      const text = screen.getByText("Secondary");
      expect(text).toHaveClass("text-text-secondary");
    });

    it("renders with accent color variant", () => {
      render(<Text color="accent">Accent</Text>);
      const text = screen.getByText("Accent");
      expect(text).toHaveClass("text-text-accent");
    });

    it("renders with inverse color variant", () => {
      render(<Text color="inverse">Inverse</Text>);
      const text = screen.getByText("Inverse");
      expect(text).toHaveClass("text-text-inverse");
    });
  });

  describe("Custom ClassName", () => {
    it("accepts and applies custom className", () => {
      render(<Text className="custom-class">Custom</Text>);
      const text = screen.getByText("Custom");
      expect(text).toHaveClass("custom-class");
    });

    it("preserves default styles when custom className is added", () => {
      render(<Text className="custom-class">Custom</Text>);
      const text = screen.getByText("Custom");
      expect(text).toHaveClass("font-body");
      expect(text).toHaveClass("custom-class");
    });
  });

  describe("HTML Attributes", () => {
    it("passes through additional HTML attributes", () => {
      render(
        <Text data-testid="custom-text" id="my-text">
          Attributed
        </Text>
      );
      const text = screen.getByText("Attributed");
      expect(text).toHaveAttribute("data-testid", "custom-text");
      expect(text).toHaveAttribute("id", "my-text");
    });
  });

  describe("Combined Props", () => {
    it("renders with multiple props correctly", () => {
      render(
        <Text as="span" size="lg" color="accent" className="mt-4">
          Combined props
        </Text>
      );
      const text = screen.getByText("Combined props");
      expect(text.tagName).toBe("SPAN");
      expect(text).toHaveClass("text-lg");
      expect(text).toHaveClass("text-text-accent");
      expect(text).toHaveClass("mt-4");
    });
  });
});
