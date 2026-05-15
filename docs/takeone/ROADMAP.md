# TakeOne — Roadmap

## Fase 1 — Cronograma de Streamers (MVP)

Objetivo: ferramenta que elimina a necessidade de site próprio pra streamers de reação.

**Nesta fase, apenas streamers têm conta. O público acessa tudo sem autenticação.**

### Features
- [ ] Prisma: schema + migrations + seed
- [ ] Autenticação (email + Google via NextAuth.js) — apenas para streamers
- [ ] Dashboard do streamer (`/streamer/dashboard`)
- [ ] Pesquisa de filmes/séries via TMDB autocomplete
- [ ] Agendamento por dia da semana + horário
- [ ] Suporte a recorrência (ex: "toda quinta, S3 de Avatar")
- [ ] Labels customizáveis (Live, Filme, Reacts, Sessão Dupla, etc.)
- [ ] Página pública `/cronograma/[streamer]` com grade semanal
- [ ] Widget embedável (`/embed/cronograma/[streamer]`) — iframe sem header/footer
- [ ] Perfil do streamer com links (Twitch, YouTube, Kick)
- [ ] Aviso de conteúdo sensível: flag sim/não para nudez no agendamento (preenchido pelo streamer)

### Novos componentes
- `ScheduleGrid` — grade semanal visual
- `ScheduleEntryForm` — formulário de agendamento (com TMDB autocomplete)
- `TMDBSearch` — autocomplete de busca TMDB (reutilizável)
- `StreamerDashboard` — layout do dashboard privado
- `StreamerProfileHeader` — header do perfil público do streamer
- `EmbedWrapper` — layout limpo pra iframe (sem header/footer)

### Novas páginas
- `/cronograma/[streamer]` — grade semanal pública
- `/streamer/dashboard` — dashboard privado de gerenciamento
- `/embed/cronograma/[streamer]` — iframe embedável

### Novas API routes
- `/api/auth/[...nextauth]` — NextAuth.js (Google + Credentials)
- `/api/schedule` — CRUD schedule entries
- `/api/streamer/profile` — gerenciar perfil de streamer
- `/api/tmdb/search` — proxy de busca TMDB (protegido, do lado do servidor)

### Site existente (filmes-novos)
- Nenhuma alteração necessária. As páginas de detalhe (filme/série) já servem como conteúdo de contexto quando o usuário clica em um filme do cronograma.

---

## Fase 2 — Utilitários do Espectador

Objetivo: dar motivos pro espectador criar conta — ferramentas pessoais que orbitam o cronograma.

### Features
- [ ] Autenticação aberta para o público geral (email + Google)
- [ ] Seguir/deixar de seguir streamers
- [ ] Watchlist pessoal: salvar filmes/séries do cronograma (ou avulsos)
- [ ] Histórico: marcar reações do cronograma como assistidas
- [ ] Notificações push/email quando streamer seguido agenda nova sessão
- [ ] Feed "Meus streamers estão vendo..." na Home (se logado)

### Novos componentes
- `FollowButton` — seguir/deixar de seguir streamer
- `WatchlistButton` — salvar/remover filme da watchlist
- `HistorySection` — listagem do histórico do usuário
- `NotificationBell` — dropdown de notificações
- `StreamerFeed` — feed de atividades dos streamers seguidos

### Novas páginas
- `/feed` — feed personalizado com atividades dos seguidos
- `/perfil` — perfil do usuário (watchlist, histórico, streamers seguidos)

### Novas API routes
- `/api/follows` — CRUD follows
- `/api/watchlist` — CRUD watchlist (apenas salvar/remover, sem rating)
- `/api/history` — marcar entrada do cronograma como assistida
- `/api/notifications` — preferências + listagem de notificações

---

## Fase 3 — Hub de Reações

Objetivo: centralizar reações de streamers a filmes/séries.

### Features
- [ ] Envio de links de reação (YouTube, Twitch, Kick, TikTok)
- [ ] Votos da comunidade (útil/não útil)
- [ ] Moderação básica (status: pending → approved/rejected)
- [ ] Aba "Reações" nas páginas de detalhe (ao lado da sinopse)
- [ ] Seção "Ao Vivo Agora" na Home
- [ ] Verificação de streamer (badge)

### Novos componentes
- `ReactionCard` — card de reação com embed/links
- `ReactionSubmitForm` — formulário pra enviar link
- `LiveNowBanner` — seção de lives ativas na home
- `Tabs` — navegação entre abas (Sinopse / Reações)

### Novas API routes
- `/api/reactions` — CRUD reações (GET/POST)
- `/api/reactions/[id]/vote` — votar (POST)
- `/api/feed/live` — buscar lives ativas (GET)

---

## Fase Social (descartada)

Reviews, avaliações com estrelas, perfil social, activity feed de amigos, desafios comunitários — tudo isso foi descartado. O TakeOne não é uma rede social. É uma ferramenta.

Se no futuro fizer sentido repensar, será com base em dados reais de uso, não por suposição.

---

## Schema Final (Prisma)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================
// Fase 1 — Cronograma de Streamers
// ============================================

model User {
  id            String   @id @default(uuid())
  email         String   @unique
  username      String   @unique
  displayName   String?  @map("display_name")
  avatarUrl     String?  @map("avatar_url")
  createdAt     DateTime @default(now()) @map("created_at")

  streamerProfile StreamerProfile?
  follows         Follow[]
  watchlist       Watchlist[]
  viewingHistory  ViewingHistory[]
  reactions       Reaction[]
  reactionVotes   ReactionVote[]
  notifications   Notification[]

  @@map("users")
}

model StreamerProfile {
  id          String   @id
  displayName String?  @map("display_name") @db.VarChar(200)
  twitchUrl   String?  @map("twitch_url")
  youtubeUrl  String?  @map("youtube_url")
  kickUrl     String?  @map("kick_url")
  bio         String?
  isVerified  Boolean  @default(false) @map("is_verified")
  createdAt   DateTime @default(now()) @map("created_at")

  user           User               @relation(fields: [id], references: [id])
  scheduleEntries ScheduleEntry[]
  embedSettings  EmbedSettings?
  followers      Follow[]
  streamSessions StreamSession[]

  @@map("streamer_profiles")
}

model ScheduleEntry {
  id            String    @id @default(uuid())
  streamerId    String    @map("streamer_id")
  tmdbId        Int       @map("tmdb_id")
  mediaType     String    @map("media_type") @db.VarChar(4)
  dayOfWeek     Int       @map("day_of_week")
  timeOfDay     String?   @map("time_of_day")
  seasonNumber  Int?      @map("season_number")
  episodeNumber Int?      @map("episode_number")
  title         String?   @db.VarChar(300)
  label         String?   @db.VarChar(50)
  hasNudity     Boolean   @default(false) @map("has_nudity")
  notes         String?
  isRecurring   Boolean   @default(false) @map("is_recurring")
  startsAt      DateTime? @map("starts_at")
  endsAt        DateTime? @map("ends_at")
  sortOrder     Int       @default(0) @map("sort_order")
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime? @updatedAt @map("updated_at")

  streamerProfile StreamerProfile @relation(fields: [streamerId], references: [id], onDelete: Cascade)
  watchlist       Watchlist[]
  viewingHistory  ViewingHistory[]

  @@map("schedule_entries")
}

model EmbedSettings {
  id           String  @id
  theme        String  @default("dark") @db.VarChar(10)
  showHeader   Boolean @default(true) @map("show_header")
  showPosters  Boolean @default(true) @map("show_posters")
  customCss    String? @map("custom_css")

  streamerProfile StreamerProfile @relation(fields: [id], references: [id], onDelete: Cascade)

  @@map("embed_settings")
}

// ============================================
// Fase 2 — Utilitários do Espectador
// ============================================

model Follow {
  followerId  String   @map("follower_id")
  followingId String   @map("following_id")
  createdAt   DateTime @default(now()) @map("created_at")

  follower  User            @relation(fields: [followerId], references: [id])
  following StreamerProfile @relation(fields: [followingId], references: [id])

  @@id([followerId, followingId])
  @@map("follows")
}

model Watchlist {
  id            String   @id @default(uuid())
  userId        String   @map("user_id")
  tmdbId        Int      @map("tmdb_id")
  mediaType     String   @map("media_type") @db.VarChar(4)
  sourceEntryId String?  @map("source_entry_id")
  notes         String?
  createdAt     DateTime @default(now()) @map("created_at")

  user          User           @relation(fields: [userId], references: [id])
  scheduleEntry ScheduleEntry? @relation(fields: [sourceEntryId], references: [id], onDelete: SetNull)

  @@unique([userId, tmdbId, mediaType])
  @@map("watchlist")
}

model ViewingHistory {
  id              String   @id @default(uuid())
  userId          String   @map("user_id")
  scheduleEntryId String   @map("schedule_entry_id")
  watchedAt       DateTime @default(now()) @map("watched_at")

  user          User          @relation(fields: [userId], references: [id])
  scheduleEntry ScheduleEntry @relation(fields: [scheduleEntryId], references: [id], onDelete: Cascade)

  @@unique([userId, scheduleEntryId])
  @@map("viewing_history")
}

model Notification {
  id        String   @id @default(uuid())
  userId    String   @map("user_id")
  type      String   @db.VarChar(50)
  title     String   @db.VarChar(300)
  body      String?
  data      Json?
  read      Boolean  @default(false)
  createdAt DateTime @default(now()) @map("created_at")

  user User @relation(fields: [userId], references: [id])

  @@map("notifications")
}

// ============================================
// Fase 3 — Hub de Reações
// ============================================

model Reaction {
  id          String   @id @default(uuid())
  userId      String   @map("user_id")
  tmdbId      Int      @map("tmdb_id")
  mediaType   String   @map("media_type") @db.VarChar(4)
  platform    String   @db.VarChar(10)
  url         String
  title       String?  @db.VarChar(300)
  channelName String?  @map("channel_name") @db.VarChar(200)
  contentType String?  @map("content_type") @db.VarChar(10)
  status      String   @default("pending") @db.VarChar(10)
  createdAt   DateTime @default(now()) @map("created_at")

  user  User            @relation(fields: [userId], references: [id])
  votes ReactionVote[]

  @@map("reactions")
}

model ReactionVote {
  id         String @id @default(uuid())
  reactionId String @map("reaction_id")
  userId     String @map("user_id")
  vote       Int

  reaction Reaction @relation(fields: [reactionId], references: [id], onDelete: Cascade)
  user     User     @relation(fields: [userId], references: [id])

  @@unique([reactionId, userId])
  @@map("reaction_votes")
}

model StreamSession {
  id           String    @id @default(uuid())
  streamerId   String    @map("streamer_id")
  tmdbId       Int       @map("tmdb_id")
  mediaType    String?   @map("media_type") @db.VarChar(4)
  platform     String?   @db.VarChar(10)
  scheduledFor DateTime? @map("scheduled_for")
  title        String?   @db.VarChar(300)
  isLive       Boolean   @default(false) @map("is_live")
  createdAt    DateTime  @default(now()) @map("created_at")

  streamerProfile StreamerProfile @relation(fields: [streamerId], references: [id])

  @@map("stream_sessions")
}
```
