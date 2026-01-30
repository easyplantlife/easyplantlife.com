import { render, screen } from "@testing-library/react";
import { AboutContent } from "@/components/about/AboutContent";

/**
 * AboutContent Component Tests
 *
 * Tests for the About page content structure following TDD approach.
 * Based on acceptance criteria from issue #32 (M5-01):
 * - Explains "why Easy Plant Life exists"
 * - Clearly states what it is NOT
 * - Emphasizes realism and sustainability
 * - Tone is calm, honest, non-authoritative
 * - Not preachy or activist
 *
 * Content Sections:
 * 1. Why Easy Plant Life exists
 * 2. What we believe
 * 3. What we're not (explicitly)
 */

describe("AboutContent Component", () => {
  describe("Rendering", () => {
    it("renders as an article element", () => {
      render(<AboutContent />);
      const article = screen.getByRole("article");
      expect(article).toBeInTheDocument();
    });

    it("renders with data-testid for identification", () => {
      render(<AboutContent />);
      expect(screen.getByTestId("about-content")).toBeInTheDocument();
    });
  });

  describe("Section: Why Easy Plant Life Exists", () => {
    it("renders a section explaining why Easy Plant Life exists", () => {
      render(<AboutContent />);
      const section = screen.getByTestId("about-why-section");
      expect(section).toBeInTheDocument();
    });

    it("has a heading for the 'why' section", () => {
      render(<AboutContent />);
      const heading = screen.getByRole("heading", { name: /why/i });
      expect(heading).toBeInTheDocument();
    });

    it("explains the purpose of Easy Plant Life", () => {
      render(<AboutContent />);
      const section = screen.getByTestId("about-why-section");
      // Should contain content about the purpose/reason
      expect(section.textContent).toMatch(/exist|purpose|started|began|why/i);
    });
  });

  describe("Section: What We Believe", () => {
    it("renders a section about beliefs/philosophy", () => {
      render(<AboutContent />);
      const section = screen.getByTestId("about-beliefs-section");
      expect(section).toBeInTheDocument();
    });

    it("has a heading for the beliefs section", () => {
      render(<AboutContent />);
      const heading = screen.getByRole("heading", { name: /believe|philosophy/i });
      expect(heading).toBeInTheDocument();
    });

    it("emphasizes realism over perfection", () => {
      render(<AboutContent />);
      const section = screen.getByTestId("about-beliefs-section");
      // Should mention realistic approach, not perfection
      expect(section.textContent).toMatch(/real|practical|sustainable/i);
    });

    it("emphasizes sustainability", () => {
      render(<AboutContent />);
      const section = screen.getByTestId("about-beliefs-section");
      expect(section.textContent).toMatch(/sustainab/i);
    });
  });

  describe("Section: What We Are Not", () => {
    it("renders a section explicitly stating what Easy Plant Life is NOT", () => {
      render(<AboutContent />);
      const section = screen.getByTestId("about-not-section");
      expect(section).toBeInTheDocument();
    });

    it("has a heading for the 'what we are not' section", () => {
      render(<AboutContent />);
      const heading = screen.getByRole("heading", { name: /not|aren't/i });
      expect(heading).toBeInTheDocument();
    });

    it("clearly states what the brand is not", () => {
      render(<AboutContent />);
      const section = screen.getByTestId("about-not-section");
      // Should explicitly state what it's not
      expect(section.textContent).toMatch(/not|never|don't|aren't/i);
    });
  });

  describe("Tone and Content Guidelines", () => {
    it("does not use preachy language", () => {
      render(<AboutContent />);
      const content = screen.getByTestId("about-content");
      const text = content.textContent?.toLowerCase() || "";
      // Should not contain preachy/demanding words
      const preachyWords = ["must", "should always", "you need to", "have to"];
      preachyWords.forEach((word) => {
        expect(text).not.toContain(word);
      });
    });

    it("does not use activist language", () => {
      render(<AboutContent />);
      const content = screen.getByTestId("about-content");
      const text = content.textContent?.toLowerCase() || "";
      // Should not contain activist/aggressive words
      const activistWords = ["fight", "battle", "warrior", "revolution", "crusade"];
      activistWords.forEach((word) => {
        expect(text).not.toContain(word);
      });
    });

    it("does not use hype words", () => {
      render(<AboutContent />);
      const content = screen.getByTestId("about-content");
      const text = content.textContent?.toLowerCase() || "";
      // Should not contain marketing hype
      const hypeWords = ["amazing", "incredible", "revolutionary", "game-changing", "best ever"];
      hypeWords.forEach((word) => {
        expect(text).not.toContain(word);
      });
    });

    it("uses calm, honest language", () => {
      render(<AboutContent />);
      const content = screen.getByTestId("about-content");
      const text = content.textContent?.toLowerCase() || "";
      // Should contain words that convey calm/honest tone
      expect(text).toMatch(/simple|calm|easy|honest|real|practical/i);
    });
  });

  describe("Visual Design", () => {
    it("has generous spacing between sections", () => {
      render(<AboutContent />);
      const sections = [
        screen.getByTestId("about-why-section"),
        screen.getByTestId("about-beliefs-section"),
        screen.getByTestId("about-not-section"),
      ];
      // Each section should have margin/padding classes
      sections.forEach((section) => {
        expect(section.className).toMatch(/mb-|py-|space-y-/);
      });
    });

    it("uses brand typography for headings", () => {
      render(<AboutContent />);
      const headings = screen.getAllByRole("heading");
      headings.forEach((heading) => {
        expect(heading).toHaveClass("font-heading");
      });
    });

    it("uses brand typography for body text", () => {
      render(<AboutContent />);
      const paragraphs = screen.getByTestId("about-content").querySelectorAll("p");
      paragraphs.forEach((p) => {
        expect(p).toHaveClass("font-body");
      });
    });
  });

  describe("Layout Simplicity", () => {
    it("does not use complex grid layouts", () => {
      render(<AboutContent />);
      const content = screen.getByTestId("about-content");
      const gridElements = content.querySelectorAll('[class*="grid-cols"]');
      expect(gridElements).toHaveLength(0);
    });

    it("does not render cards", () => {
      render(<AboutContent />);
      const content = screen.getByTestId("about-content");
      const cards = content.querySelectorAll('[class*="card"], [data-testid*="card"]');
      expect(cards).toHaveLength(0);
    });

    it("content flows in a single column", () => {
      render(<AboutContent />);
      const content = screen.getByTestId("about-content");
      // Should not have multi-column layouts
      expect(content.className).not.toMatch(/columns-\d|col-span/);
    });
  });

  describe("Accessibility", () => {
    it("has proper heading hierarchy starting at h2", () => {
      render(<AboutContent />);
      // Page title (h1) will be in the page layout, so content starts at h2
      const headings = screen.getAllByRole("heading");
      headings.forEach((heading) => {
        const level = parseInt(heading.tagName.charAt(1));
        expect(level).toBeGreaterThanOrEqual(2);
      });
    });

    it("sections are marked with semantic HTML", () => {
      render(<AboutContent />);
      const whySection = screen.getByTestId("about-why-section");
      const beliefsSection = screen.getByTestId("about-beliefs-section");
      const notSection = screen.getByTestId("about-not-section");
      // Should be section elements
      expect(whySection.tagName).toBe("SECTION");
      expect(beliefsSection.tagName).toBe("SECTION");
      expect(notSection.tagName).toBe("SECTION");
    });

    it("paragraphs use semantic p elements", () => {
      render(<AboutContent />);
      const content = screen.getByTestId("about-content");
      const textContainers = content.querySelectorAll("p");
      expect(textContainers.length).toBeGreaterThan(0);
    });
  });

  describe("Custom Styling", () => {
    it("accepts and applies custom className", () => {
      render(<AboutContent className="custom-class" />);
      const content = screen.getByTestId("about-content");
      expect(content).toHaveClass("custom-class");
    });
  });

  describe("Content Structure Completeness", () => {
    /**
     * GIVEN the About page loads
     * WHEN I view the content
     * THEN I can understand the brand philosophy
     */
    it("contains all three required content sections", () => {
      render(<AboutContent />);

      // Why section exists
      expect(screen.getByTestId("about-why-section")).toBeInTheDocument();

      // Beliefs section exists
      expect(screen.getByTestId("about-beliefs-section")).toBeInTheDocument();

      // What we're not section exists
      expect(screen.getByTestId("about-not-section")).toBeInTheDocument();
    });

    it("has meaningful content in each section", () => {
      render(<AboutContent />);

      const sections = [
        screen.getByTestId("about-why-section"),
        screen.getByTestId("about-beliefs-section"),
        screen.getByTestId("about-not-section"),
      ];

      sections.forEach((section) => {
        const paragraphs = section.querySelectorAll("p");
        expect(paragraphs.length).toBeGreaterThan(0);
        // Each section should have meaningful content (at least 50 characters)
        const totalContent = Array.from(paragraphs)
          .map((p) => p.textContent || "")
          .join("");
        expect(totalContent.length).toBeGreaterThan(50);
      });
    });
  });
});
