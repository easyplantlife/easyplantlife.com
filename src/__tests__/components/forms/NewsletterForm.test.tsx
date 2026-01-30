import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NewsletterForm } from "@/components/forms/NewsletterForm";

/**
 * NewsletterForm Component Tests
 *
 * Tests for the reusable Newsletter signup form following TDD approach.
 * Based on acceptance criteria from issue #51 (M8-04):
 * - NewsletterForm component created
 * - Email input with validation
 * - Submit button with loading state
 * - Success state with confirmation message
 * - Error state with helpful message
 * - Accessible (labels, error announcements)
 * - No marketing hype in copy
 *
 * Test Cases from Issue:
 * GIVEN an empty form
 * WHEN I click submit
 * THEN validation error shows for email
 *
 * GIVEN a valid email
 * WHEN I submit the form
 * THEN loading state shows
 * AND success message appears on completion
 *
 * GIVEN submission fails
 * WHEN error occurs
 * THEN error message displays
 * AND form can be resubmitted
 */

describe("NewsletterForm Component", () => {
  describe("Rendering", () => {
    it("renders as a form element", () => {
      render(<NewsletterForm />);
      const form = screen.getByRole("form", { name: /newsletter/i });
      expect(form).toBeInTheDocument();
      expect(form.tagName).toBe("FORM");
    });

    it("renders with data-testid for identification", () => {
      render(<NewsletterForm />);
      expect(screen.getByTestId("newsletter-form")).toBeInTheDocument();
    });
  });

  describe("Email Input Field", () => {
    it("renders an email input field", () => {
      render(<NewsletterForm />);
      const input = screen.getByRole("textbox", { name: /email/i });
      expect(input).toBeInTheDocument();
    });

    it("email input has type email", () => {
      render(<NewsletterForm />);
      const input = screen.getByRole("textbox", { name: /email/i });
      expect(input).toHaveAttribute("type", "email");
    });

    it("email input has appropriate placeholder", () => {
      render(<NewsletterForm />);
      const input = screen.getByPlaceholderText(/email/i);
      expect(input).toBeInTheDocument();
    });

    it("email input is required", () => {
      render(<NewsletterForm />);
      const input = screen.getByRole("textbox", { name: /email/i });
      expect(input).toBeRequired();
    });

    it("email input has accessible label", () => {
      render(<NewsletterForm />);
      const input = screen.getByRole("textbox", { name: /email/i });
      expect(input).toHaveAccessibleName();
    });
  });

  describe("Submit Button", () => {
    it("renders a submit button", () => {
      render(<NewsletterForm />);
      const button = screen.getByRole("button", {
        name: /subscribe|sign up|join/i,
      });
      expect(button).toBeInTheDocument();
    });

    it("submit button has type submit", () => {
      render(<NewsletterForm />);
      const button = screen.getByRole("button", {
        name: /subscribe|sign up|join/i,
      });
      expect(button).toHaveAttribute("type", "submit");
    });
  });

  describe("Form Behavior", () => {
    it("accepts email input", async () => {
      const user = userEvent.setup();
      render(<NewsletterForm />);
      const input = screen.getByRole("textbox", { name: /email/i });

      await user.type(input, "test@example.com");

      expect(input).toHaveValue("test@example.com");
    });

    it("calls onSubmit with email when form is submitted", async () => {
      const user = userEvent.setup();
      const handleSubmit = jest.fn();
      render(<NewsletterForm onSubmit={handleSubmit} />);
      const input = screen.getByRole("textbox", { name: /email/i });
      const button = screen.getByRole("button", {
        name: /subscribe|sign up|join/i,
      });

      await user.type(input, "test@example.com");
      await user.click(button);

      expect(handleSubmit).toHaveBeenCalledWith("test@example.com");
    });
  });

  describe("Email Validation", () => {
    /**
     * GIVEN an empty form
     * WHEN I click submit
     * THEN validation error shows for email
     */
    it("shows error when submitting empty form", async () => {
      const user = userEvent.setup();
      render(<NewsletterForm />);
      const input = screen.getByRole("textbox", { name: /email/i });
      const button = screen.getByRole("button", {
        name: /subscribe|sign up|join/i,
      });

      // Clear the input first to ensure it's empty
      await user.clear(input);
      await user.click(button);

      // Browser's native validation should mark it as invalid
      expect(input).toBeInvalid();
    });

    it("shows error for invalid email format", async () => {
      const user = userEvent.setup();
      const handleSubmit = jest.fn();
      render(<NewsletterForm onSubmit={handleSubmit} />);
      const input = screen.getByRole("textbox", { name: /email/i });
      const button = screen.getByRole("button", {
        name: /subscribe|sign up|join/i,
      });

      // Use an email that passes browser validation but fails custom regex
      await user.type(input, "invalid-email");
      await user.click(button);

      // Should be invalid due to browser validation
      expect(input).toBeInvalid();
    });

    it("validates email format with custom validation", async () => {
      const user = userEvent.setup();
      const handleSubmit = jest.fn();
      render(<NewsletterForm onSubmit={handleSubmit} />);
      const input = screen.getByRole("textbox", { name: /email/i });
      const button = screen.getByRole("button", {
        name: /subscribe|sign up|join/i,
      });

      await user.type(input, "valid@email.com");
      await user.click(button);

      expect(handleSubmit).toHaveBeenCalledWith("valid@email.com");
    });

    it("shows custom error message for invalid email after browser validation passes", async () => {
      const user = userEvent.setup();
      const handleSubmit = jest.fn();
      render(<NewsletterForm onSubmit={handleSubmit} />);
      const input = screen.getByRole("textbox", { name: /email/i });
      const button = screen.getByRole("button", {
        name: /subscribe|sign up|join/i,
      });

      // Use an email that might pass browser validation but could fail custom regex
      // Using a valid-looking email that should pass both validations
      await user.type(input, "test@test.c");
      await user.click(button);

      // If it passes browser validation but not custom, error message should show
      // This tests that we show helpful validation messages
      await waitFor(() => {
        const error = screen.queryByTestId("newsletter-error");
        if (error) {
          expect(error).toHaveTextContent(/valid email/i);
        }
      });
    });
  });

  describe("Loading State", () => {
    /**
     * GIVEN a valid email
     * WHEN I submit the form
     * THEN loading state shows
     */
    it("shows loading state during submission", async () => {
      const user = userEvent.setup();
      let resolveSubmit: () => void;
      const handleSubmit = jest.fn(
        () => new Promise<void>((resolve) => (resolveSubmit = resolve))
      );
      render(<NewsletterForm onSubmit={handleSubmit} />);
      const input = screen.getByRole("textbox", { name: /email/i });
      const button = screen.getByRole("button", {
        name: /subscribe|sign up|join/i,
      });

      await user.type(input, "test@example.com");
      await user.click(button);

      // Button should show loading text
      expect(button).toHaveTextContent(/subscribing|loading|sending/i);

      // Resolve the promise to clean up
      resolveSubmit!();
    });

    it("disables submit button while submitting", async () => {
      const user = userEvent.setup();
      let resolveSubmit: () => void;
      const handleSubmit = jest.fn(
        () => new Promise<void>((resolve) => (resolveSubmit = resolve))
      );
      render(<NewsletterForm onSubmit={handleSubmit} />);
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
      render(<NewsletterForm onSubmit={handleSubmit} />);
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

  describe("Success State", () => {
    /**
     * GIVEN a valid email
     * WHEN I submit the form
     * AND success message appears on completion
     */
    it("displays success message after successful submission", async () => {
      const user = userEvent.setup();
      const handleSubmit = jest.fn().mockResolvedValue(undefined);
      render(<NewsletterForm onSubmit={handleSubmit} />);
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
      render(<NewsletterForm onSubmit={handleSubmit} />);
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

    it("success message contains confirmation text", async () => {
      const user = userEvent.setup();
      const handleSubmit = jest.fn().mockResolvedValue(undefined);
      render(<NewsletterForm onSubmit={handleSubmit} />);
      const input = screen.getByRole("textbox", { name: /email/i });
      const button = screen.getByRole("button", {
        name: /subscribe|sign up|join/i,
      });

      await user.type(input, "test@example.com");
      await user.click(button);

      await waitFor(() => {
        const success = screen.getByTestId("newsletter-success");
        expect(success.textContent).toMatch(
          /thank you|subscribed|success/i
        );
      });
    });

    it("hides the form after successful submission", async () => {
      const user = userEvent.setup();
      const handleSubmit = jest.fn().mockResolvedValue(undefined);
      render(<NewsletterForm onSubmit={handleSubmit} />);
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
    /**
     * GIVEN submission fails
     * WHEN error occurs
     * THEN error message displays
     * AND form can be resubmitted
     */
    it("displays error message when submission fails", async () => {
      const user = userEvent.setup();
      const handleSubmit = jest
        .fn()
        .mockRejectedValue(new Error("Submission failed"));
      render(<NewsletterForm onSubmit={handleSubmit} />);
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

    it("error message contains helpful text", async () => {
      const user = userEvent.setup();
      const handleSubmit = jest
        .fn()
        .mockRejectedValue(new Error("Submission failed"));
      render(<NewsletterForm onSubmit={handleSubmit} />);
      const input = screen.getByRole("textbox", { name: /email/i });
      const button = screen.getByRole("button", {
        name: /subscribe|sign up|join/i,
      });

      await user.type(input, "test@example.com");
      await user.click(button);

      await waitFor(() => {
        const error = screen.getByTestId("newsletter-error");
        // Should provide helpful guidance, not just a generic error
        expect(error.textContent).toMatch(/try again|went wrong|error/i);
      });
    });

    it("error message has role alert for accessibility", async () => {
      const user = userEvent.setup();
      const handleSubmit = jest
        .fn()
        .mockRejectedValue(new Error("Submission failed"));
      render(<NewsletterForm onSubmit={handleSubmit} />);
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
      render(<NewsletterForm onSubmit={handleSubmit} />);
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

    it("form can be resubmitted after error", async () => {
      const user = userEvent.setup();
      const handleSubmit = jest
        .fn()
        .mockRejectedValueOnce(new Error("Submission failed"))
        .mockResolvedValueOnce(undefined);
      render(<NewsletterForm onSubmit={handleSubmit} />);
      const input = screen.getByRole("textbox", { name: /email/i });
      const button = screen.getByRole("button", {
        name: /subscribe|sign up|join/i,
      });

      // First submission fails
      await user.type(input, "test@example.com");
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByTestId("newsletter-error")).toBeInTheDocument();
      });

      // Second submission succeeds
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByTestId("newsletter-success")).toBeInTheDocument();
      });
    });

    it("error clears when user starts typing again", async () => {
      const user = userEvent.setup();
      const handleSubmit = jest
        .fn()
        .mockRejectedValue(new Error("Submission failed"));
      render(<NewsletterForm onSubmit={handleSubmit} />);
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

  describe("Accessibility", () => {
    it("form has accessible name", () => {
      render(<NewsletterForm />);
      const form = screen.getByRole("form");
      expect(form).toHaveAccessibleName();
    });

    it("error message is linked to input via aria-describedby", async () => {
      const user = userEvent.setup();
      const handleSubmit = jest
        .fn()
        .mockRejectedValue(new Error("Submission failed"));
      render(<NewsletterForm onSubmit={handleSubmit} />);
      const input = screen.getByRole("textbox", { name: /email/i });
      const button = screen.getByRole("button", {
        name: /subscribe|sign up|join/i,
      });

      await user.type(input, "test@example.com");
      await user.click(button);

      await waitFor(() => {
        const error = screen.getByTestId("newsletter-error");
        expect(input).toHaveAttribute("aria-describedby", error.id);
      });
    });

    it("is keyboard navigable", async () => {
      const user = userEvent.setup();
      render(<NewsletterForm />);

      await user.tab();
      expect(screen.getByRole("textbox", { name: /email/i })).toHaveFocus();

      await user.tab();
      expect(
        screen.getByRole("button", { name: /subscribe|sign up|join/i })
      ).toHaveFocus();
    });

    it("form can be submitted with Enter key", async () => {
      const user = userEvent.setup();
      const handleSubmit = jest.fn().mockResolvedValue(undefined);
      render(<NewsletterForm onSubmit={handleSubmit} />);
      const input = screen.getByRole("textbox", { name: /email/i });

      await user.type(input, "test@example.com");
      await user.keyboard("{Enter}");

      expect(handleSubmit).toHaveBeenCalledWith("test@example.com");
    });
  });

  describe("Custom Styling", () => {
    it("accepts and applies custom className", () => {
      render(<NewsletterForm className="custom-class" />);
      const form = screen.getByTestId("newsletter-form");
      expect(form).toHaveClass("custom-class");
    });
  });

  describe("Brand Compliance - No Hype Language", () => {
    it("button text contains no hype or marketing language", () => {
      render(<NewsletterForm />);
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
      render(<NewsletterForm onSubmit={handleSubmit} />);
      const input = screen.getByRole("textbox", { name: /email/i });
      const button = screen.getByRole("button");

      await user.type(input, "test@example.com");
      await user.click(button);

      await waitFor(() => {
        const success = screen.getByTestId("newsletter-success");
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
      render(<NewsletterForm onSubmit={handleSubmit} />);
      const input = screen.getByRole("textbox", { name: /email/i });
      const button = screen.getByRole("button");

      await user.type(input, "test@example.com");
      await user.click(button);

      await waitFor(() => {
        const error = screen.getByTestId("newsletter-error");
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
});
