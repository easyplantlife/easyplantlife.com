"use client";

import { type HTMLAttributes } from "react";
import { Text } from "@/components/ui/Text";
import { ContactForm } from "@/components/forms/ContactForm";

export interface ContactContentProps extends HTMLAttributes<HTMLElement> {
  /** Additional CSS classes */
  className?: string;
}

/**
 * Handles contact form submission by calling the API.
 *
 * @param data - The form data (name, email, message)
 */
async function handleContactSubmit(data: {
  name: string;
  email: string;
  message: string;
}): Promise<void> {
  const response = await fetch("/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const result = await response.json();
    throw new Error(result.error || "Failed to send message");
  }
}

/**
 * ContactContent Component
 *
 * The main content structure for the Contact page. Contains a calm
 * introductory message and the contact form.
 *
 * Design principles:
 * - Minimal, focused design
 * - Calm, honest tone per brand guidelines
 * - No social links
 * - Contact form prominently displayed
 *
 * @example
 * ```tsx
 * <ContactContent />
 * <ContactContent className="mt-8" />
 * ```
 */
export function ContactContent({
  className = "",
  ...props
}: ContactContentProps) {
  return (
    <article
      data-testid="contact-content"
      className={`space-y-8 ${className}`.trim()}
      {...props}
    >
      {/* Introductory text - calm, no hype */}
      <Text size="lg" color="secondary" className="max-w-2xl">
        Have a question or want to get in touch? Send us a message below.
      </Text>

      {/* Contact form - prominent placement */}
      <div className="max-w-md">
        <ContactForm className="w-full" onSubmit={handleContactSubmit} />
      </div>
    </article>
  );
}
