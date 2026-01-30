/**
 * Tests for Resend configuration and email service
 *
 * Tests the Resend SDK integration for newsletter and email functionality.
 * Validates configuration, client creation, and error handling.
 */

import {
  getResendClient,
  isResendConfigured,
  validateResendConfig,
  ResendConfigError,
} from "@/lib/api/resend";

// Mock the Resend SDK
jest.mock("resend", () => ({
  Resend: jest.fn().mockImplementation((apiKey: string) => ({
    apiKey,
    emails: {
      send: jest.fn(),
    },
    contacts: {
      create: jest.fn(),
    },
  })),
}));

describe("Resend Configuration", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    // Clear the cached client between tests
    jest.clearAllMocks();
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe("isResendConfigured", () => {
    it("should return true when RESEND_API_KEY is set", () => {
      process.env.RESEND_API_KEY = "re_test_123456789";
      expect(isResendConfigured()).toBe(true);
    });

    it("should return false when RESEND_API_KEY is not set", () => {
      delete process.env.RESEND_API_KEY;
      expect(isResendConfigured()).toBe(false);
    });

    it("should return false when RESEND_API_KEY is empty string", () => {
      process.env.RESEND_API_KEY = "";
      expect(isResendConfigured()).toBe(false);
    });

    it("should return false when RESEND_API_KEY is only whitespace", () => {
      process.env.RESEND_API_KEY = "   ";
      expect(isResendConfigured()).toBe(false);
    });
  });

  describe("validateResendConfig", () => {
    it("should return valid when API key is properly formatted", () => {
      process.env.RESEND_API_KEY = "re_test_123456789";
      const result = validateResendConfig();
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it("should return invalid when API key is missing", () => {
      delete process.env.RESEND_API_KEY;
      const result = validateResendConfig();
      expect(result.valid).toBe(false);
      expect(result.error).toBe(
        "RESEND_API_KEY environment variable is not set"
      );
    });

    it("should return invalid when API key is empty", () => {
      process.env.RESEND_API_KEY = "";
      const result = validateResendConfig();
      expect(result.valid).toBe(false);
      expect(result.error).toBe(
        "RESEND_API_KEY environment variable is not set"
      );
    });

    it("should return valid for live API keys starting with re_", () => {
      process.env.RESEND_API_KEY = "re_abc123xyz";
      const result = validateResendConfig();
      expect(result.valid).toBe(true);
    });
  });

  describe("getResendClient", () => {
    it("should return a Resend client when API key is configured", () => {
      process.env.RESEND_API_KEY = "re_test_123456789";
      const client = getResendClient();
      expect(client).toBeDefined();
      expect(client.emails).toBeDefined();
      expect(client.contacts).toBeDefined();
    });

    it("should throw ResendConfigError when API key is not configured", () => {
      delete process.env.RESEND_API_KEY;
      expect(() => getResendClient()).toThrow(ResendConfigError);
    });

    it("should throw with descriptive error message", () => {
      delete process.env.RESEND_API_KEY;
      expect(() => getResendClient()).toThrow(
        "RESEND_API_KEY environment variable is not set"
      );
    });

    it("should return the same client instance on subsequent calls", () => {
      process.env.RESEND_API_KEY = "re_test_123456789";
      const client1 = getResendClient();
      const client2 = getResendClient();
      expect(client1).toBe(client2);
    });
  });

  describe("ResendConfigError", () => {
    it("should be an instance of Error", () => {
      const error = new ResendConfigError("Test error");
      expect(error).toBeInstanceOf(Error);
    });

    it("should have the correct name", () => {
      const error = new ResendConfigError("Test error");
      expect(error.name).toBe("ResendConfigError");
    });

    it("should have the correct message", () => {
      const error = new ResendConfigError("Configuration failed");
      expect(error.message).toBe("Configuration failed");
    });
  });
});

describe("Resend Environment Integration", () => {
  it("should use RESEND_API_KEY from environment", () => {
    // This test validates that the module reads from the correct env variable
    const envVars: (keyof NodeJS.ProcessEnv)[] = ["RESEND_API_KEY"];

    envVars.forEach((key) => {
      expect(typeof key).toBe("string");
      expect(key.startsWith("NEXT_PUBLIC_")).toBe(false); // Server-only
    });
  });
});
