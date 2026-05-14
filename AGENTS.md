# filmes-novos

Brazilian Portuguese movie/series discovery site (Next.js 16, Pages Router).

## Quick start

```bash
npm install        # install deps
npm run dev        # http://localhost:3000
npm run build      # production build
npm run start      # serve production build
npm run lint       # next lint (no typecheck — TypeScript checked at build time)
npm run typecheck  # npx tsc --noEmit
```

## Environment

- **Required**: `NEXT_PUBLIC_TMDB_API_KEY` (TMDB API read token) in `.env` or `.env.local`
- `.env` is gitignored per `.gitignore`; use `.env.example` as template

## Architecture

| Path | Purpose |
|------|---------|
| `src/types/` | Shared TypeScript interfaces (e.g. `tmdb.ts`) |
| `src/pages/` | Next.js Pages Router — all SSR via `getServerSideProps` |
| `src/pages/index.tsx` | Home — carousel, featured movies |
| `src/pages/filme/[filme].tsx` | Movie detail page |
| `src/pages/serie/[serie].tsx` | TV series detail page |
| `src/pages/series/index.tsx` | Series listing |
| `src/pages/catalago/[nome].tsx` | Catalog by streaming platform (e.g. `/catalago/netflix`) |
| `src/pages/api/sitemap.xml.ts` | Dynamic sitemap (fetches 50 pages each of popular movies + series from TMDB) |
| `src/services/api.ts` | TMDB API client (Bearer token auth, single `get()` export) |
| `src/components/*/index.tsx` | Each component is a directory with `index.tsx` + optional `*.interfaces.ts` |
| `src/hooks/useScript.ts` | Custom hook for dynamic script injection |
| `src/styles/globals.css` | Tailwind v4 directives via `@import "tailwindcss"`, `@theme`, custom scrollbar, spinner |

## Conventions

- **All code is TypeScript** — `.tsx` for components/pages, `.ts` for API routes/hooks/services
- **Component interfaces go in separate files**: `ComponentName.interfaces.ts` alongside `index.tsx`
- **Shared types go in `src/types/*.ts`**
- **Imports**: `@/` maps to project root, so `import { Header } from '@/src/components/Header'`
- **All data fetching**: TMDB API via `src/services/api.ts` with Bearer token auth
- **Slugs**: movie/series titles are lowercased, spaces replaced with `-`, URL-encoded
- **Language**: `pt-BR` for all TMDB queries, site content in Brazilian Portuguese
- **Tailwind v4**: no `tailwind.config.js`; custom theme values via CSS `@theme` block
- **Slick-carousel CSS**: imported in `_app.js` (the `~` prefix doesn't work with Turbopack)

## Tailwind v4

- Config via CSS (`@theme`), not JS
- Custom colors: `gold-500/600/700`, `cinema-900/800/700/600`, `accent-red`, `accent-blue` in `src/styles/globals.css`
- PostCSS plugin: `@tailwindcss/postcss` (not `tailwindcss`)
- Build uses Turbopack

## Design system

- **Theme**: Dark cinematic (`bg-cinema-900`, gold accents)
- **Fonts**: `Bebas Neue` (headings) + `DM Sans` (body), loaded via `<link>` in `_document.js`
- **Components**: glassmorphism (`.glass` class), gradient borders (`.card-gradient-border`), gold buttons (`.btn-gold`), all in `globals.css`
- **Animations**: `animate-fade-in-up` with delay variants for staggered reveals
- **Header**: Fixed glass nav at top (`mt-16` on content below)
- **Images**: Use `<img>` not `next/image` for TMDB images (avoids domain config issues with dynamic URLs)

## Integrations (prod only)

- Disqus comments — on movie/series detail pages via `DisqusComments` component

## Language

All agents must respond in **Brazilian Portuguese (pt-BR)**. Never use English unless the user explicitly asks.

## Agents

Specialized subagents are defined in `.opencode/agents/`:

| Agent | When to use |
|-------|-------------|
| `frontend` | UI components, styling, Tailwind, design system, layout, responsiveness, animations |

Before starting a frontend task, delegate to the `frontend` subagent via `task` with `subagent_type: "frontend"`.

## Scripts

Only listed in `package.json`. No test runner configured.
