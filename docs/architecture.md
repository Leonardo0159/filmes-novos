# FilmES Novos — Documentação do Projeto

## Stack

| Tecnologia | Versão | Uso |
|---|---|---|
| Next.js | 16.2.6 | Framework (Pages Router) |
| React | 19.2.6 | UI |
| TypeScript | 6.0.3 | Tipagem |
| Tailwind CSS | 4.3.0 | Estilização (`@tailwindcss/postcss`) |
| PostCSS | 8.5.14 | Processamento CSS |
| Turbopack | — | Bundler dev |

### Dependências

- `react-slick` + `slick-carousel` — carrosséis
- `react-icons` — ícones
- `react-ga4` — Google Analytics 4 (ID: `G-WBBLV0VBLB`)
- `disqus-react` — comentários (shortname: `https-www-filmesnovos-com-br`)

---

## Estrutura de Diretórios

```
src/
├── components/      # Cada componente em pasta própria: Nome/index.tsx + Nome.interfaces.ts
│   ├── CarouselBanner/          # Carrossel de filmes em cartaz (now_playing)
│   ├── SeriesCarouselBanner/    # Carrossel de séries no ar (on_the_air)
│   ├── StreamingCarousel/       # Carrossel misto por plataforma
│   ├── FeaturedMovies/          # Grid paginado de filmes populares
│   ├── FeaturedSeries/          # Grid paginado de séries populares
│   ├── FeaturedStreaming/       # Grid paginado por plataforma com toggle F/S
│   ├── Header/                  # Nav fixa com busca, dropdown catálogo, menu mobile
│   ├── Footer/                  # Grid 3 colunas: logo, links, contato
│   ├── Pagination/              # Navegação com elipses e scroll suave
│   └── DisqusComments/          # Embed de comentários Disqus
├── pages/
│   ├── index.tsx                # Home: header + CarouselBanner + FeaturedMovies + footer
│   ├── filme/[filme].tsx        # Detalhe do filme (SSR)
│   ├── serie/[serie].tsx        # Detalhe da série (SSR)
│   ├── series/index.tsx         # Listagem de séries
│   ├── catalago/[nome].tsx      # Catálogo por plataforma (SSR parcial)
│   └── api/sitemap.xml.ts       # Sitemap dinâmico
├── services/
│   └── api.ts                   # Cliente TMDB (Bearer token, get())
├── hooks/
│   └── useScript.ts             # Hook para script injection (não utilizado atualmente)
├── styles/
│   └── globals.css              # Tailwind v4 (@theme), glass, btn-gold, animações
└── types/
    └── tmdb.ts                  # Interfaces: TMDBMovie, TMDBSeries, TMDBGenre, etc.
```

---

## API TMDB

**Autenticação:** Bearer token via `NEXT_PUBLIC_TMDB_API_KEY`

**Cliente** (`src/services/api.ts`):
```typescript
get(url: string): Promise<unknown>  // retorna null em erro
```

### Endpoints usados

| Endpoint | Onde |
|---|---|
| `GET /3/search/movie?language=pt-BR&query={texto}` | Detalhe filme (SSR), busca no Header |
| `GET /3/search/tv?language=pt-BR&query={texto}` | Detalhe série (SSR), busca no Header |
| `GET /3/movie/popular?language=pt-BR&page={n}` | FeaturedMovies, Sitemap |
| `GET /3/tv/popular?language=pt-BR&page={n}` | FeaturedSeries, Sitemap |
| `GET /3/movie/now_playing?language=pt-BR&page=1` | CarouselBanner, checagem inTheaters |
| `GET /3/tv/on_the_air?language=pt-BR&page=1` | SeriesCarouselBanner |
| `GET /3/movie/{id}/videos?language=pt-BR` | Trailer filme |
| `GET /3/tv/{id}/videos?language=pt-BR` | Trailer série |
| `GET /3/movie/{id}/watch/providers` | Onde assistir (filme) |
| `GET /3/tv/{id}/watch/providers` | Onde assistir (série) |
| `GET /3/movie/{id}/credits?language=pt-BR` | Elenco filme |
| `GET /3/tv/{id}/credits?language=pt-BR` | Elenco série |
| `GET /3/discover/movie?with_watch_providers={id}&watch_region=BR&page={n}` | StreamingCarousel, FeaturedStreaming |
| `GET /3/discover/tv?with_watch_providers={id}&watch_region=BR&page={n}` | StreamingCarousel, FeaturedStreaming |

### Imagens

Base URL: `https://image.tmdb.org/t/p/{tamanho}`

Tamanhos usados: `original`, `w500`, `w92`

> Usa-se `<img>` e não `next/image` para evitar configurar domínios dinâmicos.

---

## Padrões de Fetch

### SSR (páginas de detalhe)

`getServerSideProps` faz chamadas paralelas via `Promise.all`:

1. Search por slug → obtém ID
2. `Promise.all([videos, watch/providers, credits, (now_playing só filme)])`
3. Retorna props: `{ movie/serie, trailerKey, watchProviders, cast, inTheaters }`

### Client-side (listagens)

`useEffect` → `get(endpoint)` → `setState(items)` → renderiza com skeletons enquanto loading.

Paginação com shallow routing: `router.push({ query: { pagina: n } }, undefined, { shallow: true })`.

---

## Design System

### Cores (`@theme` no CSS)

| Token | Valor | Uso |
|---|---|---|
| `gold-500` | `#FFD700` | Destaque principal |
| `gold-600` | `#E6C200` | Hover |
| `gold-700` | `#CCA800` | — |
| `cinema-900` | `#0a0a0f` | Background principal |
| `cinema-800` | `#12121a` | Background secundário |
| `cinema-700` | `#1a1a26` | Cards |
| `cinema-600` | `#24243a` | Hover/skeleton |
| `accent-red` | `#E50914` | Alerta |
| `accent-blue` | `#0066FF` | — |

### Fontes

- **Headings:** `Bebas Neue` (letter-spacing 0.03em)
- **Body:** `DM Sans` (300–700)
- Carregadas via Google Fonts em `_document.tsx`

### Classes utilitárias (globals.css)

- `.glass` — glassmorphism (blur 16px, borda gold 8% opacidade)
- `.glass-light` — glassmorphism mais claro
- `.card-gradient-border` — borda gradiente via `::before` com `mask-composite: exclude`
- `.btn-gold` — botão dourado com hover glow
- `.skeleton-pulse` — shimmer animado
- `.animate-fade-in-up` — fadeInUp 0.6s (com delays .delay-1 a .delay-4)
- `.spinner` — loading spinner 48px

---

## Rotas

| Rota | Tipo | Descrição |
|---|---|---|
| `/` | Estática | Home com carrossel + grid filmes populares |
| `/filme/{slug}` | SSR | Detalhe do filme |
| `/serie/{slug}` | SSR | Detalhe da série |
| `/series` | Estática | Listagem de séries |
| `/catalago/{nome}` | SSR parcial | Catálogo por plataforma |
| `/sitemap.xml` | API Route | Sitemap dinâmico (rewrite) |

---

## Observações

- **Slugs:** título lowercased, espaços → `-`, URL-encoded
- **Idioma:** pt-BR em toda UI e queries TMDB
- **Convenção:** interfaces em arquivo separado `ComponentName.interfaces.ts`
- **Path alias:** `@/` → raiz do projeto
- **Strict mode TS:** desligado (`strict: false`)
- **Tipagem:** via `as` (type assertion), não generics
- **useScript.ts:** existe mas não é usado em nenhum componente
- **Sem testes:** nenhum test runner configurado
