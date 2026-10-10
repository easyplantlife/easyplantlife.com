import localFont from "next/font/local";

/**
 * Brand typefaces, self-hosted from src/fonts.
 *
 * Using next/font/local instead of next/font/google means a build never has
 * to download anything: Google Fonts has been unreachable from hosted build
 * machines before, and with Turbopack that surfaces as a confusing
 * "Module not found" error. Both files are variable, latin-subset woff2.
 */

/** Lora (serif) for headings. */
export const headingFont = localFont({
  src: "../fonts/lora-latin-wght.woff2",
  variable: "--font-heading",
  weight: "400 700",
  style: "normal",
  display: "swap",
  fallback: ["Georgia", "serif"],
  adjustFontFallback: "Times New Roman",
});

/** Source Sans 3 (sans-serif) for body text and UI. */
export const bodyFont = localFont({
  src: "../fonts/source-sans-3-latin-wght.woff2",
  variable: "--font-body",
  weight: "300 600",
  style: "normal",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
  adjustFontFallback: "Arial",
});
