import { render, screen } from "@testing-library/react";
import AboutPage from "@/app/about/page";

/**
 * About Page Tests
 *
 * Tests for the complete About page assembly following TDD approach.
 * Based on acceptance criteria from:
 *
 * Issue #33 (M5-02):
 * - Page uses PageLayout component
 * - Content flows naturally
 * - Appropriate heading hierarchy
 * - Readable line lengths (prose width)
 * - Responsive
 *
 * Issue #35 (M5-04):
 * - Page title "About" is visible
 * - "why" section is present
 * - "what we're not" section is present
 */

describe("About Page", () => {
  /**
   * Acceptance Criteria Tests (Issue #35 - M5-04)
   *
   * GIVEN the about page
   * WHEN it loads
   * THEN the page title "About" is visible
   * AND the "why" section is present
   * AND the "what we're not" section is present
   */
  describe("Acceptance Criteria (M5-04)", () => {
    it("displays the page title 'About' when the page loads", () => {
      render(<AboutPage />);
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent(/about/i);
    });

    it("displays the 'why' section when the page loads", () => {
      render(<AboutPage />);
      const whySection = screen.getByTestId("about-why-section");
      expect(whySection).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: /why easy plant life exists/i })
      ).toBeInTheDocument();
    });

    it("displays the 'what we're not' section when the page loads", () => {
      render(<AboutPage />);
      const notSection = screen.getByTestId("about-not-section");
      expect(notSection).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: /what we're not/i })
      ).toBeInTheDocument();
    });
  });

  describe("Page Structure", () => {
    it("renders a main element as the page container (via PageLayout)", () => {
      render(<AboutPage />);
      const main = screen.getByRole("main");
      expect(main).toBeInTheDocument();
    });

    it("has proper page structure for accessibility", () => {
      render(<AboutPage />);
      // Should have exactly one main element
      expect(screen.getAllByRole("main")).toHaveLength(1);
    });

    it("renders the page title as h1 heading", () => {
      render(<AboutPage />);
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent(/about/i);
    });
  });

  describe("PageLayout Integration", () => {
    it("uses PageLayout component with title prop", () => {
      render(<AboutPage />);
      // PageLayout renders a main element with Container
      const main = screen.getByRole("main");
      expect(main).toBeInTheDocument();

      // Title is rendered as h1 with font-heading class
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toHaveClass("font-heading");
    });

    it("has consistent vertical padding from PageLayout", () => {
      render(<AboutPage />);
      const main = screen.getByRole("main");
      // PageLayout default variant adds py-12 md:py-16
      expect(main).toHaveClass("py-12");
      expect(main).toHaveClass("md:py-16");
    });

    it("content is wrapped in Container for max-width constraint", () => {
      render(<AboutPage />);
      const content = screen.getByTestId("about-content");
      // Container has mx-auto and max-w-6xl
      const container = content.parentElement;
      expect(container).toHaveClass("mx-auto");
      expect(container).toHaveClass("max-w-6xl");
    });
  });

  describe("AboutContent Integration", () => {
    it("renders the AboutContent component", () => {
      render(<AboutPage />);
      expect(screen.getByTestId("about-content")).toBeInTheDocument();
    });

    it("renders all three content sections", () => {
      render(<AboutPage />);
      expect(screen.getByTestId("about-why-section")).toBeInTheDocument();
      expect(screen.getByTestId("about-beliefs-section")).toBeInTheDocument();
      expect(screen.getByTestId("about-not-section")).toBeInTheDocument();
    });
  });

  describe("Heading Hierarchy", () => {
    it("has h1 page title followed by h2 section headings", () => {
      render(<AboutPage />);

      // Page title is h1
      const h1 = screen.getByRole("heading", { level: 1 });
      expect(h1).toBeInTheDocument();

      // Section headings are h2
      const h2s = screen.getAllByRole("heading", { level: 2 });
      expect(h2s.length).toBeGreaterThanOrEqual(3);
    });

    it("heading hierarchy is sequential (no skipped levels)", () => {
      render(<AboutPage />);
      const headings = screen.getAllByRole("heading");

      // First heading should be level 1
      expect(headings[0].tagName).toBe("H1");

      // All other headings should be level 2 (not jumping to h3, h4, etc.)
      const subHeadings = headings.slice(1);
      subHeadings.forEach((heading) => {
        expect(heading.tagName).toBe("H2");
      });
    });
  });

  describe("Content Flow", () => {
    it("content sections are in logical order", () => {
      render(<AboutPage />);
      const whySection = screen.getByTestId("about-why-section");
      const beliefsSection = screen.getByTestId("about-beliefs-section");
      const notSection = screen.getByTestId("about-not-section");

      // Why should come before Beliefs
      expect(
        whySection.compareDocumentPosition(beliefsSection) &
          Node.DOCUMENT_POSITION_FOLLOWING
      ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);

      // Beliefs should come before Not
      expect(
        beliefsSection.compareDocumentPosition(notSection) &
          Node.DOCUMENT_POSITION_FOLLOWING
      ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    });

    it("title appears before content", () => {
      render(<AboutPage />);
      const title = screen.getByRole("heading", { level: 1 });
      const content = screen.getByTestId("about-content");

      expect(
        title.compareDocumentPosition(content) &
          Node.DOCUMENT_POSITION_FOLLOWING
      ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    });
  });

  describe("Readable Line Lengths", () => {
    it("content is constrained for prose readability", () => {
      render(<AboutPage />);
      // Container provides max-width constraint
      const content = screen.getByTestId("about-content");
      const container = content.parentElement;
      expect(container?.className).toMatch(/max-w-/);
    });

    it("paragraphs have leading-relaxed for readable line height", () => {
      render(<AboutPage />);
      const content = screen.getByTestId("about-content");
      const paragraphs = content.querySelectorAll("p");
      paragraphs.forEach((p) => {
        expect(p).toHaveClass("leading-relaxed");
      });
    });
  });

  describe("Responsive Design", () => {
    it("uses responsive vertical padding", () => {
      render(<AboutPage />);
      const main = screen.getByRole("main");
      // PageLayout default variant: py-12 md:py-16
      expect(main).toHaveClass("py-12");
      expect(main).toHaveClass("md:py-16");
    });

    it("uses responsive horizontal padding via Container", () => {
      render(<AboutPage />);
      const content = screen.getByTestId("about-content");
      const container = content.parentElement;
      // Container has responsive horizontal padding
      expect(container).toHaveClass("px-4");
      expect(container).toHaveClass("md:px-6");
      expect(container).toHaveClass("lg:px-8");
    });

    it("section headings use responsive text sizes", () => {
      render(<AboutPage />);
      const sectionHeadings = screen.getAllByRole("heading", { level: 2 });
      sectionHeadings.forEach((heading) => {
        // Headings should have responsive classes like md:text-4xl
        expect(heading.className).toMatch(/md:text-/);
      });
    });
  });

  describe("Accessibility", () => {
    it("has proper landmark with main element", () => {
      render(<AboutPage />);
      expect(screen.getByRole("main")).toBeInTheDocument();
    });

    it("content uses semantic article element", () => {
      render(<AboutPage />);
      expect(screen.getByRole("article")).toBeInTheDocument();
    });

    it("sections use semantic section elements", () => {
      render(<AboutPage />);
      const whySection = screen.getByTestId("about-why-section");
      const beliefsSection = screen.getByTestId("about-beliefs-section");
      const notSection = screen.getByTestId("about-not-section");

      expect(whySection.tagName).toBe("SECTION");
      expect(beliefsSection.tagName).toBe("SECTION");
      expect(notSection.tagName).toBe("SECTION");
    });
  });

  describe("Visual Design - Brand Compliance", () => {
    it("page title uses brand heading font", () => {
      render(<AboutPage />);
      const title = screen.getByRole("heading", { level: 1 });
      expect(title).toHaveClass("font-heading");
    });

    it("section headings use brand heading font", () => {
      render(<AboutPage />);
      const sectionHeadings = screen.getAllByRole("heading", { level: 2 });
      sectionHeadings.forEach((heading) => {
        expect(heading).toHaveClass("font-heading");
      });
    });

    it("body text uses brand body font", () => {
      render(<AboutPage />);
      const content = screen.getByTestId("about-content");
      const paragraphs = content.querySelectorAll("p");
      paragraphs.forEach((p) => {
        expect(p).toHaveClass("font-body");
      });
    });

    it("has generous spacing between sections", () => {
      render(<AboutPage />);
      const content = screen.getByTestId("about-content");
      // AboutContent has space-y-16 for generous spacing
      expect(content).toHaveClass("space-y-16");
    });
  });
});
