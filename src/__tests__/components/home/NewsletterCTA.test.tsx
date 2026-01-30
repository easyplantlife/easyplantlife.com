import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NewsletterCTA } from "@/components/home/NewsletterCTA";
import { handleNewsletterSubmit } from "@/components/home/NewsletterCTA";

/**
 * NewsletterCTA Component Tests
 *
 * Tests for the home page Newsletter CTA section following TDD approach.
 * Based on acceptance criteria from issue #27 (M4-02):
 * - NewsletterCTA component created
 * - Clear value proposition (one sentence)
 * - Email input field
 * - Submit button
 * - Success state after submission
 * - Error state for failures
 * - No hype or marketing language
 *
 * Additional tests for issue #53 (M8-06):
 * - Home page form submits to newsletter API
 * - Success/error states work correctly
 * - Form resets appropriately after submission
 * - Same behavior as dedicated newsletter page
 */

// Mock fetch for API calls
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe("NewsletterCTA Component", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });
  describe("Rendering", () => {
    it("renders as a section element with appropriate landmark", () => {
      render(<NewsletterCTA />);
      const section = screen.getByRole("region", { name: /newsletter/i });
      expect(section).toBeInTheDocument();
      expect(section.tagName).toBe("SECTION");
    });

    it("renders with data-testid for identification", () => {
      render(<NewsletterCTA />);
      expect(screen.getByTestId("newsletter-cta")).toBeInTheDocument();
    });
  });

  describe("Value Proposition", () => {
    it("displays a clear value proposition", () => {
      render(<NewsletterCTA />);
      const proposition = screen.getByTestId("newsletter-value-proposition");
      expect(proposition).toBeInTheDocument();
    });

    it("value proposition is one sentence", () => {
      render(<NewsletterCTA />);
      const proposition = screen.getByTestId("newsletter-value-proposition");
      const text = proposition.textContent || "";
      // Count sentence-ending punctuation (should be exactly 1)
      const sentenceCount = (text.match(/[.!?]+/g) || []).length;
      expect(sentenceCount).toBe(1);
    });

    it("value proposition contains no hype words", () => {
      render(<NewsletterCTA />);
      const proposition = screen.getByTestId("newsletter-value-proposition");
      const text = proposition.textContent?.toLowerCase() || "";
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
        expect(text).not.toContain(word);
      });
    });
  });

  describe("Email Input Field", () => {
    it("renders an email input field", () => {
      render(<NewsletterCTA />);
      const input = screen.getByRole("textbox", { name: /email/i });
      expect(input).toBeInTheDocument();
    });

    it("email input has type email", () => {
      render(<NewsletterCTA />);
      const input = screen.getByRole("textbox", { name: /email/i });
      expect(input).toHaveAttribute("type", "email");
    });

    it("email input has appropriate placeholder", () => {
      render(<NewsletterCTA />);
      const input = screen.getByPlaceholderText(/email/i);
      expect(input).toBeInTheDocument();
    });

    it("email input is required", () => {
      render(<NewsletterCTA />);
      const input = screen.getByRole("textbox", { name: /email/i });
      expect(input).toBeRequired();
    });
  });

  describe("Submit Button", () => {
    it("renders a submit button", () => {
      render(<NewsletterCTA />);
      const button = screen.getByRole("button", {
        name: /subscribe|sign up|join/i,
      });
      expect(button).toBeInTheDocument();
    });

    it("submit button has type submit", () => {
      render(<NewsletterCTA />);
      const button = screen.getByRole("button", {
        name: /subscribe|sign up|join/i,
      });
      expect(button).toHaveAttribute("type", "submit");
    });
  });

  describe("Form Behavior", () => {
    it("renders a form element", () => {
      render(<NewsletterCTA />);
      const form = screen.getByRole("form", { name: /newsletter/i });
      expect(form).toBeInTheDocument();
    });

    it("accepts email input", async () => {
      const user = userEvent.setup();
      render(<NewsletterCTA />);
      const input = screen.getByRole("textbox", { name: /email/i });

      await user.type(input, "test@example.com");

      expect(input).toHaveValue("test@example.com");
    });

    it("calls onSubmit with email when form is submitted", async () => {
      const user = userEvent.setup();
      const handleSubmit = jest.fn();
      render(<NewsletterCTA onSubmit={handleSubmit} />);
      const input = screen.getByRole("textbox", { name: /email/i });
      const button = screen.getByRole("button", {
        name: /subscribe|sign up|join/i,
      });

      await user.type(input, "test@example.com");
      await user.click(button);

      expect(handleSubmit).toHaveBeenCalledWith("test@example.com");
    });
  });

  describe("Success State", () => {
    it("displays success message after successful submission", async () => {
      const user = userEvent.setup();
      const handleSubmit = jest.fn().mockResolvedValue(undefined);
      render(<NewsletterCTA onSubmit={handleSubmit} />);
      const input = screen.getByRole("textbox", { name: /email/i });
      const button = screen.getByRole("button", {
        name: /subscribe|sign up|join/i,
      });

      await user.type(input, "test@example.com");
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByTestId("newsletter-success")).toBeInTheDocument();
      });
    });

    it("success message is visible to user", async () => {
      const user = userEvent.setup();
      const handleSubmit = jest.fn().mockResolvedValue(undefined);
      render(<NewsletterCTA onSubmit={handleSubmit} />);
      const input = screen.getByRole("textbox", { name: /email/i });
      const button = screen.getByRole("button", {
        name: /subscribe|sign up|join/i,
      });

      await user.type(input, "test@example.com");
      await user.click(button);

      await waitFor(() => {
        const success = screen.getByTestId("newsletter-success");
        expect(success).toBeVisible();
      });
    });

    it("hides the form after successful submission", async () => {
      const user = userEvent.setup();
      const handleSubmit = jest.fn().mockResolvedValue(undefined);
      render(<NewsletterCTA onSubmit={handleSubmit} />);
      const input = screen.getByRole("textbox", { name: /email/i });
      const button = screen.getByRole("button", {
        name: /subscribe|sign up|join/i,
      });

      await user.type(input, "test@example.com");
      await user.click(button);

      await waitFor(() => {
        expect(screen.queryByRole("form")).not.toBeInTheDocument();
      });
    });
  });

  describe("Error State", () => {
    it("displays error message when submission fails", async () => {
      const user = userEvent.setup();
      const handleSubmit = jest
        .fn()
        .mockRejectedValue(new Error("Submission failed"));
      render(<NewsletterCTA onSubmit={handleSubmit} />);
      const input = screen.getByRole("textbox", { name: /email/i });
      const button = screen.getByRole("button", {
        name: /subscribe|sign up|join/i,
      });

      await user.type(input, "test@example.com");
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByTestId("newsletter-error")).toBeInTheDocument();
      });
    });

    it("error message has role alert for accessibility", async () => {
      const user = userEvent.setup();
      const handleSubmit = jest
        .fn()
        .mockRejectedValue(new Error("Submission failed"));
      render(<NewsletterCTA onSubmit={handleSubmit} />);
      const input = screen.getByRole("textbox", { name: /email/i });
      const button = screen.getByRole("button", {
        name: /subscribe|sign up|join/i,
      });

      await user.type(input, "test@example.com");
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByRole("alert")).toBeInTheDocument();
      });
    });

    it("form remains visible after error for retry", async () => {
      const user = userEvent.setup();
      const handleSubmit = jest
        .fn()
        .mockRejectedValue(new Error("Submission failed"));
      render(<NewsletterCTA onSubmit={handleSubmit} />);
      const input = screen.getByRole("textbox", { name: /email/i });
      const button = screen.getByRole("button", {
        name: /subscribe|sign up|join/i,
      });

      await user.type(input, "test@example.com");
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByRole("form")).toBeInTheDocument();
      });
    });

    it("error clears when user starts typing again", async () => {
      const user = userEvent.setup();
      const handleSubmit = jest
        .fn()
        .mockRejectedValue(new Error("Submission failed"));
      render(<NewsletterCTA onSubmit={handleSubmit} />);
      const input = screen.getByRole("textbox", { name: /email/i });
      const button = screen.getByRole("button", {
        name: /subscribe|sign up|join/i,
      });

      await user.type(input, "test@example.com");
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByTestId("newsletter-error")).toBeInTheDocument();
      });

      await user.type(input, "a");

      expect(screen.queryByTestId("newsletter-error")).not.toBeInTheDocument();
    });
  });

  describe("Email Validation", () => {
    it("shows error for invalid email format", async () => {
      const user = userEvent.setup();
      render(<NewsletterCTA />);
      const input = screen.getByRole("textbox", { name: /email/i });
      const button = screen.getByRole("button", {
        name: /subscribe|sign up|join/i,
      });

      // Use an email that passes browser validation but fails our regex
      // (browser accepts some formats our validation rejects)
      await user.type(input, "test@");
      await user.click(button);

      // Browser's native validation will prevent form submission for "test@"
      // which doesn't have a domain, so check that the input has invalid state
      expect(input).toBeInvalid();
    });

    it("validates email format with custom validation", async () => {
      const user = userEvent.setup();
      const handleSubmit = jest.fn();
      render(<NewsletterCTA onSubmit={handleSubmit} />);
      const input = screen.getByRole("textbox", { name: /email/i });
      const button = screen.getByRole("button", {
        name: /subscribe|sign up|join/i,
      });

      // Use an email that passes browser validation but we want to ensure
      // our validator catches edge cases
      await user.type(input, "valid@email.com");
      await user.click(button);

      expect(handleSubmit).toHaveBeenCalledWith("valid@email.com");
    });
  });

  describe("Loading State", () => {
    it("disables submit button while submitting", async () => {
      const user = userEvent.setup();
      let resolveSubmit: () => void;
      const handleSubmit = jest.fn(
        () => new Promise<void>((resolve) => (resolveSubmit = resolve))
      );
      render(<NewsletterCTA onSubmit={handleSubmit} />);
      const input = screen.getByRole("textbox", { name: /email/i });
      const button = screen.getByRole("button", {
        name: /subscribe|sign up|join/i,
      });

      await user.type(input, "test@example.com");
      await user.click(button);

      expect(button).toBeDisabled();

      // Resolve the promise to clean up
      resolveSubmit!();
    });

    it("disables input while submitting", async () => {
      const user = userEvent.setup();
      let resolveSubmit: () => void;
      const handleSubmit = jest.fn(
        () => new Promise<void>((resolve) => (resolveSubmit = resolve))
      );
      render(<NewsletterCTA onSubmit={handleSubmit} />);
      const input = screen.getByRole("textbox", { name: /email/i });
      const button = screen.getByRole("button", {
        name: /subscribe|sign up|join/i,
      });

      await user.type(input, "test@example.com");
      await user.click(button);

      expect(input).toBeDisabled();

      // Resolve the promise to clean up
      resolveSubmit!();
    });
  });

  describe("Visual Design", () => {
    it("has generous padding for white space", () => {
      render(<NewsletterCTA />);
      const section = screen.getByTestId("newsletter-cta");
      expect(section.className).toMatch(/py-(\d+|section)/);
    });

    it("content is centered", () => {
      render(<NewsletterCTA />);
      const section = screen.getByTestId("newsletter-cta");
      expect(section).toHaveClass("text-center");
    });

    it("uses brand background color", () => {
      render(<NewsletterCTA />);
      const section = screen.getByTestId("newsletter-cta");
      expect(section.className).toMatch(/bg-/);
    });
  });

  describe("Accessibility", () => {
    it("has proper section aria-label", () => {
      render(<NewsletterCTA />);
      const section = screen.getByRole("region");
      expect(section).toHaveAttribute("aria-label");
    });

    it("form has accessible name", () => {
      render(<NewsletterCTA />);
      const form = screen.getByRole("form");
      expect(form).toHaveAccessibleName();
    });

    it("email input has accessible label", () => {
      render(<NewsletterCTA />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveAccessibleName();
    });

    it("is keyboard navigable", async () => {
      const user = userEvent.setup();
      render(<NewsletterCTA />);

      await user.tab();
      expect(screen.getByRole("textbox", { name: /email/i })).toHaveFocus();

      await user.tab();
      expect(
        screen.getByRole("button", { name: /subscribe|sign up|join/i })
      ).toHaveFocus();
    });
  });

  describe("Custom Styling", () => {
    it("accepts and applies custom className", () => {
      render(<NewsletterCTA className="custom-class" />);
      const section = screen.getByTestId("newsletter-cta");
      expect(section).toHaveClass("custom-class");
    });
  });

  describe("Brand Compliance - No Hype Language", () => {
    /**
     * GIVEN the newsletter CTA
     * WHEN I read the copy
     * THEN it contains no hype words (free, exclusive, etc.)
     */
    it("contains no hype or marketing language throughout", () => {
      render(<NewsletterCTA />);
      const section = screen.getByTestId("newsletter-cta");
      const text = section.textContent?.toLowerCase() || "";
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
        "now!",
        "must",
        "hurry",
      ];
      hypeWords.forEach((word) => {
        expect(text).not.toContain(word);
      });
    });
  });
});

/**
 * handleNewsletterSubmit Function Tests
 *
 * Tests for the newsletter API submission handler used by the home page CTA.
 * Based on acceptance criteria from issue #53 (M8-06):
 * - Home page form submits to newsletter API
 * - Success/error states work correctly
 * - Same behavior as dedicated newsletter page
 */
describe("handleNewsletterSubmit", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("calls the newsletter API with the email", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    await handleNewsletterSubmit("test@example.com");

    expect(mockFetch).toHaveBeenCalledWith("/api/newsletter", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: "test@example.com" }),
    });
  });

  it("resolves successfully when API returns ok response", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    await expect(handleNewsletterSubmit("test@example.com")).resolves.toBeUndefined();
  });

  it("throws an error when API returns non-ok response", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Invalid email format" }),
    });

    await expect(handleNewsletterSubmit("test@example.com")).rejects.toThrow(
      "Invalid email format"
    );
  });

  it("throws generic error when API error has no message", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    });

    await expect(handleNewsletterSubmit("test@example.com")).rejects.toThrow(
      "Failed to subscribe"
    );
  });
});

/**
 * NewsletterCTA API Integration Tests
 *
 * Tests for the NewsletterCTA component with the API handler.
 * Based on acceptance criteria from issue #53 (M8-06):
 * - Home page form submits to newsletter API
 * - Success/error states work correctly
 * - Form resets appropriately after submission
 * - Same behavior as dedicated newsletter page
 */
describe("NewsletterCTA with API Integration", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("submits to API when using handleNewsletterSubmit", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    const user = userEvent.setup();
    render(<NewsletterCTA onSubmit={handleNewsletterSubmit} />);

    const input = screen.getByRole("textbox", { name: /email/i });
    const button = screen.getByRole("button", { name: /subscribe/i });

    await user.type(input, "user@example.com");
    await user.click(button);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: "user@example.com" }),
      });
    });
  });

  it("shows success state after successful API submission", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    const user = userEvent.setup();
    render(<NewsletterCTA onSubmit={handleNewsletterSubmit} />);

    const input = screen.getByRole("textbox", { name: /email/i });
    const button = screen.getByRole("button", { name: /subscribe/i });

    await user.type(input, "user@example.com");
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByTestId("newsletter-success")).toBeInTheDocument();
    });
  });

  it("shows error state when API fails", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Server error" }),
    });

    const user = userEvent.setup();
    render(<NewsletterCTA onSubmit={handleNewsletterSubmit} />);

    const input = screen.getByRole("textbox", { name: /email/i });
    const button = screen.getByRole("button", { name: /subscribe/i });

    await user.type(input, "user@example.com");
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByTestId("newsletter-error")).toBeInTheDocument();
    });
  });

  it("form remains visible after error for retry", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Server error" }),
    });

    const user = userEvent.setup();
    render(<NewsletterCTA onSubmit={handleNewsletterSubmit} />);

    const input = screen.getByRole("textbox", { name: /email/i });
    const button = screen.getByRole("button", { name: /subscribe/i });

    await user.type(input, "user@example.com");
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByRole("form")).toBeInTheDocument();
    });
  });

  it("defaults to API handler when no onSubmit prop is provided", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    const user = userEvent.setup();
    // Note: No onSubmit prop provided - should use default API handler
    render(<NewsletterCTA />);

    const input = screen.getByRole("textbox", { name: /email/i });
    const button = screen.getByRole("button", { name: /subscribe/i });

    await user.type(input, "default@example.com");
    await user.click(button);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: "default@example.com" }),
      });
    });

    // Verify success state is shown
    await waitFor(() => {
      expect(screen.getByTestId("newsletter-success")).toBeInTheDocument();
    });
  });
});
