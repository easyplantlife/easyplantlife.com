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
      // Primary variant is the filled accent pill
      expect(button).toHaveClass("bg-accent");
      expect(button).toHaveClass("text-on-accent");
      expect(button).toHaveClass("rounded-pill");
    });

    it("renders with primary variant explicitly", () => {
      render(<Button variant="primary">Primary</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("bg-accent");
    });

    it("renders with secondary variant", () => {
      render(<Button variant="secondary">Secondary</Button>);
      const button = screen.getByRole("button");
      // Secondary variant is outlined: tinted border, accent text
      expect(button).toHaveClass("bg-transparent");
      expect(button).toHaveClass("border-tint-line");
      expect(button).toHaveClass("text-accent");
    });

    it("renders with ghost variant", () => {
      render(<Button variant="ghost">Ghost</Button>);
      const button = screen.getByRole("button");
      // Ghost variant is text only
      expect(button).toHaveClass("bg-transparent");
      expect(button).toHaveClass("text-accent");
      expect(button).not.toHaveClass("border-tint-line");
    });
  });

  describe("Sizes", () => {
    it("renders with medium size by default", () => {
      render(<Button>Medium</Button>);
      const button = screen.getByRole("button");
      // 48px tall: a comfortable touch target
      expect(button).toHaveClass("h-12");
      expect(button).toHaveClass("text-base");
    });

    it("renders with small size", () => {
      render(<Button size="sm">Small</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("h-10");
      expect(button).toHaveClass("text-[15px]");
    });

    it("renders with medium size explicitly", () => {
      render(<Button size="md">Medium</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("h-12");
    });

    it("renders with large size", () => {
      render(<Button size="lg">Large</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("h-14");
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
      expect(button).toHaveClass("opacity-60");
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
