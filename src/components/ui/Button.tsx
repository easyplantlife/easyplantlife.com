import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost";

export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonStyleOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  className?: string;
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const baseStyles = [
  "inline-flex items-center justify-center gap-2",
  "whitespace-nowrap rounded-pill border border-transparent",
  "font-sans font-semibold",
  "transition-colors duration-200",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ground",
].join(" ");

const variantStyles: Record<ButtonVariant, string> = {
  /** Filled: the one primary action per view. */
  primary: "bg-accent text-on-accent hover:bg-accent-hover",
  /** Outlined: secondary actions such as the header's Newsletter link. */
  secondary:
    "bg-transparent border-tint-line text-accent hover:bg-tint hover:text-accent-hover dark:border-accent",
  /** Text only: tertiary actions inside dense areas. */
  ghost: "bg-transparent text-accent hover:bg-tint hover:text-accent-hover",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-10 px-[18px] text-[15px]",
  md: "h-12 px-[22px] text-base",
  lg: "h-14 px-7 text-lg",
};

/**
 * Builds the button class list. Shared with ButtonLink so an <a> styled as a
 * button is visually identical to a <button>.
 */
export function buttonClassName({
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
}: ButtonStyleOptions = {}): string {
  return cn(
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    disabled && "cursor-not-allowed opacity-60",
    className
  );
}

/**
 * Button
 *
 * Pill-shaped action. Defaults to type="button" so it never submits a form
 * by accident; pass type="submit" inside forms.
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
    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={buttonClassName({ variant, size, disabled, className })}
        {...props}
      >
        {children}
      </button>
    );
  }
);
