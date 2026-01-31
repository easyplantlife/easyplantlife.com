import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Link } from "@/components/ui/Link";
import * as analytics from "@/lib/analytics/events";

// Mock the analytics module
jest.mock("@/lib/analytics/events", () => ({
  trackOutboundClick: jest.fn(),
}));

/**
 * Link Component Tests
 *
 * Tests for the styled Link component following TDD approach.
 * Verifies internal/external link handling, styling, and accessibility.
 */

describe("Link Component", () => {
  describe("Rendering", () => {
    it("renders children correctly", () => {
      render(<Link href="/about">About Us</Link>);
      expect(screen.getByRole("link")).toHaveTextContent("About Us");
    });

    it("renders as an anchor element", () => {
      render(<Link href="/about">Link</Link>);
      expect(screen.getByRole("link")).toBeInTheDocument();
    });

    it("applies href attribute correctly", () => {
      render(<Link href="/contact">Contact</Link>);
      expect(screen.getByRole("link")).toHaveAttribute("href", "/contact");
    });
  });

  describe("Internal Links", () => {
    it("uses Next.js Link for internal absolute paths", () => {
      render(<Link href="/about">About</Link>);
      const link = screen.getByRole("link");
      // Internal links should not have target="_blank"
      expect(link).not.toHaveAttribute("target", "_blank");
      expect(link).not.toHaveAttribute("rel");
    });

    it("uses Next.js Link for relative paths", () => {
      render(<Link href="about">About</Link>);
      const link = screen.getByRole("link");
      expect(link).not.toHaveAttribute("target", "_blank");
    });

    it("handles hash links as internal", () => {
      render(<Link href="#section">Jump to section</Link>);
      const link = screen.getByRole("link");
      expect(link).not.toHaveAttribute("target", "_blank");
    });
  });

  describe("External Links", () => {
    it("opens external https links in new tab", () => {
      render(<Link href="https://medium.com/article">Read on Medium</Link>);
      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("target", "_blank");
    });

    it("opens external http links in new tab", () => {
      render(<Link href="http://example.com">Example</Link>);
      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("target", "_blank");
    });

    it("has rel noopener noreferrer for external links", () => {
      render(<Link href="https://medium.com/article">Read on Medium</Link>);
      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("handles mailto links as external", () => {
      render(<Link href="mailto:hello@easyplantlife.com">Email Us</Link>);
      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("handles tel links as external", () => {
      render(<Link href="tel:+1234567890">Call Us</Link>);
      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  describe("Styling", () => {
    it("has text accent color for links", () => {
      render(<Link href="/about">About</Link>);
      const link = screen.getByRole("link");
      expect(link).toHaveClass("text-text-accent");
    });

    it("has subtle underline styling", () => {
      render(<Link href="/about">About</Link>);
      const link = screen.getByRole("link");
      // Using underline-offset for subtle appearance
      expect(link).toHaveClass("underline");
      expect(link).toHaveClass("underline-offset-2");
    });

    it("has hover state defined", () => {
      render(<Link href="/about">About</Link>);
      const link = screen.getByRole("link");
      // Hover changes to darker green
      expect(link).toHaveClass("hover:text-primary-dark");
    });

    it("has transition for smooth hover effect", () => {
      render(<Link href="/about">About</Link>);
      const link = screen.getByRole("link");
      expect(link).toHaveClass("transition-colors");
    });

    it("accepts and applies additional className", () => {
      render(
        <Link href="/about" className="custom-class">
          About
        </Link>
      );
      const link = screen.getByRole("link");
      expect(link).toHaveClass("custom-class");
    });
  });

  describe("Accessibility", () => {
    it("is focusable via keyboard", async () => {
      const user = userEvent.setup();
      render(<Link href="/about">Focusable Link</Link>);
      const link = screen.getByRole("link");

      await user.tab();

      expect(link).toHaveFocus();
    });

    it("has visible focus ring when focused", async () => {
      const user = userEvent.setup();
      render(<Link href="/about">Focusable Link</Link>);
      const link = screen.getByRole("link");

      await user.tab();

      expect(link).toHaveClass("focus-visible:ring-2");
      expect(link).toHaveClass("focus-visible:outline-none");
    });

    it("can be activated via keyboard Enter", async () => {
      // Note: We can't test actual navigation, but we can verify the link is properly formed
      render(<Link href="/about">Press Enter</Link>);
      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "/about");
    });

    it("passes through aria-label attribute", () => {
      render(
        <Link href="/about" aria-label="Learn more about us">
          About
        </Link>
      );
      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("aria-label", "Learn more about us");
    });

    it("passes through data-testid attribute", () => {
      render(
        <Link href="/about" data-testid="about-link">
          About
        </Link>
      );
      expect(screen.getByTestId("about-link")).toBeInTheDocument();
    });
  });

  describe("TypeScript Props", () => {
    it("forwards ref to the anchor element", () => {
      const ref = { current: null as HTMLAnchorElement | null };
      render(
        <Link href="/about" ref={ref}>
          About
        </Link>
      );
      expect(ref.current).toBeInstanceOf(HTMLAnchorElement);
    });

    it("accepts all standard anchor attributes", () => {
      render(
        <Link href="/about" title="About page" id="about-link">
          About
        </Link>
      );
      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("title", "About page");
      expect(link).toHaveAttribute("id", "about-link");
    });
  });

  describe("Analytics Tracking (M10-02)", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("tracks outbound click when external link is clicked", async () => {
      const user = userEvent.setup();
      render(
        <Link href="https://medium.com/@easyplantlife/article">
          Read on Medium
        </Link>
      );
      const link = screen.getByRole("link");

      await user.click(link);

      expect(analytics.trackOutboundClick).toHaveBeenCalledWith(
        "https://medium.com/@easyplantlife/article",
        "Read on Medium"
      );
    });

    it("tracks outbound click for https links", async () => {
      const user = userEvent.setup();
      render(<Link href="https://amazon.com/dp/123456">Buy Now</Link>);
      const link = screen.getByRole("link");

      await user.click(link);

      expect(analytics.trackOutboundClick).toHaveBeenCalledWith(
        "https://amazon.com/dp/123456",
        "Buy Now"
      );
    });

    it("tracks outbound click for http links", async () => {
      const user = userEvent.setup();
      render(<Link href="http://example.com">Example</Link>);
      const link = screen.getByRole("link");

      await user.click(link);

      expect(analytics.trackOutboundClick).toHaveBeenCalledWith(
        "http://example.com",
        "Example"
      );
    });

    it("does not track internal link clicks", async () => {
      const user = userEvent.setup();
      render(<Link href="/about">About Us</Link>);
      const link = screen.getByRole("link");

      await user.click(link);

      expect(analytics.trackOutboundClick).not.toHaveBeenCalled();
    });

    it("does not track hash link clicks", async () => {
      const user = userEvent.setup();
      render(<Link href="#section">Jump to section</Link>);
      const link = screen.getByRole("link");

      await user.click(link);

      expect(analytics.trackOutboundClick).not.toHaveBeenCalled();
    });

    it("handles links with complex child elements", async () => {
      const user = userEvent.setup();
      render(
        <Link href="https://medium.com/article">
          <span>Read</span> <strong>on Medium</strong>
        </Link>
      );
      const link = screen.getByRole("link");

      await user.click(link);

      expect(analytics.trackOutboundClick).toHaveBeenCalledWith(
        "https://medium.com/article",
        "Read on Medium"
      );
    });
  });
});
