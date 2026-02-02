"use client";

import { useState, type HTMLAttributes, type FormEvent } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

/**
 * Handles newsletter form submission by calling the API.
 * Exported for testing and for use as the default onSubmit handler.
 *
 * @param email - The email address to subscribe
 */
export async function handleNewsletterSubmit(email: string): Promise<void> {
  const response = await fetch("/api/newsletter", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Failed to subscribe");
  }
}

export interface NewsletterCTAProps extends Omit<
  HTMLAttributes<HTMLElement>,
  "onSubmit"
> {
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
    // Soft gradient background for visual interest
    "bg-gradient-to-b",
    "from-neutral-50",
    "to-primary-50/30",
    // Generous vertical padding
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
      // Use provided onSubmit handler or default to API handler
      const submitHandler = onSubmit ?? handleNewsletterSubmit;
      await submitHandler(email);
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
        <div className="max-w-2xl mx-auto">
          <div
            data-testid="newsletter-success"
            className="rounded-2xl p-8 md:p-10 border border-primary-200 bg-gradient-to-br from-white to-primary-50 shadow-sm max-w-md mx-auto"
          >
            <div className="mb-5 flex justify-center">
              <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
                <Image
                  src="/images/mark-logo.png"
                  alt=""
                  width={32}
                  height={32}
                  className="opacity-80"
                  aria-hidden="true"
                />
              </div>
            </div>
            <p className="mb-2 font-heading text-2xl text-primary-800 font-medium">
              Thank you for subscribing!
            </p>
            <p className="text-neutral-600 leading-relaxed">
              We&apos;ll be in touch with thoughtful updates. No rush, no
              overwhelm.
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
      <div className="max-w-2xl mx-auto">
        {/* Section Header */}
        <h2 className="font-heading text-2xl md:text-3xl text-neutral-800 mb-4">
          Stay in the Loop
        </h2>

        {/* Value Proposition - calm, no hype */}
        <p
          data-testid="newsletter-value-proposition"
          className="font-body text-lg md:text-xl text-neutral-600 mb-3"
        >
          Occasional thoughts on easy plant-based living.
        </p>
        <p className="font-body text-base text-neutral-500 mb-8 max-w-lg mx-auto">
          Short notes on simplicity, sustainability, and practical choices—no
          hype, no frequency pressure. Just useful ideas when they are ready.
        </p>

        {/* Newsletter Form - Card style */}
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6 md:p-8 max-w-md mx-auto">
          <form
            aria-label="Newsletter signup form"
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
          >
            <div className="w-full">
              <Input
                type="email"
                label="Email address"
                placeholder="your@email.com"
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
              className="w-full"
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

          <p className="font-body text-xs text-neutral-400 mt-4 text-center">
            No overwhelm. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
}
