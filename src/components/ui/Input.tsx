import { forwardRef, useId, type InputHTMLAttributes } from "react";

export interface InputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size"
> {
  /** Label text for the input */
  label?: string;
  /** Error message to display below the input */
  error?: string;
}

/**
 * Input Component
 *
 * A reusable input component following the Easy Plant Life design system.
 * Supports labels, error states, and includes proper accessibility features.
 *
 * @example
 * ```tsx
 * // Basic input with label
 * <Input label="Email" placeholder="Enter your email" />
 *
 * // Input with error state
 * <Input label="Email" error="Email is required" />
 *
 * // Input without label
 * <Input placeholder="Search..." aria-label="Search" />
 * ```
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    error,
    id: providedId,
    type = "text",
    disabled = false,
    className = "",
    ...props
  },
  ref
) {
  const generatedId = useId();
  const inputId = providedId || (label ? generatedId : undefined);
  const errorId = inputId ? `${inputId}-error` : undefined;

  const baseStyles = [
    // Base styling
    "w-full",
    "px-4 py-3",
    "font-body text-base",
    "rounded-xl",
    "border-2",
    "bg-white",
    "text-neutral-800",
    "transition-all duration-200",
    // Placeholder styling (subtle)
    "placeholder:text-neutral-400",
    // Focus styles for accessibility - vibrant green
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:border-primary-500",
    // Hover effect
    "hover:border-primary-300",
    // Border color based on error state
    error ? "border-red-400" : "border-neutral-200",
    // Disabled styles
    disabled && "opacity-50 cursor-not-allowed bg-neutral-100",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={inputId}
          className="font-body text-sm font-medium text-text"
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        type={type}
        disabled={disabled}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error && errorId ? errorId : undefined}
        className={`${baseStyles} ${className}`.trim()}
        {...props}
      />
      {error && (
        <span
          id={errorId}
          className="font-body text-sm text-red-600"
          role="alert"
        >
          {error}
        </span>
      )}
    </div>
  );
});
