/**
 * Contact Page Integration Tests
 *
 * Integration tests for the Contact page that test the complete user flow
 * without mocking the form component. These tests verify the acceptance
 * criteria from issue #60 (M9-05):
 *
 * GIVEN the contact page
 * WHEN it loads
 * THEN the contact form is displayed
 *
 * GIVEN a valid contact submission
 * WHEN submitted
 * THEN success message displays
 *
 * GIVEN spam submission (honeypot filled)
 * WHEN submitted
 * THEN no email is sent but user sees "success"
 */

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ContactPage from "@/app/contact/page";

// Mock the fetch API for form submissions
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe("Contact Page Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockReset();
  });

  describe("Contact page load - form displayed", () => {
    /**
     * GIVEN the contact page
     * WHEN it loads
     * THEN the contact form is displayed
     */
    it("displays the contact form when page loads", () => {
      render(<ContactPage />);

      // Form should be present
      const form = screen.getByRole("form", { name: /contact/i });
      expect(form).toBeInTheDocument();
    });

    it("displays name input field", () => {
      render(<ContactPage />);

      const nameInput = screen.getByRole("textbox", { name: /name/i });
      expect(nameInput).toBeInTheDocument();
      expect(nameInput).toBeEnabled();
    });

    it("displays email input field", () => {
      render(<ContactPage />);

      const emailInput = screen.getByRole("textbox", { name: /email/i });
      expect(emailInput).toBeInTheDocument();
      expect(emailInput).toBeEnabled();
    });

    it("displays message textarea", () => {
      render(<ContactPage />);

      const messageInput = screen.getByRole("textbox", { name: /message/i });
      expect(messageInput).toBeInTheDocument();
      expect(messageInput).toBeEnabled();
    });

    it("displays submit button", () => {
      render(<ContactPage />);

      const submitButton = screen.getByRole("button", { name: /send/i });
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toBeEnabled();
    });

    it("form is interactive and accepts user input", async () => {
      const user = userEvent.setup();
      render(<ContactPage />);

      const nameInput = screen.getByRole("textbox", { name: /name/i });
      const emailInput = screen.getByRole("textbox", { name: /email/i });
      const messageInput = screen.getByRole("textbox", { name: /message/i });

      await user.type(nameInput, "Jane Doe");
      await user.type(emailInput, "jane@example.com");
      await user.type(messageInput, "Hello, I have a question.");

      expect(nameInput).toHaveValue("Jane Doe");
      expect(emailInput).toHaveValue("jane@example.com");
      expect(messageInput).toHaveValue("Hello, I have a question.");
    });
  });

  describe("Valid contact submission - success message", () => {
    /**
     * GIVEN a valid contact submission
     * WHEN submitted
     * THEN success message displays
     */
    it("displays success message after valid submission", async () => {
      const user = userEvent.setup();
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          message: "Thank you for your message.",
        }),
      });

      render(<ContactPage />);

      // Fill out the form
      await user.type(
        screen.getByRole("textbox", { name: /name/i }),
        "John Doe"
      );
      await user.type(
        screen.getByRole("textbox", { name: /email/i }),
        "john@example.com"
      );
      await user.type(
        screen.getByRole("textbox", { name: /message/i }),
        "I have a question about plants."
      );

      // Submit the form
      await user.click(screen.getByRole("button", { name: /send/i }));

      // Wait for success message
      await waitFor(() => {
        expect(screen.getByTestId("contact-success")).toBeInTheDocument();
      });
    });

    it("success message contains thank you text", async () => {
      const user = userEvent.setup();
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          message: "Thank you for your message.",
        }),
      });

      render(<ContactPage />);

      await user.type(
        screen.getByRole("textbox", { name: /name/i }),
        "John Doe"
      );
      await user.type(
        screen.getByRole("textbox", { name: /email/i }),
        "john@example.com"
      );
      await user.type(
        screen.getByRole("textbox", { name: /message/i }),
        "Hello!"
      );
      await user.click(screen.getByRole("button", { name: /send/i }));

      await waitFor(() => {
        const success = screen.getByTestId("contact-success");
        expect(success.textContent).toMatch(/thank you/i);
      });
    });

    it("form is hidden after successful submission", async () => {
      const user = userEvent.setup();
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          message: "Thank you for your message.",
        }),
      });

      render(<ContactPage />);

      await user.type(
        screen.getByRole("textbox", { name: /name/i }),
        "John Doe"
      );
      await user.type(
        screen.getByRole("textbox", { name: /email/i }),
        "john@example.com"
      );
      await user.type(
        screen.getByRole("textbox", { name: /message/i }),
        "Hello!"
      );
      await user.click(screen.getByRole("button", { name: /send/i }));

      await waitFor(() => {
        expect(screen.queryByRole("form")).not.toBeInTheDocument();
      });
    });

    it("sends correct data to API endpoint", async () => {
      const user = userEvent.setup();
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          message: "Thank you for your message.",
        }),
      });

      render(<ContactPage />);

      await user.type(
        screen.getByRole("textbox", { name: /name/i }),
        "John Doe"
      );
      await user.type(
        screen.getByRole("textbox", { name: /email/i }),
        "john@example.com"
      );
      await user.type(
        screen.getByRole("textbox", { name: /message/i }),
        "My question here."
      );
      await user.click(screen.getByRole("button", { name: /send/i }));

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          "/api/contact",
          expect.objectContaining({
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: "John Doe",
              email: "john@example.com",
              message: "My question here.",
            }),
          })
        );
      });
    });
  });

  describe("Spam submission with honeypot - silent success", () => {
    /**
     * GIVEN spam submission (honeypot filled)
     * WHEN submitted
     * THEN no email is sent but user sees "success"
     */
    it("shows success message when honeypot is filled (bot detected)", async () => {
      const user = userEvent.setup();
      // Note: In a honeypot scenario, the form doesn't even call the API
      // because it detects the spam on the client side

      render(<ContactPage />);

      // Fill out the form including honeypot
      await user.type(
        screen.getByRole("textbox", { name: /name/i }),
        "Spam Bot"
      );
      await user.type(
        screen.getByRole("textbox", { name: /email/i }),
        "bot@spam.com"
      );
      await user.type(
        screen.getByRole("textbox", { name: /message/i }),
        "Buy cheap products!"
      );

      // Fill the honeypot field (bots would fill this)
      const honeypot = screen.getByTestId("contact-honeypot");
      await user.type(honeypot, "http://spam-link.com");

      // Submit the form
      await user.click(screen.getByRole("button", { name: /send/i }));

      // User should see success (to not reveal honeypot trap)
      await waitFor(() => {
        expect(screen.getByTestId("contact-success")).toBeInTheDocument();
      });
    });

    it("does not call API when honeypot is filled", async () => {
      const user = userEvent.setup();
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      });

      render(<ContactPage />);

      await user.type(
        screen.getByRole("textbox", { name: /name/i }),
        "Spam Bot"
      );
      await user.type(
        screen.getByRole("textbox", { name: /email/i }),
        "bot@spam.com"
      );
      await user.type(
        screen.getByRole("textbox", { name: /message/i }),
        "Spam message"
      );

      // Fill honeypot
      const honeypot = screen.getByTestId("contact-honeypot");
      await user.type(honeypot, "spam-value");

      await user.click(screen.getByRole("button", { name: /send/i }));

      await waitFor(() => {
        expect(screen.getByTestId("contact-success")).toBeInTheDocument();
      });

      // API should NOT have been called
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("honeypot field is hidden from regular users", () => {
      render(<ContactPage />);

      const honeypot = screen.getByTestId("contact-honeypot");
      const container = honeypot.closest("[aria-hidden]");

      // Honeypot container should be hidden from accessibility tree
      expect(container).toHaveAttribute("aria-hidden", "true");
    });

    it("honeypot field is not in keyboard navigation", async () => {
      const user = userEvent.setup();
      render(<ContactPage />);

      const honeypot = screen.getByTestId("contact-honeypot");

      // Tab through all focusable elements
      await user.tab(); // name
      await user.tab(); // email
      await user.tab(); // message
      await user.tab(); // button

      // Honeypot should never receive focus
      expect(honeypot).not.toHaveFocus();
    });
  });

  describe("Error handling", () => {
    it("displays error message when API call fails", async () => {
      const user = userEvent.setup();
      mockFetch.mockResolvedValue({
        ok: false,
        json: async () => ({
          success: false,
          error: "Failed to send message",
        }),
      });

      render(<ContactPage />);

      await user.type(
        screen.getByRole("textbox", { name: /name/i }),
        "John Doe"
      );
      await user.type(
        screen.getByRole("textbox", { name: /email/i }),
        "john@example.com"
      );
      await user.type(
        screen.getByRole("textbox", { name: /message/i }),
        "Hello!"
      );
      await user.click(screen.getByRole("button", { name: /send/i }));

      await waitFor(() => {
        expect(screen.getByTestId("contact-error")).toBeInTheDocument();
      });
    });

    it("allows retry after error", async () => {
      const user = userEvent.setup();
      mockFetch
        .mockResolvedValueOnce({
          ok: false,
          json: async () => ({
            success: false,
            error: "Server error",
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            success: true,
            message: "Thank you",
          }),
        });

      render(<ContactPage />);

      await user.type(
        screen.getByRole("textbox", { name: /name/i }),
        "John Doe"
      );
      await user.type(
        screen.getByRole("textbox", { name: /email/i }),
        "john@example.com"
      );
      await user.type(
        screen.getByRole("textbox", { name: /message/i }),
        "Hello!"
      );

      // First submission fails
      await user.click(screen.getByRole("button", { name: /send/i }));
      await waitFor(() => {
        expect(screen.getByTestId("contact-error")).toBeInTheDocument();
      });

      // Form should still be visible for retry
      expect(screen.getByRole("form")).toBeInTheDocument();

      // Retry submission succeeds
      await user.click(screen.getByRole("button", { name: /send/i }));
      await waitFor(() => {
        expect(screen.getByTestId("contact-success")).toBeInTheDocument();
      });
    });
  });

  describe("Form validation", () => {
    it("requires name field", async () => {
      const user = userEvent.setup();
      render(<ContactPage />);

      // Leave name empty, fill other fields
      await user.type(
        screen.getByRole("textbox", { name: /email/i }),
        "john@example.com"
      );
      await user.type(
        screen.getByRole("textbox", { name: /message/i }),
        "Hello!"
      );

      await user.click(screen.getByRole("button", { name: /send/i }));

      // Name field should be invalid
      expect(screen.getByRole("textbox", { name: /name/i })).toBeInvalid();
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("requires email field", async () => {
      const user = userEvent.setup();
      render(<ContactPage />);

      await user.type(
        screen.getByRole("textbox", { name: /name/i }),
        "John Doe"
      );
      // Leave email empty
      await user.type(
        screen.getByRole("textbox", { name: /message/i }),
        "Hello!"
      );

      await user.click(screen.getByRole("button", { name: /send/i }));

      expect(screen.getByRole("textbox", { name: /email/i })).toBeInvalid();
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("requires message field", async () => {
      const user = userEvent.setup();
      render(<ContactPage />);

      await user.type(
        screen.getByRole("textbox", { name: /name/i }),
        "John Doe"
      );
      await user.type(
        screen.getByRole("textbox", { name: /email/i }),
        "john@example.com"
      );
      // Leave message empty

      await user.click(screen.getByRole("button", { name: /send/i }));

      expect(screen.getByRole("textbox", { name: /message/i })).toBeInvalid();
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe("Accessibility", () => {
    it("page has proper heading hierarchy", () => {
      render(<ContactPage />);

      const h1 = screen.getByRole("heading", { level: 1 });
      expect(h1).toBeInTheDocument();
      expect(h1).toHaveTextContent(/contact/i);
    });

    it("form has accessible name", () => {
      render(<ContactPage />);

      const form = screen.getByRole("form");
      expect(form).toHaveAccessibleName();
    });

    it("all form inputs have accessible labels", () => {
      render(<ContactPage />);

      expect(
        screen.getByRole("textbox", { name: /name/i })
      ).toHaveAccessibleName();
      expect(
        screen.getByRole("textbox", { name: /email/i })
      ).toHaveAccessibleName();
      expect(
        screen.getByRole("textbox", { name: /message/i })
      ).toHaveAccessibleName();
    });

    it("form is keyboard navigable", async () => {
      const user = userEvent.setup();
      render(<ContactPage />);

      await user.tab();
      expect(screen.getByRole("textbox", { name: /name/i })).toHaveFocus();

      await user.tab();
      expect(screen.getByRole("textbox", { name: /email/i })).toHaveFocus();

      await user.tab();
      expect(screen.getByRole("textbox", { name: /message/i })).toHaveFocus();

      await user.tab();
      expect(screen.getByRole("button", { name: /send/i })).toHaveFocus();
    });
  });
});
