"use client";

import { useState } from "react";
import NextLink from "next/link";

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

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

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={toggleMobileMenu}
            aria-label="Menu"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-text hover:text-primary-dark hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-colors duration-200"
          >
            {/* Hamburger icon */}
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div id="mobile-menu" className="md:hidden">
          <nav className="px-4 pt-2 pb-4 space-y-2">
            {navLinks.map((link) => (
              <NextLink
                key={link.href}
                href={link.href}
                className="block py-2 text-text hover:text-primary-dark transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </NextLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
