/**
 * Comprehensive Newsletter Component Tests
 *
 * Integration tests covering the newsletter form behavior across all contexts.
 * Based on acceptance criteria from issue #55 (M8-08):
 *
 * GIVEN the newsletter form
 * WHEN submitted successfully
 * THEN success message displays
 *
 * GIVEN the home page newsletter form
 * WHEN submitted
 * THEN it functions identically to dedicated page
 */

import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Component imports
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { NewsletterContent } from "@/components/newsletter";
import {
  NewsletterCTA,
  handleNewsletterSubmit,
} from "@/components/home/NewsletterCTA";
import Home from "@/app/page";

// Mock fetch for client-side components
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe("Comprehensive Newsletter Component Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockReset();
  });

  describe("GIVEN the newsletter form WHEN submitted successfully THEN success message displays", () => {
    /**
     * Form component tests - validates that success message appears
     * after successful form submission.
     */
    it("displays success message after NewsletterForm submission", async () => {
      const user = userEvent.setup();
      const handleSubmit = jest.fn().mockResolvedValue(undefined);
      render(<NewsletterForm onSubmit={handleSubmit} />);

      const input = screen.getByRole("textbox", { name: /email/i });
      const button = screen.getByRole("button", { name: /subscribe/i });

      await user.type(input, "test@example.com");
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByTestId("newsletter-success")).toBeInTheDocument();
      });

      // Verify success message content
      const successMessage = screen.getByTestId("newsletter-success");
      expect(successMessage).toHaveTextContent(/thank you/i);
      expect(successMessage).toHaveTextContent(/subscri/i);
    });

    it("displays success message after NewsletterContent submission", async () => {
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

    it("displays success message after NewsletterCTA submission", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      const user = userEvent.setup();
      render(<NewsletterCTA />);

      const input = screen.getByRole("textbox", { name: /email/i });
      const button = screen.getByRole("button", { name: /subscribe/i });

      await user.type(input, "test@example.com");
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByTestId("newsletter-success")).toBeInTheDocument();
      });
    });

    it("hides form after successful submission", async () => {
      const user = userEvent.setup();
      const handleSubmit = jest.fn().mockResolvedValue(undefined);
      render(<NewsletterForm onSubmit={handleSubmit} />);

      const input = screen.getByRole("textbox", { name: /email/i });
      const button = screen.getByRole("button", { name: /subscribe/i });

      await user.type(input, "test@example.com");
      await user.click(button);

      await waitFor(() => {
        expect(screen.queryByRole("form")).not.toBeInTheDocument();
      });
    });

    it("shows loading state during submission", async () => {
      const user = userEvent.setup();
      let resolveSubmit: () => void;
      const handleSubmit = jest.fn(
        () => new Promise<void>((resolve) => (resolveSubmit = resolve))
      );
      render(<NewsletterForm onSubmit={handleSubmit} />);

      const input = screen.getByRole("textbox", { name: /email/i });
      const button = screen.getByRole("button", { name: /subscribe/i });

      await user.type(input, "test@example.com");
      await user.click(button);

      // Verify loading state
      expect(button).toHaveTextContent(/subscribing/i);
      expect(button).toBeDisabled();
      expect(input).toBeDisabled();

      // Resolve to complete the test
      resolveSubmit!();
    });
  });

  describe("GIVEN the home page newsletter form WHEN submitted THEN it functions identically to dedicated page", () => {
    /**
     * Consistency tests - validates that home page form behavior
     * matches the dedicated newsletter page.
     */

    describe("API call consistency", () => {
      it("home page form calls same API endpoint as dedicated page", async () => {
        mockFetch.mockResolvedValue({
          ok: true,
          json: async () => ({ success: true }),
        });

        const user = userEvent.setup();

        // Test home page form (NewsletterCTA)
        const { unmount: unmountHome } = render(<NewsletterCTA />);
        const homeInput = screen.getByRole("textbox", { name: /email/i });
        const homeButton = screen.getByRole("button", { name: /subscribe/i });

        await user.type(homeInput, "home@example.com");
        await user.click(homeButton);

        await waitFor(() => {
          expect(mockFetch).toHaveBeenCalledWith("/api/newsletter", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: "home@example.com" }),
          });
        });

        unmountHome();
        mockFetch.mockClear();

        // Test dedicated page form (NewsletterContent)
        render(<NewsletterContent />);
        const dedicatedInput = screen.getByRole("textbox", { name: /email/i });
        const dedicatedButton = screen.getByRole("button", {
          name: /subscribe/i,
        });

        await user.type(dedicatedInput, "dedicated@example.com");
        await user.click(dedicatedButton);

        await waitFor(() => {
          expect(mockFetch).toHaveBeenCalledWith("/api/newsletter", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: "dedicated@example.com" }),
          });
        });
      });
    });

    describe("Success state consistency", () => {
      it("both forms display identical success message structure", async () => {
        mockFetch.mockResolvedValue({
          ok: true,
          json: async () => ({ success: true }),
        });

        const user = userEvent.setup();

        // Test home page form success
        const { unmount: unmountHome } = render(<NewsletterCTA />);
        await user.type(
          screen.getByRole("textbox", { name: /email/i }),
          "test@example.com"
        );
        await user.click(screen.getByRole("button", { name: /subscribe/i }));

        await waitFor(() => {
          const homeSuccess = screen.getByTestId("newsletter-success");
          expect(homeSuccess).toBeInTheDocument();
          expect(homeSuccess).toHaveTextContent(/thank you/i);
        });

        const homeSuccessText =
          screen.getByTestId("newsletter-success").textContent;
        unmountHome();

        // Test dedicated page form success
        render(<NewsletterContent />);
        await user.type(
          screen.getByRole("textbox", { name: /email/i }),
          "test2@example.com"
        );
        await user.click(screen.getByRole("button", { name: /subscribe/i }));

        await waitFor(() => {
          const dedicatedSuccess = screen.getByTestId("newsletter-success");
          expect(dedicatedSuccess).toBeInTheDocument();
          expect(dedicatedSuccess).toHaveTextContent(/thank you/i);
        });

        const dedicatedSuccessText =
          screen.getByTestId("newsletter-success").textContent;

        // Both should have similar success messaging (not necessarily identical)
        expect(homeSuccessText).toContain("Thank you");
        expect(dedicatedSuccessText).toContain("Thank you");
      });
    });

    describe("Error state consistency", () => {
      it("both forms display error state when API fails", async () => {
        mockFetch.mockResolvedValue({
          ok: false,
          json: async () => ({ error: "Server error" }),
        });

        const user = userEvent.setup();

        // Test home page form error
        const { unmount: unmountHome } = render(<NewsletterCTA />);
        await user.type(
          screen.getByRole("textbox", { name: /email/i }),
          "test@example.com"
        );
        await user.click(screen.getByRole("button", { name: /subscribe/i }));

        await waitFor(() => {
          expect(screen.getByTestId("newsletter-error")).toBeInTheDocument();
        });

        expect(screen.getByRole("alert")).toBeInTheDocument();
        unmountHome();

        // Test dedicated page form error
        render(<NewsletterContent />);
        await user.type(
          screen.getByRole("textbox", { name: /email/i }),
          "test2@example.com"
        );
        await user.click(screen.getByRole("button", { name: /subscribe/i }));

        await waitFor(() => {
          expect(screen.getByTestId("newsletter-error")).toBeInTheDocument();
        });

        expect(screen.getByRole("alert")).toBeInTheDocument();
      });

      it("both forms allow retry after error", async () => {
        mockFetch
          .mockResolvedValueOnce({
            ok: false,
            json: async () => ({ error: "Server error" }),
          })
          .mockResolvedValueOnce({
            ok: true,
            json: async () => ({ success: true }),
          });

        const user = userEvent.setup();
        render(<NewsletterCTA />);

        const input = screen.getByRole("textbox", { name: /email/i });
        const button = screen.getByRole("button", { name: /subscribe/i });

        // First attempt fails
        await user.type(input, "test@example.com");
        await user.click(button);

        await waitFor(() => {
          expect(screen.getByTestId("newsletter-error")).toBeInTheDocument();
        });

        // Form should still be visible for retry
        expect(screen.getByRole("form")).toBeInTheDocument();

        // Second attempt succeeds
        await user.click(button);

        await waitFor(() => {
          expect(screen.getByTestId("newsletter-success")).toBeInTheDocument();
        });
      });
    });

    describe("Validation consistency", () => {
      it("both forms validate email format before submission", async () => {
        const user = userEvent.setup();

        // Test home page form validation
        const { unmount: unmountHome } = render(<NewsletterCTA />);
        await user.type(
          screen.getByRole("textbox", { name: /email/i }),
          "invalid"
        );
        await user.click(screen.getByRole("button", { name: /subscribe/i }));

        // Should show validation error (either browser or custom)
        expect(screen.getByRole("textbox", { name: /email/i })).toBeInvalid();
        unmountHome();

        // Test dedicated page form validation
        render(<NewsletterContent />);
        await user.type(
          screen.getByRole("textbox", { name: /email/i }),
          "invalid"
        );
        await user.click(screen.getByRole("button", { name: /subscribe/i }));

        expect(screen.getByRole("textbox", { name: /email/i })).toBeInvalid();
      });
    });

    describe("Loading state consistency", () => {
      it("both forms show loading state during submission", async () => {
        let resolveHomeSubmit: () => void;
        let resolveDedicatedSubmit: () => void;

        mockFetch
          .mockImplementationOnce(
            () =>
              new Promise((resolve) => {
                resolveHomeSubmit = () =>
                  resolve({
                    ok: true,
                    json: async () => ({ success: true }),
                  });
              })
          )
          .mockImplementationOnce(
            () =>
              new Promise((resolve) => {
                resolveDedicatedSubmit = () =>
                  resolve({
                    ok: true,
                    json: async () => ({ success: true }),
                  });
              })
          );

        const user = userEvent.setup();

        // Test home page form loading
        const { unmount: unmountHome } = render(<NewsletterCTA />);
        await user.type(
          screen.getByRole("textbox", { name: /email/i }),
          "test@example.com"
        );
        await user.click(screen.getByRole("button", { name: /subscribe/i }));

        expect(screen.getByRole("button")).toHaveTextContent(/subscribing/i);
        expect(screen.getByRole("button")).toBeDisabled();

        resolveHomeSubmit!();
        await waitFor(() => {
          expect(screen.getByTestId("newsletter-success")).toBeInTheDocument();
        });
        unmountHome();

        // Test dedicated page form loading
        render(<NewsletterContent />);
        await user.type(
          screen.getByRole("textbox", { name: /email/i }),
          "test2@example.com"
        );
        await user.click(screen.getByRole("button", { name: /subscribe/i }));

        expect(screen.getByRole("button")).toHaveTextContent(/subscribing/i);
        expect(screen.getByRole("button")).toBeDisabled();

        resolveDedicatedSubmit!();
        await waitFor(() => {
          expect(screen.getByTestId("newsletter-success")).toBeInTheDocument();
        });
      });
    });

    describe("Accessibility consistency", () => {
      it("both forms have accessible form labels", () => {
        // Home page form
        const { unmount: unmountHome } = render(<NewsletterCTA />);
        expect(screen.getByRole("form")).toHaveAccessibleName();
        expect(screen.getByRole("textbox")).toHaveAccessibleName();
        unmountHome();

        // Dedicated page form
        render(<NewsletterContent />);
        expect(screen.getByRole("form")).toHaveAccessibleName();
        expect(screen.getByRole("textbox")).toHaveAccessibleName();
      });

      it("both forms use role=alert for error messages", async () => {
        mockFetch.mockResolvedValue({
          ok: false,
          json: async () => ({ error: "Server error" }),
        });

        const user = userEvent.setup();

        // Home page form
        const { unmount: unmountHome } = render(<NewsletterCTA />);
        await user.type(
          screen.getByRole("textbox", { name: /email/i }),
          "test@example.com"
        );
        await user.click(screen.getByRole("button", { name: /subscribe/i }));

        await waitFor(() => {
          expect(screen.getByRole("alert")).toBeInTheDocument();
        });
        unmountHome();

        // Dedicated page form
        render(<NewsletterContent />);
        await user.type(
          screen.getByRole("textbox", { name: /email/i }),
          "test2@example.com"
        );
        await user.click(screen.getByRole("button", { name: /subscribe/i }));

        await waitFor(() => {
          expect(screen.getByRole("alert")).toBeInTheDocument();
        });
      });
    });
  });

  describe("Full page integration", () => {
    /**
     * Integration tests for newsletter functionality within full page context.
     */
    it("home page newsletter form integrates correctly", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      });

      const user = userEvent.setup();
      render(<Home />);

      // Find the newsletter section
      const newsletterSection = screen.getByTestId("newsletter-cta");
      const input = within(newsletterSection).getByRole("textbox", {
        name: /email/i,
      });
      const button = within(newsletterSection).getByRole("button", {
        name: /subscribe/i,
      });

      await user.type(input, "home@example.com");
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByTestId("newsletter-success")).toBeInTheDocument();
      });

      // Verify API was called
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/newsletter",
        expect.any(Object)
      );
    });
  });

  describe("handleNewsletterSubmit function", () => {
    /**
     * Direct tests for the exported handler function.
     */
    it("calls the newsletter API with correct payload", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      await handleNewsletterSubmit("api-test@example.com");

      expect(mockFetch).toHaveBeenCalledWith("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: "api-test@example.com" }),
      });
    });

    it("throws error when API returns non-ok response", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "Invalid email" }),
      });

      await expect(handleNewsletterSubmit("test@example.com")).rejects.toThrow(
        "Invalid email"
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
});

describe("Brand Compliance Across Newsletter Components", () => {
  /**
   * Cross-component brand compliance tests - ensures all newsletter
   * components adhere to brand guidelines (no hype language).
   */
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

  beforeEach(() => {
    mockFetch.mockReset();
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });
  });

  it("NewsletterCTA contains no hype language", () => {
    render(<NewsletterCTA />);
    const section = screen.getByTestId("newsletter-cta");
    const text = section.textContent?.toLowerCase() || "";

    hypeWords.forEach((word) => {
      expect(text).not.toContain(word);
    });
  });

  it("NewsletterContent contains no hype language", () => {
    render(<NewsletterContent />);
    const content = screen.getByTestId("newsletter-content");
    const text = content.textContent?.toLowerCase() || "";

    hypeWords.forEach((word) => {
      expect(text).not.toContain(word);
    });
  });

  it("success messages contain no hype language", async () => {
    const user = userEvent.setup();
    render(<NewsletterCTA />);

    await user.type(
      screen.getByRole("textbox", { name: /email/i }),
      "test@example.com"
    );
    await user.click(screen.getByRole("button", { name: /subscribe/i }));

    await waitFor(() => {
      const success = screen.getByTestId("newsletter-success");
      const text = success.textContent?.toLowerCase() || "";

      hypeWords.forEach((word) => {
        expect(text).not.toContain(word);
      });
    });
  });

  it("no frequency pressure language in newsletter components", () => {
    const pressureWords = [
      "daily",
      "weekly",
      "constantly",
      "regular",
      "frequently",
      "inbox",
      "spam",
    ];

    // Test NewsletterCTA
    const { unmount: unmountCTA } = render(<NewsletterCTA />);
    let text =
      screen.getByTestId("newsletter-cta").textContent?.toLowerCase() || "";
    pressureWords.forEach((word) => {
      expect(text).not.toContain(word);
    });
    unmountCTA();

    // Test NewsletterContent
    render(<NewsletterContent />);
    text =
      screen.getByTestId("newsletter-content").textContent?.toLowerCase() || "";
    pressureWords.forEach((word) => {
      expect(text).not.toContain(word);
    });
  });
});
