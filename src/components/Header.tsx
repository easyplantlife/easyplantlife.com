"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { Brand } from "@/components/Brand";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { mainNavigation, newsletterNavItem } from "@/content/navigation";
import { cn, isActivePath } from "@/lib/utils";

/**
 * Header
 *
 * Brand on the left, navigation on the right. There is no hamburger menu:
 * the navigation row wraps beneath the brand when the viewport is narrow, so
 * every link stays one tap away at any width.
 */
export function Header() {
  const pathname = usePathname();

  return (
    <header className="border-b border-line bg-ground dark:border-tint-line dark:bg-surface">
      <Container className="flex min-h-[4.5rem] flex-wrap items-center justify-between gap-x-6 gap-y-3 py-3">
        <Brand />

        <div className="ml-auto flex flex-wrap items-center gap-x-5 gap-y-2">
          <nav aria-label="Main navigation">
            <ul className="flex flex-wrap items-center gap-x-7 gap-y-2">
              {mainNavigation.map((item) => {
                const active = isActivePath(pathname, item.href);
                return (
                  <li key={item.href}>
                    <NextLink
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "inline-block border-b-2 py-2 font-sans font-medium transition-colors",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ground rounded-sm",
                        active
                          ? "border-accent text-ink"
                          : "border-transparent text-muted hover:text-ink dark:text-ink dark:hover:text-accent"
                      )}
                    >
                      {item.label}
                    </NextLink>
                  </li>
                );
              })}
            </ul>
          </nav>

          <ButtonLink
            href={newsletterNavItem.href}
            variant="secondary"
            size="sm"
            aria-current={
              isActivePath(pathname, newsletterNavItem.href)
                ? "page"
                : undefined
            }
          >
            {newsletterNavItem.label}
          </ButtonLink>

          <ThemeToggle />
        </div>
      </Container>
    </header>
  );
}
