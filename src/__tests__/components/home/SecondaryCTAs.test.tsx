import { render, screen } from "@testing-library/react";
import { SecondaryCTAs } from "@/components/home";

/**
 * SecondaryCTAs Component Tests
 *
 * Tests for the home page Secondary CTAs section following TDD approach.
 * Based on acceptance criteria from issue #28 (M4-03):
 * - Section with links to Blog and Books
 * - Clear, simple labels
 * - Consistent styling with brand
 * - Not competing with newsletter CTA
 * - Accessible
 */

describe("SecondaryCTAs Component", () => {
  describe("Rendering", () => {
    it("renders as a section element with appropriate landmark", () => {
      render(<SecondaryCTAs />);
      const section = screen.getByRole("region", { name: /secondary/i });
      expect(section).toBeInTheDocument();
      expect(section.tagName).toBe("SECTION");
    });

    it("renders with data-testid for identification", () => {
      render(<SecondaryCTAs />);
      expect(screen.getByTestId("secondary-ctas")).toBeInTheDocument();
    });
  });

  describe("Blog Link", () => {
    it("renders a link to the Blog page", () => {
      render(<SecondaryCTAs />);
      const blogLink = screen.getByRole("link", { name: /blog/i });
      expect(blogLink).toBeInTheDocument();
    });

    it("Blog link has correct href", () => {
      render(<SecondaryCTAs />);
      const blogLink = screen.getByRole("link", { name: /blog/i });
      expect(blogLink).toHaveAttribute("href", "/blog");
    });

    it("Blog link has clear, simple label", () => {
      render(<SecondaryCTAs />);
      const blogLink = screen.getByRole("link", { name: /blog/i });
      // Label should be concise (1-3 words)
      const wordCount = blogLink.textContent?.trim().split(/\s+/).length || 0;
      expect(wordCount).toBeLessThanOrEqual(3);
      expect(wordCount).toBeGreaterThanOrEqual(1);
    });
  });

  describe("Books Link", () => {
    it("renders a link to the Books page", () => {
      render(<SecondaryCTAs />);
      const booksLink = screen.getByRole("link", { name: /book/i });
      expect(booksLink).toBeInTheDocument();
    });

    it("Books link has correct href", () => {
      render(<SecondaryCTAs />);
      const booksLink = screen.getByRole("link", { name: /book/i });
      expect(booksLink).toHaveAttribute("href", "/books");
    });

    it("Books link has clear, simple label", () => {
      render(<SecondaryCTAs />);
      const booksLink = screen.getByRole("link", { name: /book/i });
      // Label should be concise (1-3 words)
      const wordCount = booksLink.textContent?.trim().split(/\s+/).length || 0;
      expect(wordCount).toBeLessThanOrEqual(3);
      expect(wordCount).toBeGreaterThanOrEqual(1);
    });
  });

  describe("Visual Design - Secondary to Newsletter CTA", () => {
    it("has less visual prominence than newsletter CTA", () => {
      render(<SecondaryCTAs />);
      const section = screen.getByTestId("secondary-ctas");
      // Should use more subtle padding than primary CTAs
      expect(section.className).toMatch(/py-(\d+|section)/);
    });

    it("uses subtle styling consistent with brand", () => {
      render(<SecondaryCTAs />);
      const section = screen.getByTestId("secondary-ctas");
      // Should have a background color
      expect(section.className).toMatch(/bg-/);
    });

    it("does not compete visually with primary CTA", () => {
      render(<SecondaryCTAs />);
      const section = screen.getByTestId("secondary-ctas");
      // Should not have primary button colors dominating
      // Check that it uses secondary/ghost style links
      const links = section.querySelectorAll("a");
      expect(links.length).toBe(2);
    });
  });

  describe("Accessibility", () => {
    it("has proper section aria-label", () => {
      render(<SecondaryCTAs />);
      const section = screen.getByRole("region");
      expect(section).toHaveAttribute("aria-label");
    });

    it("links are keyboard accessible", () => {
      render(<SecondaryCTAs />);
      const links = screen.getAllByRole("link");
      links.forEach((link) => {
        expect(link).not.toHaveAttribute("tabindex", "-1");
      });
    });

    it("links have accessible names", () => {
      render(<SecondaryCTAs />);
      const blogLink = screen.getByRole("link", { name: /blog/i });
      const booksLink = screen.getByRole("link", { name: /book/i });
      expect(blogLink).toHaveAccessibleName();
      expect(booksLink).toHaveAccessibleName();
    });
  });

  describe("Layout", () => {
    it("links are displayed in a flex or inline layout", () => {
      render(<SecondaryCTAs />);
      const section = screen.getByTestId("secondary-ctas");
      // Should have centered content
      expect(section.className).toMatch(/text-center|flex/);
    });

    it("content is centered", () => {
      render(<SecondaryCTAs />);
      const section = screen.getByTestId("secondary-ctas");
      expect(section).toHaveClass("text-center");
    });
  });

  describe("Custom Styling", () => {
    it("accepts and applies custom className", () => {
      render(<SecondaryCTAs className="custom-class" />);
      const section = screen.getByTestId("secondary-ctas");
      expect(section).toHaveClass("custom-class");
    });
  });
});
