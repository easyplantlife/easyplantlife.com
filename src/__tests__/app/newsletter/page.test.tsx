import { render, screen } from "@testing-library/react";
import NewsletterPage from "@/app/newsletter/page";

/**
 * Newsletter Page Tests
 *
 * Tests for the newsletter signup page following TDD approach.
 * Based on acceptance criteria from issue #52 (M8-05):
 * - Page uses PageLayout
 * - One-sentence promise/value proposition
 * - Newsletter form prominent
 * - Clear confirmation states (handled by NewsletterForm component)
 * - Tone: no hype, no frequency pressure
 * - Responsive
 */

// Mock the NewsletterForm component to isolate page tests
jest.mock("@/components/forms/NewsletterForm", () => ({
  NewsletterForm: ({ className }: { className?: string }) => (
    <div data-testid="newsletter-form" className={className}>
      Mocked Newsletter Form
    </div>
  ),
}));

describe("Newsletter Page", () => {
  describe("Layout", () => {
    it("renders the page title", () => {
      render(<NewsletterPage />);
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent(/newsletter/i);
    });

    it("uses PageLayout component with main element", () => {
      render(<NewsletterPage />);
      const main = screen.getByRole("main");
      expect(main).toBeInTheDocument();
    });
  });

  describe("Value Proposition", () => {
    it("displays a value proposition text", () => {
      render(<NewsletterPage />);
      // Look for text that describes what users get from subscribing
      const valueText = screen.getByText(
        /thoughtful|updates|plant|living|simple|calm/i
      );
      expect(valueText).toBeInTheDocument();
    });

    it("value proposition is concise (single sentence)", () => {
      render(<NewsletterPage />);
      // The description text should be relatively short
      const paragraphs = screen.getAllByRole("paragraph");
      const valueProposition = paragraphs.find(
        (p) =>
          p.textContent?.match(
            /thoughtful|updates|plant|living|simple|calm/i
          )
      );
      expect(valueProposition).toBeTruthy();
      // A single sentence shouldn't have multiple periods (excluding email domains)
      const text = valueProposition?.textContent || "";
      const sentences = text.split(/\.\s+/).filter(Boolean);
      expect(sentences.length).toBeLessThanOrEqual(2);
    });
  });

  describe("Newsletter Form", () => {
    it("renders the newsletter form component", () => {
      render(<NewsletterPage />);
      expect(screen.getByTestId("newsletter-form")).toBeInTheDocument();
    });

    it("newsletter form is visually prominent (centered or max-width constrained)", () => {
      render(<NewsletterPage />);
      const form = screen.getByTestId("newsletter-form");
      // Form should have width constraints for prominence and readability
      expect(form.className).toMatch(/max-w|mx-auto|w-full/);
    });
  });

  describe("Brand Compliance - No Hype Language", () => {
    it("page contains no hype or marketing language", () => {
      render(<NewsletterPage />);
      const pageContent =
        document.body.textContent?.toLowerCase() || "";
      const hypeWords = [
        "free",
        "exclusive",
        "amazing",
        "incredible",
        "best",
        "revolutionary",
        "guaranteed",
        "limited",
        "urgent",
        "act now",
        "don't miss",
        "must",
        "hurry",
        "now!",
        "spam",
      ];
      hypeWords.forEach((word) => {
        expect(pageContent).not.toContain(word);
      });
    });

    it("page contains no frequency pressure language", () => {
      render(<NewsletterPage />);
      const pageContent =
        document.body.textContent?.toLowerCase() || "";
      const pressureWords = [
        "daily",
        "weekly",
        "constantly",
        "regular",
        "frequently",
        "unsubscribe anytime",
        "no spam",
        "inbox",
      ];
      pressureWords.forEach((word) => {
        expect(pageContent).not.toContain(word);
      });
    });
  });

  describe("Accessibility", () => {
    it("has proper heading hierarchy", () => {
      render(<NewsletterPage />);
      const h1 = screen.getByRole("heading", { level: 1 });
      expect(h1).toBeInTheDocument();
    });

    it("has accessible main landmark", () => {
      render(<NewsletterPage />);
      expect(screen.getByRole("main")).toBeInTheDocument();
    });
  });
});
