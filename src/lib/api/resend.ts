/**
 * Resend Configuration and Client
 *
 * Configures and provides access to the Resend email service client.
 * Used for newsletter signups and contact form emails.
 *
 * @see https://resend.com/docs for API documentation
 */

import { Resend } from "resend";

/**
 * Custom error for Resend configuration issues.
 */
export class ResendConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ResendConfigError";
  }
}

/**
 * Result of configuration validation.
 */
export interface ResendConfigValidation {
  valid: boolean;
  error?: string;
}

// Cached Resend client instance
let resendClient: Resend | null = null;

/**
 * Checks if Resend is configured with an API key.
 *
 * @returns true if RESEND_API_KEY is set and non-empty
 *
 * @example
 * ```ts
 * if (isResendConfigured()) {
 *   const client = getResendClient();
 *   // Use client...
 * }
 * ```
 */
export function isResendConfigured(): boolean {
  const apiKey = process.env.RESEND_API_KEY;
  return Boolean(apiKey && apiKey.trim().length > 0);
}

/**
 * Validates the Resend configuration.
 *
 * Checks that the API key is present and properly formatted.
 *
 * @returns Validation result with valid flag and optional error message
 *
 * @example
 * ```ts
 * const result = validateResendConfig();
 * if (!result.valid) {
 *   console.error(result.error);
 * }
 * ```
 */
export function validateResendConfig(): ResendConfigValidation {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey || apiKey.trim().length === 0) {
    return {
      valid: false,
      error: "RESEND_API_KEY environment variable is not set",
    };
  }

  return { valid: true };
}

/**
 * Gets the Resend client instance.
 *
 * Creates a singleton Resend client using the configured API key.
 * Throws if the API key is not configured.
 *
 * @returns Configured Resend client
 * @throws {ResendConfigError} If RESEND_API_KEY is not set
 *
 * @example
 * ```ts
 * const resend = getResendClient();
 * await resend.emails.send({
 *   from: 'newsletter@easyplantlife.com',
 *   to: 'subscriber@example.com',
 *   subject: 'Welcome!',
 *   html: '<p>Welcome to Easy Plant Life!</p>'
 * });
 * ```
 */
export function getResendClient(): Resend {
  const validation = validateResendConfig();

  if (!validation.valid) {
    throw new ResendConfigError(validation.error!);
  }

  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY!);
  }

  return resendClient;
}
