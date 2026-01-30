"use client";

import {
  useState,
  useId,
  type HTMLAttributes,
  type FormEvent,
  type ChangeEvent,
} from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

/**
 * Form data shape for contact form submission
 */
export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface ContactFormProps
  extends Omit<HTMLAttributes<HTMLFormElement>, "onSubmit"> {
  /** Additional CSS classes */
  className?: string;
  /** Callback when form is submitted with valid data */
  onSubmit?: (data: ContactFormData) => Promise<void>;
}

/**
 * Validates an email address format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * ContactForm Component
 *
 * A contact form component with validation, honeypot spam protection, and state handling.
 * Fields: name, email, message.
 *
 * Features:
 * - Name, email, and message fields with validation
 * - Honeypot field for spam prevention (hidden)
 * - Submit button with loading state
 * - Success state with confirmation message
 * - Error state with helpful message
 * - Accessible (labels, error announcements)
 * - No marketing hype in copy
 *
 * @example
 * ```tsx
 * <ContactForm />
 * <ContactForm onSubmit={async (data) => await sendContactMessage(data)} />
 * ```
 */
export function ContactForm({
  className = "",
  onSubmit,
  ...props
}: ContactFormProps) {
  const formId = useId();
  const errorId = `${formId}-error`;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    // Check honeypot - if filled, silently "succeed" without sending
    if (honeypot.trim()) {
      setStatus("success");
      return;
    }

    // Client-side validation
    if (!name.trim()) {
      setStatus("error");
      setErrorMessage("Please enter your name.");
      return;
    }

    if (!email.trim()) {
      setStatus("error");
      setErrorMessage("Please enter your email address.");
      return;
    }

    if (!isValidEmail(email)) {
      setStatus("error");
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (!message.trim()) {
      setStatus("error");
      setErrorMessage("Please enter your message.");
      return;
    }

    setStatus("loading");

    try {
      if (onSubmit) {
        await onSubmit({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
        });
      }
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  const handleInputChange = (
    setter: (value: string) => void,
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setter(e.target.value);
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
        data-testid="contact-form"
        className={className}
        role="status"
        aria-live="polite"
      >
        <div
          data-testid="contact-success"
          className="text-primary font-body text-lg"
        >
          <p className="mb-2 font-medium">Thank you for your message.</p>
          <p className="text-text-secondary">
            We have received your inquiry and will get back to you soon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form
      aria-label="Contact form"
      aria-describedby={errorMessage ? errorId : undefined}
      data-testid="contact-form"
      onSubmit={handleSubmit}
      className={`flex flex-col gap-4 ${className}`.trim()}
      {...props}
    >
      {/* Name Field */}
      <Input
        type="text"
        label="Name"
        placeholder="Your name"
        value={name}
        onChange={(e) => handleInputChange(setName, e)}
        required
        disabled={isLoading}
      />

      {/* Email Field */}
      <Input
        type="email"
        label="Email"
        placeholder="Your email"
        value={email}
        onChange={(e) => handleInputChange(setEmail, e)}
        required
        disabled={isLoading}
      />

      {/* Message Field */}
      <div className="flex flex-col gap-1">
        <label
          htmlFor={`${formId}-message`}
          className="font-body text-sm font-medium text-text"
        >
          Message
        </label>
        <textarea
          id={`${formId}-message`}
          placeholder="Your message"
          value={message}
          onChange={(e) => handleInputChange(setMessage, e)}
          required
          disabled={isLoading}
          rows={5}
          className={`
            w-full
            px-4 py-2
            font-body text-base
            rounded-md
            border
            bg-background
            text-text
            transition-colors duration-200
            placeholder:text-text-secondary
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
            border-neutral-200
            ${isLoading ? "opacity-50 cursor-not-allowed bg-neutral-100" : ""}
            resize-y
          `
            .trim()
            .replace(/\s+/g, " ")}
        />
      </div>

      {/* Honeypot Field - Hidden from users, bots fill it in */}
      <div
        aria-hidden="true"
        className="absolute left-[-9999px] top-[-9999px] opacity-0 h-0 w-0 overflow-hidden"
      >
        <label htmlFor={`${formId}-website`}>
          Website (leave blank)
        </label>
        <input
          id={`${formId}-website`}
          data-testid="contact-honeypot"
          type="text"
          name="website"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        disabled={isLoading}
        className="w-full sm:w-auto self-start"
      >
        {isLoading ? "Sending..." : "Send Message"}
      </Button>

      {/* Error State */}
      {status === "error" && errorMessage && (
        <div
          data-testid="contact-error"
          id={errorId}
          role="alert"
          className="mt-2 text-red-600 font-body text-sm"
        >
          {errorMessage}
        </div>
      )}
    </form>
  );
}
