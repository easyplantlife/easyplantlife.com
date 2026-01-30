import { render, screen } from "@testing-library/react";
import { Container } from "@/components/ui/Container";

/**
 * Container Component Tests
 *
 * Tests for the layout Container component following TDD approach.
 * Verifies variants, responsive padding, centering, and accessibility.
 */

describe("Container Component", () => {
  describe("Rendering", () => {
    it("renders children correctly", () => {
      render(<Container>Test content</Container>);
      expect(screen.getByText("Test content")).toBeInTheDocument();
    });

    it("renders as a div element by default", () => {
      render(<Container data-testid="container">Content</Container>);
      const container = screen.getByTestId("container");
      expect(container.tagName).toBe("DIV");
    });

    it("renders with semantic HTML element when specified", () => {
      render(
        <Container as="section" data-testid="container">
          Content
        </Container>
      );
      const container = screen.getByTestId("container");
      expect(container.tagName).toBe("SECTION");
    });

    it("renders with main element when specified", () => {
      render(
        <Container as="main" data-testid="container">
          Content
        </Container>
      );
      const container = screen.getByTestId("container");
      expect(container.tagName).toBe("MAIN");
    });

    it("renders with article element when specified", () => {
      render(
        <Container as="article" data-testid="container">
          Content
        </Container>
      );
      const container = screen.getByTestId("container");
      expect(container.tagName).toBe("ARTICLE");
    });
  });

  describe("Variants", () => {
    it("renders with default variant by default", () => {
      render(<Container data-testid="container">Content</Container>);
      const container = screen.getByTestId("container");
      // Default variant should have standard max-width
      expect(container).toHaveClass("max-w-6xl");
    });

    it("renders with prose variant for reading-optimized width", () => {
      render(
        <Container variant="prose" data-testid="container">
          Content
        </Container>
      );
      const container = screen.getByTestId("container");
      // Prose variant should have narrower max-width optimized for reading (~65ch)
      expect(container).toHaveClass("max-w-prose");
    });

    it("renders with wide variant for full layouts", () => {
      render(
        <Container variant="wide" data-testid="container">
          Content
        </Container>
      );
      const container = screen.getByTestId("container");
      // Wide variant should have larger max-width
      expect(container).toHaveClass("max-w-7xl");
    });

    it("renders with full variant for edge-to-edge content", () => {
      render(
        <Container variant="full" data-testid="container">
          Content
        </Container>
      );
      const container = screen.getByTestId("container");
      // Full variant should have no max-width restriction
      expect(container).not.toHaveClass("max-w-6xl");
      expect(container).not.toHaveClass("max-w-prose");
      expect(container).not.toHaveClass("max-w-7xl");
    });
  });

  describe("Centering", () => {
    it("centers content horizontally by default", () => {
      render(<Container data-testid="container">Content</Container>);
      const container = screen.getByTestId("container");
      expect(container).toHaveClass("mx-auto");
    });

    it("centers content for all variants", () => {
      const { rerender } = render(
        <Container variant="prose" data-testid="container">
          Content
        </Container>
      );
      expect(screen.getByTestId("container")).toHaveClass("mx-auto");

      rerender(
        <Container variant="wide" data-testid="container">
          Content
        </Container>
      );
      expect(screen.getByTestId("container")).toHaveClass("mx-auto");
    });
  });

  describe("Responsive Padding", () => {
    it("has horizontal padding for mobile viewports", () => {
      render(<Container data-testid="container">Content</Container>);
      const container = screen.getByTestId("container");
      // Should have base horizontal padding
      expect(container).toHaveClass("px-4");
    });

    it("has larger horizontal padding for larger viewports", () => {
      render(<Container data-testid="container">Content</Container>);
      const container = screen.getByTestId("container");
      // Should have responsive padding classes
      expect(container).toHaveClass("md:px-6");
      expect(container).toHaveClass("lg:px-8");
    });

    it("full variant still has horizontal padding", () => {
      render(
        <Container variant="full" data-testid="container">
          Content
        </Container>
      );
      const container = screen.getByTestId("container");
      expect(container).toHaveClass("px-4");
    });
  });

  describe("Custom Styling", () => {
    it("accepts and applies custom className", () => {
      render(
        <Container className="custom-class bg-primary" data-testid="container">
          Content
        </Container>
      );
      const container = screen.getByTestId("container");
      expect(container).toHaveClass("custom-class");
      expect(container).toHaveClass("bg-primary");
    });

    it("custom className does not override base styles", () => {
      render(
        <Container className="custom-class" data-testid="container">
          Content
        </Container>
      );
      const container = screen.getByTestId("container");
      // Should still have base classes
      expect(container).toHaveClass("mx-auto");
      expect(container).toHaveClass("px-4");
    });
  });

  describe("Props Forwarding", () => {
    it("passes through HTML attributes", () => {
      render(
        <Container
          data-testid="container"
          id="main-container"
          aria-label="Main content"
        >
          Content
        </Container>
      );
      const container = screen.getByTestId("container");
      expect(container).toHaveAttribute("id", "main-container");
      expect(container).toHaveAttribute("aria-label", "Main content");
    });

    it("supports ref forwarding", () => {
      const ref = { current: null };
      render(
        <Container ref={ref} data-testid="container">
          Content
        </Container>
      );
      expect(ref.current).toBeInstanceOf(HTMLElement);
    });
  });
});
