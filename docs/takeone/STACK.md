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
| Prisma | ORM + migrations |
| @prisma/client | SDK do banco |
| NextAuth.js | Autenticação (Google + Credentials) |
| @auth/prisma-adapter | Adaptador Prisma pro NextAuth |
| Vercel Postgres (Neon) | PostgreSQL serverless |
| bcryptjs | Hash de senhas (Credentials provider) |

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
    └── Backend (Next.js API routes)
          ├── NextAuth.js (auth — Google + Credentials)
          ├── Prisma (ORM → PostgreSQL no Vercel Postgres)
          └── API routes (CRUD de schedule, watchlist, etc.)
```

## Estrutura de pastas (adições do TakeOne)

```
src/
├── services/
│   ├── api.ts              ← já existe (TMDB)
│   ├── prisma.ts           ← NOVO: singleton Prisma Client
│   └── auth.ts             ← NOVO: config NextAuth
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
│   │   ├── auth/
│   │   │   └── [...nextauth].ts ← NOVO (Fase 1: NextAuth handler)
│   │   ├── schedule/        ← NOVO (Fase 1)
│   │   ├── streamer/        ← NOVO (Fase 1)
│   │   ├── tmdb/
│   │   │   └── search.ts   ← NOVO (Fase 1: proxy TMDB)
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
DATABASE_URL=postgresql://...         # Vercel Postgres (Neon)
NEXTAUTH_SECRET=...                   # openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000    # ou produção
```

## Serviço Prisma (src/services/prisma.ts)

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

## Serviço Auth (src/services/auth.ts)

```typescript
import type { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user || !user.password) return null

        const isValid = await bcrypt.compare(credentials.password, user.password)
        if (!isValid) return null

        return { id: user.id, email: user.email, name: user.displayName }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: '/streamer/dashboard',
  },
  session: { strategy: 'jwt' },
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!
      }
      return session
    },
  },
}
```

## Rota NextAuth (src/pages/api/auth/[...nextauth].ts)

```typescript
import NextAuth from 'next-auth'
import { authOptions } from '@/src/services/auth'

export default NextAuth(authOptions)
```

## Instalação de dependências

```bash
npm install prisma @prisma/client next-auth @auth/prisma-adapter bcryptjs
npm install -D @types/bcryptjs
npx prisma init
npx prisma db push
```
