/**
 * Email Service Layer
 *
 * Provides high-level functions for email operations:
 * - Newsletter signup (add contacts to audience)
 * - Transactional emails (contact form submissions)
 *
 * Uses the Resend SDK under the hood.
 */

import { getResendClient, ResendConfigError } from "./resend";

// Default configuration
const DEFAULT_FROM_EMAIL = "Easy Plant Life <hello@easyplantlife.com>";
const DEFAULT_AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID || "";

/**
 * Custom error for email service failures.
 */
export class EmailServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EmailServiceError";
  }
}

/**
 * Parameters for adding a contact to the newsletter.
 */
export interface AddToNewsletterParams {
  /** The subscriber's email address */
  email: string;
  /** Optional first name for personalization */
  firstName?: string;
}

/**
 * Result of adding a contact to the newsletter.
 */
export interface AddToNewsletterResult {
  /** Whether the operation succeeded */
  success: boolean;
  /** The created contact ID */
  contactId: string;
}

/**
 * Parameters for sending a transactional email.
 */
export interface SendEmailParams {
  /** Recipient email address */
  to: string;
  /** Email subject line */
  subject: string;
  /** HTML content of the email */
  html?: string;
  /** Plain text content of the email */
  text?: string;
  /** Optional custom from address */
  from?: string;
  /** Optional reply-to address */
  replyTo?: string;
}

/**
 * Result of sending an email.
 */
export interface SendEmailResult {
  /** Whether the operation succeeded */
  success: boolean;
  /** The sent email ID */
  emailId: string;
}

/**
 * Adds a contact to the newsletter audience.
 *
 * @param params - The newsletter signup parameters
 * @returns Promise resolving to the result with contact ID
 * @throws {EmailServiceError} If the operation fails
 *
 * @example
 * ```ts
 * const result = await addToNewsletter({
 *   email: 'subscriber@example.com',
 *   firstName: 'Jane'
 * });
 * console.log('Contact added:', result.contactId);
 * ```
 */
export async function addToNewsletter(
  params: AddToNewsletterParams
): Promise<AddToNewsletterResult> {
  let client;

  try {
    client = getResendClient();
  } catch (error) {
    if (error instanceof ResendConfigError) {
      throw new EmailServiceError("Email service not configured");
    }
    throw error;
  }

  try {
    const contactData: {
      email: string;
      audienceId: string;
      firstName?: string;
    } = {
      email: params.email,
      audienceId: DEFAULT_AUDIENCE_ID,
    };

    if (params.firstName) {
      contactData.firstName = params.firstName;
    }

    const { data, error } = await client.contacts.create(contactData);

    if (error) {
      throw new EmailServiceError(
        `Failed to add contact to newsletter: ${error.message}`
      );
    }

    return {
      success: true,
      contactId: data!.id,
    };
  } catch (error) {
    if (error instanceof EmailServiceError) {
      throw error;
    }

    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    throw new EmailServiceError(`Failed to add contact to newsletter: ${message}`);
  }
}

/**
 * Sends a transactional email.
 *
 * Used for contact form submissions and other transactional messages.
 *
 * @param params - The email parameters
 * @returns Promise resolving to the result with email ID
 * @throws {EmailServiceError} If the operation fails
 *
 * @example
 * ```ts
 * const result = await sendEmail({
 *   to: 'contact@easyplantlife.com',
 *   subject: 'Contact Form Submission',
 *   html: '<p>Message content here</p>',
 *   replyTo: 'visitor@example.com'
 * });
 * console.log('Email sent:', result.emailId);
 * ```
 */
export async function sendEmail(
  params: SendEmailParams
): Promise<SendEmailResult> {
  let client;

  try {
    client = getResendClient();
  } catch (error) {
    if (error instanceof ResendConfigError) {
      throw new EmailServiceError("Email service not configured");
    }
    throw error;
  }

  try {
    const emailData: {
      from: string;
      to: string;
      subject: string;
      html?: string;
      text?: string;
      replyTo?: string;
    } = {
      from: params.from || DEFAULT_FROM_EMAIL,
      to: params.to,
      subject: params.subject,
    };

    if (params.html) {
      emailData.html = params.html;
    }

    if (params.text) {
      emailData.text = params.text;
    }

    if (params.replyTo) {
      emailData.replyTo = params.replyTo;
    }

    const { data, error } = await client.emails.send(emailData);

    if (error) {
      throw new EmailServiceError(`Failed to send email: ${error.message}`);
    }

    return {
      success: true,
      emailId: data!.id,
    };
  } catch (error) {
    if (error instanceof EmailServiceError) {
      throw error;
    }

    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    throw new EmailServiceError(`Failed to send email: ${message}`);
  }
}
