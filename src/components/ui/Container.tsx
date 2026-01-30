import { forwardRef, type ElementType, type HTMLAttributes } from "react";

/**
 * Container variant options
 * - default: Standard max-width for general page content
 * - prose: Narrower width optimized for reading (~65 characters)
 * - wide: Larger width for full layouts
 * - full: No max-width restriction (edge-to-edge with padding)
 */
export type ContainerVariant = "default" | "prose" | "wide" | "full";

/**
 * Allowed semantic HTML elements for the Container
 */
export type ContainerElement = "div" | "section" | "main" | "article" | "aside";

export interface ContainerProps extends HTMLAttributes<HTMLElement> {
  /** Width variant */
  variant?: ContainerVariant;
  /** HTML element to render as */
  as?: ContainerElement;
}

/**
 * Variant styles mapping
 * Default: Standard max-width (1152px / 72rem)
 * Prose: Optimized for reading (~65ch)
 * Wide: Larger max-width (1280px / 80rem)
 * Full: No max-width constraint
 */
const variantStyles: Record<ContainerVariant, string> = {
  default: "max-w-6xl",
  prose: "max-w-prose",
  wide: "max-w-7xl",
  full: "",
};

/**
 * Container Component
 *
 * A layout component that provides consistent max-width and horizontal padding.
 * Used to constrain content width across all pages while maintaining
 * responsive horizontal padding and centered content.
 *
 * @example
 * ```tsx
 * // Default container for general content
 * <Container>
 *   <h1>Page Title</h1>
 *   <p>Page content goes here...</p>
 * </Container>
 *
 * // Prose container for article content
 * <Container variant="prose">
 *   <article>Long-form reading content...</article>
 * </Container>
 *
 * // Wide container for full layouts
 * <Container variant="wide" as="main">
 *   <Dashboard />
 * </Container>
 * ```
 */
export const Container = forwardRef<HTMLElement, ContainerProps>(
  function Container(
    { children, variant = "default", as: Component = "div", className = "", ...props },
    ref
  ) {
    const baseStyles = [
      // Centering
      "mx-auto",
      // Responsive horizontal padding
      "px-4",
      "md:px-6",
      "lg:px-8",
    ].join(" ");

    const Tag = Component as ElementType;

    return (
      <Tag
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${className}`.trim()}
        {...props}
      >
        {children}
      </Tag>
    );
  }
);
