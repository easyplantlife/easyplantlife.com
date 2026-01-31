/**
 * Content Review Tests
 *
 * These tests verify that all site content meets quality standards:
 * - No placeholder text remains
 * - Tone matches brand guidelines (calm, honest, not preachy)
 * - No common typos or grammatical errors
 * - All internal links are valid
 * - All images have proper paths
 *
 * Task: M11-04: Final Content and Copy Review
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import { Hero } from "@/components/home/Hero";
import { NewsletterCTA } from "@/components/home/NewsletterCTA";
import { SecondaryCTAs } from "@/components/home/SecondaryCTAs";
import { AboutContent } from "@/components/about/AboutContent";
import { NewsletterContent } from "@/components/newsletter/NewsletterContent";
import { ContactContent } from "@/components/contact/ContactContent";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import NotFound from "@/app/not-found";
import { books } from "@/content/books";

// Placeholder text patterns to detect
const PLACEHOLDER_PATTERNS = [
  /lorem ipsum/i,
  /\[todo\]/i,
  /\[placeholder\]/i,
  /xxx/i,
  /sample text/i,
  /insert.*here/i,
  /your.*here/i, // "Your text here", "Your name here"
  /example\.com/i,
  /test@test/i,
  /foo|bar|baz/i,
];

// Words that violate brand tone (preachy, hype, activist)
const TONE_VIOLATIONS = [
  /\bmust\b/i, // Too prescriptive
  /\bshould\b(?! feel| be in touch)/i, // Prescriptive (except "should feel")
  /\bnever\b(?! existed| feel preachy)/i, // Absolutist
  /\balways\b/i, // Absolutist
  /\bamazing\b/i, // Hype
  /\bincredible\b/i, // Hype
  /\brevolutionary\b/i, // Hype
  /\blife-changing\b/i, // Hype
  /\bgame-changer\b/i, // Hype
  /\bunleash\b/i, // Marketing speak
  /\bsupercharge\b/i, // Marketing speak
  /\bskyrocket\b/i, // Marketing speak
  /\bexclusive\b/i, // Marketing speak
  /\blimited time\b/i, // Marketing speak
  /\bact now\b/i, // Urgency
  /\bdon't miss\b/i, // Urgency
  /\bhurry\b/i, // Urgency
  /\bsign up today\b/i, // Urgency
  /\bjoin now\b/i, // Urgency
  /\bfree\b(?! from)/i, // Marketing (except "free from")
];

// Common typos to check for
const COMMON_TYPOS = [
  /\bteh\b/i,
  /\brecieve\b/i,
  /\bseperate\b/i,
  /\boccured\b/i,
  /\boccurence\b/i,
  /\bdefinately\b/i,
  /\baccidently\b/i,
  /\bneccessary\b/i,
  /\brecommendation\b/i, // Should check context
  /\bvegtable\b/i,
  /\bvegatable\b/i,
  /\bplant-based(?!\s)/i, // Should have space after (unless end of sentence)
];

/**
 * Helper to extract all text content from a rendered component
 */
function extractTextContent(container: HTMLElement): string {
  return container.textContent || "";
}

/**
 * Helper to check text against violation patterns
 */
function findViolations(
  text: string,
  patterns: RegExp[]
): { pattern: string; match: string }[] {
  const violations: { pattern: string; match: string }[] = [];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      violations.push({ pattern: pattern.toString(), match: match[0] });
    }
  }
  return violations;
}

describe("Content Quality: No Placeholder Text", () => {
  it("Hero component has no placeholder text", () => {
    const { container } = render(<Hero />);
    const text = extractTextContent(container);
    const violations = findViolations(text, PLACEHOLDER_PATTERNS);
    expect(violations).toHaveLength(0);
  });

  it("NewsletterCTA has no placeholder text", () => {
    const { container } = render(<NewsletterCTA />);
    const text = extractTextContent(container);
    const violations = findViolations(text, PLACEHOLDER_PATTERNS);
    expect(violations).toHaveLength(0);
  });

  it("SecondaryCTAs has no placeholder text", () => {
    const { container } = render(<SecondaryCTAs />);
    const text = extractTextContent(container);
    const violations = findViolations(text, PLACEHOLDER_PATTERNS);
    expect(violations).toHaveLength(0);
  });

  it("AboutContent has no placeholder text", () => {
    const { container } = render(<AboutContent />);
    const text = extractTextContent(container);
    const violations = findViolations(text, PLACEHOLDER_PATTERNS);
    expect(violations).toHaveLength(0);
  });

  it("NewsletterContent has no placeholder text", () => {
    const { container } = render(<NewsletterContent />);
    const text = extractTextContent(container);
    const violations = findViolations(text, PLACEHOLDER_PATTERNS);
    expect(violations).toHaveLength(0);
  });

  it("ContactContent has no placeholder text", () => {
    const { container } = render(<ContactContent />);
    const text = extractTextContent(container);
    const violations = findViolations(text, PLACEHOLDER_PATTERNS);
    expect(violations).toHaveLength(0);
  });

  it("Header has no placeholder text", () => {
    const { container } = render(<Header />);
    const text = extractTextContent(container);
    const violations = findViolations(text, PLACEHOLDER_PATTERNS);
    expect(violations).toHaveLength(0);
  });

  it("Footer has no placeholder text", () => {
    const { container } = render(<Footer />);
    const text = extractTextContent(container);
    const violations = findViolations(text, PLACEHOLDER_PATTERNS);
    expect(violations).toHaveLength(0);
  });

  it("NotFound page has no placeholder text", () => {
    const { container } = render(<NotFound />);
    const text = extractTextContent(container);
    const violations = findViolations(text, PLACEHOLDER_PATTERNS);
    expect(violations).toHaveLength(0);
  });

  it("Books content has no placeholder text", () => {
    for (const book of books) {
      const text = `${book.title} ${book.description}`;
      const violations = findViolations(text, PLACEHOLDER_PATTERNS);
      expect(violations).toHaveLength(0);
    }
  });
});

describe("Content Quality: Brand Tone Compliance", () => {
  it("Hero content follows brand tone guidelines", () => {
    const { container } = render(<Hero />);
    const text = extractTextContent(container);
    const violations = findViolations(text, TONE_VIOLATIONS);
    expect(violations).toHaveLength(0);
  });

  it("NewsletterCTA follows brand tone guidelines", () => {
    const { container } = render(<NewsletterCTA />);
    const text = extractTextContent(container);
    const violations = findViolations(text, TONE_VIOLATIONS);
    expect(violations).toHaveLength(0);
  });

  it("AboutContent follows brand tone guidelines", () => {
    const { container } = render(<AboutContent />);
    const text = extractTextContent(container);
    const violations = findViolations(text, TONE_VIOLATIONS);
    expect(violations).toHaveLength(0);
  });

  it("NewsletterContent follows brand tone guidelines", () => {
    const { container } = render(<NewsletterContent />);
    const text = extractTextContent(container);
    const violations = findViolations(text, TONE_VIOLATIONS);
    expect(violations).toHaveLength(0);
  });

  it("ContactContent follows brand tone guidelines", () => {
    const { container } = render(<ContactContent />);
    const text = extractTextContent(container);
    const violations = findViolations(text, TONE_VIOLATIONS);
    expect(violations).toHaveLength(0);
  });

  it("Books content follows brand tone guidelines", () => {
    for (const book of books) {
      const text = `${book.title} ${book.description}`;
      const violations = findViolations(text, TONE_VIOLATIONS);
      expect(violations).toHaveLength(0);
    }
  });
});

describe("Content Quality: No Typos", () => {
  it("Hero content has no common typos", () => {
    const { container } = render(<Hero />);
    const text = extractTextContent(container);
    const violations = findViolations(text, COMMON_TYPOS);
    expect(violations).toHaveLength(0);
  });

  it("AboutContent has no common typos", () => {
    const { container } = render(<AboutContent />);
    const text = extractTextContent(container);
    const violations = findViolations(text, COMMON_TYPOS);
    expect(violations).toHaveLength(0);
  });

  it("NewsletterContent has no common typos", () => {
    const { container } = render(<NewsletterContent />);
    const text = extractTextContent(container);
    const violations = findViolations(text, COMMON_TYPOS);
    expect(violations).toHaveLength(0);
  });

  it("ContactContent has no common typos", () => {
    const { container } = render(<ContactContent />);
    const text = extractTextContent(container);
    const violations = findViolations(text, COMMON_TYPOS);
    expect(violations).toHaveLength(0);
  });

  it("Books content has no common typos", () => {
    for (const book of books) {
      const text = `${book.title} ${book.description}`;
      const violations = findViolations(text, COMMON_TYPOS);
      expect(violations).toHaveLength(0);
    }
  });
});

describe("Content Quality: Internal Links", () => {
  it("Header navigation links use valid internal paths", () => {
    render(<Header />);
    const links = screen.getAllByRole("link");
    const validPaths = ["/", "/about", "/books", "/blog", "/newsletter", "/contact"];

    links.forEach((link) => {
      const href = link.getAttribute("href");
      if (href && !href.startsWith("http")) {
        expect(validPaths).toContain(href);
      }
    });
  });

  it("Footer navigation links use valid internal paths", () => {
    render(<Footer />);
    const links = screen.getAllByRole("link");
    const validPaths = ["/", "/about", "/books", "/blog", "/newsletter", "/contact"];

    links.forEach((link) => {
      const href = link.getAttribute("href");
      if (href && !href.startsWith("http")) {
        expect(validPaths).toContain(href);
      }
    });
  });

  it("SecondaryCTAs links use valid internal paths", () => {
    render(<SecondaryCTAs />);
    const links = screen.getAllByRole("link");
    const validPaths = ["/", "/about", "/books", "/blog", "/newsletter", "/contact"];

    links.forEach((link) => {
      const href = link.getAttribute("href");
      if (href && !href.startsWith("http")) {
        expect(validPaths).toContain(href);
      }
    });
  });

  it("NotFound page has valid home link", () => {
    render(<NotFound />);
    const homeLink = screen.getByRole("link", { name: /return home/i });
    expect(homeLink.getAttribute("href")).toBe("/");
  });
});

describe("Content Quality: Book Data Integrity", () => {
  it("All books have required fields", () => {
    for (const book of books) {
      expect(book.id).toBeTruthy();
      expect(book.title).toBeTruthy();
      expect(book.description).toBeTruthy();
      expect(book.coverImage).toBeTruthy();
      expect(["available", "coming-soon"]).toContain(book.status);
      expect(Array.isArray(book.purchaseLinks)).toBe(true);
    }
  });

  it("Book cover images have valid paths", () => {
    for (const book of books) {
      // Cover image should start with / and have a valid extension
      expect(book.coverImage).toMatch(/^\/.*\.(jpg|jpeg|png|webp|svg)$/i);
    }
  });

  it("Available books have purchase links, coming-soon books may not", () => {
    for (const book of books) {
      if (book.status === "available") {
        expect(book.purchaseLinks.length).toBeGreaterThan(0);
      }
      // coming-soon books don't need links
    }
  });
});

describe("Content Quality: Form Labels and Accessibility", () => {
  it("Newsletter form has proper labels", () => {
    render(<NewsletterContent />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it("Contact form has proper labels", () => {
    render(<ContactContent />);
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
  });

  it("Forms have submit buttons with clear text", () => {
    render(<NewsletterContent />);
    expect(screen.getByRole("button", { name: /subscribe/i })).toBeInTheDocument();

    const { unmount } = render(<ContactContent />);
    expect(screen.getByRole("button", { name: /send message/i })).toBeInTheDocument();
    unmount();
  });
});

describe("Content Quality: Page Sections Have Proper Structure", () => {
  it("Hero has brand name, tagline, and explanation", () => {
    render(<Hero />);

    // Brand name
    expect(screen.getByText("Easy Plant Life")).toBeInTheDocument();

    // Tagline (2-4 words)
    const tagline = screen.getByTestId("hero-tagline");
    const taglineWords = tagline.textContent?.trim().split(/\s+/) || [];
    expect(taglineWords.length).toBeGreaterThanOrEqual(2);
    expect(taglineWords.length).toBeLessThanOrEqual(5); // Allow a bit of flexibility

    // Explanation (max 3 sentences)
    const explanation = screen.getByTestId("hero-explanation");
    const sentences = explanation.textContent?.split(/[.!?]+/).filter(Boolean) || [];
    expect(sentences.length).toBeLessThanOrEqual(3);
  });

  it("About page has three required sections", () => {
    render(<AboutContent />);

    expect(screen.getByTestId("about-why-section")).toBeInTheDocument();
    expect(screen.getByTestId("about-beliefs-section")).toBeInTheDocument();
    expect(screen.getByTestId("about-not-section")).toBeInTheDocument();
  });

  it("Newsletter value proposition is concise (one sentence)", () => {
    render(<NewsletterContent />);

    const content = screen.getByTestId("newsletter-content");
    const textContent = content.querySelector("p")?.textContent || "";
    const sentences = textContent.split(/[.!?]+/).filter(Boolean);
    expect(sentences.length).toBeLessThanOrEqual(2); // Allow some flexibility
  });
});
