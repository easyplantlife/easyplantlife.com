# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Easy Plant Life is a calm, brand-first landing website (not a web app). Primary purpose:

- Communicate brand philosophy clearly
- Distribute written content (self-hosted blog, books)
- Capture newsletter signups via Resend

This is an author/lifestyle brand site, not a startup product.

## Tech Stack (Planned)

- **Framework**: Next.js with App Router
- **Styling**: Tailwind CSS
- **Email**: Resend (newsletter + contact form)
- **Blog**: Self-hosted Markdown posts in `src/content/posts` (see `docs/blog.md`)
- **Analytics**: Google Analytics 4 (event-based, minimal)
- **Testing**: Jest + React Testing Library

## Development Commands

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run lint         # Run ESLint
npm test             # Run test suite
npm test -- --watch  # Run tests in watch mode
npm test -- path/to/test.ts  # Run single test file
```

## Project Structure

```
src/app                 # Next.js App Router pages and API routes
src/components          # Reusable UI components
src/components/ui       # Primitives (Button, ButtonLink, ArrowLink, Input, Textarea,
                        #   Eyebrow, Heading, Text, Container, Panel, StatusNote, ...)
src/components/theme    # ThemeProvider, ThemeToggle, ThemeScript (light / dark)
src/components/home     # Home sections (Hero, IdeaSection, RecentWriting, BooksPreview)
src/components/blog     # BlogPostRow, BlogPostsList, PostArticle, PreferEmail
src/components/books    # BookItem, BooksList
src/components/forms    # NewsletterForm, ContactForm
src/lib                 # Utilities (theme.ts, utils.ts)
src/lib/api             # Service layers (email, form clients)
src/lib/blog            # Markdown post loader (posts.ts) and renderer (markdown.ts)
src/content             # Static content (books, navigation, site config)
src/content/posts       # Blog posts as Markdown with front matter
public                  # Static assets
```

## Design Tokens & Theming

- All colors are semantic CSS variables defined in `src/app/globals.css` and
  mapped to Tailwind utilities via `@theme inline`: `bg-ground`, `bg-surface`,
  `bg-tint`, `bg-field`, `border-line`, `border-tint-line`, `text-ink`,
  `text-ink-soft`, `text-muted`, `text-faint`, `text-accent`, `text-on-accent`,
  `text-error`. Never use raw hex values or default Tailwind palette colors in
  components.
- Light and dark themes switch on `data-theme` on `<html>`. The attribute is
  set before paint by the inline script from `src/lib/theme.ts`, persisted in
  localStorage, and toggled with `ThemeToggle`. Use the `dark:` variant only
  for the rare case a token swap is not enough.
- Typography: `font-serif` (Lora) for headings, `font-sans` (Source Sans 3)
  for everything else. Use the `Heading`, `Text` and `Eyebrow` primitives
  rather than ad-hoc classes.
- Layout is intrinsic: wrapping flex rows and
  `grid-cols-[repeat(auto-fit,minmax(min(100%,<min>),1fr))]` grids instead of
  breakpoint-specific layouts. The header has no hamburger menu; its nav wraps.
- `tailwind.config.ts` is not loaded by Tailwind v4 (there is no `@config`);
  it remains as a documented reference of the legacy palette and scale.

## Key Documents

- `MasterDocument.md` - Brand guidelines, visual identity, page requirements
- `SPECS.md` - TDD-ready task specifications with acceptance criteria (71 tasks across 11 milestones)

## Automation

```bash
# Claude Code slash commands
/build                    # Pick next issue, implement with TDD, create PR
/merge                    # Review and merge current branch's PR

# Continuous development loop
./scripts/dev-loop.sh              # Run build → merge in continuous loop
./scripts/dev-loop.sh --build      # Run only build phase
./scripts/dev-loop.sh --merge      # Run only merge phase
./scripts/dev-loop.sh --once       # Single cycle then exit
```

## Development Approach

- **TDD-first**: Write tests before implementation
- **Static-first**: Prefer static rendering where possible
- **Accessibility by default**: All components must be keyboard navigable with proper ARIA

## Brand Guidelines (Critical)

- **Tone**: Calm, honest, non-authoritative. Never preachy or activist
- **Visual**: Quiet editorial. Warm off-white ground, one deep green accent,
  hairlines instead of cards, generous white space. Dark theme keeps the same
  structure on a green-black ground
- **Content**: No hype words, no marketing language, no frequency pressure
- **Complexity**: If it doesn't increase clarity, it doesn't belong in MVP
