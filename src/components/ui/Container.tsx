import { forwardRef, type ElementType, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type ContainerVariant = "default" | "prose" | "narrow" | "wide" | "full";

export type ContainerElement = "div" | "section" | "main" | "article" | "aside";

export interface ContainerProps extends HTMLAttributes<HTMLElement> {
  variant?: ContainerVariant;
  as?: ContainerElement;
}

const variantStyles: Record<ContainerVariant, string> = {
  /** 1120px: page content */
  default: "max-w-content",
  /** 680px: long-form reading */
  prose: "max-w-prose",
  /** 704px: a single centered column (newsletter) */
  narrow: "max-w-narrow",
  /** 1280px: dev tooling */
  wide: "max-w-wide",
  full: "",
};

/**
 * Container
 *
 * Centers content with side gutters that scale with the viewport.
 */
export const Container = forwardRef<HTMLElement, ContainerProps>(
  function Container(
    {
      children,
      variant = "default",
      as: Component = "div",
      className = "",
      ...props
    },
    ref
  ) {
    const Tag = Component as ElementType;

    return (
      <Tag
        ref={ref}
        className={cn(
          "mx-auto w-full px-5 sm:px-8 lg:px-12",
          variantStyles[variant],
          className
        )}
        {...props}
      >
        {children}
      </Tag>
    );
  }
);
