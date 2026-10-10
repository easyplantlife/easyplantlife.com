import { type HTMLAttributes, type ReactNode } from "react";
import { Container, type ContainerVariant } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { cn } from "@/lib/utils";

export type PageLayoutVariant = "default" | "narrow";

export interface PageLayoutProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  /** Page title, rendered as the h1. */
  title?: string;
  /** Small label above the title (usually the section name). */
  eyebrow?: string;
  /** One or two sentences under the title. */
  lead?: string;
  /** Optional element aligned opposite the intro, e.g. an external link. */
  action?: ReactNode;
  /** "narrow" centers a single column, for the newsletter page. */
  variant?: PageLayoutVariant;
}

const containerVariant: Record<PageLayoutVariant, ContainerVariant> = {
  default: "default",
  narrow: "narrow",
};

/**
 * PageLayout
 *
 * The main landmark for inner pages, with an optional intro block
 * (eyebrow, title, lead) that every page shares.
 */
export function PageLayout({
  children,
  title,
  eyebrow,
  lead,
  action,
  variant = "default",
  className = "",
  ...props
}: PageLayoutProps) {
  const hasIntro = Boolean(title || eyebrow || lead);
  const isNarrow = variant === "narrow";

  return (
    <main className={cn("flex-1 pb-24 pt-20", className)} {...props}>
      <Container variant={containerVariant[variant]}>
        {hasIntro && (
          <header
            className={cn(
              "mb-12 flex flex-wrap items-end justify-between gap-6",
              isNarrow && "justify-center text-center"
            )}
          >
            <div
              className={cn(
                "flex max-w-3xl flex-col gap-5",
                isNarrow && "items-center"
              )}
            >
              {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
              {title && <Heading level={1}>{title}</Heading>}
              {lead && (
                <Text size="xl" color="secondary" className="max-w-[54ch]">
                  {lead}
                </Text>
              )}
            </div>
            {action}
          </header>
        )}
        {children}
      </Container>
    </main>
  );
}
