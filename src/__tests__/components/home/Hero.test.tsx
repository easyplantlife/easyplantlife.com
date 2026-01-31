import { render, screen } from "@testing-library/react";
import { Hero } from "@/components/home/Hero";

/**
 * Hero Component Tests
 *
 * Tests for the home page Hero section following TDD approach.
 * Based on acceptance criteria from issue #26 (M4-01):
 * - Logo prominently displayed
 * - Short tagline (2-4 words) visible immediately
 * - Brief brand explanation (2-3 sentences max)
 * - Generous white space
 * - No feature lists or complex layouts
 * - Feels "calm and intentional"
 */

describe("Hero Component", () => {
  describe("Rendering", () => {
    it("renders as a section element with appropriate landmark", () => {
      render(<Hero />);
      const hero = screen.getByRole("region", { name: /hero/i });
      expect(hero).toBeInTheDocument();
      expect(hero.tagName).toBe("SECTION");
    });

    it("renders with data-testid for identification", () => {
      render(<Hero />);
      expect(screen.getByTestId("hero-section")).toBeInTheDocument();
    });
  });

  describe("Logo Display", () => {
    it("displays the brand name prominently", () => {
      render(<Hero />);
      const logo = screen.getByRole("img", { name: /easy plant life/i });
      expect(logo).toBeInTheDocument();
    });

    it("renders logo with heading structure for prominence", () => {
      render(<Hero />);
      const h1 = screen.getByRole("heading", { level: 1, name: /easy plant life/i });
      expect(h1).toHaveClass("font-heading");
    });

    it("logo is visually prominent with appropriate size", () => {
      render(<Hero />);
      const logo = screen.getByRole("img", { name: /easy plant life/i });
      // Should have responsive width classes for prominence
      expect(logo.className).toMatch(/w-64|md:w-80|lg:w-96/);
    });
  });

  describe("Tagline Display", () => {
    it("displays a short tagline", () => {
      render(<Hero />);
      const tagline = screen.getByTestId("hero-tagline");
      expect(tagline).toBeInTheDocument();
    });

    it("tagline is between 2-4 words", () => {
      render(<Hero />);
      const tagline = screen.getByTestId("hero-tagline");
      const wordCount = tagline.textContent?.trim().split(/\s+/).length || 0;
      expect(wordCount).toBeGreaterThanOrEqual(2);
      expect(wordCount).toBeLessThanOrEqual(4);
    });

    it("tagline is immediately visible (not hidden)", () => {
      render(<Hero />);
      const tagline = screen.getByTestId("hero-tagline");
      expect(tagline).toBeVisible();
    });
  });

  describe("Brand Explanation", () => {
    it("displays a brief brand explanation", () => {
      render(<Hero />);
      const explanation = screen.getByTestId("hero-explanation");
      expect(explanation).toBeInTheDocument();
    });

    it("explanation has no more than 3 sentences", () => {
      render(<Hero />);
      const explanation = screen.getByTestId("hero-explanation");
      const text = explanation.textContent || "";
      // Count sentences by looking for sentence-ending punctuation
      const sentenceCount = (text.match(/[.!?]+/g) || []).length;
      expect(sentenceCount).toBeLessThanOrEqual(3);
      expect(sentenceCount).toBeGreaterThanOrEqual(1);
    });

    it("explanation uses readable text size", () => {
      render(<Hero />);
      const explanation = screen.getByTestId("hero-explanation");
      // Should use body text sizing
      expect(explanation.className).toMatch(/text-(base|lg|xl)/);
    });
  });

  describe("Visual Design - White Space", () => {
    it("has generous vertical padding", () => {
      render(<Hero />);
      const hero = screen.getByTestId("hero-section");
      // Should have vertical padding classes
      expect(hero.className).toMatch(/py-(\d+|section)/);
    });

    it("content is centered for balance", () => {
      render(<Hero />);
      const hero = screen.getByTestId("hero-section");
      expect(hero).toHaveClass("text-center");
    });

    it("uses brand background color", () => {
      render(<Hero />);
      const hero = screen.getByTestId("hero-section");
      // Should use background color
      expect(hero.className).toMatch(/bg-/);
    });
  });

  describe("Layout Simplicity", () => {
    it("does not render any lists", () => {
      render(<Hero />);
      const hero = screen.getByTestId("hero-section");
      const lists = hero.querySelectorAll("ul, ol");
      expect(lists).toHaveLength(0);
    });

    it("does not render any grid layouts", () => {
      render(<Hero />);
      const hero = screen.getByTestId("hero-section");
      const gridElements = hero.querySelectorAll('[class*="grid"]');
      expect(gridElements).toHaveLength(0);
    });

    it("does not render any cards", () => {
      render(<Hero />);
      const hero = screen.getByTestId("hero-section");
      // Check for card-like elements
      const cards = hero.querySelectorAll('[class*="card"], [role="article"]');
      expect(cards).toHaveLength(0);
    });
  });

  describe("Accessibility", () => {
    it("has proper heading hierarchy", () => {
      render(<Hero />);
      // Logo should be h1 (main page heading) with accessible name from image alt
      const h1 = screen.getByRole("heading", { level: 1, name: /easy plant life/i });
      expect(h1).toBeInTheDocument();
    });

    it("tagline and explanation use semantic text elements", () => {
      render(<Hero />);
      const tagline = screen.getByTestId("hero-tagline");
      const explanation = screen.getByTestId("hero-explanation");
      expect(tagline.tagName).toBe("P");
      // Explanation is a div container with paragraph children
      expect(explanation.querySelectorAll("p").length).toBeGreaterThanOrEqual(1);
    });

    it("section has appropriate aria-label", () => {
      render(<Hero />);
      const hero = screen.getByRole("region");
      expect(hero).toHaveAttribute("aria-label");
    });
  });

  describe("Typography", () => {
    it("uses heading font for logo container", () => {
      render(<Hero />);
      const h1 = screen.getByRole("heading", { level: 1 });
      expect(h1).toHaveClass("font-heading");
    });

    it("uses body font for explanation text", () => {
      render(<Hero />);
      const explanation = screen.getByTestId("hero-explanation");
      expect(explanation).toHaveClass("font-body");
    });

    it("uses appropriate text colors from brand palette", () => {
      render(<Hero />);
      const h1 = screen.getByRole("heading", { level: 1 });
      const explanation = screen.getByTestId("hero-explanation");
      // Should use brand structure and colors
      expect(h1).toBeInTheDocument();
      expect(explanation.className).toMatch(/text-(text|secondary|neutral)/);
    });
  });

  describe("Custom Styling", () => {
    it("accepts and applies custom className", () => {
      render(<Hero className="custom-class" />);
      const hero = screen.getByTestId("hero-section");
      expect(hero).toHaveClass("custom-class");
    });

    it("custom className does not override essential styles", () => {
      render(<Hero className="custom-class" />);
      const hero = screen.getByTestId("hero-section");
      // Should still have centering and padding
      expect(hero).toHaveClass("text-center");
    });
  });

  describe("Brand Message - Understanding Test", () => {
    /**
     * GIVEN the home page loads
     * WHEN I view the hero section
     * THEN I can understand the brand in under 30 seconds
     *
     * This test verifies the essential brand elements are present
     * for quick comprehension.
     */
    it("contains all elements needed for brand understanding", () => {
      render(<Hero />);

      // Brand name/logo is visible
      expect(screen.getByRole("img", { name: /easy plant life/i })).toBeVisible();

      // Tagline provides quick context
      const tagline = screen.getByTestId("hero-tagline");
      expect(tagline).toBeVisible();
      expect(tagline.textContent?.trim().length).toBeGreaterThan(0);

      // Brief explanation is available
      const explanation = screen.getByTestId("hero-explanation");
      expect(explanation).toBeVisible();
      expect(explanation.textContent?.trim().length).toBeGreaterThan(0);
    });

    /**
     * GIVEN the hero section
     * WHEN I count the sentences in the explanation
     * THEN there are no more than 3 sentences
     */
    it("keeps explanation concise for quick reading", () => {
      render(<Hero />);
      const explanation = screen.getByTestId("hero-explanation");
      const text = explanation.textContent || "";
      const sentences = text.match(/[.!?]+/g) || [];
      expect(sentences.length).toBeLessThanOrEqual(3);
    });
  });
});
