"use client";

import React, {
  forwardRef,
  type AnchorHTMLAttributes,
  type MouseEvent,
} from "react";
import NextLink from "next/link";
import { trackOutboundClick } from "@/lib/analytics/events";
import { cn, isExternalHref } from "@/lib/utils";

export type LinkVariant = "inline" | "plain";

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  /**
   * "inline" (default) styles the link for use inside running text.
   * "plain" only adds the focus ring, for links that bring their own look
   * (buttons, nav items, arrow links).
   */
  variant?: LinkVariant;
}

function getTextContent(node: React.ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (Array.isArray(node)) {
    return node.map(getTextContent).join(" ").replace(/\s+/g, " ").trim();
  }
  if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
    return getTextContent(node.props.children);
  }
  return "";
}

const focusStyles =
  "rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ground";

const variantStyles: Record<LinkVariant, string> = {
  inline:
    "text-accent underline decoration-1 underline-offset-[3px] transition-colors duration-200 hover:text-accent-hover",
  plain: "",
};

/**
 * Link
 *
 * A client component because external links attach a click handler for
 * analytics; server components can render it freely.
 *
 * Internal links use next/link. External links (http, mailto, tel) open in a
 * new tab, carry rel="noopener noreferrer" and report an outbound click to
 * analytics with the link's text.
 */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { href, children, variant = "inline", className = "", onClick, ...props },
  ref
) {
  const combinedClassName = cn(focusStyles, variantStyles[variant], className);

  if (isExternalHref(href)) {
    const handleExternalClick = (e: MouseEvent<HTMLAnchorElement>) => {
      const linkText = getTextContent(children).trim();
      trackOutboundClick(href, linkText || undefined);
      onClick?.(e);
    };

    return (
      <a
        ref={ref}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={combinedClassName}
        onClick={handleExternalClick}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <NextLink
      ref={ref}
      href={href}
      className={combinedClassName}
      onClick={onClick}
      {...props}
    >
      {children}
    </NextLink>
  );
});
