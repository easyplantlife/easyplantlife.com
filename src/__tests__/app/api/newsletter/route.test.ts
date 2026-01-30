/**
 * @jest-environment node
 *
 * Tests for Newsletter Signup API Endpoint
 *
 * Tests the POST /api/newsletter endpoint for newsletter signups.
 * Covers validation, success cases, error handling, and idempotency.
 */

import { POST } from "@/app/api/newsletter/route";
import { addToNewsletter, EmailServiceError } from "@/lib/api/email";
import { NextRequest } from "next/server";

// Mock the email service
jest.mock("@/lib/api/email", () => ({
  addToNewsletter: jest.fn(),
  EmailServiceError: class EmailServiceError extends Error {
    constructor(message: string) {
      super(message);
      this.name = "EmailServiceError";
    }
  },
}));

const mockAddToNewsletter = addToNewsletter as jest.MockedFunction<
  typeof addToNewsletter
>;

/**
 * Helper to create a mock NextRequest with JSON body
 */
function createRequest(body: unknown): NextRequest {
  return new NextRequest("http://localhost:3000/api/newsletter", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

describe("POST /api/newsletter", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Successful signups", () => {
    it("should return 200 with success message for valid email", async () => {
      mockAddToNewsletter.mockResolvedValue({
        success: true,
        contactId: "contact_123",
      });

      const request = createRequest({ email: "test@example.com" });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe("Successfully subscribed to the newsletter");
      expect(mockAddToNewsletter).toHaveBeenCalledWith({
        email: "test@example.com",
      });
    });

    it("should pass firstName to email service when provided", async () => {
      mockAddToNewsletter.mockResolvedValue({
        success: true,
        contactId: "contact_456",
      });

      const request = createRequest({
        email: "john@example.com",
        firstName: "John",
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(mockAddToNewsletter).toHaveBeenCalledWith({
        email: "john@example.com",
        firstName: "John",
      });
    });

    it("should handle various valid email formats", async () => {
      mockAddToNewsletter.mockResolvedValue({
        success: true,
        contactId: "contact_789",
      });

      const validEmails = [
        "simple@example.com",
        "very.common@example.com",
        "disposable.style.email.with+symbol@example.com",
        "user@subdomain.example.com",
        "user-name@example.co.uk",
      ];

      for (const email of validEmails) {
        const request = createRequest({ email });
        const response = await POST(request);

        expect(response.status).toBe(200);
      }
    });
  });

  describe("Email validation errors", () => {
    it("should return 400 for missing email", async () => {
      const request = createRequest({});
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Email is required");
      expect(mockAddToNewsletter).not.toHaveBeenCalled();
    });

    it("should return 400 for empty email", async () => {
      const request = createRequest({ email: "" });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Email is required");
      expect(mockAddToNewsletter).not.toHaveBeenCalled();
    });

    it("should return 400 for invalid email format - missing @", async () => {
      const request = createRequest({ email: "notanemail" });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Invalid email format");
      expect(mockAddToNewsletter).not.toHaveBeenCalled();
    });

    it("should return 400 for invalid email format - missing domain", async () => {
      const request = createRequest({ email: "test@" });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Invalid email format");
      expect(mockAddToNewsletter).not.toHaveBeenCalled();
    });

    it("should return 400 for invalid email format - missing local part", async () => {
      const request = createRequest({ email: "@example.com" });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Invalid email format");
      expect(mockAddToNewsletter).not.toHaveBeenCalled();
    });

    it("should return 400 for non-string email", async () => {
      const request = createRequest({ email: 12345 });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Email is required");
      expect(mockAddToNewsletter).not.toHaveBeenCalled();
    });
  });

  describe("Duplicate email handling (idempotent)", () => {
    it("should return 200 for duplicate email (idempotent behavior)", async () => {
      // Resend's API returns success even for existing contacts
      // This makes the endpoint idempotent - no error to user
      mockAddToNewsletter.mockResolvedValue({
        success: true,
        contactId: "contact_existing",
      });

      const request = createRequest({ email: "existing@example.com" });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });
  });

  describe("Service error handling", () => {
    it("should return 500 when email service fails", async () => {
      mockAddToNewsletter.mockRejectedValue(
        new EmailServiceError("Failed to add contact to newsletter: API error")
      );

      const request = createRequest({ email: "test@example.com" });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe(
        "Unable to subscribe. Please try again later."
      );
    });

    it("should return 500 when email service is not configured", async () => {
      mockAddToNewsletter.mockRejectedValue(
        new EmailServiceError("Email service not configured")
      );

      const request = createRequest({ email: "test@example.com" });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe(
        "Unable to subscribe. Please try again later."
      );
    });

    it("should handle unexpected errors gracefully", async () => {
      mockAddToNewsletter.mockRejectedValue(new Error("Unexpected error"));

      const request = createRequest({ email: "test@example.com" });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe(
        "Unable to subscribe. Please try again later."
      );
    });
  });

  describe("Request parsing", () => {
    it("should handle malformed JSON gracefully", async () => {
      const request = new NextRequest("http://localhost:3000/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: "not valid json",
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Invalid request body");
    });

    it("should trim whitespace from email", async () => {
      mockAddToNewsletter.mockResolvedValue({
        success: true,
        contactId: "contact_trimmed",
      });

      const request = createRequest({ email: "  test@example.com  " });
      const response = await POST(request);

      expect(response.status).toBe(200);
      expect(mockAddToNewsletter).toHaveBeenCalledWith({
        email: "test@example.com",
      });
    });

    it("should normalize email to lowercase", async () => {
      mockAddToNewsletter.mockResolvedValue({
        success: true,
        contactId: "contact_lower",
      });

      const request = createRequest({ email: "TEST@EXAMPLE.COM" });
      const response = await POST(request);

      expect(response.status).toBe(200);
      expect(mockAddToNewsletter).toHaveBeenCalledWith({
        email: "test@example.com",
      });
    });
  });
});
