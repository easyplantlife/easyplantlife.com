import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "@/components/ui/Input";

/**
 * Input Component Tests
 *
 * Tests for the reusable Input component following TDD approach.
 * Verifies label association, error states, focus styles, and accessibility.
 */

describe("Input Component", () => {
  describe("Rendering", () => {
    it("renders an input element", () => {
      render(<Input />);
      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });

    it("renders with placeholder text", () => {
      render(<Input placeholder="Enter your email" />);
      expect(
        screen.getByPlaceholderText("Enter your email")
      ).toBeInTheDocument();
    });
  });

  describe("Label Association", () => {
    it("renders a label when label prop is provided", () => {
      render(<Input label="Email" />);
      expect(screen.getByText("Email")).toBeInTheDocument();
    });

    it("associates label with input via id", () => {
      render(<Input label="Email" id="email-input" />);
      const input = screen.getByRole("textbox");
      const label = screen.getByText("Email");
      expect(label).toHaveAttribute("for", "email-input");
      expect(input).toHaveAttribute("id", "email-input");
    });

    it("generates an id when label is provided but no id is given", () => {
      render(<Input label="Email" />);
      const input = screen.getByRole("textbox");
      const label = screen.getByText("Email");
      expect(input).toHaveAttribute("id");
      expect(label).toHaveAttribute("for", input.getAttribute("id"));
    });

    it("label is accessible via getByLabelText", () => {
      render(<Input label="Email Address" />);
      expect(screen.getByLabelText("Email Address")).toBeInTheDocument();
    });
  });

  describe("Error State", () => {
    it("displays error message when error prop is provided", () => {
      render(<Input error="Email is required" />);
      expect(screen.getByText("Email is required")).toBeInTheDocument();
    });

    it("has error styling when error prop is provided", () => {
      render(<Input error="Email is required" />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveClass("border-red-500");
    });

    it("associates error message with input via aria-describedby", () => {
      render(<Input error="Email is required" id="email" />);
      const input = screen.getByRole("textbox");
      const errorMessage = screen.getByText("Email is required");
      expect(input).toHaveAttribute("aria-describedby", "email-error");
      expect(errorMessage).toHaveAttribute("id", "email-error");
    });

    it("sets aria-invalid when error is present", () => {
      render(<Input error="Invalid email" />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("aria-invalid", "true");
    });

    it("does not have error styling when no error", () => {
      render(<Input />);
      const input = screen.getByRole("textbox");
      expect(input).not.toHaveClass("border-red-500");
    });
  });

  describe("Placeholder Styling", () => {
    it("has subtle placeholder styling", () => {
      render(<Input placeholder="Enter text" />);
      const input = screen.getByRole("textbox");
      // Placeholder should use muted/secondary text color
      expect(input).toHaveClass("placeholder:text-text-secondary");
    });
  });

  describe("Focus State", () => {
    it("has focus ring with brand colors", async () => {
      const user = userEvent.setup();
      render(<Input />);
      const input = screen.getByRole("textbox");

      await user.tab();

      expect(input).toHaveFocus();
      expect(input).toHaveClass("focus-visible:ring-primary");
    });

    it("has visible focus ring styles", () => {
      render(<Input />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveClass("focus-visible:ring-2");
      expect(input).toHaveClass("focus-visible:outline-none");
    });
  });

  describe("Accessibility", () => {
    it("is focusable via keyboard", async () => {
      const user = userEvent.setup();
      render(<Input />);
      const input = screen.getByRole("textbox");

      await user.tab();

      expect(input).toHaveFocus();
    });

    it("accepts text input", async () => {
      const user = userEvent.setup();
      render(<Input />);
      const input = screen.getByRole("textbox");

      await user.type(input, "test@example.com");

      expect(input).toHaveValue("test@example.com");
    });

    it("is disabled when disabled prop is true", () => {
      render(<Input disabled />);
      const input = screen.getByRole("textbox");
      expect(input).toBeDisabled();
    });

    it("has disabled styling when disabled", () => {
      render(<Input disabled />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveClass("opacity-50");
      expect(input).toHaveClass("cursor-not-allowed");
    });

    it("supports required attribute", () => {
      render(<Input required />);
      const input = screen.getByRole("textbox");
      expect(input).toBeRequired();
    });
  });

  describe("TypeScript Props", () => {
    it("accepts and applies type attribute", () => {
      render(<Input type="email" />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("type", "email");
    });

    it("defaults to type text", () => {
      render(<Input />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("type", "text");
    });

    it("accepts and applies className", () => {
      render(<Input className="custom-class" />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveClass("custom-class");
    });

    it("passes through additional HTML input attributes", () => {
      render(
        <Input
          aria-label="Custom label"
          data-testid="custom-input"
          name="email"
          maxLength={100}
        />
      );
      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("aria-label", "Custom label");
      expect(input).toHaveAttribute("data-testid", "custom-input");
      expect(input).toHaveAttribute("name", "email");
      expect(input).toHaveAttribute("maxLength", "100");
    });

    it("supports onChange handler", async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      render(<Input onChange={handleChange} />);
      const input = screen.getByRole("textbox");

      await user.type(input, "a");

      expect(handleChange).toHaveBeenCalled();
    });

    it("supports onBlur handler", async () => {
      const user = userEvent.setup();
      const handleBlur = jest.fn();
      render(<Input onBlur={handleBlur} />);
      const input = screen.getByRole("textbox");

      await user.click(input);
      await user.tab();

      expect(handleBlur).toHaveBeenCalled();
    });
  });

  describe("Combined Label and Error", () => {
    it("renders both label and error message correctly", () => {
      render(<Input label="Email" error="Email is required" />);
      expect(screen.getByText("Email")).toBeInTheDocument();
      expect(screen.getByText("Email is required")).toBeInTheDocument();
    });

    it("input is accessible by label when error is present", () => {
      render(<Input label="Email" error="Invalid email format" />);
      expect(screen.getByLabelText("Email")).toBeInTheDocument();
    });
  });
});
