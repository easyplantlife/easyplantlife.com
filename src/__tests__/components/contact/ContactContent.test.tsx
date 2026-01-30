import { render, screen } from "@testing-library/react";
import { ContactContent } from "@/components/contact";

/**
 * ContactContent Component Tests
 *
 * Tests for the contact page content component following TDD approach.
 * This component contains the introductory text and contact form.
 */

// Mock the ContactForm component to isolate content tests
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

describe("ContactContent", () => {
  describe("Rendering", () => {
    it("renders the component with data-testid", () => {
      render(<ContactContent />);
      expect(screen.getByTestId("contact-content")).toBeInTheDocument();
    });

    it("renders as an article element", () => {
      render(<ContactContent />);
      const content = screen.getByTestId("contact-content");
      expect(content.tagName).toBe("ARTICLE");
    });

    it("accepts additional className prop", () => {
      render(<ContactContent className="mt-8" />);
      const content = screen.getByTestId("contact-content");
      expect(content).toHaveClass("mt-8");
    });
  });

  describe("Introductory Text", () => {
    it("displays introductory text about getting in touch", () => {
      render(<ContactContent />);
      const text = screen.getByText(
        /question|get in touch|hear|message|reach/i
      );
      expect(text).toBeInTheDocument();
    });

    it("introductory text uses secondary color for calm tone", () => {
      render(<ContactContent />);
      const text = screen.getByText(
        /question|get in touch|hear|message|reach/i
      );
      expect(text).toHaveClass("text-text-secondary");
    });

    it("introductory text has max-width for readability", () => {
      render(<ContactContent />);
      const text = screen.getByText(
        /question|get in touch|hear|message|reach/i
      );
      expect(text.className).toMatch(/max-w/);
    });
  });

  describe("Contact Form Integration", () => {
    it("renders the ContactForm component", () => {
      render(<ContactContent />);
      expect(screen.getByTestId("contact-form")).toBeInTheDocument();
    });

    it("contact form has width constraints", () => {
      render(<ContactContent />);
      const form = screen.getByTestId("contact-form");
      expect(form.className).toMatch(/w-full/);
    });

    it("form is wrapped in container with max-width", () => {
      render(<ContactContent />);
      const form = screen.getByTestId("contact-form");
      const wrapper = form.parentElement;
      expect(wrapper?.className).toMatch(/max-w/);
    });
  });

  describe("Layout and Spacing", () => {
    it("has vertical spacing between elements", () => {
      render(<ContactContent />);
      const content = screen.getByTestId("contact-content");
      expect(content).toHaveClass("space-y-8");
    });
  });

  describe("Brand Compliance", () => {
    it("does not contain hype language", () => {
      render(<ContactContent />);
      const content = screen.getByTestId("contact-content");
      const text = content.textContent?.toLowerCase() || "";
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
      ];
      hypeWords.forEach((word) => {
        expect(text).not.toContain(word);
      });
    });

    it("uses calm, honest tone", () => {
      render(<ContactContent />);
      const content = screen.getByTestId("contact-content");
      const text = content.textContent?.toLowerCase() || "";
      // Should not contain pushy language
      expect(text).not.toContain("must");
      expect(text).not.toContain("hurry");
      expect(text).not.toContain("now!");
    });
  });
});
