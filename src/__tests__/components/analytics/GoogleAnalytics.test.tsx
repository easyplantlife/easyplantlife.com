/**
 * Google Analytics 4 Integration Tests
 *
 * Tests for M10-01: Set Up Google Analytics 4 Integration
 *
 * Acceptance Criteria:
 * - GA4 measurement ID configured
 * - Analytics script loads on all pages
 * - Page views tracked automatically
 * - No personally identifiable information collected
 * - Analytics only loads in production
 *
 * Test Cases:
 * GIVEN production environment
 * WHEN any page loads
 * THEN GA4 script is present
 *
 * GIVEN development environment
 * WHEN any page loads
 * THEN GA4 script is NOT present
 */

import { render } from "@testing-library/react";

// Mock next/script
jest.mock("next/script", () => {
  const MockScript = ({
    id,
    src,
    strategy,
    dangerouslySetInnerHTML,
    "data-testid": testId,
  }: {
    id?: string;
    src?: string;
    strategy?: string;
    dangerouslySetInnerHTML?: { __html: string };
    "data-testid"?: string;
  }) => {
    if (src) {
      return (
        <script
          id={id}
          src={src}
          data-strategy={strategy}
          data-testid={testId || id}
        />
      );
    }
    if (dangerouslySetInnerHTML) {
      return (
        <script
          id={id}
          data-strategy={strategy}
          data-testid={testId || id}
          dangerouslySetInnerHTML={dangerouslySetInnerHTML}
        />
      );
    }
    return null;
  };
  MockScript.displayName = "MockScript";
  return MockScript;
});

// Import after mocking
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";

describe("GoogleAnalytics Component (M10-01)", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe("Production Environment", () => {
    beforeEach(() => {
      process.env.NODE_ENV = "production";
      process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = "G-TEST123456";
    });

    it("renders GA4 scripts when measurement ID is provided", () => {
      const { container } = render(<GoogleAnalytics />);

      // Should have gtag.js script
      const gtagScript = container.querySelector(
        'script[src*="googletagmanager.com/gtag"]'
      );
      expect(gtagScript).toBeInTheDocument();

      // Should have inline config script
      const configScript = container.querySelector('script[id="ga-config"]');
      expect(configScript).toBeInTheDocument();
    });

    it("uses the correct measurement ID from environment variable", () => {
      const { container } = render(<GoogleAnalytics />);

      const gtagScript = container.querySelector(
        'script[src*="googletagmanager.com/gtag"]'
      );
      expect(gtagScript?.getAttribute("src")).toContain("G-TEST123456");
    });

    it("loads gtag.js with afterInteractive strategy for performance", () => {
      const { container } = render(<GoogleAnalytics />);

      const gtagScript = container.querySelector(
        'script[src*="googletagmanager.com/gtag"]'
      );
      expect(gtagScript?.getAttribute("data-strategy")).toBe("afterInteractive");
    });

    it("initializes gtag with page_view tracking", () => {
      const { container } = render(<GoogleAnalytics />);

      const configScript = container.querySelector('script[id="ga-config"]');
      const scriptContent =
        configScript?.innerHTML || configScript?.textContent || "";

      // Should initialize dataLayer
      expect(scriptContent).toContain("window.dataLayer");

      // Should configure gtag with measurement ID
      expect(scriptContent).toContain("gtag('config'");
      expect(scriptContent).toContain("G-TEST123456");
    });

    it("does not collect personally identifiable information by default", () => {
      const { container } = render(<GoogleAnalytics />);

      const configScript = container.querySelector('script[id="ga-config"]');
      const scriptContent =
        configScript?.innerHTML || configScript?.textContent || "";

      // Should not enable user ID tracking or enhanced measurement that could collect PII
      // The config should only have basic page_view tracking
      expect(scriptContent).not.toContain("user_id");
      expect(scriptContent).not.toContain("client_id");
    });
  });

  describe("Development Environment", () => {
    beforeEach(() => {
      process.env.NODE_ENV = "development";
      process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = "G-TEST123456";
    });

    it("does not render any scripts in development mode", () => {
      const { container } = render(<GoogleAnalytics />);

      const scripts = container.querySelectorAll("script");
      expect(scripts.length).toBe(0);
    });

    it("returns null when not in production", () => {
      const { container } = render(<GoogleAnalytics />);

      expect(container.firstChild).toBeNull();
    });
  });

  describe("Missing Configuration", () => {
    beforeEach(() => {
      process.env.NODE_ENV = "production";
      delete process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
    });

    it("does not render scripts when measurement ID is missing", () => {
      const { container } = render(<GoogleAnalytics />);

      const scripts = container.querySelectorAll("script");
      expect(scripts.length).toBe(0);
    });

    it("returns null when measurement ID is not configured", () => {
      const { container } = render(<GoogleAnalytics />);

      expect(container.firstChild).toBeNull();
    });
  });

  describe("Empty Measurement ID", () => {
    beforeEach(() => {
      process.env.NODE_ENV = "production";
      process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = "";
    });

    it("does not render scripts when measurement ID is empty string", () => {
      const { container } = render(<GoogleAnalytics />);

      const scripts = container.querySelectorAll("script");
      expect(scripts.length).toBe(0);
    });
  });

  describe("Test Environment", () => {
    beforeEach(() => {
      process.env.NODE_ENV = "test";
      process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = "G-TEST123456";
    });

    it("does not render scripts in test mode", () => {
      const { container } = render(<GoogleAnalytics />);

      const scripts = container.querySelectorAll("script");
      expect(scripts.length).toBe(0);
    });
  });
});
