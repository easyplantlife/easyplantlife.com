"use client";

import {
  useEffect,
  useId,
  useState,
  type ChangeEvent,
  type FormEvent,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { StatusNote } from "@/components/ui/StatusNote";
import { trackFormView, trackNewsletterSubmit } from "@/lib/analytics/events";
import { subscribeToNewsletter } from "@/lib/api/forms";
import { cn } from "@/lib/utils";

export type NewsletterFormLayout = "inline" | "stacked";

export interface NewsletterFormProps extends Omit<
  HTMLAttributes<HTMLFormElement>,
  "onSubmit"
> {
  /** "inline" puts the button beside the field (hero); "stacked" labels it. */
  layout?: NewsletterFormLayout;
  hideLabel?: boolean;
  submitLabel?: string;
  helpText?: string;
  /** Extra links shown in the success note. */
  successActions?: ReactNode;
  /** Defaults to posting to /api/newsletter. */
  onSubmit?: (email: string) => Promise<void>;
}

type Status = "idle" | "loading" | "success" | "error";

export const NEWSLETTER_INVALID_EMAIL =
  "That does not look like an email address. Check it and try again.";
export const NEWSLETTER_SUBMIT_FAILED =
  "Something went wrong. Please try again.";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * NewsletterForm
 *
 * One field, one button, explicit idle, sending, error and success states.
 */
export function NewsletterForm({
  layout = "stacked",
  hideLabel = layout === "inline",
  submitLabel = "Subscribe",
  helpText = "Unsubscribe with one click, any time. Your address is never shared.",
  successActions,
  onSubmit = subscribeToNewsletter,
  className = "",
  ...props
}: NewsletterFormProps) {
  const id = useId();
  const errorId = `${id}-error`;
  const helpId = `${id}-help`;

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    trackFormView("newsletter");
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!isValidEmail(email)) {
      setStatus("error");
      setErrorMessage(NEWSLETTER_INVALID_EMAIL);
      return;
    }

    setStatus("loading");

    try {
      await onSubmit(email);
      setStatus("success");
      trackNewsletterSubmit("success");
    } catch {
      setStatus("error");
      setErrorMessage(NEWSLETTER_SUBMIT_FAILED);
      trackNewsletterSubmit("error");
    }
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (status === "error") {
      setStatus("idle");
      setErrorMessage(null);
    }
  };

  const reset = () => {
    setEmail("");
    setStatus("idle");
    setErrorMessage(null);
  };

  const isLoading = status === "loading";
  const hasError = status === "error" && Boolean(errorMessage);

  if (status === "success") {
    return (
      <div data-testid="newsletter-form" className={className}>
        <StatusNote
          data-testid="newsletter-success"
          title="You're on the list."
          actions={
            <>
              {successActions}
              <Button variant="ghost" size="sm" onClick={reset}>
                Use a different address
              </Button>
            </>
          }
        >
          A short confirmation is on its way to <strong>{email}</strong>. After
          that, nothing arrives until there is something worth sending.
        </StatusNote>
      </div>
    );
  }

  return (
    <form
      aria-label="Newsletter signup form"
      data-testid="newsletter-form"
      noValidate
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-2.5", className)}
      {...props}
    >
      <div
        className={cn(
          "flex gap-2.5",
          layout === "inline" ? "flex-wrap items-start" : "flex-col"
        )}
      >
        <Input
          type="email"
          name="email"
          label="Email address"
          hideLabel={hideLabel}
          placeholder="you@example.com"
          autoComplete="email"
          value={email}
          onChange={handleEmailChange}
          required
          disabled={isLoading}
          aria-invalid={hasError ? "true" : undefined}
          aria-describedby={hasError ? errorId : helpId}
          wrapperClassName={
            layout === "inline" ? "min-w-0 flex-1 basis-56" : undefined
          }
        />
        <Button
          type="submit"
          variant="primary"
          disabled={isLoading}
          aria-busy={isLoading || undefined}
          className={layout === "inline" ? "shrink-0" : "self-start"}
        >
          {isLoading ? "Sending…" : submitLabel}
        </Button>
      </div>

      {hasError && (
        <p
          data-testid="newsletter-error"
          id={errorId}
          role="alert"
          className="font-sans text-[15px] text-error"
        >
          {errorMessage}
        </p>
      )}

      <p id={helpId} className="font-sans text-sm text-faint">
        {helpText}
      </p>
    </form>
  );
}
