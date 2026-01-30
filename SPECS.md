# Easy Plant Life — Technical Specifications

## Document Purpose

This document transforms the MasterDocument.md into executable specifications, acceptance tests, and atomic tasks suitable for TDD-driven development by junior developers.

Each task is designed to be:
- Completable in 1–2 hours
- Self-contained with clear "done" criteria
- Testable before implementation
- Reviewable and revertible independently

---

## Milestone Overview

| # | Milestone | Est. Tasks | Focus |
|---|-----------|------------|-------|
| M1 | Project Foundation | 8 | Setup, config, CI/CD |
| M2 | Design System | 10 | Typography, colors, components |
| M3 | Layout & Navigation | 7 | Header, footer, routing |
| M4 | Home Page | 6 | Hero, CTAs, brand message |
| M5 | About Page | 4 | Philosophy content |
| M6 | Books Page | 5 | Book display, external links |
| M7 | Blog Integration | 7 | Medium integration, post list |
| M8 | Newsletter System | 8 | Resend integration, forms |
| M9 | Contact Page | 5 | Contact form, email delivery |
| M10 | Analytics & SEO | 6 | GA4, meta tags, sitemap |
| M11 | Polish & Launch | 5 | Accessibility, performance, final QA |

**Total: 71 tasks**

---

## Milestone 1: Project Foundation

### M1-01: Initialize Next.js Project with App Router

**Title:** Initialize Next.js Project with App Router

**Description:**
Create a new Next.js project using the App Router architecture. The project must use TypeScript for type safety and be configured for static-first rendering as specified in the tech stack.

**Acceptance Criteria:**
- [ ] Project created with `create-next-app` using App Router
- [ ] TypeScript enabled and configured
- [ ] Default boilerplate removed (default pages, styles)
- [ ] `npm run dev` starts without errors
- [ ] `npm run build` completes successfully
- [ ] Project structure follows Next.js 14+ conventions

**Test Cases:**
```
GIVEN a fresh clone of the repository
WHEN I run `npm install && npm run build`
THEN the build completes with exit code 0

GIVEN the development server is running
WHEN I visit http://localhost:3000
THEN I see a blank page (no boilerplate content)
```

**Labels:** `setup`, `foundation`, `priority:critical`

---

### M1-02: Configure Tailwind CSS

**Title:** Configure Tailwind CSS with Custom Theme Foundation

**Description:**
Install and configure Tailwind CSS with a minimal custom theme. This establishes the foundation for the design system. Do not add brand colors yet—that comes in M2.

**Acceptance Criteria:**
- [ ] Tailwind CSS installed and configured
- [ ] `tailwind.config.ts` created with TypeScript
- [ ] Global CSS file imports Tailwind directives
- [ ] Tailwind classes render correctly in a test component
- [ ] PostCSS configured properly
- [ ] Unused CSS purged in production builds

**Test Cases:**
```
GIVEN a component with className="text-red-500"
WHEN the page renders
THEN the text appears red

GIVEN a production build
WHEN I inspect the CSS bundle
THEN unused Tailwind classes are not included
```

**Labels:** `setup`, `styling`, `priority:critical`

---

### M1-03: Configure ESLint and Prettier

**Title:** Configure ESLint and Prettier for Code Quality

**Description:**
Set up ESLint with Next.js recommended rules and Prettier for consistent formatting. Configure them to work together without conflicts.

**Acceptance Criteria:**
- [ ] ESLint configured with Next.js and TypeScript rules
- [ ] Prettier configured with consistent style rules
- [ ] ESLint and Prettier do not conflict
- [ ] `npm run lint` works and catches errors
- [ ] Pre-commit hook runs linting (optional but recommended)

**Test Cases:**
```
GIVEN a file with inconsistent formatting
WHEN I run `npm run lint`
THEN errors are reported

GIVEN a file with a TypeScript error
WHEN I run `npm run lint`
THEN the TypeScript error is caught
```

**Labels:** `setup`, `dx`, `priority:high`

---

### M1-04: Set Up Testing Infrastructure

**Title:** Set Up Jest and React Testing Library

**Description:**
Configure Jest with React Testing Library for component and integration testing. This is critical for TDD workflow—tests must be runnable before any feature work begins.

**Acceptance Criteria:**
- [ ] Jest installed and configured for Next.js
- [ ] React Testing Library installed
- [ ] `jest.config.ts` properly configured
- [ ] Test command (`npm test`) works
- [ ] Sample test file passes
- [ ] Coverage reporting enabled

**Test Cases:**
```
GIVEN a test file with `describe` and `it` blocks
WHEN I run `npm test`
THEN tests execute and report results

GIVEN a React component test using Testing Library
WHEN I run the test
THEN component renders and assertions pass
```

**Labels:** `setup`, `testing`, `priority:critical`

---

### M1-05: Configure Environment Variables

**Title:** Configure Environment Variables Structure

**Description:**
Set up environment variable handling for different environments (development, production). Create `.env.example` with all required variables documented.

**Acceptance Criteria:**
- [ ] `.env.local` created and gitignored
- [ ] `.env.example` created with all required variables (no secrets)
- [ ] Environment variables typed in TypeScript
- [ ] Variables accessible in both server and client contexts as needed
- [ ] Documentation for each variable in `.env.example`

**Required Variables:**
```
# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=

# Email (Resend)
RESEND_API_KEY=

# Medium Integration (if needed)
MEDIUM_PUBLICATION_URL=
```

**Labels:** `setup`, `config`, `priority:high`

---

### M1-06: Create Project Directory Structure

**Title:** Create Organized Directory Structure

**Description:**
Establish the folder structure that will be used throughout the project. This provides clear conventions for where code lives.

**Acceptance Criteria:**
- [ ] `/app` - Next.js App Router pages
- [ ] `/components` - Reusable UI components
- [ ] `/components/ui` - Primitive UI components
- [ ] `/lib` - Utility functions and helpers
- [ ] `/lib/api` - API-related utilities
- [ ] `/styles` - Global styles
- [ ] `/public` - Static assets
- [ ] `/content` - Static content (books, etc.)
- [ ] `/__tests__` - Test files (or co-located)
- [ ] README updated with structure explanation

**Labels:** `setup`, `architecture`, `priority:high`

---

### M1-07: Configure Path Aliases

**Title:** Configure TypeScript Path Aliases

**Description:**
Set up path aliases for cleaner imports. This prevents deeply nested relative imports and makes refactoring easier.

**Acceptance Criteria:**
- [ ] `@/` alias points to project root
- [ ] `@/components` alias works
- [ ] `@/lib` alias works
- [ ] Aliases work in test files
- [ ] IDE autocomplete works with aliases

**Test Cases:**
```
GIVEN a component importing from "@/lib/utils"
WHEN the file is compiled
THEN the import resolves correctly
```

**Labels:** `setup`, `dx`, `priority:medium`

---

### M1-08: Create CI Pipeline Configuration

**Title:** Configure GitHub Actions CI Pipeline

**Description:**
Create a GitHub Actions workflow that runs on every push and PR. The pipeline must run linting, type checking, and tests.

**Acceptance Criteria:**
- [ ] `.github/workflows/ci.yml` created
- [ ] Pipeline triggers on push to main and PRs
- [ ] Runs `npm ci` for clean installs
- [ ] Runs linting step
- [ ] Runs type checking step
- [ ] Runs test suite
- [ ] Fails fast on any error

**Labels:** `setup`, `ci`, `priority:high`

---

## Milestone 2: Design System

### M2-01: Define Color Palette in Tailwind Config

**Title:** Define Brand Color Palette in Tailwind

**Description:**
Add the brand color palette to Tailwind configuration. Colors should match the visual identity: soft greens, off-whites, warm neutrals. No loud contrast.

**Acceptance Criteria:**
- [ ] Primary green color scale defined (50-900)
- [ ] Neutral/warm white scale defined
- [ ] Background colors defined
- [ ] Text colors defined
- [ ] Colors documented in code comments
- [ ] No default Tailwind colors leak into design

**Color Specifications:**
```
Primary (Soft Green): For accents, links, CTAs
- Light: #E8F5E9
- Default: #81C784
- Dark: #4CAF50

Neutral (Warm):
- White: #FDFCFB
- Light: #F5F5F0
- Medium: #E8E6E1
- Dark: #2D2D2D (text)
```

**Labels:** `design-system`, `styling`, `priority:critical`

---

### M2-02: Configure Typography System

**Title:** Configure Typography with Brand Fonts

**Description:**
Set up the typography system with fonts that feel "human and organic" per brand guidelines. Use serif or soft sans-serif combinations. Ensure excellent readability.

**Acceptance Criteria:**
- [ ] Primary font selected and loaded (likely serif for headings)
- [ ] Secondary font selected (soft sans-serif for body)
- [ ] Font files optimized and self-hosted or via Google Fonts
- [ ] Font sizes scale defined
- [ ] Line heights optimized for readability
- [ ] Tailwind typography configured

**Test Cases:**
```
GIVEN the homepage loads
WHEN I inspect the body text
THEN it uses the configured body font

GIVEN heading elements (h1-h6)
WHEN they render
THEN they use the heading font with correct sizes
```

**Labels:** `design-system`, `typography`, `priority:critical`

---

### M2-03: Create Spacing Scale

**Title:** Define Consistent Spacing Scale

**Description:**
Configure Tailwind's spacing scale to create consistent, harmonious spacing throughout the site. The design should have "strong use of white space."

**Acceptance Criteria:**
- [ ] Spacing scale defined (4, 8, 16, 24, 32, 48, 64, 96, 128)
- [ ] Section padding standardized
- [ ] Component internal spacing consistent
- [ ] Mobile vs desktop spacing considered

**Labels:** `design-system`, `styling`, `priority:high`

---

### M2-04: Create Button Component

**Title:** Create Reusable Button Component

**Description:**
Build the primary Button component following TDD. This will be used for all CTAs including newsletter signup and navigation.

**Acceptance Criteria:**
- [ ] Button component created at `/components/ui/Button.tsx`
- [ ] Variants: `primary`, `secondary`, `ghost`
- [ ] Sizes: `sm`, `md`, `lg`
- [ ] States: default, hover, focus, disabled
- [ ] Accessible (keyboard navigation, focus visible)
- [ ] TypeScript props interface defined

**Test Cases:**
```
GIVEN a Button with variant="primary"
WHEN it renders
THEN it has the primary green background

GIVEN a Button with disabled={true}
WHEN a user clicks it
THEN the onClick handler does not fire

GIVEN a Button
WHEN a user presses Tab to focus it
THEN the focus ring is visible
```

**Labels:** `component`, `ui`, `priority:critical`

---

### M2-05: Create Link Component

**Title:** Create Styled Link Component

**Description:**
Build a Link component that wraps Next.js Link with consistent styling. Must handle both internal and external links appropriately.

**Acceptance Criteria:**
- [ ] Link component created at `/components/ui/Link.tsx`
- [ ] Internal links use Next.js Link
- [ ] External links open in new tab with `rel="noopener noreferrer"`
- [ ] Underline style consistent with brand (subtle)
- [ ] Hover state defined
- [ ] Accessible

**Test Cases:**
```
GIVEN a Link with href="/about"
WHEN it renders
THEN it uses Next.js Link component

GIVEN a Link with href="https://medium.com/..."
WHEN it renders
THEN it has target="_blank" and rel="noopener noreferrer"
```

**Labels:** `component`, `ui`, `priority:high`

---

### M2-06: Create Text/Heading Components

**Title:** Create Typography Components

**Description:**
Build Text and Heading components for consistent typography usage. These enforce the type scale and prevent one-off styling.

**Acceptance Criteria:**
- [ ] Heading component with levels 1-6
- [ ] Text component with size variants
- [ ] Semantic HTML tags used (h1, h2, p, span)
- [ ] Color variants available
- [ ] Components accept className for overrides

**Test Cases:**
```
GIVEN a Heading with level={1}
WHEN it renders
THEN it outputs an h1 element with correct styling

GIVEN a Text with size="lg"
WHEN it renders
THEN it has the large font size class
```

**Labels:** `component`, `typography`, `priority:high`

---

### M2-07: Create Input Component

**Title:** Create Form Input Component

**Description:**
Build a styled Input component for forms (newsletter, contact). Must be accessible and handle validation states.

**Acceptance Criteria:**
- [ ] Input component at `/components/ui/Input.tsx`
- [ ] Label association (via id or wrapping)
- [ ] Error state styling
- [ ] Placeholder styling (subtle)
- [ ] Focus state with brand colors
- [ ] TypeScript props for all HTML input attributes

**Test Cases:**
```
GIVEN an Input with error="Email is required"
WHEN it renders
THEN the error message is displayed
AND the input has error styling

GIVEN an Input with label="Email"
WHEN it renders
THEN the label is associated with the input (accessible)
```

**Labels:** `component`, `ui`, `forms`, `priority:high`

---

### M2-08: Create Container Component

**Title:** Create Layout Container Component

**Description:**
Build a Container component that provides consistent max-width and horizontal padding. Used to constrain content width across all pages.

**Acceptance Criteria:**
- [ ] Container component at `/components/ui/Container.tsx`
- [ ] Max-width appropriate for reading (prose ~65ch for text)
- [ ] Wider variant for full layouts
- [ ] Responsive horizontal padding
- [ ] Centers content

**Test Cases:**
```
GIVEN a Container with variant="prose"
WHEN it renders
THEN it has max-width optimized for reading

GIVEN a Container on mobile viewport
WHEN it renders
THEN it has appropriate horizontal padding
```

**Labels:** `component`, `layout`, `priority:high`

---

### M2-09: Create Card Component

**Title:** Create Card Component for Content Blocks

**Description:**
Build a minimal Card component for displaying books and blog posts. Keep it simple—no heavy shadows or borders per brand guidelines.

**Acceptance Criteria:**
- [ ] Card component at `/components/ui/Card.tsx`
- [ ] Subtle styling (minimal border or shadow)
- [ ] Padding consistent with spacing scale
- [ ] Optional image slot
- [ ] Optional clickable variant

**Labels:** `component`, `ui`, `priority:medium`

---

### M2-10: Create Design System Documentation Page

**Title:** Create Internal Design System Reference

**Description:**
Build a dev-only page (`/dev/design-system`) that displays all components and their variants. This serves as living documentation.

**Acceptance Criteria:**
- [ ] Page only accessible in development
- [ ] Shows all colors from palette
- [ ] Shows typography scale
- [ ] Shows all component variants
- [ ] Easy to copy code examples

**Labels:** `documentation`, `dx`, `priority:low`

---

## Milestone 3: Layout & Navigation

### M3-01: Create Root Layout

**Title:** Create Root Layout with HTML Structure

**Description:**
Build the root layout (`/app/layout.tsx`) that wraps all pages. Must include proper HTML structure, metadata, and font loading.

**Acceptance Criteria:**
- [ ] Root layout created
- [ ] HTML lang attribute set
- [ ] Fonts loaded via next/font
- [ ] Base metadata configured
- [ ] Body has proper background color
- [ ] Viewport meta tag correct

**Test Cases:**
```
GIVEN any page renders
WHEN I inspect the HTML
THEN it has lang="en" on html element
AND fonts are loaded without layout shift
```

**Labels:** `layout`, `foundation`, `priority:critical`

---

### M3-02: Create Header Component

**Title:** Create Site Header with Navigation

**Description:**
Build the site header with logo and navigation links. Keep it minimal per brand guidelines. Mobile responsiveness is critical.

**Acceptance Criteria:**
- [ ] Header component at `/components/Header.tsx`
- [ ] Logo displayed (mark logo on mobile, can be full on desktop)
- [ ] Navigation links: Home, About, Books, Blog, Newsletter, Contact
- [ ] Mobile menu (hamburger or similar minimal solution)
- [ ] Sticky positioning (optional, consider user preference)
- [ ] Accessible navigation (nav element, aria labels)

**Test Cases:**
```
GIVEN the header renders on desktop
WHEN I look at navigation
THEN all nav links are visible

GIVEN the header renders on mobile
WHEN I tap the menu button
THEN the navigation menu opens

GIVEN a screen reader user
WHEN they navigate the header
THEN they hear appropriate aria labels
```

**Labels:** `component`, `navigation`, `priority:critical`

---

### M3-03: Create Mobile Navigation Menu

**Title:** Create Mobile Navigation Drawer/Menu

**Description:**
Build the mobile navigation experience. Should feel calm and intentional—no jarring animations. Consider a slide-in drawer or simple dropdown.

**Acceptance Criteria:**
- [ ] Mobile menu component created
- [ ] Opens/closes smoothly
- [ ] All navigation links accessible
- [ ] Closes when link is clicked
- [ ] Closes when clicking outside
- [ ] Focus trapped when open (accessibility)
- [ ] Escape key closes menu

**Test Cases:**
```
GIVEN the mobile menu is open
WHEN I click a navigation link
THEN the menu closes
AND I navigate to that page

GIVEN the mobile menu is open
WHEN I press Escape
THEN the menu closes
```

**Labels:** `component`, `navigation`, `mobile`, `priority:high`

---

### M3-04: Create Footer Component

**Title:** Create Site Footer

**Description:**
Build the site footer with logo lockup, essential links, and copyright. Keep minimal—this is not a mega-footer.

**Acceptance Criteria:**
- [ ] Footer component at `/components/Footer.tsx`
- [ ] Logo lockup displayed
- [ ] Essential links (About, Contact, Newsletter)
- [ ] Copyright notice with current year
- [ ] Proper semantic structure (footer element)
- [ ] Consistent with brand (calm, minimal)

**Test Cases:**
```
GIVEN the footer renders
WHEN I look at the copyright
THEN it shows the current year

GIVEN the footer renders
WHEN I inspect the HTML
THEN it uses a footer element
```

**Labels:** `component`, `layout`, `priority:high`

---

### M3-05: Create Page Layout Component

**Title:** Create Reusable Page Layout Component

**Description:**
Build a PageLayout component that provides consistent structure for all pages: proper spacing, max-width, and page title handling.

**Acceptance Criteria:**
- [ ] PageLayout component created
- [ ] Accepts title prop for page heading
- [ ] Consistent vertical padding
- [ ] Uses Container component
- [ ] Optional hero variant for home page

**Labels:** `component`, `layout`, `priority:high`

---

### M3-06: Implement Page Routes

**Title:** Create All Page Route Files

**Description:**
Create the route files for all pages with placeholder content. This establishes the information architecture.

**Acceptance Criteria:**
- [ ] `/app/page.tsx` - Home
- [ ] `/app/about/page.tsx` - About
- [ ] `/app/books/page.tsx` - Books
- [ ] `/app/blog/page.tsx` - Blog
- [ ] `/app/newsletter/page.tsx` - Newsletter
- [ ] `/app/contact/page.tsx` - Contact
- [ ] Each page has basic metadata
- [ ] Each page renders without error

**Test Cases:**
```
GIVEN I navigate to /about
WHEN the page loads
THEN I see the About page (placeholder content OK)

GIVEN I navigate to /nonexistent
WHEN the page loads
THEN I see a 404 page
```

**Labels:** `routing`, `foundation`, `priority:critical`

---

### M3-07: Create 404 Page

**Title:** Create Custom 404 Not Found Page

**Description:**
Build a custom 404 page that matches the brand. Should be helpful and calm, not jarring.

**Acceptance Criteria:**
- [ ] `/app/not-found.tsx` created
- [ ] Friendly message
- [ ] Link back to home
- [ ] Consistent with brand styling
- [ ] No technical jargon

**Labels:** `page`, `ux`, `priority:medium`

---

## Milestone 4: Home Page

### M4-01: Create Hero Section Component

**Title:** Create Home Page Hero Section

**Description:**
Build the hero section for the home page. This is the first impression—must communicate the brand in under 30 seconds. Include logo, tagline, and brief brand explanation.

**Acceptance Criteria:**
- [ ] Hero component at `/components/home/Hero.tsx`
- [ ] Logo prominently displayed
- [ ] Short tagline (2-4 words) visible immediately
- [ ] Brief brand explanation (2-3 sentences max)
- [ ] Generous white space
- [ ] No feature lists or complex layouts
- [ ] Feels "calm and intentional"

**Test Cases:**
```
GIVEN the home page loads
WHEN I view the hero section
THEN I can understand the brand in under 30 seconds

GIVEN the hero section
WHEN I count the sentences in the explanation
THEN there are no more than 3 sentences
```

**Labels:** `component`, `home`, `priority:critical`

---

### M4-02: Create Newsletter CTA Component

**Title:** Create Home Page Newsletter CTA

**Description:**
Build the primary CTA section for newsletter signup on the home page. This is the primary conversion goal.

**Acceptance Criteria:**
- [ ] NewsletterCTA component created
- [ ] Clear value proposition (one sentence)
- [ ] Email input field
- [ ] Submit button
- [ ] Success state after submission
- [ ] Error state for failures
- [ ] No hype or marketing language

**Test Cases:**
```
GIVEN the newsletter CTA
WHEN I read the copy
THEN it contains no hype words (free, exclusive, etc.)

GIVEN a valid email submission
WHEN the form submits successfully
THEN a success message displays

GIVEN an invalid email
WHEN I try to submit
THEN an error message displays
```

**Labels:** `component`, `home`, `newsletter`, `priority:critical`

---

### M4-03: Create Secondary CTAs Section

**Title:** Create Blog and Books CTA Links

**Description:**
Build the secondary CTA section that directs users to Blog and Books. Keep minimal—just clear paths forward.

**Acceptance Criteria:**
- [ ] Section with links to Blog and Books
- [ ] Clear, simple labels
- [ ] Consistent styling with brand
- [ ] Not competing with newsletter CTA
- [ ] Accessible

**Labels:** `component`, `home`, `priority:high`

---

### M4-04: Assemble Home Page

**Title:** Assemble Complete Home Page

**Description:**
Combine all home page components into the final page. Ensure proper spacing, flow, and that it remains single-scroll or near single-scroll.

**Acceptance Criteria:**
- [ ] Hero section renders
- [ ] Newsletter CTA renders
- [ ] Secondary CTAs render
- [ ] Page is single-scroll or near single-scroll
- [ ] No unnecessary sections
- [ ] Responsive on all devices

**Test Cases:**
```
GIVEN the home page on desktop
WHEN I view without scrolling
THEN I see the complete brand message

GIVEN the home page on mobile
WHEN I scroll through
THEN all sections are accessible and readable
```

**Labels:** `page`, `home`, `priority:critical`

---

### M4-05: Add Home Page Metadata

**Title:** Configure Home Page SEO Metadata

**Description:**
Add proper metadata for the home page including title, description, and Open Graph tags.

**Acceptance Criteria:**
- [ ] Page title set
- [ ] Meta description set (under 160 characters)
- [ ] Open Graph title and description
- [ ] Open Graph image (if available)
- [ ] Twitter card metadata

**Labels:** `seo`, `home`, `priority:high`

---

### M4-06: Write Home Page Tests

**Title:** Write Integration Tests for Home Page

**Description:**
Write comprehensive tests for the home page to ensure all components render correctly and interactions work.

**Test Cases:**
```
GIVEN the home page
WHEN it loads
THEN the logo is visible
AND the tagline is visible
AND the newsletter form is present
AND links to blog and books exist

GIVEN the home page newsletter form
WHEN I enter a valid email and submit
THEN the form shows success state

GIVEN the home page
WHEN viewed on mobile
THEN all content is accessible
```

**Labels:** `testing`, `home`, `priority:high`

---

## Milestone 5: About Page

### M5-01: Create About Page Content Component

**Title:** Create About Page Content Structure

**Description:**
Build the About page content component. Content explains why Easy Plant Life exists and what it is NOT. Tone is personal but not biographical.

**Acceptance Criteria:**
- [ ] About content component created
- [ ] Explains "why Easy Plant Life exists"
- [ ] Clearly states what it is NOT
- [ ] Emphasizes realism and sustainability
- [ ] Tone is calm, honest, non-authoritative
- [ ] Not preachy or activist

**Content Sections:**
1. Why Easy Plant Life exists
2. What we believe
3. What we're not (explicitly)

**Labels:** `component`, `about`, `priority:high`

---

### M5-02: Assemble About Page

**Title:** Assemble Complete About Page

**Description:**
Combine components into the final About page with proper layout and spacing.

**Acceptance Criteria:**
- [ ] Page uses PageLayout component
- [ ] Content flows naturally
- [ ] Appropriate heading hierarchy
- [ ] Readable line lengths (prose width)
- [ ] Responsive

**Labels:** `page`, `about`, `priority:high`

---

### M5-03: Add About Page Metadata

**Title:** Configure About Page SEO Metadata

**Description:**
Add proper metadata for the About page.

**Acceptance Criteria:**
- [ ] Page title: "About | Easy Plant Life"
- [ ] Meta description set
- [ ] Open Graph tags

**Labels:** `seo`, `about`, `priority:medium`

---

### M5-04: Write About Page Tests

**Title:** Write Tests for About Page

**Description:**
Write tests to ensure About page renders correctly.

**Test Cases:**
```
GIVEN the about page
WHEN it loads
THEN the page title "About" is visible
AND the "why" section is present
AND the "what we're not" section is present
```

**Labels:** `testing`, `about`, `priority:medium`

---

## Milestone 6: Books Page

### M6-01: Create Book Data Structure

**Title:** Define Book Data Model and Content

**Description:**
Create the data structure for books and add initial book content. Books are static content for MVP.

**Acceptance Criteria:**
- [ ] Book TypeScript interface defined
- [ ] Book data stored in `/content/books.ts`
- [ ] Each book has: title, description, cover image, status, purchase links
- [ ] Status can be: "available" or "coming-soon"
- [ ] At least one book entry (can be placeholder)

**Data Structure:**
```typescript
interface Book {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  status: 'available' | 'coming-soon';
  purchaseLinks: {
    label: string;
    url: string;
  }[];
}
```

**Labels:** `data`, `books`, `priority:high`

---

### M6-02: Create Book Card Component

**Title:** Create Book Display Card Component

**Description:**
Build a card component specifically for displaying books. Shows cover, title, description, status, and purchase links.

**Acceptance Criteria:**
- [ ] BookCard component at `/components/books/BookCard.tsx`
- [ ] Displays cover image
- [ ] Displays title and short description
- [ ] Shows status badge (available/coming soon)
- [ ] Lists purchase links (external)
- [ ] External links have proper attributes

**Test Cases:**
```
GIVEN a book with status "available"
WHEN the card renders
THEN purchase links are displayed

GIVEN a book with status "coming-soon"
WHEN the card renders
THEN "Coming Soon" badge is shown
AND no purchase links are displayed
```

**Labels:** `component`, `books`, `priority:high`

---

### M6-03: Create Books List Component

**Title:** Create Books List/Grid Component

**Description:**
Build a component that displays all books. Layout should be clean and scannable.

**Acceptance Criteria:**
- [ ] BooksList component created
- [ ] Renders all books from data source
- [ ] Responsive layout (single column mobile, may expand desktop)
- [ ] Appropriate spacing between books

**Labels:** `component`, `books`, `priority:high`

---

### M6-04: Assemble Books Page

**Title:** Assemble Complete Books Page

**Description:**
Combine components into the final Books page.

**Acceptance Criteria:**
- [ ] Page uses PageLayout
- [ ] Page title/intro explaining the books section
- [ ] Books list renders
- [ ] Responsive on all devices

**Labels:** `page`, `books`, `priority:high`

---

### M6-05: Write Books Page Tests

**Title:** Write Tests for Books Page

**Description:**
Write tests for books page and components.

**Test Cases:**
```
GIVEN the books page
WHEN it loads
THEN all books from data source are displayed

GIVEN a book card with external links
WHEN I inspect the links
THEN they have target="_blank" and rel="noopener noreferrer"
```

**Labels:** `testing`, `books`, `priority:medium`

---

## Milestone 7: Blog Integration

### M7-01: Research Medium Integration Options

**Title:** Research and Document Medium Integration Approach

**Description:**
Research how to fetch posts from Medium. Options include RSS feed, Medium API (if available), or manual curation. Document the chosen approach.

**Acceptance Criteria:**
- [ ] Research Medium RSS feed structure
- [ ] Determine if API access is available/needed
- [ ] Document the chosen integration method
- [ ] Identify rate limits or restrictions
- [ ] Create technical specification for implementation

**Output:** Technical decision document in `/docs/medium-integration.md`

**Labels:** `research`, `blog`, `priority:critical`

---

### M7-02: Create Medium Service

**Title:** Create Medium Data Fetching Service

**Description:**
Build a service to fetch blog posts from Medium. This handles all Medium API/RSS communication.

**Acceptance Criteria:**
- [ ] Service at `/lib/api/medium.ts`
- [ ] Fetches post list from Medium
- [ ] Parses required fields: title, excerpt, URL, date
- [ ] Handles errors gracefully
- [ ] Implements caching (if appropriate)
- [ ] TypeScript types for Medium post data

**Test Cases:**
```
GIVEN the Medium service
WHEN fetching posts succeeds
THEN it returns an array of posts with title, excerpt, url, date

GIVEN the Medium service
WHEN fetching fails
THEN it throws a descriptive error
```

**Labels:** `api`, `blog`, `priority:critical`

---

### M7-03: Create Blog Post Data Type

**Title:** Define Blog Post TypeScript Interface

**Description:**
Create the TypeScript interface for blog posts as displayed on the site.

**Acceptance Criteria:**
- [ ] BlogPost interface defined
- [ ] Fields: title, excerpt, url, publishedDate
- [ ] Optional fields: thumbnail, readTime
- [ ] Type exported from `/lib/types/blog.ts`

**Labels:** `types`, `blog`, `priority:high`

---

### M7-04: Create Blog Post Card Component

**Title:** Create Blog Post Preview Card

**Description:**
Build a card component for displaying blog post previews. Links out to Medium.

**Acceptance Criteria:**
- [ ] BlogPostCard component created
- [ ] Displays title prominently
- [ ] Shows excerpt (truncated if needed)
- [ ] Shows publication date
- [ ] Links to Medium article
- [ ] External link indicators present

**Test Cases:**
```
GIVEN a blog post card
WHEN it renders
THEN the title links to the Medium URL
AND the link opens in a new tab
```

**Labels:** `component`, `blog`, `priority:high`

---

### M7-05: Create Blog Posts List Component

**Title:** Create Blog Posts List Component

**Description:**
Build a component that displays a list of blog posts.

**Acceptance Criteria:**
- [ ] BlogPostsList component created
- [ ] Accepts posts array as prop
- [ ] Handles empty state gracefully
- [ ] Loading state handled
- [ ] Error state handled

**Test Cases:**
```
GIVEN an empty posts array
WHEN the list renders
THEN a "no posts" message displays

GIVEN posts are loading
WHEN the list renders
THEN a loading indicator displays
```

**Labels:** `component`, `blog`, `priority:high`

---

### M7-06: Assemble Blog Page

**Title:** Assemble Complete Blog Page

**Description:**
Combine components into the final Blog page. Implement data fetching.

**Acceptance Criteria:**
- [ ] Page uses PageLayout
- [ ] Fetches posts on load (SSR or SSG)
- [ ] Displays posts list
- [ ] Clear indication posts link to Medium
- [ ] Error handling for failed fetches
- [ ] Responsive

**Labels:** `page`, `blog`, `priority:high`

---

### M7-07: Write Blog Page Tests

**Title:** Write Tests for Blog Page and Components

**Description:**
Write comprehensive tests for blog functionality.

**Test Cases:**
```
GIVEN the blog page with posts
WHEN it loads
THEN posts are displayed with titles and excerpts

GIVEN the blog page
WHEN Medium fetch fails
THEN an error message displays

GIVEN blog post links
WHEN clicked
THEN they open Medium in a new tab
```

**Labels:** `testing`, `blog`, `priority:medium`

---

## Milestone 8: Newsletter System

### M8-01: Set Up Resend Account and API

**Title:** Configure Resend Integration

**Description:**
Set up Resend account, create API key, and configure for newsletter functionality.

**Acceptance Criteria:**
- [ ] Resend account created
- [ ] API key generated and stored in environment
- [ ] Domain verified in Resend (if using custom domain)
- [ ] Test email sends successfully
- [ ] Audience/contact list created for newsletter

**Labels:** `setup`, `email`, `priority:critical`

---

### M8-02: Create Email Service

**Title:** Create Email Service Layer

**Description:**
Build a service layer for interacting with Resend API. Abstracts email functionality.

**Acceptance Criteria:**
- [ ] Email service at `/lib/api/email.ts`
- [ ] Function to add contact to newsletter audience
- [ ] Function to send transactional email (for contact form)
- [ ] Error handling with descriptive messages
- [ ] TypeScript types for all parameters/returns

**Test Cases:**
```
GIVEN a valid email
WHEN addToNewsletter is called
THEN the contact is added to Resend audience

GIVEN Resend API fails
WHEN addToNewsletter is called
THEN it throws an appropriate error
```

**Labels:** `api`, `email`, `priority:critical`

---

### M8-03: Create Newsletter API Route

**Title:** Create Newsletter Signup API Endpoint

**Description:**
Build the API route that handles newsletter signup submissions.

**Acceptance Criteria:**
- [ ] API route at `/app/api/newsletter/route.ts`
- [ ] Accepts POST with email in body
- [ ] Validates email format
- [ ] Calls email service to add contact
- [ ] Returns appropriate success/error responses
- [ ] Rate limiting considered

**Test Cases:**
```
GIVEN a valid email POST request
WHEN the API is called
THEN it returns 200 with success message

GIVEN an invalid email format
WHEN the API is called
THEN it returns 400 with validation error

GIVEN a duplicate email
WHEN the API is called
THEN it returns 200 (idempotent, no error to user)
```

**Labels:** `api`, `newsletter`, `priority:critical`

---

### M8-04: Create Newsletter Form Component

**Title:** Create Newsletter Signup Form Component

**Description:**
Build the newsletter form component with proper validation and state handling.

**Acceptance Criteria:**
- [ ] NewsletterForm component created
- [ ] Email input with validation
- [ ] Submit button with loading state
- [ ] Success state with confirmation message
- [ ] Error state with helpful message
- [ ] Accessible (labels, error announcements)
- [ ] No marketing hype in copy

**Test Cases:**
```
GIVEN an empty form
WHEN I click submit
THEN validation error shows for email

GIVEN a valid email
WHEN I submit the form
THEN loading state shows
AND success message appears on completion

GIVEN submission fails
WHEN error occurs
THEN error message displays
AND form can be resubmitted
```

**Labels:** `component`, `newsletter`, `forms`, `priority:critical`

---

### M8-05: Assemble Newsletter Page

**Title:** Assemble Complete Newsletter Page

**Description:**
Build the dedicated newsletter signup page with form and value proposition.

**Acceptance Criteria:**
- [ ] Page uses PageLayout
- [ ] One-sentence promise/value proposition
- [ ] Newsletter form prominent
- [ ] Clear confirmation states
- [ ] Tone: no hype, no frequency pressure
- [ ] Responsive

**Labels:** `page`, `newsletter`, `priority:high`

---

### M8-06: Integrate Newsletter Form on Home Page

**Title:** Connect Home Page Newsletter CTA to API

**Description:**
Wire up the newsletter form on the home page to actually submit to the API.

**Acceptance Criteria:**
- [ ] Home page form submits to newsletter API
- [ ] Success/error states work correctly
- [ ] Form resets appropriately after submission
- [ ] Same behavior as dedicated newsletter page

**Labels:** `integration`, `home`, `newsletter`, `priority:high`

---

### M8-07: Add Newsletter Page Metadata

**Title:** Configure Newsletter Page SEO Metadata

**Description:**
Add proper metadata for the newsletter page.

**Acceptance Criteria:**
- [ ] Page title: "Newsletter | Easy Plant Life"
- [ ] Meta description emphasizing value
- [ ] Open Graph tags

**Labels:** `seo`, `newsletter`, `priority:medium`

---

### M8-08: Write Newsletter System Tests

**Title:** Write Comprehensive Newsletter Tests

**Description:**
Write tests covering the entire newsletter flow.

**Test Cases:**
```
GIVEN the newsletter API
WHEN called with valid email
THEN contact is added to Resend

GIVEN the newsletter form
WHEN submitted successfully
THEN success message displays

GIVEN the home page newsletter form
WHEN submitted
THEN it functions identically to dedicated page
```

**Labels:** `testing`, `newsletter`, `priority:high`

---

## Milestone 9: Contact Page

### M9-01: Create Contact API Route

**Title:** Create Contact Form API Endpoint

**Description:**
Build the API route that handles contact form submissions and sends email via Resend.

**Acceptance Criteria:**
- [ ] API route at `/app/api/contact/route.ts`
- [ ] Accepts POST with name, email, message
- [ ] Validates all required fields
- [ ] Sends email to site owner via Resend
- [ ] Returns appropriate responses
- [ ] Basic spam protection (honeypot field)

**Test Cases:**
```
GIVEN a valid contact form submission
WHEN the API is called
THEN an email is sent to the site owner
AND 200 response returned

GIVEN missing required fields
WHEN the API is called
THEN 400 response with validation errors
```

**Labels:** `api`, `contact`, `priority:high`

---

### M9-02: Create Contact Form Component

**Title:** Create Contact Form Component

**Description:**
Build the contact form with proper validation and state management.

**Acceptance Criteria:**
- [ ] ContactForm component created
- [ ] Fields: name, email, message
- [ ] Honeypot field for spam prevention (hidden)
- [ ] Validation for all fields
- [ ] Loading, success, error states
- [ ] Accessible

**Test Cases:**
```
GIVEN an empty form
WHEN I submit
THEN validation errors show for all fields

GIVEN a valid form
WHEN I submit
THEN loading state shows
AND success message appears

GIVEN the honeypot field has value
WHEN form submits
THEN it silently "succeeds" without sending
```

**Labels:** `component`, `contact`, `forms`, `priority:high`

---

### M9-03: Assemble Contact Page

**Title:** Assemble Complete Contact Page

**Description:**
Build the contact page with form and minimal additional content.

**Acceptance Criteria:**
- [ ] Page uses PageLayout
- [ ] Contact form displayed
- [ ] Optional: direct email address displayed
- [ ] No social links required
- [ ] Minimal, focused design
- [ ] Responsive

**Labels:** `page`, `contact`, `priority:high`

---

### M9-04: Add Contact Page Metadata

**Title:** Configure Contact Page SEO Metadata

**Description:**
Add proper metadata for the contact page.

**Acceptance Criteria:**
- [ ] Page title: "Contact | Easy Plant Life"
- [ ] Meta description
- [ ] Open Graph tags

**Labels:** `seo`, `contact`, `priority:medium`

---

### M9-05: Write Contact Page Tests

**Title:** Write Tests for Contact Page

**Description:**
Write tests for contact form and page.

**Test Cases:**
```
GIVEN the contact page
WHEN it loads
THEN the contact form is displayed

GIVEN a valid contact submission
WHEN submitted
THEN success message displays

GIVEN spam submission (honeypot filled)
WHEN submitted
THEN no email is sent but user sees "success"
```

**Labels:** `testing`, `contact`, `priority:medium`

---

## Milestone 10: Analytics & SEO

### M10-01: Integrate Google Analytics

**Title:** Set Up Google Analytics 4 Integration

**Description:**
Integrate GA4 for basic traffic analytics. Keep it minimal—no invasive profiling.

**Acceptance Criteria:**
- [ ] GA4 measurement ID configured
- [ ] Analytics script loads on all pages
- [ ] Page views tracked automatically
- [ ] No personally identifiable information collected
- [ ] Analytics only loads in production

**Test Cases:**
```
GIVEN production environment
WHEN any page loads
THEN GA4 script is present

GIVEN development environment
WHEN any page loads
THEN GA4 script is NOT present
```

**Labels:** `analytics`, `setup`, `priority:high`

---

### M10-02: Implement Custom Event Tracking

**Title:** Add Custom Event Tracking

**Description:**
Add tracking for meaningful user interactions as specified in MasterDocument.

**Events to Track:**
- Newsletter form view
- Newsletter submission (success/failure)
- Contact form submission
- Outbound clicks (Medium articles, book purchases)

**Acceptance Criteria:**
- [ ] Event tracking utility created
- [ ] Newsletter form view event fires
- [ ] Newsletter submit event fires with outcome
- [ ] Contact submit event fires
- [ ] Outbound link clicks tracked
- [ ] Events include minimal necessary data

**Test Cases:**
```
GIVEN the newsletter form
WHEN it becomes visible
THEN a form_view event is sent to GA4

GIVEN a Medium link
WHEN clicked
THEN an outbound_click event is sent with destination
```

**Labels:** `analytics`, `tracking`, `priority:medium`

---

### M10-03: Configure Base Metadata

**Title:** Configure Site-Wide Default Metadata

**Description:**
Set up default metadata that applies to all pages unless overridden.

**Acceptance Criteria:**
- [ ] Default title template: "Page | Easy Plant Life"
- [ ] Default description set
- [ ] Default Open Graph image
- [ ] Twitter card type configured
- [ ] Favicon configured (mark logo)
- [ ] Apple touch icon configured

**Labels:** `seo`, `metadata`, `priority:high`

---

### M10-04: Create Sitemap

**Title:** Generate XML Sitemap

**Description:**
Create a sitemap.xml for search engine crawling.

**Acceptance Criteria:**
- [ ] Sitemap generated at `/sitemap.xml`
- [ ] Includes all public pages
- [ ] Uses Next.js built-in sitemap generation
- [ ] Proper lastmod dates if possible

**Labels:** `seo`, `priority:medium`

---

### M10-05: Create Robots.txt

**Title:** Create Robots.txt File

**Description:**
Create robots.txt with appropriate crawler directives.

**Acceptance Criteria:**
- [ ] robots.txt at `/robots.txt`
- [ ] Allows all crawlers
- [ ] Points to sitemap
- [ ] Blocks any admin/dev routes if they exist

**Labels:** `seo`, `priority:medium`

---

### M10-06: Implement Structured Data

**Title:** Add JSON-LD Structured Data

**Description:**
Add basic structured data for better search results.

**Acceptance Criteria:**
- [ ] Organization schema on home page
- [ ] WebSite schema with search action (if applicable)
- [ ] Book schema on books page (for each book)
- [ ] Article schema for blog posts (if rendered on-site)

**Labels:** `seo`, `structured-data`, `priority:low`

---

## Milestone 11: Polish & Launch

### M11-01: Accessibility Audit

**Title:** Conduct Accessibility Audit and Fixes

**Description:**
Audit the entire site for accessibility issues and fix any problems.

**Acceptance Criteria:**
- [ ] Run automated accessibility tests (axe, lighthouse)
- [ ] Fix all critical/serious issues
- [ ] Keyboard navigation works throughout
- [ ] Focus indicators visible
- [ ] Color contrast meets WCAG AA
- [ ] Images have alt text
- [ ] Forms are properly labeled

**Test Cases:**
```
GIVEN any page
WHEN running axe accessibility audit
THEN no critical or serious issues found

GIVEN the entire site
WHEN navigating with keyboard only
THEN all interactive elements are reachable
```

**Labels:** `accessibility`, `qa`, `priority:critical`

---

### M11-02: Performance Optimization

**Title:** Optimize Site Performance

**Description:**
Audit and optimize performance for fast loading and good Core Web Vitals.

**Acceptance Criteria:**
- [ ] Lighthouse performance score > 90
- [ ] Images optimized (next/image, WebP)
- [ ] Fonts optimized (subset, preload)
- [ ] No layout shift from font loading
- [ ] JavaScript bundle size minimized
- [ ] CSS purged of unused styles

**Test Cases:**
```
GIVEN any page
WHEN running Lighthouse
THEN performance score is > 90

GIVEN the home page
WHEN it loads
THEN Largest Contentful Paint < 2.5s
```

**Labels:** `performance`, `qa`, `priority:high`

---

### M11-03: Cross-Browser Testing

**Title:** Test Across Browsers and Devices

**Description:**
Verify the site works correctly across major browsers and devices.

**Acceptance Criteria:**
- [ ] Chrome (latest) tested
- [ ] Firefox (latest) tested
- [ ] Safari (latest) tested
- [ ] Mobile Safari (iOS) tested
- [ ] Chrome Mobile (Android) tested
- [ ] All critical functionality works
- [ ] Layout is correct on all

**Labels:** `testing`, `qa`, `priority:high`

---

### M11-04: Content Review

**Title:** Final Content and Copy Review

**Description:**
Review all site content for accuracy, tone, and brand alignment.

**Acceptance Criteria:**
- [ ] All placeholder text replaced
- [ ] Tone matches brand guidelines (calm, not preachy)
- [ ] No typos or grammatical errors
- [ ] Links all work
- [ ] Images all load
- [ ] Contact/newsletter forms tested with real emails

**Labels:** `content`, `qa`, `priority:critical`

---

### M11-05: Launch Checklist

**Title:** Complete Pre-Launch Checklist

**Description:**
Verify all launch requirements are met.

**Checklist:**
- [ ] Domain configured and DNS propagated
- [ ] SSL certificate active
- [ ] Environment variables set in production
- [ ] Analytics tracking verified
- [ ] Newsletter signup tested in production
- [ ] Contact form tested in production
- [ ] 404 page works
- [ ] Sitemap accessible
- [ ] Robots.txt accessible
- [ ] Social preview images work
- [ ] Legal pages if needed (privacy, terms)

**Labels:** `launch`, `qa`, `priority:critical`

---

## Task Dependencies

The following diagram shows critical path dependencies:

```
M1 (Foundation)
    └── M2 (Design System)
            ├── M3 (Layout & Navigation)
            │       ├── M4 (Home Page) ────────────────┐
            │       ├── M5 (About Page)                │
            │       ├── M6 (Books Page)                │
            │       └── M7 (Blog Integration)          │
            │                                          │
            └── M8 (Newsletter System) ◄───────────────┘
                    │
                    └── M9 (Contact Page)

M10 (Analytics & SEO) can proceed in parallel after M3

M11 (Polish & Launch) requires all other milestones complete
```

---

## Label Definitions

| Label | Description |
|-------|-------------|
| `priority:critical` | Must be done, blocks other work |
| `priority:high` | Important, should be done soon |
| `priority:medium` | Should be done, can wait |
| `priority:low` | Nice to have |
| `setup` | Project setup/configuration |
| `foundation` | Core infrastructure |
| `design-system` | Design system work |
| `component` | Reusable component |
| `page` | Page assembly |
| `api` | Backend API work |
| `testing` | Test writing |
| `seo` | Search engine optimization |
| `analytics` | Analytics implementation |
| `qa` | Quality assurance |
| `accessibility` | Accessibility work |
| `performance` | Performance optimization |

---

## Revision History

| Version | Date | Author | Notes |
|---------|------|--------|-------|
| 1.0 | 2026-01-30 | Claude (via Chad Le Grand methodology) | Initial specification |
