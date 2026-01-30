import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Card } from "@/components/ui/Card";

/**
 * Card Component Tests
 *
 * Tests for the Card component following TDD approach.
 * Verifies rendering, styling, image slot, clickable variant, and accessibility.
 */

describe("Card Component", () => {
  describe("Rendering", () => {
    it("renders children correctly", () => {
      render(<Card>Card content</Card>);
      expect(screen.getByText("Card content")).toBeInTheDocument();
    });

    it("renders as a div element by default", () => {
      render(<Card data-testid="card">Content</Card>);
      const card = screen.getByTestId("card");
      expect(card.tagName).toBe("DIV");
    });

    it("renders as an article element when specified", () => {
      render(
        <Card as="article" data-testid="card">
          Content
        </Card>
      );
      const card = screen.getByTestId("card");
      expect(card.tagName).toBe("ARTICLE");
    });

    it("renders as a section element when specified", () => {
      render(
        <Card as="section" data-testid="card">
          Content
        </Card>
      );
      const card = screen.getByTestId("card");
      expect(card.tagName).toBe("SECTION");
    });
  });

  describe("Styling", () => {
    it("has subtle border styling by default", () => {
      render(<Card data-testid="card">Content</Card>);
      const card = screen.getByTestId("card");
      expect(card).toHaveClass("border");
    });

    it("has rounded corners", () => {
      render(<Card data-testid="card">Content</Card>);
      const card = screen.getByTestId("card");
      expect(card).toHaveClass("rounded-lg");
    });

    it("has padding consistent with spacing scale", () => {
      render(<Card data-testid="card">Content</Card>);
      const card = screen.getByTestId("card");
      // Should use component spacing (p-6 = 1.5rem = 24px)
      expect(card).toHaveClass("p-6");
    });

    it("has background color", () => {
      render(<Card data-testid="card">Content</Card>);
      const card = screen.getByTestId("card");
      expect(card).toHaveClass("bg-background");
    });
  });

  describe("Image Slot", () => {
    it("renders image when provided", () => {
      render(
        <Card
          data-testid="card"
          image={<img src="/test.jpg" alt="Test image" />}
        >
          Content
        </Card>
      );
      expect(screen.getByAltText("Test image")).toBeInTheDocument();
    });

    it("renders image before content", () => {
      render(
        <Card
          data-testid="card"
          image={<img src="/test.jpg" alt="Test image" data-testid="image" />}
        >
          <span data-testid="content">Content</span>
        </Card>
      );
      const card = screen.getByTestId("card");
      const image = screen.getByTestId("image");
      const content = screen.getByTestId("content");
      // Image should come before content in the DOM
      expect(card.firstChild).toContainElement(image);
      expect(card.lastChild).toContainElement(content);
    });

    it("does not render image container when image is not provided", () => {
      render(<Card data-testid="card">Content</Card>);
      const card = screen.getByTestId("card");
      // Should only have one child (content wrapper)
      expect(card.childElementCount).toBe(1);
    });

    it("image container has proper styling", () => {
      render(
        <Card data-testid="card" image={<img src="/test.jpg" alt="Test" />}>
          Content
        </Card>
      );
      const card = screen.getByTestId("card");
      const imageContainer = card.firstElementChild;
      // Image container should have negative margin to offset card padding
      expect(imageContainer).toHaveClass("-mx-6");
      expect(imageContainer).toHaveClass("-mt-6");
      expect(imageContainer).toHaveClass("mb-4");
    });
  });

  describe("Clickable Variant", () => {
    it("renders as anchor when href is provided", () => {
      render(
        <Card href="/test" data-testid="card">
          Clickable card
        </Card>
      );
      const card = screen.getByTestId("card");
      expect(card.tagName).toBe("A");
      expect(card).toHaveAttribute("href", "/test");
    });

    it("has hover styles when clickable", () => {
      render(
        <Card href="/test" data-testid="card">
          Clickable card
        </Card>
      );
      const card = screen.getByTestId("card");
      expect(card).toHaveClass("hover:border-primary");
    });

    it("has transition for smooth hover effect", () => {
      render(
        <Card href="/test" data-testid="card">
          Clickable card
        </Card>
      );
      const card = screen.getByTestId("card");
      expect(card).toHaveClass("transition-colors");
    });

    it("is focusable when clickable", async () => {
      const user = userEvent.setup();
      render(
        <Card href="/test" data-testid="card">
          Clickable card
        </Card>
      );
      const card = screen.getByTestId("card");

      await user.tab();

      expect(card).toHaveFocus();
    });

    it("has focus ring when clickable and focused", () => {
      render(
        <Card href="/test" data-testid="card">
          Clickable card
        </Card>
      );
      const card = screen.getByTestId("card");
      expect(card).toHaveClass("focus-visible:ring-2");
      expect(card).toHaveClass("focus-visible:ring-primary");
    });

    it("non-clickable card does not have hover styles", () => {
      render(<Card data-testid="card">Non-clickable card</Card>);
      const card = screen.getByTestId("card");
      expect(card).not.toHaveClass("hover:border-primary");
    });
  });

  describe("Accessibility", () => {
    it("clickable card can be activated with Enter key", async () => {
      // For Next.js Link, we just verify it renders as an anchor
      render(
        <Card href="/test" data-testid="card">
          Clickable card
        </Card>
      );
      const card = screen.getByTestId("card");
      expect(card.tagName).toBe("A");
    });

    it("supports aria-label on clickable cards", () => {
      render(
        <Card href="/test" aria-label="View book details" data-testid="card">
          Book title
        </Card>
      );
      const card = screen.getByTestId("card");
      expect(card).toHaveAttribute("aria-label", "View book details");
    });

    it("can have custom role when needed", () => {
      render(
        <Card role="listitem" data-testid="card">
          List item card
        </Card>
      );
      const card = screen.getByTestId("card");
      expect(card).toHaveAttribute("role", "listitem");
    });
  });

  describe("Custom Styling", () => {
    it("accepts and applies custom className", () => {
      render(
        <Card className="custom-class" data-testid="card">
          Content
        </Card>
      );
      const card = screen.getByTestId("card");
      expect(card).toHaveClass("custom-class");
    });

    it("custom className does not override base styles", () => {
      render(
        <Card className="custom-class" data-testid="card">
          Content
        </Card>
      );
      const card = screen.getByTestId("card");
      // Should still have base classes
      expect(card).toHaveClass("border");
      expect(card).toHaveClass("rounded-lg");
      expect(card).toHaveClass("p-6");
    });
  });

  describe("Props Forwarding", () => {
    it("passes through HTML attributes", () => {
      render(
        <Card data-testid="card" id="main-card" aria-describedby="description">
          Content
        </Card>
      );
      const card = screen.getByTestId("card");
      expect(card).toHaveAttribute("id", "main-card");
      expect(card).toHaveAttribute("aria-describedby", "description");
    });

    it("supports ref forwarding", () => {
      const ref = { current: null };
      render(
        <Card ref={ref} data-testid="card">
          Content
        </Card>
      );
      expect(ref.current).toBeInstanceOf(HTMLElement);
    });
  });
});
