import { render, screen } from "@testing-library/react";
import ContactPage from "@/app/contact/page";

/**
 * Contact Page Tests
 *
 * Tests for the contact page following TDD approach.
 * Based on acceptance criteria from issue #58 (M9-03):
 * - Page uses PageLayout
 * - Contact form displayed
 * - Optional: direct email address displayed
 * - No social links required
 * - Minimal, focused design
 * - Responsive
 */

// Mock the ContactForm component to isolate page tests
jest.mock("@/components/forms/ContactForm", () => ({
  ContactForm: ({
    className,
    onSubmit,
  }: {
    className?: string;
    onSubmit?: () => void;
  }) => (
    <div data-testid="contact-form" className={className} onClick={onSubmit}>
      Mocked Contact Form
    </div>
  ),
}));

describe("Contact Page", () => {
  describe("Layout", () => {
    it("renders the page title", () => {
      render(<ContactPage />);
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent(/contact/i);
    });

    it("uses PageLayout component with main element", () => {
      render(<ContactPage />);
      const main = screen.getByRole("main");
      expect(main).toBeInTheDocument();
    });

    it("has proper vertical padding from PageLayout", () => {
      render(<ContactPage />);
      const main = screen.getByRole("main");
      // PageLayout default variant: py-12 md:py-16
      expect(main).toHaveClass("py-12");
      expect(main).toHaveClass("md:py-16");
    });
  });

  describe("Contact Form", () => {
    it("renders the contact form component", () => {
      render(<ContactPage />);
      expect(screen.getByTestId("contact-form")).toBeInTheDocument();
    });

    it("contact form is visually prominent (max-width constrained)", () => {
      render(<ContactPage />);
      const form = screen.getByTestId("contact-form");
      // Form should have width constraints for prominence and readability
      expect(form.className).toMatch(/max-w|w-full/);
    });
  });

  describe("Introductory Text", () => {
    it("displays introductory text about contacting", () => {
      render(<ContactPage />);
      // Look for text that explains the contact page purpose
      const introText = screen.getByText(
        /question|get in touch|hear|message|reach/i
      );
      expect(introText).toBeInTheDocument();
    });

    it("introductory text is concise", () => {
      render(<ContactPage />);
      const paragraphs = screen.getAllByRole("paragraph");
      const introText = paragraphs.find((p) =>
        p.textContent?.match(/question|get in touch|hear|message|reach/i)
      );
      expect(introText).toBeTruthy();
      // Should be relatively short - single sentence or two
      const text = introText?.textContent || "";
      const sentences = text.split(/\.\s+/).filter(Boolean);
      expect(sentences.length).toBeLessThanOrEqual(2);
    });
  });

  describe("Brand Compliance - Minimal Focused Design", () => {
    it("page contains no hype or marketing language", () => {
      render(<ContactPage />);
      const pageContent = document.body.textContent?.toLowerCase() || "";
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
        "hurry",
      ];
      hypeWords.forEach((word) => {
        expect(pageContent).not.toContain(word);
      });
    });

    it("page does not display social links", () => {
      render(<ContactPage />);
      const pageContent = document.body.textContent?.toLowerCase() || "";
      const socialPlatforms = [
        "twitter",
        "facebook",
        "instagram",
        "linkedin",
        "tiktok",
      ];
      socialPlatforms.forEach((platform) => {
        expect(pageContent).not.toContain(platform);
      });
    });
  });

  describe("Accessibility", () => {
    it("has proper heading hierarchy", () => {
      render(<ContactPage />);
      const h1 = screen.getByRole("heading", { level: 1 });
      expect(h1).toBeInTheDocument();
    });

    it("has accessible main landmark", () => {
      render(<ContactPage />);
      expect(screen.getByRole("main")).toBeInTheDocument();
    });

    it("page title uses brand heading font", () => {
      render(<ContactPage />);
      const title = screen.getByRole("heading", { level: 1 });
      expect(title).toHaveClass("font-heading");
    });
  });

  describe("Content Structure", () => {
    it("renders the ContactContent component", () => {
      render(<ContactPage />);
      expect(screen.getByTestId("contact-content")).toBeInTheDocument();
    });

    it("content is wrapped in Container for max-width constraint", () => {
      render(<ContactPage />);
      const content = screen.getByTestId("contact-content");
      const container = content.parentElement;
      expect(container).toHaveClass("mx-auto");
      expect(container).toHaveClass("max-w-6xl");
    });
  });
});
