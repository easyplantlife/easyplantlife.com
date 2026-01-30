/**
 * @jest-environment node
 *
 * Newsletter API Integration Tests
 *
 * Tests for the newsletter API endpoint validating that the complete
 * flow from receiving a request to adding contacts to Resend works correctly.
 *
 * Based on acceptance criteria from issue #55 (M8-08):
 *
 * GIVEN the newsletter API
 * WHEN called with valid email
 * THEN contact is added to Resend
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

describe("Newsletter API Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GIVEN the newsletter API WHEN called with valid email THEN contact is added to Resend", () => {
    /**
     * Core API functionality test - validates the complete API flow
     * from receiving a request to adding the contact to Resend.
     */
    it("adds contact to Resend when API receives valid email", async () => {
      mockAddToNewsletter.mockResolvedValue({
        success: true,
        contactId: "contact_test_123",
      });

      const request = createRequest({ email: "subscriber@example.com" });
      const response = await POST(request);
      const data = await response.json();

      // Verify API response
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe("Successfully subscribed to the newsletter");

      // Verify contact was added to Resend via email service
      expect(mockAddToNewsletter).toHaveBeenCalledTimes(1);
      expect(mockAddToNewsletter).toHaveBeenCalledWith({
        email: "subscriber@example.com",
      });
    });

    it("adds contact with firstName when provided", async () => {
      mockAddToNewsletter.mockResolvedValue({
        success: true,
        contactId: "contact_test_456",
      });

      const request = createRequest({
        email: "john@example.com",
        firstName: "John",
      });
      const response = await POST(request);

      expect(response.status).toBe(200);
      expect(mockAddToNewsletter).toHaveBeenCalledWith({
        email: "john@example.com",
        firstName: "John",
      });
    });

    it("normalizes email to lowercase before adding to Resend", async () => {
      mockAddToNewsletter.mockResolvedValue({
        success: true,
        contactId: "contact_normalized",
      });

      const request = createRequest({ email: "USER@EXAMPLE.COM" });
      const response = await POST(request);

      expect(response.status).toBe(200);
      expect(mockAddToNewsletter).toHaveBeenCalledWith({
        email: "user@example.com",
      });
    });

    it("trims whitespace from email before adding to Resend", async () => {
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

    it("handles duplicate emails gracefully (idempotent)", async () => {
      // Resend API returns success for existing contacts
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

  describe("Email validation before Resend", () => {
    it("validates email presence before adding to Resend", async () => {
      const invalidBodies = [
        {},
        { email: "" },
        { email: null },
        { email: undefined },
      ];

      for (const body of invalidBodies) {
        const request = createRequest(body);
        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe("Email is required");
        expect(mockAddToNewsletter).not.toHaveBeenCalled();
      }
    });

    it("validates email format before adding to Resend", async () => {
      const invalidEmails = [
        "notanemail",
        "missing@domain",
        "@nodomain.com",
        "spaces in@email.com",
      ];

      for (const email of invalidEmails) {
        const request = createRequest({ email });
        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe("Invalid email format");
        expect(mockAddToNewsletter).not.toHaveBeenCalled();
        mockAddToNewsletter.mockClear();
      }
    });

    it("rejects non-string email values", async () => {
      const nonStringEmails = [12345, true, [], {}];

      for (const email of nonStringEmails) {
        const request = createRequest({ email });
        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.success).toBe(false);
        expect(mockAddToNewsletter).not.toHaveBeenCalled();
        mockAddToNewsletter.mockClear();
      }
    });
  });

  describe("Resend service error handling", () => {
    it("returns 500 when Resend service fails", async () => {
      mockAddToNewsletter.mockRejectedValue(
        new EmailServiceError("Failed to add contact to newsletter: API error")
      );

      const request = createRequest({ email: "test@example.com" });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Unable to subscribe. Please try again later.");
    });

    it("returns 500 when Resend is not configured", async () => {
      mockAddToNewsletter.mockRejectedValue(
        new EmailServiceError("Email service not configured")
      );

      const request = createRequest({ email: "test@example.com" });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Unable to subscribe. Please try again later.");
    });

    it("handles unexpected errors from Resend gracefully", async () => {
      mockAddToNewsletter.mockRejectedValue(new Error("Network timeout"));

      const request = createRequest({ email: "test@example.com" });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      // Error message should not expose internal details
      expect(data.error).not.toContain("Network timeout");
    });
  });

  describe("Request parsing", () => {
    it("handles malformed JSON gracefully", async () => {
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
  });
});
