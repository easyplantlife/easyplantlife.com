# Easy Plant Life — Website Master Document

## 1. Project Overview

**Easy Plant Life** (also referred to as **Easy Vegan Life** in brand language) is a calm, brand-first website.

This is **not a web app** and **not a product dashboard**. It is a **landing-style website** whose primary purpose is to:

- Clearly communicate the brand philosophy
- Establish trust and credibility
- Distribute written content (blog + books)
- Capture interest via a newsletter

The site should feel more like an **author / lifestyle brand** than a startup.

MVP and beta scope are intentionally minimal.

---

## 2. Goals (MVP / Beta)

### Primary Goals

- Communicate what “Easy Plant Life” stands for in under 30 seconds
- Feel calm, credible, and intentional
- Provide a clear place to read long-form thoughts (blog)
- Provide a clear place to discover books
- Capture newsletter signups

### Explicit Non-Goals

- No complex user accounts
- No dashboards
- No recipe database
- No personalization
- No growth-hack funnels

---

## 3. Target Audience

- People interested in vegan living but overwhelmed by complexity
- Long-term vegans tired of perfectionism and performative wellness
- Busy people who want clarity, not content overload
- Readers who appreciate thoughtful, simple writing

The tone should **never** feel preachy, activist, or influencer-driven.

---

## 4. Brand Positioning

**One-line positioning:**

> Easy Plant Life is about living vegan without turning it into a project.

### Brand Values

- Simplicity over optimization
- Sustainability over perfection
- Calm over urgency
- Practical over ideological

### Brand Personality

- Grounded
- Minimal
- Thoughtful
- Quiet confidence

---

## 5. Visual Identity

### Overall Aesthetic

- Editorial, lifestyle, calm
- Minimal UI
- Strong use of white space

### Color Palette

- Soft greens (primary accent)
- Off-whites / warm neutrals
- No loud contrast
- No gradients unless extremely subtle

### Typography

- Highly readable
- Human, organic feel
- No sharp "tech" fonts
- Prefer serif or soft sans-serif combinations

### Logo Usage

- **Lockup logo**: homepage hero, footer
- **Mark logo (green heart + leaf)**: favicon, mobile header, social previews

The logo should feel natural and timeless, not trendy.

---

## 6. Information Architecture (Pages)

### 6.1 Home (`/`)

**Purpose:** First impression + brand clarity

**Content:**

- Logo
- Short tagline (2–4 words)
- Brief brand explanation (2–3 sentences max)
- Primary CTA: Newsletter signup
- Secondary CTA: Blog or Books

**Notes:**

- Single-scroll or near single-scroll
- No feature lists
- No cards, no grids unless justified

---

### 6.2 About (`/about`)

**Purpose:** Explain the philosophy

**Content:**

- Why Easy Plant Life exists
- What it is _not_
- Emphasis on realism and sustainability

**Tone:**

- Personal but not biographical
- Calm, honest, non-authoritative

---

### 6.3 Books (`/books`)

**Purpose:** Showcase long-form work

**Content:**

- Book covers
- Short descriptions
- Status: available / coming soon
- External purchase links

**Notes:**

- Static content for MVP
- Signals credibility and seriousness

---

### 6.4 Blog (`/blog`)

**Purpose:** Content hub

**Source of truth:** Medium

**On-site behavior:**

- Display a list of recent posts
- Each item shows:
  - Title
  - Short excerpt
  - Link to read on Medium

**Important:**

- The website does not host the full articles
- Medium remains canonical

Integration approach can evolve, but MVP prioritizes reliability over sophistication.

---

### 6.5 Newsletter (`/newsletter`)

**Purpose:** Capture long-term interest

**Content:**

- One-sentence promise
- Email input
- Clear confirmation states

**Tone:**

- No hype
- No frequency pressure
- No marketing language

---

### 6.6 Contact (`/contact`)

**Purpose:** Direct communication

**Content:**

- Minimal form or email address
- No social links required

---

## 7. Tech Stack

### Frontend

- **Next.js** (App Router)
- **Tailwind CSS**
- Static-first approach

### Backend

- **Next.js API Routes**
- No database in MVP

### Email

- **Resend**
  - Contact form delivery
  - Newsletter audience management

### Blog Platform

- **Medium** (external)
- Website displays excerpts/snippets only

### Analytics

- **Google Analytics (GA4)**
- Event-based tracking (no invasive user profiling)

---

## 8. Third-Party Integrations

### Required (MVP)

- Resend (email + newsletter)
- Google Analytics (traffic + events)

### Optional / Later

- Cookie consent (EU compliance)
- Lightweight analytics alternative (Plausible / Umami)

---

## 9. Analytics & Event Tracking (High Level)

Track only meaningful interactions:

- Page views
- Newsletter form views
- Newsletter submissions (success/failure)
- Contact submissions
- Outbound clicks (Medium, book purchases)

No session replay.
No behavioral profiling.

---

## 10. Development Approach

- **TDD-first**
- Clear separation between content and layout
- Minimal state management
- Accessibility respected by default

The site should be easy to maintain, easy to evolve, and hard to break.

---

## 11. Success Criteria (MVP)

- Brand message is understood immediately
- Site feels calm and intentional
- Newsletter signup works reliably
- Blog and book links are clear
- No unnecessary complexity

---

## 12. Guiding Principle

If a feature adds complexity without increasing clarity, it does not belong in MVP.

This website should feel like a **quiet place on the internet**, not a product demo.
