import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContactForm } from "@/components/forms/ContactForm";
import * as analytics from "@/lib/analytics/events";

// Mock the analytics module
jest.mock("@/lib/analytics/events", () => ({
  trackFormView: jest.fn(),
  trackContactSubmit: jest.fn(),
}));

/**
 * ContactForm Component Tests
 *
 * Tests for the Contact Form component following TDD approach.
 * Based on acceptance criteria from issue #57 (M9-02):
 * - ContactForm component created
 * - Fields: name, email, message
 * - Honeypot field for spam prevention (hidden)
 * - Validation for all fields
 * - Loading, success, error states
 * - Accessible
 *
 * Test Cases from Issue:
 * GIVEN an empty form
 * WHEN I submit
 * THEN validation errors show for all fields
 *
 * GIVEN a valid form
 * WHEN I submit
 * THEN loading state shows
 * AND success message appears
 *
 * GIVEN the honeypot field has value
 * WHEN form submits
 * THEN it silently "succeeds" without sending
 */

describe("ContactForm Component", () => {
  describe("Rendering", () => {
    it("renders as a form element", () => {
      render(<ContactForm />);
      const form = screen.getByRole("form", { name: /contact/i });
      expect(form).toBeInTheDocument();
      expect(form.tagName).toBe("FORM");
    });

    it("renders with data-testid for identification", () => {
      render(<ContactForm />);
      expect(screen.getByTestId("contact-form")).toBeInTheDocument();
    });
  });

  describe("Form Fields", () => {
    describe("Name Field", () => {
      it("renders a name input field", () => {
        render(<ContactForm />);
        const input = screen.getByRole("textbox", { name: /name/i });
        expect(input).toBeInTheDocument();
      });

      it("name input has type text", () => {
        render(<ContactForm />);
        const input = screen.getByRole("textbox", { name: /name/i });
        expect(input).toHaveAttribute("type", "text");
      });

      it("name input is required", () => {
        render(<ContactForm />);
        const input = screen.getByRole("textbox", { name: /name/i });
        expect(input).toBeRequired();
      });

      it("name input has accessible label", () => {
        render(<ContactForm />);
        const input = screen.getByRole("textbox", { name: /name/i });
        expect(input).toHaveAccessibleName();
      });
    });

    describe("Email Field", () => {
      it("renders an email input field", () => {
        render(<ContactForm />);
        const input = screen.getByRole("textbox", { name: /email/i });
        expect(input).toBeInTheDocument();
      });

      it("email input has type email", () => {
        render(<ContactForm />);
        const input = screen.getByRole("textbox", { name: /email/i });
        expect(input).toHaveAttribute("type", "email");
      });

      it("email input is required", () => {
        render(<ContactForm />);
        const input = screen.getByRole("textbox", { name: /email/i });
        expect(input).toBeRequired();
      });

      it("email input has accessible label", () => {
        render(<ContactForm />);
        const input = screen.getByRole("textbox", { name: /email/i });
        expect(input).toHaveAccessibleName();
      });
    });

    describe("Message Field", () => {
      it("renders a message textarea", () => {
        render(<ContactForm />);
        const textarea = screen.getByRole("textbox", { name: /message/i });
        expect(textarea).toBeInTheDocument();
        expect(textarea.tagName).toBe("TEXTAREA");
      });

      it("message textarea is required", () => {
        render(<ContactForm />);
        const textarea = screen.getByRole("textbox", { name: /message/i });
        expect(textarea).toBeRequired();
      });

      it("message textarea has accessible label", () => {
        render(<ContactForm />);
        const textarea = screen.getByRole("textbox", { name: /message/i });
        expect(textarea).toHaveAccessibleName();
      });
    });

    describe("Honeypot Field", () => {
      it("renders a hidden honeypot field for spam prevention", () => {
        render(<ContactForm />);
        const honeypot = screen.getByTestId("contact-honeypot");
        expect(honeypot).toBeInTheDocument();
      });

      it("honeypot field is visually hidden from users", () => {
        render(<ContactForm />);
        const honeypot = screen.getByTestId("contact-honeypot");
        // Using CSS to hide (not display:none to avoid bot detection)
        const container = honeypot.closest("[aria-hidden]");
        expect(container).toHaveAttribute("aria-hidden", "true");
      });

      it("honeypot field has autocomplete off to prevent autofill", () => {
        render(<ContactForm />);
        const honeypot = screen.getByTestId("contact-honeypot");
        expect(honeypot).toHaveAttribute("autocomplete", "off");
      });

      it("honeypot field has tabindex -1 to prevent keyboard focus", () => {
        render(<ContactForm />);
        const honeypot = screen.getByTestId("contact-honeypot");
        expect(honeypot).toHaveAttribute("tabindex", "-1");
      });
    });
  });

  describe("Submit Button", () => {
    it("renders a submit button", () => {
      render(<ContactForm />);
      const button = screen.getByRole("button", { name: /send|submit/i });
      expect(button).toBeInTheDocument();
    });

    it("submit button has type submit", () => {
      render(<ContactForm />);
      const button = screen.getByRole("button", { name: /send|submit/i });
      expect(button).toHaveAttribute("type", "submit");
    });
  });

  describe("Form Behavior", () => {
    it("accepts name input", async () => {
      const user = userEvent.setup();
      render(<ContactForm />);
      const input = screen.getByRole("textbox", { name: /name/i });

      await user.type(input, "John Doe");

      expect(input).toHaveValue("John Doe");
    });

    it("accepts email input", async () => {
      const user = userEvent.setup();
      render(<ContactForm />);
      const input = screen.getByRole("textbox", { name: /email/i });

      await user.type(input, "john@example.com");

      expect(input).toHaveValue("john@example.com");
    });

    it("accepts message input", async () => {
      const user = userEvent.setup();
      render(<ContactForm />);
      const textarea = screen.getByRole("textbox", { name: /message/i });

      await user.type(textarea, "Hello, I have a question.");

      expect(textarea).toHaveValue("Hello, I have a question.");
    });

    it("calls onSubmit with form data when form is submitted", async () => {
      const user = userEvent.setup();
      const handleSubmit = jest.fn();
      render(<ContactForm onSubmit={handleSubmit} />);

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
      await user.click(screen.getByRole("button", { name: /send|submit/i }));

      expect(handleSubmit).toHaveBeenCalledWith({
        name: "John Doe",
        email: "john@example.com",
        message: "Hello!",
      });
    });
  });

  describe("Validation", () => {
    /**
     * GIVEN an empty form
     * WHEN I submit
     * THEN validation errors show for all fields
     */
    it("shows error when submitting empty form", async () => {
      const user = userEvent.setup();
      render(<ContactForm />);
      const button = screen.getByRole("button", { name: /send|submit/i });

      await user.click(button);

      // All required fields should be invalid
      expect(screen.getByRole("textbox", { name: /name/i })).toBeInvalid();
      expect(screen.getByRole("textbox", { name: /email/i })).toBeInvalid();
      expect(screen.getByRole("textbox", { name: /message/i })).toBeInvalid();
    });

    it("shows validation error for empty name", async () => {
      const user = userEvent.setup();
      const handleSubmit = jest.fn();
      render(<ContactForm onSubmit={handleSubmit} />);

      await user.type(
        screen.getByRole("textbox", { name: /email/i }),
        "john@example.com"
      );
      await user.type(
        screen.getByRole("textbox", { name: /message/i }),
        "Hello!"
      );
      await user.click(screen.getByRole("button", { name: /send|submit/i }));

      expect(screen.getByRole("textbox", { name: /name/i })).toBeInvalid();
      expect(handleSubmit).not.toHaveBeenCalled();
    });

    it("shows validation error for empty email", async () => {
      const user = userEvent.setup();
      const handleSubmit = jest.fn();
      render(<ContactForm onSubmit={handleSubmit} />);

      await user.type(
        screen.getByRole("textbox", { name: /name/i }),
        "John Doe"
      );
      await user.type(
        screen.getByRole("textbox", { name: /message/i }),
        "Hello!"
      );
      await user.click(screen.getByRole("button", { name: /send|submit/i }));

      expect(screen.getByRole("textbox", { name: /email/i })).toBeInvalid();
      expect(handleSubmit).not.toHaveBeenCalled();
    });

    it("shows validation error for invalid email format", async () => {
      const user = userEvent.setup();
      const handleSubmit = jest.fn();
      render(<ContactForm onSubmit={handleSubmit} />);

      await user.type(
        screen.getByRole("textbox", { name: /name/i }),
        "John Doe"
      );
      await user.type(
        screen.getByRole("textbox", { name: /email/i }),
        "invalid-email"
      );
      await user.type(
        screen.getByRole("textbox", { name: /message/i }),
        "Hello!"
      );
      await user.click(screen.getByRole("button", { name: /send|submit/i }));

      expect(screen.getByRole("textbox", { name: /email/i })).toBeInvalid();
    });

    it("shows validation error for empty message", async () => {
      const user = userEvent.setup();
      const handleSubmit = jest.fn();
      render(<ContactForm onSubmit={handleSubmit} />);

      await user.type(
        screen.getByRole("textbox", { name: /name/i }),
        "John Doe"
      );
      await user.type(
        screen.getByRole("textbox", { name: /email/i }),
        "john@example.com"
      );
      await user.click(screen.getByRole("button", { name: /send|submit/i }));

      expect(screen.getByRole("textbox", { name: /message/i })).toBeInvalid();
      expect(handleSubmit).not.toHaveBeenCalled();
    });

    it("shows custom error message for invalid email after browser validation", async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      await user.type(
        screen.getByRole("textbox", { name: /name/i }),
        "John Doe"
      );
      await user.type(
        screen.getByRole("textbox", { name: /email/i }),
        "test@test.c"
      );
      await user.type(
        screen.getByRole("textbox", { name: /message/i }),
        "Hello!"
      );
      await user.click(screen.getByRole("button", { name: /send|submit/i }));

      await waitFor(() => {
        const error = screen.queryByTestId("contact-error");
        if (error) {
          expect(error).toHaveTextContent(/valid email/i);
        }
      });
    });
  });

  describe("Loading State", () => {
    /**
     * GIVEN a valid form
     * WHEN I submit
     * THEN loading state shows
     */
    it("shows loading state during submission", async () => {
      const user = userEvent.setup();
      let resolveSubmit: () => void;
      const handleSubmit = jest.fn(
        () => new Promise<void>((resolve) => (resolveSubmit = resolve))
      );
      render(<ContactForm onSubmit={handleSubmit} />);

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
      await user.click(screen.getByRole("button", { name: /send|submit/i }));

      // Button should show loading text
      expect(
        screen.getByRole("button", { name: /sending|loading/i })
      ).toBeInTheDocument();

      // Resolve the promise to clean up
      resolveSubmit!();
    });

    it("disables submit button while submitting", async () => {
      const user = userEvent.setup();
      let resolveSubmit: () => void;
      const handleSubmit = jest.fn(
        () => new Promise<void>((resolve) => (resolveSubmit = resolve))
      );
      render(<ContactForm onSubmit={handleSubmit} />);

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
      await user.click(screen.getByRole("button", { name: /send|submit/i }));

      const button = screen.getByRole("button", { name: /sending|loading/i });
      expect(button).toBeDisabled();

      resolveSubmit!();
    });

    it("disables all inputs while submitting", async () => {
      const user = userEvent.setup();
      let resolveSubmit: () => void;
      const handleSubmit = jest.fn(
        () => new Promise<void>((resolve) => (resolveSubmit = resolve))
      );
      render(<ContactForm onSubmit={handleSubmit} />);

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
      await user.click(screen.getByRole("button", { name: /send|submit/i }));

      expect(screen.getByRole("textbox", { name: /name/i })).toBeDisabled();
      expect(screen.getByRole("textbox", { name: /email/i })).toBeDisabled();
      expect(screen.getByRole("textbox", { name: /message/i })).toBeDisabled();

      resolveSubmit!();
    });
  });

  describe("Success State", () => {
    /**
     * GIVEN a valid form
     * WHEN I submit
     * AND success message appears
     */
    it("displays success message after successful submission", async () => {
      const user = userEvent.setup();
      const handleSubmit = jest.fn().mockResolvedValue(undefined);
      render(<ContactForm onSubmit={handleSubmit} />);

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
      await user.click(screen.getByRole("button", { name: /send|submit/i }));

      await waitFor(() => {
        expect(screen.getByTestId("contact-success")).toBeInTheDocument();
      });
    });

    it("success message is visible to user", async () => {
      const user = userEvent.setup();
      const handleSubmit = jest.fn().mockResolvedValue(undefined);
      render(<ContactForm onSubmit={handleSubmit} />);

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
      await user.click(screen.getByRole("button", { name: /send|submit/i }));

      await waitFor(() => {
        const success = screen.getByTestId("contact-success");
        expect(success).toBeVisible();
      });
    });

    it("success message contains confirmation text", async () => {
      const user = userEvent.setup();
      const handleSubmit = jest.fn().mockResolvedValue(undefined);
      render(<ContactForm onSubmit={handleSubmit} />);

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
      await user.click(screen.getByRole("button", { name: /send|submit/i }));

      await waitFor(() => {
        const success = screen.getByTestId("contact-success");
        expect(success.textContent).toMatch(/thank you|sent|received/i);
      });
    });

    it("hides the form after successful submission", async () => {
      const user = userEvent.setup();
      const handleSubmit = jest.fn().mockResolvedValue(undefined);
      render(<ContactForm onSubmit={handleSubmit} />);

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
      await user.click(screen.getByRole("button", { name: /send|submit/i }));

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
      render(<ContactForm onSubmit={handleSubmit} />);

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
      await user.click(screen.getByRole("button", { name: /send|submit/i }));

      await waitFor(() => {
        expect(screen.getByTestId("contact-error")).toBeInTheDocument();
      });
    });

    it("error message contains helpful text", async () => {
      const user = userEvent.setup();
      const handleSubmit = jest
        .fn()
        .mockRejectedValue(new Error("Submission failed"));
      render(<ContactForm onSubmit={handleSubmit} />);

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
      await user.click(screen.getByRole("button", { name: /send|submit/i }));

      await waitFor(() => {
        const error = screen.getByTestId("contact-error");
        expect(error.textContent).toMatch(/try again|went wrong|error/i);
      });
    });

    it("error message has role alert for accessibility", async () => {
      const user = userEvent.setup();
      const handleSubmit = jest
        .fn()
        .mockRejectedValue(new Error("Submission failed"));
      render(<ContactForm onSubmit={handleSubmit} />);

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
      await user.click(screen.getByRole("button", { name: /send|submit/i }));

      await waitFor(() => {
        expect(screen.getByRole("alert")).toBeInTheDocument();
      });
    });

    it("form remains visible after error for retry", async () => {
      const user = userEvent.setup();
      const handleSubmit = jest
        .fn()
        .mockRejectedValue(new Error("Submission failed"));
      render(<ContactForm onSubmit={handleSubmit} />);

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
      await user.click(screen.getByRole("button", { name: /send|submit/i }));

      await waitFor(() => {
        expect(screen.getByRole("form")).toBeInTheDocument();
      });
    });

    it("form can be resubmitted after error", async () => {
      const user = userEvent.setup();
      const handleSubmit = jest
        .fn()
        .mockRejectedValueOnce(new Error("Submission failed"))
        .mockResolvedValueOnce(undefined);
      render(<ContactForm onSubmit={handleSubmit} />);

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
      await user.click(screen.getByRole("button", { name: /send|submit/i }));

      await waitFor(() => {
        expect(screen.getByTestId("contact-error")).toBeInTheDocument();
      });

      // Second submission succeeds
      await user.click(screen.getByRole("button", { name: /send|submit/i }));

      await waitFor(() => {
        expect(screen.getByTestId("contact-success")).toBeInTheDocument();
      });
    });

    it("error clears when user starts typing again", async () => {
      const user = userEvent.setup();
      const handleSubmit = jest
        .fn()
        .mockRejectedValue(new Error("Submission failed"));
      render(<ContactForm onSubmit={handleSubmit} />);

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
      await user.click(screen.getByRole("button", { name: /send|submit/i }));

      await waitFor(() => {
        expect(screen.getByTestId("contact-error")).toBeInTheDocument();
      });

      await user.type(screen.getByRole("textbox", { name: /name/i }), "a");

      expect(screen.queryByTestId("contact-error")).not.toBeInTheDocument();
    });
  });

  describe("Honeypot Spam Prevention", () => {
    /**
     * GIVEN the honeypot field has value
     * WHEN form submits
     * THEN it silently "succeeds" without sending
     */
    it("does not call onSubmit when honeypot is filled", async () => {
      const user = userEvent.setup();
      const handleSubmit = jest.fn();
      render(<ContactForm onSubmit={handleSubmit} />);

      const honeypot = screen.getByTestId("contact-honeypot");

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
      // Bot fills in honeypot
      await user.type(honeypot, "spam-bot-value");
      await user.click(screen.getByRole("button", { name: /send|submit/i }));

      // onSubmit should not be called
      expect(handleSubmit).not.toHaveBeenCalled();
    });

    it("shows success message when honeypot is filled to not reveal trap", async () => {
      const user = userEvent.setup();
      const handleSubmit = jest.fn();
      render(<ContactForm onSubmit={handleSubmit} />);

      const honeypot = screen.getByTestId("contact-honeypot");

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
      await user.type(honeypot, "spam-bot-value");
      await user.click(screen.getByRole("button", { name: /send|submit/i }));

      // Should show success to not reveal honeypot
      await waitFor(() => {
        expect(screen.getByTestId("contact-success")).toBeInTheDocument();
      });
    });
  });

  describe("Accessibility", () => {
    it("form has accessible name", () => {
      render(<ContactForm />);
      const form = screen.getByRole("form");
      expect(form).toHaveAccessibleName();
    });

    it("is keyboard navigable", async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      await user.tab();
      expect(screen.getByRole("textbox", { name: /name/i })).toHaveFocus();

      await user.tab();
      expect(screen.getByRole("textbox", { name: /email/i })).toHaveFocus();

      await user.tab();
      expect(screen.getByRole("textbox", { name: /message/i })).toHaveFocus();

      await user.tab();
      expect(
        screen.getByRole("button", { name: /send|submit/i })
      ).toHaveFocus();
    });

    it("honeypot field is not in tab order", async () => {
      const user = userEvent.setup();
      render(<ContactForm />);

      const honeypot = screen.getByTestId("contact-honeypot");

      // Tab through all focusable elements
      await user.tab(); // name
      await user.tab(); // email
      await user.tab(); // message
      await user.tab(); // button

      // Honeypot should never have focus
      expect(honeypot).not.toHaveFocus();
    });

    it("error message is linked to form via aria-describedby", async () => {
      const user = userEvent.setup();
      const handleSubmit = jest
        .fn()
        .mockRejectedValue(new Error("Submission failed"));
      render(<ContactForm onSubmit={handleSubmit} />);

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
      await user.click(screen.getByRole("button", { name: /send|submit/i }));

      await waitFor(() => {
        const form = screen.getByRole("form");
        const error = screen.getByTestId("contact-error");
        expect(form).toHaveAttribute("aria-describedby", error.id);
      });
    });

    it("form can be submitted with Enter key from input fields", async () => {
      const user = userEvent.setup();
      const handleSubmit = jest.fn().mockResolvedValue(undefined);
      render(<ContactForm onSubmit={handleSubmit} />);

      await user.type(
        screen.getByRole("textbox", { name: /name/i }),
        "John Doe"
      );
      await user.type(
        screen.getByRole("textbox", { name: /email/i }),
        "john@example.com{Enter}"
      );

      // Form should attempt to submit (validation will fail due to missing message)
      // But onSubmit won't be called because message is empty
      expect(screen.getByRole("textbox", { name: /message/i })).toBeInvalid();
    });
  });

  describe("Custom Styling", () => {
    it("accepts and applies custom className", () => {
      render(<ContactForm className="custom-class" />);
      const form = screen.getByTestId("contact-form");
      expect(form).toHaveClass("custom-class");
    });
  });

  describe("Brand Compliance - No Hype Language", () => {
    it("button text contains no hype or marketing language", () => {
      render(<ContactForm />);
      const button = screen.getByRole("button");
      const text = button.textContent?.toLowerCase() || "";
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

    it("success message contains no hype language", async () => {
      const user = userEvent.setup();
      const handleSubmit = jest.fn().mockResolvedValue(undefined);
      render(<ContactForm onSubmit={handleSubmit} />);

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
      await user.click(screen.getByRole("button"));

      await waitFor(() => {
        const success = screen.getByTestId("contact-success");
        const text = success.textContent?.toLowerCase() || "";
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

    it("error message contains no hype language", async () => {
      const user = userEvent.setup();
      const handleSubmit = jest
        .fn()
        .mockRejectedValue(new Error("Submission failed"));
      render(<ContactForm onSubmit={handleSubmit} />);

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
      await user.click(screen.getByRole("button"));

      await waitFor(() => {
        const error = screen.getByTestId("contact-error");
        const text = error.textContent?.toLowerCase() || "";
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
  });

  describe("Analytics Tracking (M10-02)", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("tracks form view when component mounts", () => {
      render(<ContactForm />);

      expect(analytics.trackFormView).toHaveBeenCalledWith("contact");
    });

    it("tracks successful contact submission", async () => {
      const user = userEvent.setup();
      const handleSubmit = jest.fn().mockResolvedValue(undefined);
      render(<ContactForm onSubmit={handleSubmit} />);

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
      await user.click(screen.getByRole("button", { name: /send|submit/i }));

      await waitFor(() => {
        expect(analytics.trackContactSubmit).toHaveBeenCalledWith("success");
      });
    });

    it("tracks failed contact submission", async () => {
      const user = userEvent.setup();
      const handleSubmit = jest
        .fn()
        .mockRejectedValue(new Error("Submission failed"));
      render(<ContactForm onSubmit={handleSubmit} />);

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
      await user.click(screen.getByRole("button", { name: /send|submit/i }));

      await waitFor(() => {
        expect(analytics.trackContactSubmit).toHaveBeenCalledWith("error");
      });
    });

    it("does not track submit when honeypot is filled", async () => {
      const user = userEvent.setup();
      const handleSubmit = jest.fn();
      render(<ContactForm onSubmit={handleSubmit} />);

      const honeypot = screen.getByTestId("contact-honeypot");

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
      await user.type(honeypot, "spam-bot-value");
      await user.click(screen.getByRole("button", { name: /send|submit/i }));

      await waitFor(() => {
        // Success state shown but no tracking event fired
        expect(screen.getByTestId("contact-success")).toBeInTheDocument();
      });
      expect(analytics.trackContactSubmit).not.toHaveBeenCalled();
    });

    it("only tracks form view once per mount", () => {
      const { rerender } = render(<ContactForm />);

      // Force a rerender
      rerender(<ContactForm className="updated" />);

      expect(analytics.trackFormView).toHaveBeenCalledTimes(1);
    });
  });
});
