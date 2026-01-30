/**
 * Newsletter Signup API Endpoint
 *
 * POST /api/newsletter
 *
 * Handles newsletter signup requests by validating email
 * and adding contacts to the newsletter audience via Resend.
 */

import { NextRequest, NextResponse } from "next/server";
import { addToNewsletter, EmailServiceError } from "@/lib/api/email";

/**
 * Simple email validation regex.
 * Checks for basic email format: local@domain.tld
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Request body shape for newsletter signup
 */
interface NewsletterSignupBody {
  email?: unknown;
  firstName?: string;
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
 * POST /api/newsletter
 *
 * Accepts newsletter signup requests.
 *
 * @param request - The incoming request
 * @returns JSON response with success status
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  // Parse request body
  let body: NewsletterSignupBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body" },
      { status: 400 }
    );
  }

  // Validate email presence and type
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

  // Add to newsletter
  try {
    const params: { email: string; firstName?: string } = { email };

    if (body.firstName && typeof body.firstName === "string") {
      params.firstName = body.firstName.trim();
    }

    await addToNewsletter(params);

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed to the newsletter",
    });
  } catch (error) {
    // Log error for debugging (in production, use proper logging)
    console.error("Newsletter signup error:", error);

    // Don't expose internal errors to clients
    return NextResponse.json(
      {
        success: false,
        error: "Unable to subscribe. Please try again later.",
      },
      { status: 500 }
    );
  }
}
