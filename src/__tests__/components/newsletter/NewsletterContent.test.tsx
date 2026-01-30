import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NewsletterContent } from "@/components/newsletter";

/**
 * NewsletterContent Component Tests
 *
 * Tests for the NewsletterContent component.
 * Based on acceptance criteria from issue #52 (M8-05):
 * - One-sentence promise/value proposition
 * - Newsletter form prominent
 * - Clear confirmation states
 * - Tone: no hype, no frequency pressure
 */

// Mock fetch for API calls
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe("NewsletterContent Component", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  describe("Rendering", () => {
    it("renders with data-testid for identification", () => {
      render(<NewsletterContent />);
      expect(screen.getByTestId("newsletter-content")).toBeInTheDocument();
    });

    it("renders as an article element", () => {
      render(<NewsletterContent />);
      expect(screen.getByRole("article")).toBeInTheDocument();
    });
  });

  describe("Value Proposition", () => {
    it("displays value proposition text", () => {
      render(<NewsletterContent />);
      expect(
        screen.getByText(/thoughtful|updates|plant|living/i)
      ).toBeInTheDocument();
    });

    it("value proposition mentions thoughtful updates", () => {
      render(<NewsletterContent />);
      expect(screen.getByText(/thoughtful/i)).toBeInTheDocument();
    });

    it("value proposition avoids frequency commitment", () => {
      render(<NewsletterContent />);
      const text =
        screen.getByTestId("newsletter-content").textContent?.toLowerCase() ||
        "";
      expect(text).not.toMatch(/daily|weekly|monthly|every/);
    });
  });

  describe("Newsletter Form Integration", () => {
    it("renders the newsletter form", () => {
      render(<NewsletterContent />);
      expect(screen.getByTestId("newsletter-form")).toBeInTheDocument();
    });

    it("form is connected to the API on submit", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      const user = userEvent.setup();
      render(<NewsletterContent />);

      const input = screen.getByRole("textbox", { name: /email/i });
      const button = screen.getByRole("button", { name: /subscribe/i });

      await user.type(input, "test@example.com");
      await user.click(button);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith("/api/newsletter", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: "test@example.com" }),
        });
      });
    });

    it("shows success message after successful submission", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      const user = userEvent.setup();
      render(<NewsletterContent />);

      const input = screen.getByRole("textbox", { name: /email/i });
      const button = screen.getByRole("button", { name: /subscribe/i });

      await user.type(input, "test@example.com");
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByTestId("newsletter-success")).toBeInTheDocument();
      });
    });

    it("shows error message when API fails", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "Failed to subscribe" }),
      });

      const user = userEvent.setup();
      render(<NewsletterContent />);

      const input = screen.getByRole("textbox", { name: /email/i });
      const button = screen.getByRole("button", { name: /subscribe/i });

      await user.type(input, "test@example.com");
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByTestId("newsletter-error")).toBeInTheDocument();
      });
    });
  });

  describe("Brand Compliance", () => {
    it("contains no hype language", () => {
      render(<NewsletterContent />);
      const content =
        screen.getByTestId("newsletter-content").textContent?.toLowerCase() ||
        "";
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
      ];
      hypeWords.forEach((word) => {
        expect(content).not.toContain(word);
      });
    });

    it("contains no frequency pressure language", () => {
      render(<NewsletterContent />);
      const content =
        screen.getByTestId("newsletter-content").textContent?.toLowerCase() ||
        "";
      const pressureWords = [
        "daily",
        "weekly",
        "constantly",
        "regular",
        "frequently",
        "inbox",
        "spam",
      ];
      pressureWords.forEach((word) => {
        expect(content).not.toContain(word);
      });
    });
  });

  describe("Custom Styling", () => {
    it("accepts and applies custom className", () => {
      render(<NewsletterContent className="custom-class" />);
      expect(screen.getByTestId("newsletter-content")).toHaveClass(
        "custom-class"
      );
    });
  });

  describe("Accessibility", () => {
    it("uses semantic article element", () => {
      render(<NewsletterContent />);
      expect(screen.getByRole("article")).toBeInTheDocument();
    });
  });
});
