"use client";

import { type HTMLAttributes } from "react";
import { Text } from "@/components/ui/Text";
import { NewsletterForm } from "@/components/forms/NewsletterForm";

export interface NewsletterContentProps extends HTMLAttributes<HTMLElement> {
  /** Additional CSS classes */
  className?: string;
}

/**
 * Handles newsletter form submission by calling the API.
 *
 * @param email - The email address to subscribe
 */
async function handleNewsletterSubmit(email: string): Promise<void> {
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

/**
 * NewsletterContent Component
 *
 * The main content structure for the Newsletter page. Contains a calm
 * value proposition and the newsletter signup form.
 *
 * Design principles:
 * - One-sentence value proposition
 * - Prominent newsletter form
 * - No hype or frequency pressure
 * - Calm, honest tone per brand guidelines
 *
 * @example
 * ```tsx
 * <NewsletterContent />
 * <NewsletterContent className="mt-8" />
 * ```
 */
export function NewsletterContent({
  className = "",
  ...props
}: NewsletterContentProps) {
  return (
    <article
      data-testid="newsletter-content"
      className={`space-y-8 ${className}`.trim()}
      {...props}
    >
      {/* Value proposition - calm, no hype */}
      <div className="max-w-2xl space-y-4">
        <Text size="lg" className="text-neutral-700">
          Thoughtful notes on easy plant-based living.
        </Text>
        <Text size="base" className="text-neutral-500">
          We only send when we have something worth sharing.
        </Text>
      </div>

      {/* Newsletter signup form - prominent placement */}
      <div className="max-w-md">
        <NewsletterForm className="w-full" onSubmit={handleNewsletterSubmit} />
      </div>
    </article>
  );
}
