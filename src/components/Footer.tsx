import NextLink from "next/link";
import Image from "next/image";

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
 * Features gradient background and brand-aligned design.
 *
 * @example
 * ```tsx
 * <Footer />
 * ```
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-neutral-200 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center gap-8">
          {/* Logo */}
          <NextLink
            href="/"
            aria-label="Easy Plant Life"
            className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm"
          >
            <span className="sr-only">Easy Plant Life</span>
            <Image
              src="/images/lockup-logo.png"
              alt=""
              width={200}
              height={70}
              className="h-16 w-auto"
              aria-hidden="true"
            />
          </NextLink>

          {/* Navigation */}
          <nav
            aria-label="Footer navigation"
            className="flex items-center flex-wrap justify-center gap-6"
          >
            {footerLinks.map((link) => (
              <NextLink
                key={link.href}
                href={link.href}
                className="text-neutral-600 hover:text-primary-600 font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm"
              >
                {link.name}
              </NextLink>
            ))}
          </nav>

          {/* Divider */}
          <div className="flex items-center gap-4 w-full max-w-xs">
            <div className="flex-1 h-px bg-neutral-200" />
            <Image
              src="/images/mark-logo.png"
              alt=""
              width={24}
              height={24}
              className="opacity-50"
              aria-hidden="true"
            />
            <div className="flex-1 h-px bg-neutral-200" />
          </div>

          {/* Copyright */}
          <p className="text-sm text-neutral-500">
            © {currentYear} Easy Plant Life. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
