import { forwardRef, useId, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { controlBorderStyles, controlStyles, FormField } from "./FormField";

export interface InputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size"
> {
  label?: string;
  /** Keep the label for assistive tech but do not show it. */
  hideLabel?: boolean;
  hint?: string;
  error?: string;
  /** Classes for the wrapping field (label + control), e.g. flex sizing. */
  wrapperClassName?: string;
}

/**
 * Input
 *
 * Single-line text control. With a label it renders a full FormField; without
 * one it renders the bare control (pass aria-label in that case).
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    hideLabel = false,
    hint,
    error,
    wrapperClassName,
    id: providedId,
    type = "text",
    disabled = false,
    className = "",
    "aria-describedby": describedBy,
    ...props
  },
  ref
) {
  const generatedId = useId();
  const inputId = providedId ?? generatedId;
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;

  const describedByIds =
    [error ? errorId : hint ? hintId : undefined, describedBy]
      .filter(Boolean)
      .join(" ") || undefined;

  const control = (
    <input
      ref={ref}
      id={inputId}
      type={type}
      disabled={disabled}
      aria-invalid={error ? "true" : undefined}
      aria-describedby={describedByIds}
      className={cn(
        controlStyles,
        "h-12",
        controlBorderStyles(Boolean(error)),
        className
      )}
      {...props}
    />
  );

  if (!label) {
    return control;
  }

  return (
    <FormField
      htmlFor={inputId}
      label={label}
      hideLabel={hideLabel}
      hint={hint}
      hintId={hintId}
      error={error}
      errorId={errorId}
      className={wrapperClassName}
    >
      {control}
    </FormField>
  );
});
