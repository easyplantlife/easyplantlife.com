import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface FormFieldProps {
  /** id of the control this field labels */
  htmlFor: string;
  label: string;
  /** Keep the label for assistive tech but do not show it. */
  hideLabel?: boolean;
  hint?: string;
  hintId?: string;
  error?: string;
  errorId?: string;
  className?: string;
  children: ReactNode;
}

/** Shared look of text controls (Input, Textarea). */
export const controlStyles = [
  "w-full rounded-[10px] border bg-field px-4",
  "font-sans text-base text-ink placeholder:text-faint",
  "transition-colors duration-200",
  "focus-visible:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus-visible:ring-offset-ground",
  "disabled:cursor-not-allowed disabled:opacity-60",
].join(" ");

export function controlBorderStyles(hasError: boolean): string {
  return hasError ? "border-error" : "border-line";
}

/**
 * FormField
 *
 * Label, control, optional hint and error in one consistent stack.
 */
export function FormField({
  htmlFor,
  label,
  hideLabel = false,
  hint,
  hintId,
  error,
  errorId,
  className = "",
  children,
}: FormFieldProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label
        htmlFor={htmlFor}
        className={cn(
          "font-sans text-[15px] font-semibold text-muted",
          hideLabel && "sr-only"
        )}
      >
        {label}
      </label>
      {children}
      {hint && !error && (
        <p id={hintId} className="font-sans text-sm text-faint">
          {hint}
        </p>
      )}
      {error && (
        <p
          id={errorId}
          role="alert"
          className="font-sans text-[15px] text-error"
        >
          {error}
        </p>
      )}
    </div>
  );
}
