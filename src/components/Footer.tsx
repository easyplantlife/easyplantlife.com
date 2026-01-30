import NextLink from "next/link";

/**
 * Footer navigation link configuration
 */
interface FooterLink {
  name: string;
  href: string;
}

const footerLinks: FooterLink[] = [
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
  { name: "Newsletter", href: "/newsletter" },
];

/**
 * Footer Component
 *
 * Site footer with logo lockup, essential links, and copyright.
 * Minimal design consistent with brand guidelines.
 *
 * @example
 * ```tsx
 * <Footer />
 * ```
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <NextLink
            href="/"
            className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm"
          >
            <span
              aria-label="Easy Plant Life home"
              className="font-heading text-lg font-semibold text-text"
            >
              Easy Plant Life
            </span>
          </NextLink>

          {/* Navigation */}
          <nav
            aria-label="Footer navigation"
            className="flex items-center space-x-6"
          >
            {footerLinks.map((link) => (
              <NextLink
                key={link.href}
                href={link.href}
                className="text-text-secondary hover:text-primary-dark transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm"
              >
                {link.name}
              </NextLink>
            ))}
          </nav>

          {/* Copyright */}
          <p className="text-sm text-text-secondary">
            © {currentYear} Easy Plant Life. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
