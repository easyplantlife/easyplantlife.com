import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "@/app/page";

/**
 * Home Page Integration Tests
 *
 * Comprehensive integration tests for the home page verifying
 * that all components work together correctly from a user's perspective.
 *
 * Based on acceptance criteria from issue #31 (M4-06):
 *
 * GIVEN the home page
 * WHEN it loads
 * THEN the logo is visible
 * AND the tagline is visible
 * AND the newsletter form is present
 * AND links to blog and books exist
 *
 * GIVEN the home page newsletter form
 * WHEN I enter a valid email and submit
 * THEN the form shows success state
 *
 * GIVEN the home page
 * WHEN viewed on mobile
 * THEN all content is accessible
 */

// Mock fetch for newsletter API calls
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe("Home Page Integration Tests", () => {
  beforeEach(() => {
    mockFetch.mockReset();
    // Default to successful API response
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });
  });
  describe("GIVEN the home page WHEN it loads", () => {
    /**
     * THEN the logo is visible
     */
    it("displays the Easy Plant Life logo/brand name", () => {
      render(<Home />);

      const logo = screen.getByRole("heading", {
        level: 1,
        name: /easy plant life/i,
      });
      expect(logo).toBeVisible();
    });

    /**
     * AND the tagline is visible
     */
    it("displays the tagline immediately visible", () => {
      render(<Home />);

      const tagline = screen.getByTestId("hero-tagline");
      expect(tagline).toBeVisible();
      expect(tagline.textContent?.trim()).not.toBe("");
    });

    /**
     * AND the newsletter form is present
     */
    it("displays the newsletter signup form with all required elements", () => {
      render(<Home />);

      // Form is present
      const form = screen.getByRole("form", { name: /newsletter/i });
      expect(form).toBeInTheDocument();

      // Email input is present
      const emailInput = screen.getByRole("textbox", { name: /email/i });
      expect(emailInput).toBeInTheDocument();

      // Subscribe button is present
      const submitButton = screen.getByRole("button", { name: /subscribe/i });
      expect(submitButton).toBeInTheDocument();
    });

    /**
     * AND links to blog and books exist
     */
    it("provides navigation links to Blog and Books pages", () => {
      render(<Home />);

      const blogLink = screen.getByRole("link", { name: /blog/i });
      expect(blogLink).toBeInTheDocument();
      expect(blogLink).toHaveAttribute("href", "/blog");

      const booksLink = screen.getByRole("link", { name: /book/i });
      expect(booksLink).toBeInTheDocument();
      expect(booksLink).toHaveAttribute("href", "/books");
    });

    /**
     * Complete page load scenario - all essential elements visible
     */
    it("renders all essential brand elements on initial load", () => {
      render(<Home />);

      // Logo
      expect(screen.getByText("Easy Plant Life")).toBeVisible();

      // Tagline
      expect(screen.getByTestId("hero-tagline")).toBeVisible();

      // Newsletter form
      expect(
        screen.getByRole("form", { name: /newsletter/i })
      ).toBeInTheDocument();

      // Navigation links
      expect(screen.getByRole("link", { name: /blog/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /book/i })).toBeInTheDocument();
    });
  });

  describe("GIVEN the home page newsletter form", () => {
    /**
     * WHEN I enter a valid email and submit
     * THEN the form shows success state
     */
    it("shows success state after submitting a valid email", async () => {
      const user = userEvent.setup();
      render(<Home />);

      // Find the newsletter section
      const newsletterSection = screen.getByTestId("newsletter-cta");

      // Enter a valid email
      const emailInput = within(newsletterSection).getByRole("textbox", {
        name: /email/i,
      });
      await user.type(emailInput, "test@example.com");

      // Submit the form
      const submitButton = within(newsletterSection).getByRole("button", {
        name: /subscribe/i,
      });
      await user.click(submitButton);

      // Wait for success state
      await waitFor(() => {
        expect(screen.getByTestId("newsletter-success")).toBeInTheDocument();
      });

      // Success message should be visible
      expect(screen.getByTestId("newsletter-success")).toBeVisible();
    });

    /**
     * Complete newsletter signup flow - user journey
     */
    it("completes full newsletter signup flow", async () => {
      const user = userEvent.setup();
      render(<Home />);

      // 1. User sees the value proposition
      expect(screen.getByTestId("newsletter-value-proposition")).toBeVisible();

      // 2. User enters their email
      const emailInput = screen.getByRole("textbox", { name: /email/i });
      await user.type(emailInput, "user@example.com");
      expect(emailInput).toHaveValue("user@example.com");

      // 3. User clicks subscribe
      const submitButton = screen.getByRole("button", { name: /subscribe/i });
      await user.click(submitButton);

      // 4. User sees success confirmation
      await waitFor(() => {
        expect(screen.getByTestId("newsletter-success")).toBeVisible();
      });

      // 5. Form is hidden after success
      expect(
        screen.queryByRole("form", { name: /newsletter/i })
      ).not.toBeInTheDocument();
    });

    /**
     * Error handling - invalid email
     */
    it("shows error state for invalid email format", async () => {
      const user = userEvent.setup();
      render(<Home />);

      // Enter an invalid email that passes browser validation but fails our validation
      const emailInput = screen.getByRole("textbox", { name: /email/i });
      await user.type(emailInput, "invalid");

      // Try to submit
      const submitButton = screen.getByRole("button", { name: /subscribe/i });
      await user.click(submitButton);

      // Input should show as invalid (browser validation)
      expect(emailInput).toBeInvalid();
    });
  });

  describe("GIVEN the home page WHEN viewed on mobile", () => {
    /**
     * THEN all content is accessible
     *
     * Note: Since JSDOM doesn't support actual viewport changes,
     * we test that responsive classes are applied and content
     * structure supports mobile viewing.
     */
    it("has responsive padding that adapts to screen size", () => {
      render(<Home />);

      const heroSection = screen.getByTestId("hero-section");
      const newsletterSection = screen.getByTestId("newsletter-cta");
      const secondarySection = screen.getByTestId("secondary-ctas");

      // All sections should have responsive padding classes
      [heroSection, newsletterSection, secondarySection].forEach((section) => {
        // Base padding (mobile)
        expect(section.className).toMatch(/py-\d+/);
        // Responsive padding (tablet/desktop)
        expect(section.className).toMatch(/md:py-|lg:py-/);
      });
    });

    it("constrains content width for mobile readability", () => {
      render(<Home />);

      // Hero content should be constrained
      const heroSection = screen.getByTestId("hero-section");
      expect(heroSection.querySelector('[class*="max-w-"]')).not.toBeNull();

      // Newsletter content should be constrained
      const newsletterSection = screen.getByTestId("newsletter-cta");
      expect(
        newsletterSection.querySelector('[class*="max-w-"]')
      ).not.toBeNull();
    });

    it("uses mobile-first responsive padding", () => {
      render(<Home />);

      const heroSection = screen.getByTestId("hero-section");

      // Should have mobile padding (px classes)
      expect(heroSection.className).toMatch(/px-\d+/);
    });

    it("newsletter form is usable on mobile", () => {
      render(<Home />);

      // Form should be accessible
      const form = screen.getByRole("form", { name: /newsletter/i });
      expect(form).toBeInTheDocument();

      // Input should be focusable
      const emailInput = screen.getByRole("textbox", { name: /email/i });
      expect(emailInput).not.toBeDisabled();

      // Button should be clickable
      const submitButton = screen.getByRole("button", { name: /subscribe/i });
      expect(submitButton).not.toBeDisabled();
    });

    it("navigation links are accessible on mobile", () => {
      render(<Home />);

      const blogLink = screen.getByRole("link", { name: /blog/i });
      const booksLink = screen.getByRole("link", { name: /book/i });

      // Links should be accessible (not hidden, not disabled)
      expect(blogLink).toBeVisible();
      expect(booksLink).toBeVisible();

      // Links should be keyboard accessible
      expect(blogLink).not.toHaveAttribute("tabindex", "-1");
      expect(booksLink).not.toHaveAttribute("tabindex", "-1");
    });
  });

  describe("Page Accessibility", () => {
    it("has proper heading hierarchy", () => {
      render(<Home />);

      // Should have exactly one h1
      const h1Elements = screen.getAllByRole("heading", { level: 1 });
      expect(h1Elements).toHaveLength(1);
      expect(h1Elements[0]).toHaveTextContent("Easy Plant Life");
    });

    it("all sections have aria-labels for screen readers", () => {
      render(<Home />);

      const sections = screen.getAllByRole("region");
      sections.forEach((section) => {
        expect(section).toHaveAttribute("aria-label");
      });
    });

    it("has a main landmark element", () => {
      render(<Home />);

      const main = screen.getByRole("main");
      expect(main).toBeInTheDocument();
    });

    it("is fully keyboard navigable", async () => {
      const user = userEvent.setup();
      render(<Home />);

      // Tab through the page
      await user.tab();
      expect(screen.getByRole("textbox", { name: /email/i })).toHaveFocus();

      await user.tab();
      expect(screen.getByRole("button", { name: /subscribe/i })).toHaveFocus();

      await user.tab();
      expect(screen.getByRole("link", { name: /blog/i })).toHaveFocus();

      await user.tab();
      expect(screen.getByRole("link", { name: /book/i })).toHaveFocus();
    });
  });

  describe("Page Layout and Structure", () => {
    it("renders sections in correct order", () => {
      render(<Home />);

      const hero = screen.getByTestId("hero-section");
      const newsletter = screen.getByTestId("newsletter-cta");
      const secondary = screen.getByTestId("secondary-ctas");

      // Hero before Newsletter
      expect(
        hero.compareDocumentPosition(newsletter) &
          Node.DOCUMENT_POSITION_FOLLOWING
      ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);

      // Newsletter before Secondary
      expect(
        newsletter.compareDocumentPosition(secondary) &
          Node.DOCUMENT_POSITION_FOLLOWING
      ).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    });

    it("has exactly three main sections", () => {
      render(<Home />);

      const sections = screen.getAllByRole("region");
      expect(sections).toHaveLength(3);
    });

    it("all sections have consistent background styling", () => {
      render(<Home />);

      const main = screen.getByRole("main");
      const hero = screen.getByTestId("hero-section");
      const newsletter = screen.getByTestId("newsletter-cta");
      const secondary = screen.getByTestId("secondary-ctas");

      // Main container has background
      expect(main.className).toMatch(/bg-/);

      // All sections have backgrounds
      expect(hero.className).toMatch(/bg-/);
      expect(newsletter.className).toMatch(/bg-/);
      expect(secondary.className).toMatch(/bg-/);
    });
  });

  describe("Brand Message Clarity", () => {
    /**
     * User should be able to understand the brand in under 30 seconds
     */
    it("displays all essential brand elements above the fold conceptually", () => {
      render(<Home />);

      // Brand name
      expect(screen.getByText("Easy Plant Life")).toBeVisible();

      // Tagline
      const tagline = screen.getByTestId("hero-tagline");
      expect(tagline).toBeVisible();

      // Explanation
      const explanation = screen.getByTestId("hero-explanation");
      expect(explanation).toBeVisible();
    });

    it("presents a clear value proposition without hype", () => {
      render(<Home />);

      const proposition = screen.getByTestId("newsletter-value-proposition");
      const text = proposition.textContent?.toLowerCase() || "";

      // No hype words
      const hypeWords = [
        "free",
        "exclusive",
        "amazing",
        "incredible",
        "best",
        "revolutionary",
      ];
      hypeWords.forEach((word) => {
        expect(text).not.toContain(word);
      });
    });
  });
});
