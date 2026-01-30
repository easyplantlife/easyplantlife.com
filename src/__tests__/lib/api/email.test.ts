/**
 * Tests for Email Service Layer
 *
 * Tests the email service functions for newsletter signups
 * and transactional emails (contact form).
 */

import {
  addToNewsletter,
  sendEmail,
  EmailServiceError,
  type AddToNewsletterParams,
  type SendEmailParams,
  type AddToNewsletterResult,
  type SendEmailResult,
} from "@/lib/api/email";
import { getResendClient, ResendConfigError } from "@/lib/api/resend";

// Mock the resend module
jest.mock("@/lib/api/resend", () => ({
  getResendClient: jest.fn(),
  ResendConfigError: class ResendConfigError extends Error {
    constructor(message: string) {
      super(message);
      this.name = "ResendConfigError";
    }
  },
}));

const mockGetResendClient = getResendClient as jest.MockedFunction<
  typeof getResendClient
>;

describe("Email Service Layer", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe("addToNewsletter", () => {
    const mockContactsCreate = jest.fn();
    const mockResendClient = {
      contacts: {
        create: mockContactsCreate,
      },
    };

    beforeEach(() => {
      mockGetResendClient.mockReturnValue(mockResendClient as never);
    });

    it("should add a contact to the newsletter audience", async () => {
      mockContactsCreate.mockResolvedValue({
        data: { id: "contact_123" },
        error: null,
      });

      const params: AddToNewsletterParams = {
        email: "test@example.com",
      };

      const result = await addToNewsletter(params);

      expect(result.success).toBe(true);
      expect(result.contactId).toBe("contact_123");
      expect(mockContactsCreate).toHaveBeenCalledWith({
        email: "test@example.com",
        audienceId: expect.any(String),
      });
    });

    it("should include first name when provided", async () => {
      mockContactsCreate.mockResolvedValue({
        data: { id: "contact_456" },
        error: null,
      });

      const params: AddToNewsletterParams = {
        email: "test@example.com",
        firstName: "John",
      };

      await addToNewsletter(params);

      expect(mockContactsCreate).toHaveBeenCalledWith({
        email: "test@example.com",
        firstName: "John",
        audienceId: expect.any(String),
      });
    });

    it("should throw EmailServiceError when Resend API fails", async () => {
      mockContactsCreate.mockResolvedValue({
        data: null,
        error: { message: "Invalid email address" },
      });

      const params: AddToNewsletterParams = {
        email: "invalid-email",
      };

      await expect(addToNewsletter(params)).rejects.toThrow(EmailServiceError);
      await expect(addToNewsletter(params)).rejects.toThrow(
        "Failed to add contact to newsletter: Invalid email address"
      );
    });

    it("should throw EmailServiceError when Resend is not configured", async () => {
      mockGetResendClient.mockImplementation(() => {
        throw new ResendConfigError("RESEND_API_KEY not set");
      });

      const params: AddToNewsletterParams = {
        email: "test@example.com",
      };

      await expect(addToNewsletter(params)).rejects.toThrow(EmailServiceError);
      await expect(addToNewsletter(params)).rejects.toThrow(
        "Email service not configured"
      );
    });

    it("should throw EmailServiceError with descriptive message on network error", async () => {
      mockContactsCreate.mockRejectedValue(new Error("Network error"));

      const params: AddToNewsletterParams = {
        email: "test@example.com",
      };

      await expect(addToNewsletter(params)).rejects.toThrow(EmailServiceError);
      await expect(addToNewsletter(params)).rejects.toThrow(
        "Failed to add contact to newsletter: Network error"
      );
    });
  });

  describe("sendEmail", () => {
    const mockEmailsSend = jest.fn();
    const mockResendClient = {
      emails: {
        send: mockEmailsSend,
      },
    };

    beforeEach(() => {
      mockGetResendClient.mockReturnValue(mockResendClient as never);
    });

    it("should send a transactional email", async () => {
      mockEmailsSend.mockResolvedValue({
        data: { id: "email_123" },
        error: null,
      });

      const params: SendEmailParams = {
        to: "recipient@example.com",
        subject: "Test Subject",
        html: "<p>Test content</p>",
      };

      const result = await sendEmail(params);

      expect(result.success).toBe(true);
      expect(result.emailId).toBe("email_123");
      expect(mockEmailsSend).toHaveBeenCalledWith({
        from: expect.any(String),
        to: "recipient@example.com",
        subject: "Test Subject",
        html: "<p>Test content</p>",
      });
    });

    it("should use custom from address when provided", async () => {
      mockEmailsSend.mockResolvedValue({
        data: { id: "email_456" },
        error: null,
      });

      const params: SendEmailParams = {
        to: "recipient@example.com",
        from: "custom@easyplantlife.com",
        subject: "Custom From",
        html: "<p>Content</p>",
      };

      await sendEmail(params);

      expect(mockEmailsSend).toHaveBeenCalledWith(
        expect.objectContaining({
          from: "custom@easyplantlife.com",
        })
      );
    });

    it("should support text content instead of HTML", async () => {
      mockEmailsSend.mockResolvedValue({
        data: { id: "email_789" },
        error: null,
      });

      const params: SendEmailParams = {
        to: "recipient@example.com",
        subject: "Plain Text",
        text: "Plain text content",
      };

      await sendEmail(params);

      expect(mockEmailsSend).toHaveBeenCalledWith(
        expect.objectContaining({
          text: "Plain text content",
        })
      );
    });

    it("should support reply-to address", async () => {
      mockEmailsSend.mockResolvedValue({
        data: { id: "email_abc" },
        error: null,
      });

      const params: SendEmailParams = {
        to: "recipient@example.com",
        subject: "With Reply-To",
        html: "<p>Content</p>",
        replyTo: "reply@example.com",
      };

      await sendEmail(params);

      expect(mockEmailsSend).toHaveBeenCalledWith(
        expect.objectContaining({
          replyTo: "reply@example.com",
        })
      );
    });

    it("should throw EmailServiceError when Resend API fails", async () => {
      mockEmailsSend.mockResolvedValue({
        data: null,
        error: { message: "Rate limit exceeded" },
      });

      const params: SendEmailParams = {
        to: "recipient@example.com",
        subject: "Test",
        html: "<p>Content</p>",
      };

      await expect(sendEmail(params)).rejects.toThrow(EmailServiceError);
      await expect(sendEmail(params)).rejects.toThrow(
        "Failed to send email: Rate limit exceeded"
      );
    });

    it("should throw EmailServiceError when Resend is not configured", async () => {
      mockGetResendClient.mockImplementation(() => {
        throw new ResendConfigError("RESEND_API_KEY not set");
      });

      const params: SendEmailParams = {
        to: "recipient@example.com",
        subject: "Test",
        html: "<p>Content</p>",
      };

      await expect(sendEmail(params)).rejects.toThrow(EmailServiceError);
      await expect(sendEmail(params)).rejects.toThrow(
        "Email service not configured"
      );
    });

    it("should throw EmailServiceError with descriptive message on network error", async () => {
      mockEmailsSend.mockRejectedValue(new Error("Connection timeout"));

      const params: SendEmailParams = {
        to: "recipient@example.com",
        subject: "Test",
        html: "<p>Content</p>",
      };

      await expect(sendEmail(params)).rejects.toThrow(EmailServiceError);
      await expect(sendEmail(params)).rejects.toThrow(
        "Failed to send email: Connection timeout"
      );
    });
  });

  describe("EmailServiceError", () => {
    it("should be an instance of Error", () => {
      const error = new EmailServiceError("Test error");
      expect(error).toBeInstanceOf(Error);
    });

    it("should have the correct name", () => {
      const error = new EmailServiceError("Test error");
      expect(error.name).toBe("EmailServiceError");
    });

    it("should have the correct message", () => {
      const error = new EmailServiceError("Email sending failed");
      expect(error.message).toBe("Email sending failed");
    });
  });

  describe("Type Definitions", () => {
    it("should require email in AddToNewsletterParams", () => {
      // Type-level test - if this compiles, the types are correct
      const params: AddToNewsletterParams = {
        email: "test@example.com",
      };
      expect(params.email).toBeDefined();
    });

    it("should have optional firstName in AddToNewsletterParams", () => {
      const paramsWithName: AddToNewsletterParams = {
        email: "test@example.com",
        firstName: "Test",
      };
      const paramsWithoutName: AddToNewsletterParams = {
        email: "test@example.com",
      };
      expect(paramsWithName.firstName).toBe("Test");
      expect(paramsWithoutName.firstName).toBeUndefined();
    });

    it("should require to and subject in SendEmailParams", () => {
      const params: SendEmailParams = {
        to: "test@example.com",
        subject: "Test",
        html: "<p>Content</p>",
      };
      expect(params.to).toBeDefined();
      expect(params.subject).toBeDefined();
    });

    it("should return success and contactId in AddToNewsletterResult", () => {
      const result: AddToNewsletterResult = {
        success: true,
        contactId: "123",
      };
      expect(result.success).toBe(true);
      expect(result.contactId).toBeDefined();
    });

    it("should return success and emailId in SendEmailResult", () => {
      const result: SendEmailResult = {
        success: true,
        emailId: "456",
      };
      expect(result.success).toBe(true);
      expect(result.emailId).toBeDefined();
    });
  });
});
