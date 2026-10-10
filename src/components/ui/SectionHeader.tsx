import { type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Eyebrow } from "./Eyebrow";
import { Heading, type HeadingLevel } from "./Heading";

export interface SectionHeaderProps extends HTMLAttributes<HTMLDivElement> {
  eyebrow?: string;
  title: string;
  level?: HeadingLevel;
  /** Optional link placed opposite the title, e.g. "All posts →". */
  action?: ReactNode;
  /** id for the heading so a section can reference it via aria-labelledby. */
  titleId?: string;
}

/**
 * SectionHeader
 *
 * Eyebrow + heading, with an optional action aligned to the right.
 */
export function SectionHeader({
  eyebrow,
  title,
  level = 2,
  action,
  titleId,
  className = "",
  ...props
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-7 flex flex-wrap items-end justify-between gap-4",
        className
      )}
      {...props}
    >
      <div className="flex flex-col gap-3">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <Heading level={level} id={titleId}>
          {title}
        </Heading>
      </div>
      {action}
    </div>
  );
}
