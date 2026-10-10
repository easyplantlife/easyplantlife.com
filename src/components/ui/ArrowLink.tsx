import { forwardRef } from "react";
import { cn, isExternalHref } from "@/lib/utils";
import { Link, type LinkProps } from "./Link";

export type ArrowLinkProps = Omit<LinkProps, "variant">;

/**
 * ArrowLink
 *
 * Quiet call to action: bold accent text with a trailing arrow. Internal links
 * get "→", links that leave the site get "↗" so the destination is honest.
 */
export const ArrowLink = forwardRef<HTMLAnchorElement, ArrowLinkProps>(
  function ArrowLink({ href, children, className = "", ...props }, ref) {
    const arrow = isExternalHref(href) ? "↗" : "→";

    return (
      <Link
        ref={ref}
        href={href}
        variant="plain"
        className={cn(
          "inline-flex items-center gap-1.5 font-sans font-semibold text-accent transition-colors",
          "hover:text-accent-hover hover:underline hover:underline-offset-4",
          className
        )}
        {...props}
      >
        {children}
        <span aria-hidden="true">{arrow}</span>
      </Link>
    );
  }
);
