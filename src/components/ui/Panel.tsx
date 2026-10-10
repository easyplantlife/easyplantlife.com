import { type ElementType, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface PanelProps extends HTMLAttributes<HTMLElement> {
  as?: "div" | "section" | "aside";
  /** Lay children out in intrinsic columns that collapse on narrow screens. */
  columns?: boolean;
}

/**
 * Panel
 *
 * A quiet surface box for a short aside: "Not sure where to start?",
 * "Prefer email?". Not a card grid; use at most one per page.
 */
export function Panel({
  as: Component = "div",
  columns = false,
  className = "",
  children,
  ...props
}: PanelProps) {
  const Tag = Component as ElementType;

  return (
    <Tag
      className={cn(
        "rounded-2xl border border-line bg-surface p-7",
        columns &&
          "grid grid-cols-[repeat(auto-fit,minmax(min(100%,16rem),1fr))] items-center gap-6",
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
