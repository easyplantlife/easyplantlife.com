import React, {
  forwardRef,
  type AnchorHTMLAttributes,
  type MouseEvent,
} from "react";
import NextLink from "next/link";
import { trackOutboundClick } from "@/lib/analytics/events";

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** The URL the link points to */
  href: string;
}

/**
 * Determines if a URL is external (should open in new tab)
 * External URLs start with http://, https://, mailto:, or tel:
 */
function isExternalLink(href: string): boolean {
  return /^(https?:\/\/|mailto:|tel:)/.test(href);
}

/**
 * Link Component
 *
 * A styled link component that wraps Next.js Link for consistent styling.
 * Automatically handles internal vs external links:
 * - Internal links use Next.js Link for client-side navigation
 * - External links open in new tab with proper security attributes
 *
 * @example
 * ```tsx
 * // Internal link
 * <Link href="/about">About Us</Link>
 *
 * // External link (automatically opens in new tab)
 * <Link href="https://medium.com/article">Read on Medium</Link>
 *
 * // With custom styling
 * <Link href="/contact" className="text-lg">Contact</Link>
 * ```
 */
/**
 * Extracts text content from React children for analytics tracking
 */
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

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { href, children, className = "", onClick, ...props },
  ref
) {
  const baseStyles = [
    // Text color - brand accent
    "text-text-accent",
    // Subtle underline styling
    "underline underline-offset-2",
    "decoration-1",
    // Hover state
    "hover:text-primary-dark",
    // Smooth transition
    "transition-colors duration-200",
    // Focus styles for accessibility
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
    "rounded-sm",
  ].join(" ");

  const combinedClassName = `${baseStyles} ${className}`.trim();

  const handleExternalClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Track outbound click with link text
    const linkText = getTextContent(children).trim();
    trackOutboundClick(href, linkText || undefined);

    // Call original onClick handler if provided
    if (onClick) {
      onClick(e);
    }
  };

  if (isExternalLink(href)) {
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
