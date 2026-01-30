/**
 * Root Layout Tests
 *
 * Tests for M3-01: Create Root Layout with HTML Structure
 *
 * Acceptance Criteria:
 * - Root layout created
 * - HTML lang attribute set
 * - Fonts loaded via next/font
 * - Base metadata configured
 * - Body has proper background color
 * - Viewport meta tag correct
 *
 * Test Case:
 * GIVEN any page renders
 * WHEN I inspect the HTML
 * THEN it has lang="en" on html element
 * AND fonts are loaded without layout shift
 */

import { render } from "@testing-library/react";
import { Metadata } from "next";

// Mock next/font/google - must be hoisted
jest.mock("next/font/google", () => {
  const mockLora = jest.fn(() => ({
    variable: "--font-heading",
    className: "mock-lora",
  }));

  const mockSourceSans3 = jest.fn(() => ({
    variable: "--font-body",
    className: "mock-source-sans",
  }));

  return {
    Lora: mockLora,
    Source_Sans_3: mockSourceSans3,
  };
});

// Mock GoogleAnalytics component
jest.mock("@/components/analytics/GoogleAnalytics", () => {
  const MockGoogleAnalytics = () => <div data-testid="google-analytics-mock" />;
  MockGoogleAnalytics.displayName = "MockGoogleAnalytics";
  return MockGoogleAnalytics;
});

// Import after mocking
import RootLayout, { metadata } from "@/app/layout";

describe("Root Layout (M3-01)", () => {
  beforeEach(() => {
    // Reset body classes before each test
    document.body.className = "";
  });

  describe("HTML Structure", () => {
    it("renders children within the layout", () => {
      const { getByTestId } = render(
        <RootLayout>
          <div data-testid="child-content">Test content</div>
        </RootLayout>
      );

      expect(getByTestId("child-content")).toBeInTheDocument();
    });

    it("sets lang attribute to 'en' on html element", () => {
      render(
        <RootLayout>
          <div>Test content</div>
        </RootLayout>
      );

      const htmlElement = document.documentElement;
      expect(htmlElement.getAttribute("lang")).toBe("en");
    });
  });

  describe("Font Loading", () => {
    it("loads fonts with display='swap' to prevent layout shift", () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { Lora, Source_Sans_3 } = require("next/font/google");

      // Check heading font (Lora) configuration
      expect(Lora).toHaveBeenCalledWith(
        expect.objectContaining({
          display: "swap",
        })
      );

      // Check body font (Source Sans 3) configuration
      expect(Source_Sans_3).toHaveBeenCalledWith(
        expect.objectContaining({
          display: "swap",
        })
      );
    });

    it("applies font CSS variables to body", () => {
      render(
        <RootLayout>
          <div>Test content</div>
        </RootLayout>
      );

      const body = document.body;
      expect(body.className).toContain("--font-heading");
      expect(body.className).toContain("--font-body");
    });

    it("applies antialiased class for smooth font rendering", () => {
      render(
        <RootLayout>
          <div>Test content</div>
        </RootLayout>
      );

      const body = document.body;
      expect(body.className).toContain("antialiased");
    });
  });

  describe("Metadata Configuration", () => {
    it("exports metadata with title", () => {
      expect(metadata).toBeDefined();
      expect((metadata as Metadata).title).toBeDefined();
      // Title is now a template object with default and template properties
      const title = (metadata as Metadata).title as {
        default?: string;
        template?: string;
      };
      expect(title.default).toBe("Easy Plant Life");
      expect(title.template).toBe("%s | Easy Plant Life");
    });

    it("exports metadata with description", () => {
      expect((metadata as Metadata).description).toBeDefined();
      expect((metadata as Metadata).description).toContain(
        "calm approach to plant-based living"
      );
    });
  });

  describe("Background and Styling", () => {
    it("body receives font variable classes for background styling", () => {
      render(
        <RootLayout>
          <div>Test content</div>
        </RootLayout>
      );

      // Body should have the font variables applied so globals.css can style it
      const body = document.body;
      expect(body.className).toBeTruthy();
    });
  });

  describe("Viewport Configuration", () => {
    it("exports viewport configuration for responsive design", async () => {
      // In Next.js 13+, viewport is exported separately from metadata
      // The viewport export controls the viewport meta tag
      const layoutModule = await import("@/app/layout");
      const viewport = layoutModule.viewport;

      // Viewport should be defined to ensure proper mobile rendering
      expect(viewport).toBeDefined();
      expect(viewport).toEqual(
        expect.objectContaining({
          width: "device-width",
          initialScale: 1,
        })
      );
    });
  });

  describe("Analytics Integration", () => {
    it("includes GoogleAnalytics component for tracking", () => {
      const { getByTestId } = render(
        <RootLayout>
          <div>Test content</div>
        </RootLayout>
      );

      // Verify GoogleAnalytics is rendered in the layout
      expect(getByTestId("google-analytics-mock")).toBeInTheDocument();
    });
  });
});
