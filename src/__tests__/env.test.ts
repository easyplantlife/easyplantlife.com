/**
 * Tests for environment variable configuration
 * Validates that environment types are properly defined and accessible
 */

describe("Environment Variables Configuration", () => {
  describe("Type definitions", () => {
    it("should have ProcessEnv interface with required variables", () => {
      // This test validates that TypeScript types are properly defined
      // The actual type checking happens at compile time
      const envVars: (keyof NodeJS.ProcessEnv)[] = [
        "NEXT_PUBLIC_GA_MEASUREMENT_ID",
        "RESEND_API_KEY",
        "MEDIUM_PUBLICATION_URL",
      ];

      // Verify that we can reference these without TypeScript errors
      envVars.forEach((key) => {
        expect(typeof key).toBe("string");
      });
    });
  });

  describe("Environment variable access", () => {
    it("should allow accessing NEXT_PUBLIC_ variables", () => {
      // NEXT_PUBLIC_ prefixed variables are available on client-side
      const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
      // Variable should either be undefined or match GA4 format (G-XXXXXXXXXX)
      if (gaId !== undefined) {
        expect(gaId).toMatch(/^G-[A-Z0-9]+$/);
      }
    });

    it("should allow accessing server-only variables", () => {
      // Non-prefixed variables are only available on server-side
      const resendKey = process.env.RESEND_API_KEY;
      // Variable should either be undefined or be a non-empty string
      if (resendKey !== undefined) {
        expect(resendKey.length).toBeGreaterThan(0);
      }
    });
  });

  describe("Environment helper functions", () => {
    // Save original env
    const originalEnv = process.env;

    beforeEach(() => {
      jest.resetModules();
      process.env = { ...originalEnv };
    });

    afterAll(() => {
      process.env = originalEnv;
    });

    it("should validate that client environment variables use NEXT_PUBLIC_ prefix", () => {
      // Client-accessible env vars must start with NEXT_PUBLIC_
      const clientVars = ["NEXT_PUBLIC_GA_MEASUREMENT_ID"];

      clientVars.forEach((varName) => {
        expect(varName.startsWith("NEXT_PUBLIC_")).toBe(true);
      });
    });

    it("should validate that server-only variables do NOT use NEXT_PUBLIC_ prefix", () => {
      // Server-only env vars should NOT start with NEXT_PUBLIC_
      const serverVars = ["RESEND_API_KEY", "MEDIUM_PUBLICATION_URL"];

      serverVars.forEach((varName) => {
        expect(varName.startsWith("NEXT_PUBLIC_")).toBe(false);
      });
    });
  });
});
