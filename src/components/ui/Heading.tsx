import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export type HeadingColor = "default" | "secondary" | "accent" | "inverse";

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level: HeadingLevel;
  color?: HeadingColor;
}

const levelStyles: Record<HeadingLevel, string> = {
  1: "text-[clamp(2.375rem,4.4vw,3.625rem)] leading-[1.1] tracking-[-0.015em]",
  2: "text-[2.125rem] leading-[1.2]",
  3: "text-2xl leading-[1.3]",
  4: "text-xl leading-[1.3]",
  5: "text-lg leading-[1.4]",
  6: "text-base leading-[1.4]",
};

const colorStyles: Record<HeadingColor, string> = {
  default: "text-ink",
  secondary: "text-muted",
  accent: "text-accent",
  inverse: "text-on-accent",
};

/**
 * Heading
 *
 * Serif heading with a calm scale. Level sets the element and size; pass a
 * className only to adjust spacing, not type.
 */
export function Heading({
  level,
  color = "default",
  className = "",
  children,
  ...props
}: HeadingProps) {
  const Tag = `h${level}` as const;

  return (
    <Tag
      className={cn(
        "font-serif font-medium",
        levelStyles[level],
        colorStyles[color],
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
