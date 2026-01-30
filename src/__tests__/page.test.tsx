import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "@/app/page";

/**
 * Home Page Tests
 *
 * Tests for the complete home page assembly following TDD approach.
 * Based on acceptance criteria from issue #29 (M4-04):
 * - Hero section renders
 * - Newsletter CTA renders
 * - Secondary CTAs render
 * - Page is single-scroll or near single-scroll
 * - No unnecessary sections
 * - Responsive on all devices
 *
 * Additional tests for issue #53 (M8-06):
 * - Home page newsletter form submits to API
 * - Success/error states work correctly
 */

// Mock fetch for API calls
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe("Home Page", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });
  describe("Page Structure", () => {
    it("renders a main element as the page container", () => {
      render(<Home />);
      const main = screen.getByRole("main");
      expect(main).toBeInTheDocument();
    });

    it("has proper page structure for accessibility", () => {
      render(<Home />);
      // Should have exactly one main element
      expect(screen.getAllByRole("main")).toHaveLength(1);
    });
  });

  describe("Hero Section", () => {
    it("renders the hero section", () => {
      render(<Home />);
      const hero = screen.getByTestId("hero-section");
      expect(hero).toBeInTheDocument();
    });

    it("renders the main heading (brand name)", () => {
      render(<Home />);
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent("Easy Plant Life");
    });

    it("renders the tagline", () => {
      render(<Home />);
      const tagline = screen.getByTestId("hero-tagline");
      expect(tagline).toBeInTheDocument();
    });

    it("renders the brand explanation", () => {
      render(<Home />);
      const explanation = screen.getByTestId("hero-explanation");
      expect(explanation).toBeInTheDocument();
    });
  });

  describe("Newsletter CTA Section", () => {
    it("renders the newsletter CTA section", () => {
      render(<Home />);
      const newsletter = screen.getByTestId("newsletter-cta");
      expect(newsletter).toBeInTheDocument();
    });

    it("renders newsletter signup form", () => {
      render(<Home />);
      const form = screen.getByRole("form", { name: /newsletter/i });
      expect(form).toBeInTheDocument();
    });

    it("renders email input field", () => {
      render(<Home />);
      const emailInput = screen.getByRole("textbox", { name: /email/i });
      expect(emailInput).toBeInTheDocument();
    });

    it("renders subscribe button", () => {
      render(<Home />);
      const button = screen.getByRole("button", {
        name: /subscribe|sign up|join/i,
      });
      expect(button).toBeInTheDocument();
    });
  });

  describe("Secondary CTAs Section", () => {
    it("renders the secondary CTAs section", () => {
      render(<Home />);
      const secondaryCtas = screen.getByTestId("secondary-ctas");
      expect(secondaryCtas).toBeInTheDocument();
    });

    it("renders link to Blog page", () => {
      render(<Home />);
      const blogLink = screen.getByRole("link", { name: /blog/i });
      expect(blogLink).toBeInTheDocument();
      expect(blogLink).toHaveAttribute("href", "/blog");
    });

    it("renders link to Books page", () => {
      render(<Home />);
      const booksLink = screen.getByRole("link", { name: /book/i });
      expect(booksLink).toBeInTheDocument();
      expect(booksLink).toHaveAttribute("href", "/books");
    });
  });

  describe("Section Order and Flow", () => {
    it("renders sections in correct order (Hero → Newsletter → Secondary)", () => {
      render(<Home />);
      const hero = screen.getByTestId("hero-section");
      const newsletter = screen.getByTestId("newsletter-cta");
      const secondary = screen.getByTestId("secondary-ctas");

      // Get the positions in the DOM
      const heroPosition = hero.compareDocumentPosition(newsletter);
      const newsletterPosition = newsletter.compareDocumentPosition(secondary);

      // Node.DOCUMENT_POSITION_FOLLOWING = 4
      // Hero should come before Newsletter
      expect(heroPosition & Node.DOCUMENT_POSITION_FOLLOWING).toBe(
        Node.DOCUMENT_POSITION_FOLLOWING
      );
      // Newsletter should come before Secondary
      expect(newsletterPosition & Node.DOCUMENT_POSITION_FOLLOWING).toBe(
        Node.DOCUMENT_POSITION_FOLLOWING
      );
    });

    it("has no unnecessary sections", () => {
      render(<Home />);
      // Count all section elements
      const sections = screen.getAllByRole("region");
      // Should have exactly 3 sections: Hero, Newsletter, Secondary CTAs
      expect(sections).toHaveLength(3);
    });
  });

  describe("Visual Design - Single Scroll", () => {
    it("uses appropriate section spacing", () => {
      render(<Home />);
      const hero = screen.getByTestId("hero-section");
      const newsletter = screen.getByTestId("newsletter-cta");
      const secondary = screen.getByTestId("secondary-ctas");

      // All sections should have vertical padding
      expect(hero.className).toMatch(/py-/);
      expect(newsletter.className).toMatch(/py-/);
      expect(secondary.className).toMatch(/py-/);
    });

    it("has consistent page background", () => {
      render(<Home />);
      const main = screen.getByRole("main");
      expect(main.className).toMatch(/bg-/);
    });
  });

  describe("Brand Message Completeness", () => {
    /**
     * GIVEN the home page on desktop
     * WHEN I view without scrolling
     * THEN I see the complete brand message
     */
    it("displays complete brand message", () => {
      render(<Home />);

      // Logo/brand name visible
      expect(screen.getByText("Easy Plant Life")).toBeVisible();

      // Tagline visible
      expect(screen.getByTestId("hero-tagline")).toBeVisible();

      // Value proposition visible
      expect(
        screen.getByTestId("newsletter-value-proposition")
      ).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has proper heading hierarchy starting with h1", () => {
      render(<Home />);
      const h1 = screen.getByRole("heading", { level: 1 });
      expect(h1).toBeInTheDocument();
    });

    it("all sections have aria-labels", () => {
      render(<Home />);
      const sections = screen.getAllByRole("region");
      sections.forEach((section) => {
        expect(section).toHaveAttribute("aria-label");
      });
    });

    it("page has skip to main content capability (main element present)", () => {
      render(<Home />);
      expect(screen.getByRole("main")).toBeInTheDocument();
    });
  });

  describe("Responsive Design", () => {
    /**
     * GIVEN the home page on mobile
     * WHEN I scroll through
     * THEN all sections are accessible and readable
     *
     * Note: Visual responsiveness is tested via responsive classes
     */
    it("sections use responsive padding classes", () => {
      render(<Home />);
      const hero = screen.getByTestId("hero-section");

      // Should have mobile and desktop responsive classes
      expect(hero.className).toMatch(/py-\d+/);
      expect(hero.className).toMatch(/md:py-|lg:py-/);
    });

    it("content is constrained for readability", () => {
      render(<Home />);
      const hero = screen.getByTestId("hero-section");

      // Hero content should be constrained with max-width
      const contentContainer = hero.querySelector('[class*="max-w-"]');
      expect(contentContainer).not.toBeNull();
    });
  });

  describe("Newsletter API Integration (M8-06)", () => {
    /**
     * GIVEN the home page newsletter form
     * WHEN I submit a valid email
     * THEN it should call the newsletter API
     */
    it("newsletter form submits to the API", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      const user = userEvent.setup();
      render(<Home />);

      const input = screen.getByRole("textbox", { name: /email/i });
      const button = screen.getByRole("button", { name: /subscribe/i });

      await user.type(input, "home@example.com");
      await user.click(button);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith("/api/newsletter", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: "home@example.com" }),
        });
      });
    });

    it("shows success message after successful submission", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      const user = userEvent.setup();
      render(<Home />);

      const input = screen.getByRole("textbox", { name: /email/i });
      const button = screen.getByRole("button", { name: /subscribe/i });

      await user.type(input, "home@example.com");
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByTestId("newsletter-success")).toBeInTheDocument();
      });
    });

    it("shows error message when API fails", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "Server error" }),
      });

      const user = userEvent.setup();
      render(<Home />);

      const input = screen.getByRole("textbox", { name: /email/i });
      const button = screen.getByRole("button", { name: /subscribe/i });

      await user.type(input, "home@example.com");
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByTestId("newsletter-error")).toBeInTheDocument();
      });
    });

    it("form behavior matches dedicated newsletter page", async () => {
      // Same behavior as dedicated newsletter page - form resets to success state after submission
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      const user = userEvent.setup();
      render(<Home />);

      const input = screen.getByRole("textbox", { name: /email/i });
      const button = screen.getByRole("button", { name: /subscribe/i });

      await user.type(input, "home@example.com");
      await user.click(button);

      await waitFor(() => {
        // Form should be replaced with success message (same as newsletter page)
        expect(screen.queryByRole("form")).not.toBeInTheDocument();
        expect(screen.getByTestId("newsletter-success")).toBeInTheDocument();
      });
    });
  });
});
