import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "@/components/ui/Button";

/**
 * Button Component Tests
 *
 * Tests for the reusable Button component following TDD approach.
 * Verifies variants, sizes, states, and accessibility requirements.
 */

describe("Button Component", () => {
  describe("Rendering", () => {
    it("renders children correctly", () => {
      render(<Button>Click me</Button>);
      expect(screen.getByRole("button")).toHaveTextContent("Click me");
    });

    it("renders as a button element by default", () => {
      render(<Button>Button</Button>);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });
  });

  describe("Variants", () => {
    it("renders with primary variant by default", () => {
      render(<Button>Primary</Button>);
      const button = screen.getByRole("button");
      // Primary variant should have the primary green background color
      expect(button).toHaveClass("bg-primary");
    });

    it("renders with primary variant explicitly", () => {
      render(<Button variant="primary">Primary</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-primary");
    });

    it("renders with secondary variant", () => {
      render(<Button variant="secondary">Secondary</Button>);
      const button = screen.getByRole("button");
      // Secondary variant should have a border and transparent background
      expect(button).toHaveClass("bg-transparent");
      expect(button).toHaveClass("border");
    });

    it("renders with ghost variant", () => {
      render(<Button variant="ghost">Ghost</Button>);
      const button = screen.getByRole("button");
      // Ghost variant should have no background
      expect(button).toHaveClass("bg-transparent");
      expect(button).not.toHaveClass("border");
    });
  });

  describe("Sizes", () => {
    it("renders with medium size by default", () => {
      render(<Button>Medium</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("px-4");
      expect(button).toHaveClass("py-2");
    });

    it("renders with small size", () => {
      render(<Button size="sm">Small</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("px-3");
      expect(button).toHaveClass("py-1.5");
      expect(button).toHaveClass("text-sm");
    });

    it("renders with medium size explicitly", () => {
      render(<Button size="md">Medium</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("px-4");
      expect(button).toHaveClass("py-2");
    });

    it("renders with large size", () => {
      render(<Button size="lg">Large</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("px-6");
      expect(button).toHaveClass("py-3");
      expect(button).toHaveClass("text-lg");
    });
  });

  describe("States", () => {
    it("handles click events when enabled", async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click me</Button>);

      await user.click(screen.getByRole("button"));

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("does not fire onClick handler when disabled", async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      render(
        <Button disabled onClick={handleClick}>
          Disabled
        </Button>
      );

      await user.click(screen.getByRole("button"));

      expect(handleClick).not.toHaveBeenCalled();
    });

    it("has disabled attribute when disabled", () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
    });

    it("applies disabled styles when disabled", () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("opacity-50");
      expect(button).toHaveClass("cursor-not-allowed");
    });
  });

  describe("Accessibility", () => {
    it("is focusable via keyboard", async () => {
      const user = userEvent.setup();
      render(<Button>Focusable</Button>);
      const button = screen.getByRole("button");

      await user.tab();

      expect(button).toHaveFocus();
    });

    it("has visible focus ring when focused", async () => {
      const user = userEvent.setup();
      render(<Button>Focusable</Button>);
      const button = screen.getByRole("button");

      await user.tab();

      // Should have focus-visible styles
      expect(button).toHaveClass("focus-visible:ring-2");
      expect(button).toHaveClass("focus-visible:outline-none");
    });

    it("is not focusable when disabled", () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole("button");
      // Disabled buttons should still be in the DOM but not receive focus via normal tab
      expect(button).toBeDisabled();
    });

    it("can be triggered via keyboard Enter", async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Press Enter</Button>);

      await user.tab();
      await user.keyboard("{Enter}");

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("can be triggered via keyboard Space", async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Press Space</Button>);

      await user.tab();
      await user.keyboard(" ");

      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("TypeScript Props", () => {
    it("accepts and applies type attribute", () => {
      render(<Button type="submit">Submit</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("type", "submit");
    });

    it("defaults to type button", () => {
      render(<Button>Button</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("type", "button");
    });

    it("accepts and applies className", () => {
      render(<Button className="custom-class">Custom</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("custom-class");
    });

    it("passes through additional HTML button attributes", () => {
      render(
        <Button aria-label="Custom label" data-testid="custom-button">
          Button
        </Button>
      );
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-label", "Custom label");
      expect(button).toHaveAttribute("data-testid", "custom-button");
    });
  });
});
