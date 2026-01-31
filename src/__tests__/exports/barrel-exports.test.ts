/**
 * Barrel Export Tests
 *
 * Tests that verify all barrel exports (index.ts files) correctly
 * re-export their modules. This ensures the public API is correct
 * and provides coverage for index files.
 */

describe("Barrel Exports", () => {
  describe("components/analytics/index.ts", () => {
    it("exports GoogleAnalytics component", async () => {
      const { GoogleAnalytics } = await import("@/components/analytics");
      expect(GoogleAnalytics).toBeDefined();
      expect(typeof GoogleAnalytics).toBe("function");
    });
  });

  describe("components/blog/index.ts", () => {
    it("exports BlogPostCard component", async () => {
      const { BlogPostCard } = await import("@/components/blog");
      expect(BlogPostCard).toBeDefined();
      expect(typeof BlogPostCard).toBe("function");
    });

    it("exports BlogPostsList component", async () => {
      const { BlogPostsList } = await import("@/components/blog");
      expect(BlogPostsList).toBeDefined();
      expect(typeof BlogPostsList).toBe("function");
    });
  });

  describe("lib/analytics/index.ts", () => {
    it("exports trackEvent function", async () => {
      const { trackEvent } = await import("@/lib/analytics");
      expect(trackEvent).toBeDefined();
      expect(typeof trackEvent).toBe("function");
    });

    it("exports trackFormView function", async () => {
      const { trackFormView } = await import("@/lib/analytics");
      expect(trackFormView).toBeDefined();
      expect(typeof trackFormView).toBe("function");
    });

    it("exports trackNewsletterSubmit function", async () => {
      const { trackNewsletterSubmit } = await import("@/lib/analytics");
      expect(trackNewsletterSubmit).toBeDefined();
      expect(typeof trackNewsletterSubmit).toBe("function");
    });

    it("exports trackContactSubmit function", async () => {
      const { trackContactSubmit } = await import("@/lib/analytics");
      expect(trackContactSubmit).toBeDefined();
      expect(typeof trackContactSubmit).toBe("function");
    });

    it("exports trackOutboundClick function", async () => {
      const { trackOutboundClick } = await import("@/lib/analytics");
      expect(trackOutboundClick).toBeDefined();
      expect(typeof trackOutboundClick).toBe("function");
    });
  });

  describe("lib/api/index.ts", () => {
    it("exports fetchMediumPosts function", async () => {
      const { fetchMediumPosts } = await import("@/lib/api");
      expect(fetchMediumPosts).toBeDefined();
      expect(typeof fetchMediumPosts).toBe("function");
    });

    it("exports getResendClient function", async () => {
      const { getResendClient } = await import("@/lib/api");
      expect(getResendClient).toBeDefined();
      expect(typeof getResendClient).toBe("function");
    });

    it("exports isResendConfigured function", async () => {
      const { isResendConfigured } = await import("@/lib/api");
      expect(isResendConfigured).toBeDefined();
      expect(typeof isResendConfigured).toBe("function");
    });

    it("exports validateResendConfig function", async () => {
      const { validateResendConfig } = await import("@/lib/api");
      expect(validateResendConfig).toBeDefined();
      expect(typeof validateResendConfig).toBe("function");
    });

    it("exports ResendConfigError class", async () => {
      const { ResendConfigError } = await import("@/lib/api");
      expect(ResendConfigError).toBeDefined();
      expect(typeof ResendConfigError).toBe("function");
    });

    it("exports addToNewsletter function", async () => {
      const { addToNewsletter } = await import("@/lib/api");
      expect(addToNewsletter).toBeDefined();
      expect(typeof addToNewsletter).toBe("function");
    });

    it("exports sendEmail function", async () => {
      const { sendEmail } = await import("@/lib/api");
      expect(sendEmail).toBeDefined();
      expect(typeof sendEmail).toBe("function");
    });

    it("exports EmailServiceError class", async () => {
      const { EmailServiceError } = await import("@/lib/api");
      expect(EmailServiceError).toBeDefined();
      expect(typeof EmailServiceError).toBe("function");
    });
  });
});
