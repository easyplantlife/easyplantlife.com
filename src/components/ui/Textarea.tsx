import { forwardRef, useId, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { controlBorderStyles, controlStyles, FormField } from "./FormField";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  hideLabel?: boolean;
  hint?: string;
  error?: string;
}

/**
 * Textarea
 *
 * Multi-line text control with the same field chrome as Input.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    {
      label,
      hideLabel = false,
      hint,
      error,
      id: providedId,
      rows = 6,
      disabled = false,
      className = "",
      "aria-describedby": describedBy,
      ...props
    },
    ref
  ) {
    const generatedId = useId();
    const textareaId = providedId ?? generatedId;
    const hintId = `${textareaId}-hint`;
    const errorId = `${textareaId}-error`;

    const describedByIds =
      [error ? errorId : hint ? hintId : undefined, describedBy]
        .filter(Boolean)
        .join(" ") || undefined;

    return (
      <FormField
        htmlFor={textareaId}
        label={label}
        hideLabel={hideLabel}
        hint={hint}
        hintId={hintId}
        error={error}
        errorId={errorId}
      >
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          disabled={disabled}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={describedByIds}
          className={cn(
            controlStyles,
            "min-h-40 resize-y py-3 leading-relaxed",
            controlBorderStyles(Boolean(error)),
            className
          )}
          {...props}
        />
      </FormField>
    );
  }
);
