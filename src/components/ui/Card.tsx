import {
  forwardRef,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import NextLink from "next/link";

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
  { children, as: Component = "div", image, href, className = "", ...props },
  ref
) {
  const baseStyles = [
    // Modern card styling with subtle shadow
    "border",
    "border-primary-100",
    // More rounded corners
    "rounded-2xl",
    // Padding consistent with spacing scale
    "p-6",
    // White background with subtle gradient
    "bg-gradient-to-br from-white to-primary-50/30",
    // Subtle shadow
    "shadow-sm",
  ].join(" ");

  const clickableStyles = href
    ? [
        // Hover state with elevated shadow and scale
        "hover:shadow-lg",
        "hover:border-primary-300",
        "hover:scale-[1.02]",
        // Smooth transition
        "transition-all duration-300",
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
        className={combinedClassName}
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
