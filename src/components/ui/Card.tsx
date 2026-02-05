"use client";

import {
  forwardRef,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
  type MouseEvent,
} from "react";
import NextLink from "next/link";
import { trackOutboundClick } from "@/lib/analytics/events";

/**
 * Allowed semantic HTML elements for the Card
 */
export type CardElement = "div" | "article" | "section";

export interface CardProps extends HTMLAttributes<HTMLElement> {
  /** HTML element to render as (ignored if href is provided) */
  as?: CardElement;
  /** Optional image slot rendered at the top of the card */
  image?: ReactNode;
  /** URL for clickable card variant (renders as anchor) */
  href?: string;
  /** Target for external links (e.g., "_blank") */
  target?: string;
  /** Relationship for external links (e.g., "noopener noreferrer") */
  rel?: string;
  /** Label for analytics tracking (e.g., book title, blog post title) */
  trackingLabel?: string;
}

/**
 * Determines if a URL is external (for analytics tracking)
 */
function isExternalLink(href: string): boolean {
  return /^(https?:\/\/|mailto:|tel:)/.test(href);
}

/**
 * Card Component
 *
 * A minimal card component for displaying books and blog posts.
 * Features subtle styling (minimal border, no heavy shadows) per brand guidelines.
 *
 * @example
 * ```tsx
 * // Basic card
 * <Card>
 *   <h3>Card Title</h3>
 *   <p>Card content</p>
 * </Card>
 *
 * // Card with image
 * <Card image={<img src="/book.jpg" alt="Book cover" />}>
 *   <h3>Book Title</h3>
 *   <p>Book description</p>
 * </Card>
 *
 * // Clickable card
 * <Card href="/books/my-book">
 *   <h3>Book Title</h3>
 *   <p>Click to view details</p>
 * </Card>
 *
 * // Card as article element
 * <Card as="article">
 *   <h3>Blog Post</h3>
 *   <p>Post excerpt</p>
 * </Card>
 * ```
 */
export const Card = forwardRef<HTMLElement, CardProps>(function Card(
  {
    children,
    as: Component = "div",
    image,
    href,
    target,
    rel,
    trackingLabel,
    className = "",
    onClick,
    ...props
  },
  ref
) {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Track outbound clicks for external links
    if (href && isExternalLink(href)) {
      trackOutboundClick(href, trackingLabel);
    }
    // Call original onClick if provided
    if (onClick) {
      onClick(e as unknown as MouseEvent<HTMLElement>);
    }
  };
  const baseStyles = [
    // Minimal card styling per brand guidelines
    "border",
    "border-neutral-200",
    // Rounded corners
    "rounded-2xl",
    // Padding consistent with spacing scale
    "p-6",
    // Gradient background
    "bg-gradient-to-br",
    "from-white",
    "to-primary-50/50",
  ].join(" ");

  const clickableStyles = href
    ? [
        // Hover state with green border
        "hover:border-primary",
        "hover:shadow-lg",
        // Smooth transition for all properties
        "transition-all",
        "duration-300",
        // Focus styles for accessibility
        "focus-visible:outline-none",
        "focus-visible:ring-2",
        "focus-visible:ring-primary-500",
        "focus-visible:ring-offset-2",
        // Block display for proper sizing
        "block",
      ].join(" ")
    : "";

  const combinedClassName =
    `${baseStyles} ${clickableStyles} ${className}`.trim();

  // Image container with negative margins to offset card padding
  const imageContainer = image ? (
    <div className="-mx-6 -mt-6 mb-4 overflow-hidden rounded-t-lg">{image}</div>
  ) : null;

  // Content wrapper
  const content = (
    <>
      {imageContainer}
      <div>{children}</div>
    </>
  );

  // Render as anchor for clickable variant
  if (href) {
    return (
      <NextLink
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        target={target}
        rel={rel}
        className={combinedClassName}
        onClick={handleClick}
        {...(props as HTMLAttributes<HTMLAnchorElement>)}
      >
        {content}
      </NextLink>
    );
  }

  // Render as specified element
  const Tag = Component as ElementType;

  return (
    <Tag ref={ref} className={combinedClassName} {...props}>
      {content}
    </Tag>
  );
});
