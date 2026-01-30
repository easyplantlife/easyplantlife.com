/**
 * Contact Form API Endpoint
 *
 * POST /api/contact
 *
 * Handles contact form submissions by validating input,
 * checking honeypot spam protection, and sending email
 * to the site owner via Resend.
 */

import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/api/email";

/**
 * Simple email validation regex.
 * Checks for basic email format: local@domain.tld
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Email address to receive contact form submissions.
 */
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || "hello@easyplantlife.com";

/**
 * Request body shape for contact form submission
 */
interface ContactFormBody {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  website?: string; // Honeypot field
}

/**
 * Validates and normalizes a string field.
 *
 * @param value - The raw input value
 * @returns Trimmed string or null if invalid/empty
 */
function validateString(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) {
    return null;
  }
  return value.trim();
}

/**
 * Validates and normalizes an email address.
 *
 * @param email - The raw email input
 * @returns Normalized email or null if invalid
 */
function validateEmail(email: unknown): string | null {
  if (typeof email !== "string" || !email.trim()) {
    return null;
  }

  const normalized = email.trim().toLowerCase();

  if (!EMAIL_REGEX.test(normalized)) {
    return null;
  }

  return normalized;
}

/**
 * Builds the HTML email content for the contact form submission.
 *
 * @param name - Sender's name
 * @param email - Sender's email
 * @param message - The message content
 * @returns HTML string for the email body
 */
function buildEmailHtml(name: string, email: string, message: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Contact Form Submission</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h2 style="color: #2d5016; margin-bottom: 24px;">New Contact Form Submission</h2>

  <table style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 8px 0; font-weight: bold; width: 80px;">Name:</td>
      <td style="padding: 8px 0;">${escapeHtml(name)}</td>
    </tr>
    <tr>
      <td style="padding: 8px 0; font-weight: bold;">Email:</td>
      <td style="padding: 8px 0;"><a href="mailto:${escapeHtml(email)}" style="color: #2d5016;">${escapeHtml(email)}</a></td>
    </tr>
  </table>

  <h3 style="color: #2d5016; margin-top: 24px; margin-bottom: 12px;">Message:</h3>
  <div style="background-color: #f9f9f7; padding: 16px; border-radius: 8px; white-space: pre-wrap;">${escapeHtml(message)}</div>

  <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 32px 0;">
  <p style="font-size: 12px; color: #666;">This email was sent from the Easy Plant Life contact form.</p>
</body>
</html>
  `.trim();
}

/**
 * Builds plain text email content as fallback.
 *
 * @param name - Sender's name
 * @param email - Sender's email
 * @param message - The message content
 * @returns Plain text string for the email body
 */
function buildEmailText(name: string, email: string, message: string): string {
  return `
New Contact Form Submission
============================

Name: ${name}
Email: ${email}

Message:
--------
${message}

---
This email was sent from the Easy Plant Life contact form.
  `.trim();
}

/**
 * Escapes HTML special characters to prevent XSS.
 *
 * @param text - Raw text to escape
 * @returns Escaped HTML-safe string
 */
function escapeHtml(text: string): string {
  const htmlEscapes: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return text.replace(/[&<>"']/g, (char) => htmlEscapes[char]);
}

/**
 * POST /api/contact
 *
 * Accepts contact form submissions.
 *
 * @param request - The incoming request
 * @returns JSON response with success status
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  // Parse request body
  let body: ContactFormBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body" },
      { status: 400 }
    );
  }

  // Check honeypot field - if filled, silently "succeed" but don't send
  if (body.website && typeof body.website === "string" && body.website.trim()) {
    // Bot detected - return success to not reveal honeypot
    return NextResponse.json({
      success: true,
      message: "Thank you for your message. We will get back to you soon.",
    });
  }

  // Validate name
  const name = validateString(body.name);
  if (!name) {
    return NextResponse.json(
      { success: false, error: "Name is required" },
      { status: 400 }
    );
  }

  // Validate email presence
  if (
    body.email === undefined ||
    body.email === null ||
    typeof body.email !== "string" ||
    !body.email.trim()
  ) {
    return NextResponse.json(
      { success: false, error: "Email is required" },
      { status: 400 }
    );
  }

  // Validate email format
  const email = validateEmail(body.email);
  if (!email) {
    return NextResponse.json(
      { success: false, error: "Invalid email format" },
      { status: 400 }
    );
  }

  // Validate message
  const message = validateString(body.message);
  if (!message) {
    return NextResponse.json(
      { success: false, error: "Message is required" },
      { status: 400 }
    );
  }

  // Send email to site owner
  try {
    await sendEmail({
      to: CONTACT_EMAIL,
      subject: `Contact Form: ${name}`,
      html: buildEmailHtml(name, email, message),
      text: buildEmailText(name, email, message),
      replyTo: email,
    });

    return NextResponse.json({
      success: true,
      message: "Thank you for your message. We will get back to you soon.",
    });
  } catch (error) {
    // Log error for debugging (in production, use proper logging)
    console.error("Contact form error:", error);

    // Don't expose internal errors to clients
    return NextResponse.json(
      {
        success: false,
        error: "Unable to send your message. Please try again later.",
      },
      { status: 500 }
    );
  }
}
