# TakeOne — Stack Tecnológica

## Stack Atual (já implementada — filmes-novos)

| Tecnologia | Versão | Função |
|------------|--------|--------|
| Next.js | ^16.2.6 | Framework (Pages Router) |
| React | ^19.2.6 | UI |
| TypeScript | ^6.0.3 | Tipagem |
| Tailwind CSS v4 | ^4.3.0 | Estilização |
| TMDB API | — | Dados de filmes/séries |

## Stack Nova (a adicionar — TakeOne)

| Tecnologia | Função |
|------------|--------|
| Supabase | PostgreSQL + Auth + Realtime |
| @supabase/supabase-js | SDK cliente |
| @supabase/ssr | Auth para Next.js Pages Router |

## Arquitetura

```
Frontend (Next.js Pages Router)
    │
    ├── TMDB API (dados públicos de filmes/séries)
    │     └── src/services/api.ts (já existe)
    │
    ├── Site Público (filmes-novos existente — intacto)
    │     ├── Páginas de detalhe (filme, série)
    │     ├── Home (carrossel, destaques)
    │     └── Catálogo por streaming
    │
    ├── TakeOne
    │     ├── Dashboard do streamer (autenticado — Fase 1)
    │     ├── Página pública /cronograma/[streamer] (Fase 1)
    │     ├── Widget embedável (Fase 1)
    │     ├── Watchlist + Histórico (Fase 2)
    │     └── Hub de Reações (Fase 3)
    │
    └── Supabase
          ├── Auth (streamers → Fase 1, público → Fase 2)
          ├── PostgreSQL (schedule, watchlist, follows, reactions)
          └── Realtime (lives ativas, notificações)
```

## Estrutura de pastas (adições do TakeOne)

```
src/
├── services/
│   ├── api.ts              ← já existe (TMDB)
│   └── supabase.ts          ← NOVO: cliente Supabase
├── contexts/
│   └── AuthContext.tsx      ← NOVO (Fase 1: streamers, Fase 2: público)
├── components/
│   ├── ScheduleGrid/        ← NOVO (Fase 1)
│   ├── ScheduleEntryForm/   ← NOVO (Fase 1)
│   ├── TMDBSearch/          ← NOVO (Fase 1: autocomplete)
│   ├── StreamerDashboard/   ← NOVO (Fase 1)
│   ├── StreamerProfileHeader/ ← NOVO (Fase 1)
│   ├── EmbedWrapper/        ← NOVO (Fase 1)
│   ├── FollowButton/        ← NOVO (Fase 2)
│   ├── WatchlistButton/     ← NOVO (Fase 2)
│   ├── HistorySection/      ← NOVO (Fase 2)
│   ├── NotificationBell/    ← NOVO (Fase 2)
│   ├── StreamerFeed/        ← NOVO (Fase 2)
│   ├── ReactionCard/        ← NOVO (Fase 3)
│   ├── ReactionSubmitForm/  ← NOVO (Fase 3)
│   ├── LiveNowBanner/       ← NOVO (Fase 3)
│   └── Tabs/                ← NOVO (Fase 3)
├── pages/
│   ├── api/
│   │   ├── auth/            ← NOVO (Fase 1: handlers Supabase Auth)
│   │   ├── schedule/        ← NOVO (Fase 1)
│   │   ├── streamer/        ← NOVO (Fase 1)
│   │   ├── follows/         ← NOVO (Fase 2)
│   │   ├── watchlist/       ← NOVO (Fase 2)
│   │   ├── history/         ← NOVO (Fase 2)
│   │   ├── notifications/   ← NOVO (Fase 2)
│   │   ├── reactions/       ← NOVO (Fase 3)
│   │   └── feed/            ← NOVO (Fase 3)
│   ├── cronograma/
│   │   └── [streamer].tsx   ← NOVO (Fase 1)
│   ├── streamer/
│   │   └── dashboard.tsx    ← NOVO (Fase 1)
│   ├── feed.tsx             ← NOVO (Fase 2)
│   ├── perfil.tsx           ← NOVO (Fase 2)
│   └── embed/
│       └── cronograma/
│           └── [streamer].tsx ← NOVO (Fase 1)
```

## Variáveis de ambiente (novas)

```env
# Já existe
NEXT_PUBLIC_TMDB_API_KEY=...

# Novas
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## Serviço Supabase (src/services/supabase.ts)

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

Para SSR, usar `@supabase/ssr` com `createPagesServerClient` nos `getServerSideProps`.

## Instalação de dependências

```bash
npm install @supabase/supabase-js @supabase/ssr
```
