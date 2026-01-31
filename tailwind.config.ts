import type { Config } from "tailwindcss";

/**
 * Easy Plant Life - Design System Configuration
 *
 * This configuration reflects the brand's visual identity:
 * - Soft greens for accents and interactions
 * - Warm neutrals for backgrounds and text
 * - No loud contrast, calm and minimal aesthetic
 * - Human, organic typography with serif headings and soft sans-serif body
 * - Strong use of white space with a harmonious spacing scale
 *
 * Colors, fonts, and spacing are defined at the theme level (not extend) to prevent
 * default Tailwind values from leaking into the design system.
 */
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      /**
       * Primary - Vibrant Green
       * Derived from the brand logos - bright, lively greens that evoke
       * growth, nature, and positive energy.
       *
       * ACCESSIBILITY: Colors optimized for WCAG 2.1 AA contrast ratios.
       */
      primary: {
        50: "#E8F5E9", // Lightest - subtle backgrounds (Material Design green-50)
        100: "#DCEDC8", // Light - soft accent
        200: "#C5E1A5", // Light green
        300: "#AED581", // Lime light
        400: "#9CCC65", // Lime - vibrant accent
        500: "#8BC34A", // Bright lime green (from logo)
        600: "#7CB342", // Medium lime
        700: "#689F38", // Forest lime
        800: "#558B2F", // Deep green
        900: "#1B5E20", // Darkest (Material Design green-900, WCAG AA)
        DEFAULT: "#4CAF50", // Vibrant green for CTAs
        light: "#C5E1A5", // Light lime for backgrounds
        bright: "#8BC34A", // Bright lime accent
        dark: "#2E7D32", // Dark green for text/hover
      },

      /**
       * Accent - Sunshine Yellow/Gold
       * From the sun element in the logo - adds warmth and energy.
       */
      accent: {
        50: "#FFFDE7",
        100: "#FFF9C4",
        200: "#FFF59D",
        300: "#FFF176",
        400: "#FFEE58",
        500: "#FFEB3B",
        600: "#FDD835",
        700: "#FBC02D",
        DEFAULT: "#FDD835", // Warm sunshine
      },

      /**
       * Neutral - Warm Tones
       * For backgrounds, text, borders, and general UI.
       * Warm off-whites and grays create a cozy, approachable feel.
       */
      neutral: {
        50: "#FDFCFB", // Warm white - main background
        100: "#F5F5F0", // Light - secondary backgrounds
        200: "#E8E6E1", // Medium - borders, dividers
        300: "#D5D3CE", // Medium gray
        400: "#A8A5A0", // Gray
        500: "#7A7875", // Medium dark
        600: "#5C5A58", // Dark gray
        700: "#3E3D3B", // Very dark
        800: "#2D2D2D", // Near black - main text
        900: "#1A1A1A", // Darkest
        DEFAULT: "#F5F5F0",
        white: "#FDFCFB",
        light: "#F5F5F0",
        medium: "#E8E6E1",
        dark: "#2D2D2D",
      },

      /**
       * Background colors
       * Semantic aliases for common background use cases.
       */
      background: {
        DEFAULT: "#FDFCFB", // Warm white
        secondary: "#F5F5F0", // Light neutral
        accent: "#F1F8E9", // Light green tint
        lime: "#DCEDC8", // Soft lime background
        gradient: {
          from: "#F1F8E9",
          via: "#DCEDC8",
          to: "#C5E1A5",
        },
      },

      /**
       * Text colors
       * Semantic aliases for typography.
       *
       * ACCESSIBILITY: Colors meet WCAG 2.1 AA contrast requirements.
       */
      text: {
        DEFAULT: "#2D2D2D", // Main body text - 10.97:1 on white
        secondary: "#5C5A58", // Secondary/muted text - 5.74:1 on white
        accent: "#2E7D32", // Links and emphasis - 4.52:1 on white (WCAG AA)
        inverse: "#FDFCFB", // Text on dark backgrounds
      },

      // Essential utility colors
      transparent: "transparent",
      current: "currentColor",
      white: "#FFFFFF",
      black: "#000000",
    },

    /**
     * Font Families
     *
     * Typography that feels "human and organic" per brand guidelines:
     * - Heading: Lora (serif) - warm, classic, readable
     * - Body: Source Sans 3 (sans-serif) - friendly, highly readable
     */
    fontFamily: {
      heading: ["var(--font-heading)", "Georgia", "serif"],
      body: ["var(--font-body)", "system-ui", "sans-serif"],
      // Semantic aliases
      sans: ["var(--font-body)", "system-ui", "sans-serif"],
      serif: ["var(--font-heading)", "Georgia", "serif"],
    },

    /**
     * Font Sizes
     *
     * A harmonious type scale optimized for readability.
     * Each size includes recommended line-height.
     */
    fontSize: {
      xs: ["0.75rem", { lineHeight: "1rem" }], // 12px
      sm: ["0.875rem", { lineHeight: "1.25rem" }], // 14px
      base: ["1rem", { lineHeight: "1.75rem" }], // 16px - body text
      lg: ["1.125rem", { lineHeight: "1.875rem" }], // 18px
      xl: ["1.25rem", { lineHeight: "2rem" }], // 20px
      "2xl": ["1.5rem", { lineHeight: "2.25rem" }], // 24px
      "3xl": ["1.875rem", { lineHeight: "2.5rem" }], // 30px
      "4xl": ["2.25rem", { lineHeight: "2.75rem" }], // 36px
      "5xl": ["3rem", { lineHeight: "1.2" }], // 48px - large headings
      "6xl": ["3.75rem", { lineHeight: "1.1" }], // 60px
    },

    /**
     * Line Heights
     *
     * Generous line heights for optimal readability.
     * Body text uses relaxed (1.75) for comfortable reading.
     */
    lineHeight: {
      none: "1",
      tight: "1.25",
      snug: "1.375",
      normal: "1.5",
      relaxed: "1.75", // Optimized for body text readability
      loose: "2",
      body: "1.75", // Semantic alias for body text
      heading: "1.25", // Tighter for headings
    },

    /**
     * Spacing Scale
     *
     * A harmonious spacing scale for strong use of white space.
     * Brand guidelines emphasize generous white space for a calm aesthetic.
     *
     * Core scale (in pixels): 4, 8, 16, 24, 32, 48, 64, 96, 128
     * Converted to rem (base 16px) for accessibility.
     *
     * Semantic aliases:
     * - section: Large spacing for page sections (desktop-friendly)
     * - component: Medium spacing for component padding
     * - element: Small spacing for related elements
     */
    spacing: {
      // Zero
      "0": "0",

      // Core spacing scale
      "1": "0.25rem", // 4px - tiny gaps
      "2": "0.5rem", // 8px - small gaps
      "3": "0.75rem", // 12px - between small and medium
      "4": "1rem", // 16px - standard spacing
      "5": "1.25rem", // 20px
      "6": "1.5rem", // 24px - comfortable spacing
      "8": "2rem", // 32px - larger gaps
      "10": "2.5rem", // 40px
      "12": "3rem", // 48px - section-like spacing
      "16": "4rem", // 64px - generous spacing
      "20": "5rem", // 80px
      "24": "6rem", // 96px - major sections
      "32": "8rem", // 128px - hero/large sections

      // Fractional values for fine-tuning
      px: "1px",
      "0.5": "0.125rem", // 2px

      // Semantic aliases for consistent usage
      section: "6rem", // 96px - page section padding (desktop)
      component: "1.5rem", // 24px - component internal padding
      element: "0.5rem", // 8px - tight element relationships
    },
  },
};

export default config;
