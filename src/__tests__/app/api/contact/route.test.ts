/**
 * @jest-environment node
 *
 * Tests for Contact Form API Endpoint
 *
 * Tests the POST /api/contact endpoint for contact form submissions.
 * Covers validation, honeypot spam protection, success cases, and error handling.
 */

import { POST } from "@/app/api/contact/route";
import { sendEmail, EmailServiceError } from "@/lib/api/email";
import { NextRequest } from "next/server";

// Mock the email service
jest.mock("@/lib/api/email", () => ({
  sendEmail: jest.fn(),
  EmailServiceError: class EmailServiceError extends Error {
    constructor(message: string) {
      super(message);
      this.name = "EmailServiceError";
    }
  },
}));

const mockSendEmail = sendEmail as jest.MockedFunction<typeof sendEmail>;

/**
 * Helper to create a mock NextRequest with JSON body
 */
function createRequest(body: unknown): NextRequest {
  return new NextRequest("http://localhost:3000/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

describe("POST /api/contact", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Successful submissions", () => {
    it("should return 200 with success message for valid submission", async () => {
      mockSendEmail.mockResolvedValue({
        success: true,
        emailId: "email_123",
      });

      const request = createRequest({
        name: "John Doe",
        email: "john@example.com",
        message: "Hello, I have a question about your plants.",
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toBe(
        "Thank you for your message. We will get back to you soon."
      );
      expect(mockSendEmail).toHaveBeenCalledTimes(1);
    });

    it("should send email with correct parameters", async () => {
      mockSendEmail.mockResolvedValue({
        success: true,
        emailId: "email_456",
      });

      const request = createRequest({
        name: "Jane Smith",
        email: "jane@example.com",
        message: "This is my message content.",
      });
      await POST(request);

      expect(mockSendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: expect.stringContaining("Jane Smith"),
          replyTo: "jane@example.com",
        })
      );
    });

    it("should include sender details in the email", async () => {
      mockSendEmail.mockResolvedValue({
        success: true,
        emailId: "email_789",
      });

      const request = createRequest({
        name: "Test User",
        email: "test@example.com",
        message: "My detailed message here.",
      });
      await POST(request);

      const callArgs = mockSendEmail.mock.calls[0][0];
      // Email should include sender name, email, and message in HTML or text
      expect(callArgs.html || callArgs.text).toContain("Test User");
      expect(callArgs.html || callArgs.text).toContain("test@example.com");
      expect(callArgs.html || callArgs.text).toContain(
        "My detailed message here."
      );
    });
  });

  describe("Required field validation", () => {
    it("should return 400 for missing name", async () => {
      const request = createRequest({
        email: "test@example.com",
        message: "Hello",
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Name is required");
      expect(mockSendEmail).not.toHaveBeenCalled();
    });

    it("should return 400 for empty name", async () => {
      const request = createRequest({
        name: "",
        email: "test@example.com",
        message: "Hello",
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Name is required");
      expect(mockSendEmail).not.toHaveBeenCalled();
    });

    it("should return 400 for whitespace-only name", async () => {
      const request = createRequest({
        name: "   ",
        email: "test@example.com",
        message: "Hello",
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Name is required");
      expect(mockSendEmail).not.toHaveBeenCalled();
    });

    it("should return 400 for missing email", async () => {
      const request = createRequest({
        name: "John Doe",
        message: "Hello",
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Email is required");
      expect(mockSendEmail).not.toHaveBeenCalled();
    });

    it("should return 400 for empty email", async () => {
      const request = createRequest({
        name: "John Doe",
        email: "",
        message: "Hello",
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Email is required");
      expect(mockSendEmail).not.toHaveBeenCalled();
    });

    it("should return 400 for missing message", async () => {
      const request = createRequest({
        name: "John Doe",
        email: "test@example.com",
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Message is required");
      expect(mockSendEmail).not.toHaveBeenCalled();
    });

    it("should return 400 for empty message", async () => {
      const request = createRequest({
        name: "John Doe",
        email: "test@example.com",
        message: "",
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Message is required");
      expect(mockSendEmail).not.toHaveBeenCalled();
    });

    it("should return 400 for whitespace-only message", async () => {
      const request = createRequest({
        name: "John Doe",
        email: "test@example.com",
        message: "   ",
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Message is required");
      expect(mockSendEmail).not.toHaveBeenCalled();
    });
  });

  describe("Email validation", () => {
    it("should return 400 for invalid email format - missing @", async () => {
      const request = createRequest({
        name: "John Doe",
        email: "notanemail",
        message: "Hello",
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Invalid email format");
      expect(mockSendEmail).not.toHaveBeenCalled();
    });

    it("should return 400 for invalid email format - missing domain", async () => {
      const request = createRequest({
        name: "John Doe",
        email: "test@",
        message: "Hello",
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Invalid email format");
      expect(mockSendEmail).not.toHaveBeenCalled();
    });

    it("should return 400 for non-string email", async () => {
      const request = createRequest({
        name: "John Doe",
        email: 12345,
        message: "Hello",
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBe(false);
      expect(data.error).toBe("Email is required");
      expect(mockSendEmail).not.toHaveBeenCalled();
    });

    it("should accept valid email formats", async () => {
      mockSendEmail.mockResolvedValue({
        success: true,
        emailId: "email_valid",
      });

      const validEmails = [
        "simple@example.com",
        "very.common@example.com",
        "user@subdomain.example.com",
        "user-name@example.co.uk",
      ];

      for (const email of validEmails) {
        jest.clearAllMocks();
        const request = createRequest({
          name: "Test User",
          email,
          message: "Test message",
        });
        const response = await POST(request);

        expect(response.status).toBe(200);
        expect(mockSendEmail).toHaveBeenCalled();
      }
    });
  });

  describe("Honeypot spam protection", () => {
    it("should silently reject submissions with filled honeypot field", async () => {
      const request = createRequest({
        name: "John Doe",
        email: "john@example.com",
        message: "Hello",
        website: "http://spam.com", // honeypot field filled = bot
      });
      const response = await POST(request);
      const data = await response.json();

      // Returns success to not give away the honeypot
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      // But doesn't actually send the email
      expect(mockSendEmail).not.toHaveBeenCalled();
    });

    it("should process submission when honeypot field is empty", async () => {
      mockSendEmail.mockResolvedValue({
        success: true,
        emailId: "email_honeypot",
      });

      const request = createRequest({
        name: "John Doe",
        email: "john@example.com",
        message: "Hello",
        website: "", // honeypot field empty = human
      });
      const response = await POST(request);

      expect(response.status).toBe(200);
      expect(mockSendEmail).toHaveBeenCalled();
    });

    it("should process submission when honeypot field is not present", async () => {
      mockSendEmail.mockResolvedValue({
        success: true,
        emailId: "email_no_honeypot",
      });

      const request = createRequest({
        name: "John Doe",
        email: "john@example.com",
        message: "Hello",
        // no website field
      });
      const response = await POST(request);

      expect(response.status).toBe(200);
      expect(mockSendEmail).toHaveBeenCalled();
    });
  });

  describe("Service error handling", () => {
    it("should return 500 when email service fails", async () => {
      mockSendEmail.mockRejectedValue(
        new EmailServiceError("Failed to send email: API error")
      );

      const request = createRequest({
        name: "John Doe",
        email: "john@example.com",
        message: "Hello",
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe(
        "Unable to send your message. Please try again later."
      );
    });

    it("should return 500 when email service is not configured", async () => {
      mockSendEmail.mockRejectedValue(
        new EmailServiceError("Email service not configured")
      );

      const request = createRequest({
        name: "John Doe",
        email: "john@example.com",
        message: "Hello",
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe(
        "Unable to send your message. Please try again later."
      );
    });

    it("should handle unexpected errors gracefully", async () => {
      mockSendEmail.mockRejectedValue(new Error("Unexpected error"));

      const request = createRequest({
        name: "John Doe",
        email: "john@example.com",
        message: "Hello",
      });
      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.success).toBe(false);
      expect(data.error).toBe(
        "Unable to send your message. Please try again later."
      );
    });
  });

  describe("Request parsing", () => {
    it("should handle malformed JSON gracefully", async () => {
      const request = new NextRequest("http://localhost:3000/api/contact", {
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

    it("should trim whitespace from input fields", async () => {
      mockSendEmail.mockResolvedValue({
        success: true,
        emailId: "email_trimmed",
      });

      const request = createRequest({
        name: "  John Doe  ",
        email: "  john@example.com  ",
        message: "  Hello there  ",
      });
      const response = await POST(request);

      expect(response.status).toBe(200);

      const callArgs = mockSendEmail.mock.calls[0][0];
      expect(callArgs.replyTo).toBe("john@example.com");
      // Check that trimmed values are used in the email content
      expect(callArgs.html || callArgs.text).toContain("John Doe");
    });

    it("should normalize email to lowercase", async () => {
      mockSendEmail.mockResolvedValue({
        success: true,
        emailId: "email_lower",
      });

      const request = createRequest({
        name: "John Doe",
        email: "JOHN@EXAMPLE.COM",
        message: "Hello",
      });
      const response = await POST(request);

      expect(response.status).toBe(200);
      expect(mockSendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          replyTo: "john@example.com",
        })
      );
    });
  });
});
