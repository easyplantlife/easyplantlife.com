import { type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { CheckIcon } from "./icons";

export type StatusNoteSize = "md" | "lg";

export interface StatusNoteProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  /** Optional row of follow-up links or buttons. */
  actions?: ReactNode;
  size?: StatusNoteSize;
}

/**
 * StatusNote
 *
 * Calm confirmation shown after a form succeeds. Announced politely to
 * assistive tech via role="status".
 */
export function StatusNote({
  title,
  children,
  actions,
  size = "md",
  className = "",
  ...props
}: StatusNoteProps) {
  const isLarge = size === "lg";

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex items-start gap-3 rounded-2xl border border-tint-line bg-tint text-accent",
        isLarge ? "p-7" : "px-[18px] py-4",
        className
      )}
      {...props}
    >
      <CheckIcon size={isLarge ? 24 : 22} className="mt-0.5 shrink-0" />
      <div className="flex min-w-0 flex-col gap-1">
        <p
          className={cn(
            "text-ink",
            isLarge
              ? "font-serif text-[22px] font-medium leading-snug"
              : "font-sans font-semibold"
          )}
        >
          {title}
        </p>
        {children && (
          <div className="font-sans leading-relaxed text-muted">{children}</div>
        )}
        {actions && (
          <div className="mt-3 flex flex-wrap items-center gap-5">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
