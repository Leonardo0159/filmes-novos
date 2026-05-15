# TakeOne — Stack Tecnológica

## Stack Atual (já implementada)

| Tecnologia | Versão | Função |
|------------|--------|--------|
| Next.js | ^16.2.6 | Framework (Pages Router) |
| React | ^19.2.6 | UI |
| TypeScript | ^6.0.3 | Tipagem |
| Tailwind CSS v4 | ^4.3.0 | Estilização |
| TMDB API | — | Dados de filmes/séries |

## Stack Nova (a adicionar)

| Tecnologia | Função |
|------------|--------|
| Supabase | PostgreSQL + Auth + Realtime |
| @supabase/supabase-js | SDK cliente |
| @supabase/ssr | Auth para Next.js Pages Router |

## Arquitetura

```
Frontend (Next.js Pages Router)
    │
    ├── TMDB API (dados públicos)
    │     └── src/services/api.ts (já existe)
    │
    └── Supabase (dados de usuário)
          ├── Auth (login, registro, sessão)
          ├── PostgreSQL (watchlist, reviews, reações, cronograma)
          └── Realtime (lives ativas, notificações)
```

## Estrutura de pastas (novas adições)

```
src/
├── services/
│   ├── api.ts              ← já existe (TMDB)
│   └── supabase.ts          ← NOVO: cliente Supabase
├── contexts/
│   └── AuthContext.tsx      ← NOVO: estado de autenticação global
├── components/
│   ├── AuthModal/           ← NOVO: modal de login/cadastro
│   ├── WatchlistButton/     ← NOVO: toggle assistir/assistido
│   ├── StarRating/          ← NOVO: input de avaliação
│   ├── ReviewCard/          ← NOVO: card de review
│   ├── ReactionCard/        ← NOVO (Fase 2)
│   └── ScheduleGrid/        ← NOVO (Fase 3)
├── pages/
│   ├── api/
│   │   ├── auth/            ← NOVO: handlers Supabase Auth
│   │   ├── watchlist.ts     ← NOVO
│   │   ├── reviews.ts       ← NOVO
│   │   ├── reactions.ts     ← NOVO (Fase 2)
│   │   └── schedule.ts      ← NOVO (Fase 3)
│   ├── cronograma/
│   │   └── [streamer].tsx   ← NOVO (Fase 3)
│   ├── streamer/
│   │   ├── [username].tsx   ← NOVO
│   │   └── dashboard.tsx    ← NOVO
│   └── embed/
│       └── cronograma/
│           └── [streamer].tsx ← NOVO (Fase 3)
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
