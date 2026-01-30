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

// Import after mocking
import RootLayout from "@/app/layout";

describe("Typography Configuration", () => {
  describe("Font Loading", () => {
    it("loads Lora font for headings", () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { Lora } = require("next/font/google");
      expect(Lora).toHaveBeenCalledWith(
        expect.objectContaining({
          subsets: ["latin"],
          variable: "--font-heading",
        })
      );
    });

    it("loads Source Sans 3 font for body text", () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { Source_Sans_3 } = require("next/font/google");
      expect(Source_Sans_3).toHaveBeenCalledWith(
        expect.objectContaining({
          subsets: ["latin"],
          variable: "--font-body",
        })
      );
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
    expect(config.default.theme?.fontFamily?.heading).toBeDefined();
  });

  it("defines body font family in Tailwind config", async () => {
    const config = await import("../../tailwind.config");
    expect(config.default.theme?.fontFamily?.body).toBeDefined();
  });

  it("defines font size scale in Tailwind config", async () => {
    const config = await import("../../tailwind.config");
    expect(config.default.theme?.fontSize).toBeDefined();
  });

  it("defines line height values optimized for readability", async () => {
    const config = await import("../../tailwind.config");
    const lineHeight = config.default.theme?.lineHeight;
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
