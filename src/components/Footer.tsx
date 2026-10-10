import NextLink from "next/link";
import { Brand } from "@/components/Brand";
import { Container } from "@/components/ui/Container";
import { Link } from "@/components/ui/Link";
import { Text } from "@/components/ui/Text";
import { footerNavigation } from "@/content/navigation";
import { siteConfig } from "@/content/site";

/**
 * Footer
 *
 * Brand and tagline, the site's links, and a pointer to Medium where the
 * writing actually lives.
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-surface">
      <Container className="flex flex-col gap-8 pb-10 pt-12">
        <div className="flex flex-wrap items-start justify-between gap-8">
          <div className="flex max-w-sm flex-col gap-3">
            <Brand size="sm" />
            <Text size="sm" color="secondary">
              {siteConfig.tagline}
            </Text>
          </div>

          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap gap-6">
              {footerNavigation.map((item) => (
                <li key={item.href}>
                  <NextLink
                    href={item.href}
                    className="rounded-sm font-sans text-[15px] font-medium text-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                  >
                    {item.label}
                  </NextLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5 font-sans text-sm text-faint">
          <span>
            © {currentYear} {siteConfig.name}
          </span>
          <Link
            href={siteConfig.mediumUrl}
            variant="plain"
            className="text-faint transition-colors hover:text-ink"
          >
            Writing lives on Medium <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </Container>
    </footer>
  );
}
