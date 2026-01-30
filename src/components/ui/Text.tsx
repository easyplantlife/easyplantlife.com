import { type HTMLAttributes } from "react";

/**
 * Text element options
 * - p: Paragraph (default)
 * - span: Inline text
 */
export type TextElement = "p" | "span";

/**
 * Text size options
 * Maps to the typography scale in tailwind.config.ts
 */
export type TextSize = "xs" | "sm" | "base" | "lg" | "xl" | "2xl";

/**
 * Color variants for text
 * - default: Main text color
 * - secondary: Muted/secondary text
 * - accent: Brand green accent
 * - inverse: White text for dark backgrounds
 */
export type TextColor = "default" | "secondary" | "accent" | "inverse";

export interface TextProps extends HTMLAttributes<HTMLParagraphElement> {
  /** HTML element to render (p or span) */
  as?: TextElement;
  /** Size variant */
  size?: TextSize;
  /** Color variant */
  color?: TextColor;
}

/**
 * Size styles mapping
 */
const sizeStyles: Record<TextSize, string> = {
  xs: "text-xs",
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
};

/**
 * Color styles mapping
 */
const colorStyles: Record<TextColor, string> = {
  default: "text-text",
  secondary: "text-text-secondary",
  accent: "text-text-accent",
  inverse: "text-text-inverse",
};

/**
 * Text Component
 *
 * A reusable text component for body content that enforces the typography
 * scale and prevents one-off styling. Uses semantic HTML tags (p, span)
 * and the brand body font (Source Sans 3).
 *
 * @example
 * ```tsx
 * // Default paragraph
 * <Text>This is body text.</Text>
 *
 * // Large text
 * <Text size="lg">Large body text for emphasis.</Text>
 *
 * // Inline span with accent color
 * <Text as="span" color="accent">highlighted text</Text>
 *
 * // Small muted text
 * <Text size="sm" color="secondary">Posted on January 30, 2026</Text>
 * ```
 */
export function Text({
  as = "p",
  size = "base",
  color = "default",
  className = "",
  children,
  ...props
}: TextProps) {
  const Tag = as;

  const baseStyles = [
    "font-body",
    "leading-relaxed",
    sizeStyles[size],
    colorStyles[color],
  ].join(" ");

  return (
    <Tag className={`${baseStyles} ${className}`.trim()} {...props}>
      {children}
    </Tag>
  );
}
