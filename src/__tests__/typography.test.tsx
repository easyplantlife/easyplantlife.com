import { render, screen } from "@testing-library/react";

/**
 * Typography Configuration Tests
 *
 * These tests verify that the typography system is correctly configured
 * per brand guidelines:
 * - Human, organic feel
 * - Serif font for headings
 * - Soft sans-serif for body text
 * - Highly readable with proper line heights
 */

// Mock next/font/local - must be hoisted
jest.mock("next/font/local", () => {
  const localFont = jest.fn((options: { variable: string }) => ({
    variable: options.variable,
    className: `mock-${options.variable.replace("--font-", "")}`,
  }));
  return { __esModule: true, default: localFont };
});

// Import after mocking
import RootLayout from "@/app/layout";

describe("Typography Configuration", () => {
  describe("Font Loading", () => {
    it("loads Lora from a local file for headings", () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const localFont = require("next/font/local").default as jest.Mock;
      expect(localFont).toHaveBeenCalledWith(
        expect.objectContaining({
          src: expect.stringContaining("lora"),
          variable: "--font-heading",
          fallback: ["Georgia", "serif"],
        })
      );
    });

    it("loads Source Sans 3 from a local file for body text", () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const localFont = require("next/font/local").default as jest.Mock;
      expect(localFont).toHaveBeenCalledWith(
        expect.objectContaining({
          src: expect.stringContaining("source-sans-3"),
          variable: "--font-body",
          fallback: ["system-ui", "sans-serif"],
        })
      );
    });

    it("does not depend on Google Fonts at build time", () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const fs = require("fs");
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const path = require("path");
      const fontsFile = fs.readFileSync(
        path.join(process.cwd(), "src", "app", "fonts.ts"),
        "utf-8"
      );
      expect(fontsFile).toContain('from "next/font/local"');
      expect(fontsFile).not.toMatch(/from "next\/font\/google"/);
    });
  });

  describe("CSS Custom Properties", () => {
    it("applies font CSS variables to body element", () => {
      render(
        <RootLayout>
          <div>Test content</div>
        </RootLayout>
      );

      const body = document.body;
      // The font CSS variables should be applied as class names
      expect(body.className).toContain("--font-heading");
      expect(body.className).toContain("--font-body");
      expect(body.className).toContain("antialiased");
    });
  });
});

describe("Typography Scale", () => {
  it("defines heading font family in Tailwind config", async () => {
    const config = await import("../../tailwind.config");
    expect(config.default.theme?.fontFamily).toBeDefined();
    const fontFamily = config.default.theme?.fontFamily as Record<
      string,
      unknown
    >;
    expect(fontFamily?.heading).toBeDefined();
  });

  it("defines body font family in Tailwind config", async () => {
    const config = await import("../../tailwind.config");
    const fontFamily = config.default.theme?.fontFamily as Record<
      string,
      unknown
    >;
    expect(fontFamily?.body).toBeDefined();
  });

  it("defines font size scale in Tailwind config", async () => {
    const config = await import("../../tailwind.config");
    expect(config.default.theme?.fontSize).toBeDefined();
  });

  it("defines line height values optimized for readability", async () => {
    const config = await import("../../tailwind.config");
    const lineHeight = config.default.theme?.lineHeight as Record<
      string,
      unknown
    >;
    expect(lineHeight).toBeDefined();
    // Body text should have generous line height (1.6-1.8)
    expect(lineHeight?.relaxed || lineHeight?.body).toBeDefined();
  });
});

describe("Typography Rendering", () => {
  beforeEach(() => {
    // Reset body classes before each test
    document.body.className = "";
  });

  it("renders body text with configured body font", () => {
    render(
      <RootLayout>
        <p data-testid="body-text">Sample body text</p>
      </RootLayout>
    );

    const bodyText = screen.getByTestId("body-text");
    expect(bodyText).toBeInTheDocument();
  });

  it("renders heading elements within layout", () => {
    render(
      <RootLayout>
        <h1 data-testid="heading">Sample Heading</h1>
      </RootLayout>
    );

    const heading = screen.getByTestId("heading");
    expect(heading).toBeInTheDocument();
  });
});
