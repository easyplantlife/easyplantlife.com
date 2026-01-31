"use client";

import NextLink from "next/link";
import Image from "next/image";
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
 * Uses mark logo on mobile and lockup logo on desktop.
 *
 * @example
 * ```tsx
 * <Header />
 * ```
 */
export function Header() {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-primary-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <NextLink
            href="/"
            className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm"
          >
            {/* Mark logo for mobile */}
            <Image
              src="/images/mark-logo.png"
              alt="Easy Plant Life"
              width={48}
              height={48}
              className="md:hidden"
              priority
            />
            {/* Lockup logo for desktop */}
            <Image
              src="/images/lockup-logo.png"
              alt="Easy Plant Life"
              width={180}
              height={60}
              className="hidden md:block"
              priority
            />
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
                className="text-neutral-700 font-medium hover:text-primary-600 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-primary-500 hover:after:w-full after:transition-all after:duration-300"
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
