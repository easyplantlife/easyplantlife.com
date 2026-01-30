import { forwardRef, type ButtonHTMLAttributes } from "react";

/**
 * Button variant options
 * - primary: Main CTA button with brand green background
 * - secondary: Outlined button for secondary actions
 * - ghost: Minimal button for tertiary actions
 */
export type ButtonVariant = "primary" | "secondary" | "ghost";

/**
 * Button size options
 * - sm: Compact size for inline actions
 * - md: Default size for most buttons
 * - lg: Large size for prominent CTAs
 */
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant */
  variant?: ButtonVariant;
  /** Size of the button */
  size?: ButtonSize;
}

/**
 * Variant styles mapping
 * Primary: Brand green background with white text
 * Secondary: Transparent with border
 * Ghost: Fully transparent, text only
 */
const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-text-inverse hover:bg-primary-dark active:bg-primary-700",
  secondary:
    "bg-transparent border border-primary text-primary hover:bg-primary-50 active:bg-primary-100",
  ghost: "bg-transparent text-text hover:bg-neutral-100 active:bg-neutral-200",
};

/**
 * Size styles mapping
 * Defines padding and text size for each size option
 */
const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

/**
 * Button Component
 *
 * A reusable button component following the Easy Plant Life design system.
 * Supports multiple variants, sizes, and includes proper accessibility features.
 *
 * @example
 * ```tsx
 * // Primary CTA
 * <Button variant="primary" size="lg">Subscribe</Button>
 *
 * // Secondary action
 * <Button variant="secondary">Learn More</Button>
 *
 * // Ghost/text button
 * <Button variant="ghost" size="sm">Cancel</Button>
 * ```
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      children,
      variant = "primary",
      size = "md",
      type = "button",
      disabled = false,
      className = "",
      ...props
    },
    ref
  ) {
    const baseStyles = [
      // Base styling
      "inline-flex items-center justify-center",
      "font-body font-medium",
      "rounded-md",
      "transition-colors duration-200",
      // Focus styles for accessibility
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
      // Disabled styles
      disabled && "opacity-50 cursor-not-allowed",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`.trim()}
        {...props}
      >
        {children}
      </button>
    );
  }
);
