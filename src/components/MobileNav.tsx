"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import NextLink from "next/link";

interface NavLink {
  name: string;
  href: string;
}

interface MobileNavProps {
  links: NavLink[];
}

/**
 * MobileNav Component
 *
 * A calm and intentional mobile navigation drawer that slides in from the right.
 * Features smooth animations, focus trapping, and proper accessibility.
 *
 * @example
 * ```tsx
 * <MobileNav links={[
 *   { name: "Home", href: "/" },
 *   { name: "About", href: "/about" },
 * ]} />
 * ```
 */
export function MobileNav({ links }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const navRef = useRef<HTMLElement>(null);

  const openMenu = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    // Return focus to the menu button when closed
    menuButtonRef.current?.focus();
  }, []);

  const toggleMenu = useCallback(() => {
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }, [isOpen, openMenu, closeMenu]);

  // Handle escape key to close menu
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeMenu]);

  // Handle click outside to close menu
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      // Check if click is outside the nav panel and not on the menu button
      if (
        navRef.current &&
        !navRef.current.contains(target) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(target)
      ) {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, closeMenu]);

  // Focus trap implementation
  useEffect(() => {
    if (!isOpen) return;

    const handleTabKey = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;

      const nav = navRef.current;
      if (!nav) return;

      // Get all focusable elements within the nav
      const focusableElements = nav.querySelectorAll<HTMLElement>(
        'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      // If shift+tab from first element, go to last
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
      // If tab from last element, go to first
      else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleTabKey);
    return () => document.removeEventListener("keydown", handleTabKey);
  }, [isOpen]);

  // Focus close button when menu opens
  useEffect(() => {
    if (isOpen) {
      closeButtonRef.current?.focus();
    }
  }, [isOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Mobile Menu Button (Hamburger) */}
      <button
        ref={menuButtonRef}
        type="button"
        onClick={toggleMenu}
        aria-label="Menu"
        aria-expanded={isOpen}
        aria-controls="mobile-nav-menu"
        className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-text hover:text-primary-dark hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-colors duration-200"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <>
          {/* Overlay/Backdrop */}
          <div
            data-testid="mobile-nav-overlay"
            className="fixed inset-0 z-40 bg-black/30 transition duration-300 ease-in-out md:hidden"
            aria-hidden="true"
          />

          {/* Menu Panel */}
          <nav
            ref={navRef}
            id="mobile-nav-menu"
            data-testid="mobile-nav-panel"
            aria-label="Mobile navigation"
            className="fixed top-0 right-0 z-50 h-full w-64 bg-background shadow-lg transition duration-300 ease-in-out transform md:hidden"
          >
            {/* Close Button */}
            <div className="flex items-center justify-end p-4 border-b border-neutral-200">
              <button
                ref={closeButtonRef}
                type="button"
                onClick={closeMenu}
                aria-label="Close menu"
                className="inline-flex items-center justify-center p-2 rounded-md text-text hover:text-primary-dark hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-colors duration-200"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Navigation Links */}
            <ul className="py-4">
              {links.map((link) => (
                <li key={link.href}>
                  <NextLink
                    href={link.href}
                    onClick={closeMenu}
                    className="block px-6 py-3 text-text hover:text-primary-dark hover:bg-neutral-100 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
                  >
                    {link.name}
                  </NextLink>
                </li>
              ))}
            </ul>
          </nav>
        </>
      )}
    </>
  );
}
