"use client";

import { useState, type HTMLAttributes, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export interface NewsletterCTAProps
  extends Omit<HTMLAttributes<HTMLElement>, "onSubmit"> {
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
 * NewsletterCTA Component
 *
 * The primary CTA section for newsletter signup on the home page.
 * This is the primary conversion goal with:
 * - Clear value proposition (one sentence)
 * - Email input field
 * - Submit button
 * - Success state after submission
 * - Error state for failures
 * - No hype or marketing language
 *
 * @example
 * ```tsx
 * <NewsletterCTA />
 * <NewsletterCTA onSubmit={async (email) => await subscribeNewsletter(email)} />
 * ```
 */
export function NewsletterCTA({
  className = "",
  onSubmit,
  ...props
}: NewsletterCTAProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const baseStyles = [
    // Background - subtle differentiation
    "bg-neutral-50",
    // Generous vertical padding for white space
    "py-16",
    "md:py-20",
    "lg:py-24",
    // Horizontal padding
    "px-4",
    "md:px-6",
    "lg:px-8",
    // Centered content
    "text-center",
  ].join(" ");

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
      <section
        aria-label="Newsletter signup"
        data-testid="newsletter-cta"
        className={`${baseStyles} ${className}`.trim()}
        {...props}
      >
        <div className="max-w-xl mx-auto">
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
      </section>
    );
  }

  return (
    <section
      aria-label="Newsletter signup"
      data-testid="newsletter-cta"
      className={`${baseStyles} ${className}`.trim()}
      {...props}
    >
      <div className="max-w-xl mx-auto">
        {/* Value Proposition - one sentence, no hype */}
        <p
          data-testid="newsletter-value-proposition"
          className="font-body text-lg md:text-xl text-text mb-8"
        >
          Receive occasional thoughts on living simply with plants.
        </p>

        {/* Newsletter Form */}
        <form
          aria-label="Newsletter signup form"
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-3 justify-center items-center max-w-md mx-auto"
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
              aria-describedby={
                errorMessage ? "newsletter-error-message" : undefined
              }
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            disabled={isLoading}
            className="w-full sm:w-auto whitespace-nowrap"
          >
            {isLoading ? "Subscribing..." : "Subscribe"}
          </Button>
        </form>

        {/* Error State */}
        {status === "error" && errorMessage && (
          <div
            data-testid="newsletter-error"
            id="newsletter-error-message"
            role="alert"
            className="mt-4 text-red-600 font-body text-sm"
          >
            {errorMessage}
          </div>
        )}
      </div>
    </section>
  );
}
