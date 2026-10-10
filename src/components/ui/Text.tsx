import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type TextElement = "p" | "span" | "div";

export type TextSize = "xs" | "sm" | "base" | "lg" | "xl" | "2xl";

export type TextColor =
  "default" | "soft" | "secondary" | "faint" | "accent" | "inverse";

export interface TextProps extends HTMLAttributes<HTMLParagraphElement> {
  as?: TextElement;
  size?: TextSize;
  color?: TextColor;
}

const sizeStyles: Record<TextSize, string> = {
  xs: "text-xs",
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
};

const colorStyles: Record<TextColor, string> = {
  default: "text-ink",
  soft: "text-ink-soft",
  secondary: "text-muted",
  faint: "text-faint",
  accent: "text-accent",
  inverse: "text-on-accent",
};

/**
 * Text
 *
 * Body copy. "soft" is for long-form prose, "secondary" for leads and
 * excerpts, "faint" for captions and helper text.
 */
export function Text({
  as: Tag = "p",
  size = "base",
  color = "default",
  className = "",
  children,
  ...props
}: TextProps) {
  return (
    <Tag
      className={cn(
        "font-sans leading-relaxed",
        sizeStyles[size],
        colorStyles[color],
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
