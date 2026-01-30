import { type HTMLAttributes } from "react";

/**
 * Heading level options (1-6)
 */
export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

/**
 * Color variants for headings
 * - default: Main text color
 * - secondary: Muted/secondary text
 * - accent: Brand green accent
 * - inverse: White text for dark backgrounds
 */
export type HeadingColor = "default" | "secondary" | "accent" | "inverse";

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  /** Heading level (1-6), determines the HTML tag (h1-h6) */
  level: HeadingLevel;
  /** Color variant */
  color?: HeadingColor;
}

/**
 * Font size mapping for each heading level
 * Uses the typography scale from tailwind.config.ts
 */
const levelStyles: Record<HeadingLevel, string> = {
  1: "text-5xl",
  2: "text-4xl",
  3: "text-3xl",
  4: "text-2xl",
  5: "text-xl",
  6: "text-lg",
};

/**
 * Color styles mapping
 */
const colorStyles: Record<HeadingColor, string> = {
  default: "text-text",
  secondary: "text-text-secondary",
  accent: "text-text-accent",
  inverse: "text-text-inverse",
};

/**
 * Heading Component
 *
 * A reusable heading component that enforces the typography scale
 * and prevents one-off styling. Uses semantic HTML tags (h1-h6)
 * and the brand serif font (Lora).
 *
 * @example
 * ```tsx
 * // Page title
 * <Heading level={1}>Welcome to Easy Plant Life</Heading>
 *
 * // Section heading
 * <Heading level={2} color="accent">Our Story</Heading>
 *
 * // Sub-section with custom class
 * <Heading level={3} className="mb-4">Chapter One</Heading>
 * ```
 */
export function Heading({
  level,
  color = "default",
  className = "",
  children,
  ...props
}: HeadingProps) {
  const Tag = `h${level}` as const;

  const baseStyles = [
    "font-heading",
    "leading-tight",
    levelStyles[level],
    colorStyles[color],
  ].join(" ");

  return (
    <Tag className={`${baseStyles} ${className}`.trim()} {...props}>
      {children}
    </Tag>
  );
}
