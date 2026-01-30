"use client";

import NextLink from "next/link";
import { MobileNav } from "./MobileNav";

/**
 * Navigation link configuration
 */
interface NavLink {
  name: string;
  href: string;
}

const navLinks: NavLink[] = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Books", href: "/books" },
  { name: "Blog", href: "/blog" },
  { name: "Newsletter", href: "/newsletter" },
  { name: "Contact", href: "/contact" },
];

/**
 * Header Component
 *
 * Site header with logo and navigation for Easy Plant Life.
 * Features responsive design with mobile menu and desktop navigation.
 *
 * @example
 * ```tsx
 * <Header />
 * ```
 */
export function Header() {
  return (
    <header className="bg-background border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NextLink
            href="/"
            className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm"
          >
            <span
              aria-label="Easy Plant Life home"
              className="font-heading text-xl font-semibold text-text"
            >
              Easy Plant Life
            </span>
          </NextLink>

          {/* Desktop Navigation */}
          <nav
            aria-label="Main navigation"
            className="hidden md:flex items-center space-x-8"
          >
            {navLinks.map((link) => (
              <NextLink
                key={link.href}
                href={link.href}
                className="text-text hover:text-primary-dark transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm"
              >
                {link.name}
              </NextLink>
            ))}
          </nav>

          {/* Mobile Navigation */}
          <MobileNav links={navLinks} />
        </div>
      </div>
    </header>
  );
}
