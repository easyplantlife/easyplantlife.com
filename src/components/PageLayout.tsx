import { type HTMLAttributes, type ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";

/**
 * PageLayout variant options
 * - default: Standard page layout with consistent vertical spacing
 * - hero: Larger vertical spacing for hero sections (home page)
 */
export type PageLayoutVariant = "default" | "hero";

export interface PageLayoutProps extends HTMLAttributes<HTMLElement> {
  /** Page content */
  children: ReactNode;
  /** Page title displayed as h1 heading */
  title?: string;
  /** Layout variant */
  variant?: PageLayoutVariant;
}

/**
 * Vertical padding styles for each variant
 */
const variantStyles: Record<PageLayoutVariant, string> = {
  default: "py-12 md:py-16",
  hero: "py-16 md:py-24",
};

/**
 * Title size styles for each variant
 */
const titleStyles: Record<PageLayoutVariant, string> = {
  default: "text-4xl",
  hero: "text-5xl",
};

/**
 * PageLayout Component
 *
 * A reusable layout component that provides consistent structure for all pages.
 * Includes proper spacing, max-width constraints via Container, and optional
 * page title handling with semantic heading hierarchy.
 *
 * @example
 * ```tsx
 * // Standard page layout
 * <PageLayout title="About Us">
 *   <p>Page content goes here...</p>
 * </PageLayout>
 *
 * // Hero variant for home page
 * <PageLayout variant="hero" title="Welcome">
 *   <p>Hero content...</p>
 * </PageLayout>
 *
 * // Layout without title
 * <PageLayout>
 *   <CustomHero />
 *   <ContentSection />
 * </PageLayout>
 * ```
 */
export function PageLayout({
  children,
  title,
  variant = "default",
  className = "",
  ...props
}: PageLayoutProps) {
  return (
    <main
      className={`${variantStyles[variant]} ${className}`.trim()}
      {...props}
    >
      <Container>
        {title && (
          <Heading level={1} className={`${titleStyles[variant]} mb-8`}>
            {title}
          </Heading>
        )}
        {children}
      </Container>
    </main>
  );
}
