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
import { IdeaSection } from "@/components/home/IdeaSection";
import { RecentWriting } from "@/components/home/RecentWriting";
import { BooksPreview } from "@/components/home/BooksPreview";
import { AboutContent } from "@/components/about/AboutContent";
import { NewsletterContent } from "@/components/newsletter/NewsletterContent";
import { ContactContent } from "@/components/contact/ContactContent";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import NotFound from "@/app/not-found";
import NewsletterPage from "@/app/newsletter/page";
import { books } from "@/content/books";

// Placeholder text patterns to detect
const PLACEHOLDER_PATTERNS = [
  /lorem ipsum/i,
  /\[todo\]/i,
  /\[placeholder\]/i,
  /xxx/i,
  /sample text/i,
  /insert\s+\w+\s+here/i, // "Insert text here", "Insert name here"
  /your\s+\w+\s+here/i, // "Your text here", "Your name here"
  /example\.com/i,
  /test@test/i,
  /\b(foo|bar|baz)\b/i,
];

// Words that violate brand tone (preachy, hype, activist)
const TONE_VIOLATIONS = [
  /\bmust\b/i, // Too prescriptive
  /\bshould\b(?! feel| be in touch)/i, // Prescriptive (except "should feel")
  /\bnever\b(?! existed| feel preachy| shared)/i, // Absolutist (except the privacy promise)
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

const VALID_INTERNAL_PATHS = [
  "/",
  "/about",
  "/books",
  "/blog",
  "/newsletter",
  "/contact",
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

/** Every rendered surface with authored copy. */
const COPY_SURFACES: [string, () => React.ReactElement][] = [
  ["Hero", () => <Hero />],
  ["IdeaSection", () => <IdeaSection />],
  ["RecentWriting (empty feed)", () => <RecentWriting posts={[]} />],
  ["BooksPreview", () => <BooksPreview />],
  ["AboutContent", () => <AboutContent />],
  ["NewsletterContent", () => <NewsletterContent />],
  ["NewsletterPage", () => <NewsletterPage />],
  ["ContactContent", () => <ContactContent />],
  ["Header", () => <Header />],
  ["Footer", () => <Footer />],
  ["NotFound", () => <NotFound />],
];

function expectNoViolationsIn(ui: React.ReactElement, patterns: RegExp[]) {
  const { container, unmount } = render(ui);
  const violations = findViolations(extractTextContent(container), patterns);
  unmount();
  expect(violations).toEqual([]);
}

describe("Content Quality: No Placeholder Text", () => {
  it.each(COPY_SURFACES)("%s has no placeholder text", (_name, make) => {
    expectNoViolationsIn(make(), PLACEHOLDER_PATTERNS);
  });

  it("Books content has no placeholder text", () => {
    for (const book of books) {
      const text = `${book.title} ${book.tagline} ${book.description}`;
      expect(findViolations(text, PLACEHOLDER_PATTERNS)).toEqual([]);
    }
  });

  it("Books have real page counts, not placeholders", () => {
    for (const book of books) {
      expect(book.pages).toBeGreaterThan(0);
    }
  });
});

describe("Content Quality: Brand Tone Compliance", () => {
  it.each(COPY_SURFACES)("%s follows brand tone guidelines", (_name, make) => {
    expectNoViolationsIn(make(), TONE_VIOLATIONS);
  });

  it("Books content follows brand tone guidelines", () => {
    for (const book of books) {
      const text = `${book.title} ${book.tagline} ${book.description}`;
      expect(findViolations(text, TONE_VIOLATIONS)).toEqual([]);
    }
  });
});

describe("Content Quality: No Typos", () => {
  it.each(COPY_SURFACES)("%s has no common typos", (_name, make) => {
    expectNoViolationsIn(make(), COMMON_TYPOS);
  });

  it("Books content has no common typos", () => {
    for (const book of books) {
      const text = `${book.title} ${book.tagline} ${book.description}`;
      expect(findViolations(text, COMMON_TYPOS)).toEqual([]);
    }
  });
});

describe("Content Quality: Internal Links", () => {
  function expectInternalLinksValid() {
    screen.getAllByRole("link").forEach((link) => {
      const href = link.getAttribute("href");
      if (href && !/^(https?:|mailto:|tel:|#)/.test(href)) {
        expect(VALID_INTERNAL_PATHS).toContain(href);
      }
    });
  }

  it("Header navigation links use valid internal paths", () => {
    render(<Header />);
    expectInternalLinksValid();
    for (const name of ["About", "Books", "Blog", "Contact", "Newsletter"]) {
      expect(screen.getByRole("link", { name })).toBeInTheDocument();
    }
  });

  it("Footer navigation links use valid internal paths", () => {
    render(<Footer />);
    expectInternalLinksValid();
    for (const name of ["About", "Books", "Blog", "Newsletter", "Contact"]) {
      expect(screen.getByRole("link", { name })).toBeInTheDocument();
    }
  });

  it("Home page sections link onward to valid internal paths", () => {
    render(
      <>
        <Hero />
        <IdeaSection />
        <RecentWriting posts={[]} />
        <BooksPreview />
      </>
    );
    expectInternalLinksValid();
  });

  it("About page anchors point at chapters that exist", () => {
    const { container } = render(<AboutContent />);
    screen
      .getAllByRole("link")
      .map((link) => link.getAttribute("href") ?? "")
      .filter((href) => href.startsWith("#"))
      .forEach((href) => {
        expect(container.querySelector(href)).not.toBeNull();
      });
  });

  it("NotFound page has valid home link", () => {
    render(<NotFound />);
    expect(
      screen.getByRole("link", { name: /back to the home page/i })
    ).toHaveAttribute("href", "/");
  });
});

describe("Content Quality: Book Data Integrity", () => {
  it("All books have required fields", () => {
    for (const book of books) {
      expect(book.id).toBeTruthy();
      expect(book.title).toBeTruthy();
      expect(book.tagline).toBeTruthy();
      expect(book.description).toBeTruthy();
      expect(book.coverImage).toBeTruthy();
      expect(["available", "coming-soon"]).toContain(book.status);
      expect(Array.isArray(book.purchaseLinks)).toBe(true);
    }
  });

  it("Book cover images have valid paths", () => {
    for (const book of books) {
      expect(book.coverImage).toMatch(/^\/.*\.(jpg|jpeg|png|webp|svg)$/i);
    }
  });

  it("Available books have purchase links, coming-soon books may not", () => {
    for (const book of books) {
      if (book.status === "available") {
        expect(book.purchaseLinks.length).toBeGreaterThan(0);
      }
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
    const { unmount } = render(<NewsletterContent />);
    expect(
      screen.getByRole("button", { name: /subscribe/i })
    ).toBeInTheDocument();
    unmount();

    render(<ContactContent />);
    expect(
      screen.getByRole("button", { name: /send message/i })
    ).toBeInTheDocument();
  });

  it("Links that leave the site say so", () => {
    render(<Footer />);
    const medium = screen.getByRole("link", { name: /medium/i });
    expect(medium).toHaveAttribute("target", "_blank");
    expect(medium.textContent).toContain("↗");
  });
});

describe("Content Quality: Page Sections Have Proper Structure", () => {
  it("Hero has brand name, a short headline and a brief explanation", () => {
    render(<Hero />);

    // Brand name as the eyebrow
    expect(screen.getByText("Easy Plant Life")).toBeInTheDocument();

    // Headline: one sentence, at most twelve words
    const headline = screen.getByRole("heading", { level: 1 });
    const words = headline.textContent?.trim().split(/\s+/) ?? [];
    expect(words.length).toBeGreaterThanOrEqual(3);
    expect(words.length).toBeLessThanOrEqual(12);

    // Explanation (max 3 sentences)
    const explanation = screen.getByTestId("hero-explanation");
    const sentences =
      explanation.textContent?.split(/[.!?]+/).filter(Boolean) || [];
    expect(sentences.length).toBeLessThanOrEqual(3);
  });

  it("Hero asks for one thing only: the newsletter", () => {
    render(<Hero />);
    expect(screen.getAllByRole("button")).toHaveLength(1);
    expect(
      screen.getByRole("button", { name: /get the notes/i })
    ).toBeInTheDocument();
  });

  it("About page has its four chapters", () => {
    render(<AboutContent />);

    expect(screen.getByTestId("about-why-section")).toBeInTheDocument();
    expect(screen.getByTestId("about-believe-section")).toBeInTheDocument();
    expect(screen.getByTestId("about-not-section")).toBeInTheDocument();
    expect(screen.getByTestId("about-who-section")).toBeInTheDocument();
  });

  it("Newsletter promise is concise (one or two sentences)", () => {
    render(<NewsletterPage />);

    const h1 = screen.getByRole("heading", { level: 1 });
    const lead = h1.nextElementSibling?.textContent ?? "";
    const sentences = lead.split(/[.!?]+/).filter(Boolean);
    expect(sentences.length).toBeGreaterThanOrEqual(1);
    expect(sentences.length).toBeLessThanOrEqual(2);
  });

  it("Newsletter page says what arrives and what does not", () => {
    render(<NewsletterContent />);
    expect(screen.getByText("What arrives")).toBeInTheDocument();
    expect(screen.getByText("What does not")).toBeInTheDocument();
  });
});
