import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type EyebrowTone = "accent" | "muted";

export interface EyebrowProps extends HTMLAttributes<HTMLElement> {
  as?: "p" | "span" | "div";
  tone?: EyebrowTone;
}

const toneStyles: Record<EyebrowTone, string> = {
  accent: "text-accent",
  muted: "text-faint",
};

/**
 * Eyebrow
 *
 * Small uppercase label that sits above a heading and names the section.
 */
export function Eyebrow({
  as: Tag = "p",
  tone = "accent",
  className = "",
  children,
  ...props
}: EyebrowProps) {
  return (
    <Tag
      className={cn(
        "font-sans text-[13px] font-semibold uppercase tracking-[0.08em]",
        toneStyles[tone],
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
