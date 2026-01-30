"use client";

import { useState, type HTMLAttributes, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export interface NewsletterFormProps
  extends Omit<HTMLAttributes<HTMLFormElement>, "onSubmit"> {
  /** Additional CSS classes */
  className?: string;
  /** Callback when form is submitted with valid email */
  onSubmit?: (email: string) => Promise<void>;
}

/**
 * Validates an email address format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * NewsletterForm Component
 *
 * A reusable newsletter signup form component with validation and state handling.
 * This is a focused form component that can be used across different contexts
 * (newsletter page, home page, etc.).
 *
 * Features:
 * - Email input with validation
 * - Submit button with loading state
 * - Success state with confirmation message
 * - Error state with helpful message
 * - Accessible (labels, error announcements)
 * - No marketing hype in copy
 *
 * @example
 * ```tsx
 * <NewsletterForm />
 * <NewsletterForm onSubmit={async (email) => await subscribeNewsletter(email)} />
 * ```
 */
export function NewsletterForm({
  className = "",
  onSubmit,
  ...props
}: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    // Client-side validation
    if (!isValidEmail(email)) {
      setStatus("error");
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");

    try {
      if (onSubmit) {
        await onSubmit(email);
      }
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    // Clear error when user starts typing
    if (status === "error") {
      setStatus("idle");
      setErrorMessage(null);
    }
  };

  const isLoading = status === "loading";

  // Success state
  if (status === "success") {
    return (
      <div
        data-testid="newsletter-form"
        className={className}
        role="status"
        aria-live="polite"
      >
        <div
          data-testid="newsletter-success"
          className="text-primary font-body text-lg"
        >
          <p className="mb-2 font-medium">Thank you for subscribing.</p>
          <p className="text-text-secondary">
            We will be in touch with thoughtful updates.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form
      aria-label="Newsletter signup form"
      data-testid="newsletter-form"
      onSubmit={handleSubmit}
      className={`flex flex-col sm:flex-row gap-3 items-start ${className}`.trim()}
      {...props}
    >
      <div className="w-full sm:flex-1">
        <Input
          type="email"
          label="Email address"
          placeholder="Your email"
          value={email}
          onChange={handleEmailChange}
          required
          disabled={isLoading}
          aria-describedby={errorMessage ? "newsletter-error-message" : undefined}
        />
      </div>
      <Button
        type="submit"
        variant="primary"
        disabled={isLoading}
        className="w-full sm:w-auto whitespace-nowrap sm:mt-6"
      >
        {isLoading ? "Subscribing..." : "Subscribe"}
      </Button>

      {/* Error State */}
      {status === "error" && errorMessage && (
        <div
          data-testid="newsletter-error"
          id="newsletter-error-message"
          role="alert"
          className="w-full mt-2 text-red-600 font-body text-sm"
        >
          {errorMessage}
        </div>
      )}
    </form>
  );
}
