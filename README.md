# Easy Plant Life

A calm, brand-first landing website for Easy Plant Life.

## Project Structure

```
easyplantlife.com/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # Reusable UI components
│   │   └── ui/           # Primitive UI components (Button, Input, etc.)
│   ├── lib/              # Utility functions and helpers
│   │   └── api/          # API-related utilities (email, medium)
│   ├── styles/           # Global styles
│   ├── content/          # Static content (books data, etc.)
│   ├── types/            # TypeScript type definitions
│   └── __tests__/        # Test files
├── public/               # Static assets
└── scripts/              # Development and automation scripts
```

### Directory Purposes

- **`src/app`**: Next.js App Router pages and layouts
- **`src/components`**: Reusable React components shared across pages
- **`src/components/ui`**: Low-level UI primitives (buttons, inputs, cards)
- **`src/lib`**: Shared utility functions and helpers
- **`src/lib/api`**: API service layers for external integrations
- **`src/styles`**: Additional global styles beyond Tailwind
- **`src/content`**: Static content data (books, metadata)
- **`public`**: Static assets served directly (images, fonts)

## Development

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run lint         # Run ESLint
npm test             # Run test suite
```

## Tech Stack

- Next.js with App Router
- Tailwind CSS
- TypeScript
- Jest + React Testing Library
