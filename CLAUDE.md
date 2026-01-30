# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Easy Plant Life is a calm, brand-first landing website (not a web app). Primary purpose:

- Communicate brand philosophy clearly
- Distribute written content (blog via Medium, books)
- Capture newsletter signups via Resend

This is an author/lifestyle brand site, not a startup product.

## Tech Stack (Planned)

- **Framework**: Next.js with App Router
- **Styling**: Tailwind CSS
- **Email**: Resend (newsletter + contact form)
- **Blog**: Medium integration (external, site displays excerpts only)
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

## Project Structure (Planned)

```
/app                 # Next.js App Router pages
/components          # Reusable UI components
/components/ui       # Primitive UI components (Button, Input, etc.)
/lib                 # Utility functions
/lib/api             # API service layers (email, medium)
/content             # Static content (books data)
/public              # Static assets
```

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
- **Visual**: Minimal UI, strong white space, soft greens, warm neutrals
- **Content**: No hype words, no marketing language, no frequency pressure
- **Complexity**: If it doesn't increase clarity, it doesn't belong in MVP
