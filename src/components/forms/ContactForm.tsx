"use client";

import {
  useEffect,
  useId,
  useState,
  type ChangeEvent,
  type FormEvent,
  type HTMLAttributes,
} from "react";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { StatusNote } from "@/components/ui/StatusNote";
import { Text } from "@/components/ui/Text";
import { Textarea } from "@/components/ui/Textarea";
import { siteConfig } from "@/content/site";
import { trackContactSubmit, trackFormView } from "@/lib/analytics/events";
import { sendContactMessage, type ContactMessage } from "@/lib/api/forms";
import { cn } from "@/lib/utils";

export type ContactFormData = ContactMessage;

export interface ContactFormProps extends Omit<
  HTMLAttributes<HTMLFormElement>,
  "onSubmit"
> {
  /** Defaults to posting to /api/contact. */
  onSubmit?: (data: ContactFormData) => Promise<void>;
}

type Status = "idle" | "loading" | "success" | "error";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * ContactForm
 *
 * Name, email and message. A hidden honeypot field catches bots: when it is
 * filled the form "succeeds" silently without sending anything.
 */
export function ContactForm({
  onSubmit = sendContactMessage,
  className = "",
  ...props
}: ContactFormProps) {
  const formId = useId();
  const errorId = `${formId}-error`;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    trackFormView("contact");
  }, []);

  const fail = (text: string) => {
    setStatus("error");
    setErrorMessage(text);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    if (honeypot.trim()) {
      setStatus("success");
      return;
    }

    if (!name.trim()) return fail("Please enter your name.");
    if (!email.trim()) return fail("Please enter your email address.");
    if (!isValidEmail(email))
      return fail("Please enter a valid email address.");
    if (!message.trim()) return fail("Please enter your message.");

    setStatus("loading");

    try {
      await onSubmit({
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
      });
      setStatus("success");
      trackContactSubmit("success");
    } catch {
      fail("Something went wrong. Please try again.");
      trackContactSubmit("error");
    }
  };

  const handleChange =
    (setter: (value: string) => void) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setter(e.target.value);
      if (status === "error") {
        setStatus("idle");
        setErrorMessage(null);
      }
    };

  const reset = () => {
    setName("");
    setEmail("");
    setMessage("");
    setHoneypot("");
    setStatus("idle");
    setErrorMessage(null);
  };

  const isLoading = status === "loading";

  if (status === "success") {
    return (
      <div data-testid="contact-form" className={className}>
        <StatusNote
          data-testid="contact-success"
          size="lg"
          title="Message sent."
          actions={
            <>
              <ArrowLink href="/" className="text-[15px]">
                Back to the home page
              </ArrowLink>
              <Button variant="ghost" size="sm" onClick={reset}>
                Send another
              </Button>
            </>
          }
        >
          Thanks for writing. A reply will come to the address you gave, from a
          person.
        </StatusNote>
      </div>
    );
  }

  return (
    <form
      aria-label="Contact form"
      aria-describedby={errorMessage ? errorId : undefined}
      data-testid="contact-form"
      noValidate
      onSubmit={handleSubmit}
      className={cn("flex w-full max-w-[520px] flex-col gap-5", className)}
      {...props}
    >
      <Input
        type="text"
        name="name"
        label="Name"
        autoComplete="name"
        value={name}
        onChange={handleChange(setName)}
        required
        disabled={isLoading}
      />

      <Input
        type="email"
        name="email"
        label="Email"
        autoComplete="email"
        placeholder="you@example.com"
        hint="Only used to reply to you."
        value={email}
        onChange={handleChange(setEmail)}
        required
        disabled={isLoading}
      />

      <Textarea
        name="message"
        label="Message"
        value={message}
        onChange={handleChange(setMessage)}
        required
        disabled={isLoading}
      />

      {/* Honeypot: hidden from people, filled in by bots */}
      <div
        aria-hidden="true"
        className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden opacity-0"
      >
        <label htmlFor={`${formId}-website`}>Website (leave blank)</label>
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

      <div className="flex flex-wrap items-center gap-4 pt-1">
        <Button
          type="submit"
          variant="primary"
          disabled={isLoading}
          aria-busy={isLoading || undefined}
          className="min-w-40"
        >
          {isLoading ? "Sending…" : "Send message"}
        </Button>
        <Text size="sm" color="faint">
          Replies come from {siteConfig.contactEmail}
        </Text>
      </div>

      {status === "error" && errorMessage && (
        <p
          data-testid="contact-error"
          id={errorId}
          role="alert"
          className="font-sans text-[15px] text-error"
        >
          {errorMessage}
        </p>
      )}
    </form>
  );
}
