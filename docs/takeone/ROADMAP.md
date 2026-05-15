# TakeOne — Roadmap

## Fase 1 — Cronograma de Streamers (MVP)

Objetivo: ferramenta que elimina a necessidade de site próprio pra streamers de reação.

**Nesta fase, apenas streamers têm conta. O público acessa tudo sem autenticação.**

### Features
- [ ] Supabase: setup do projeto, schema do banco
- [ ] Autenticação (email + Google via Supabase Auth) — apenas para streamers
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
- `/api/auth/*` — handlers Supabase Auth
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

## Schema Final

```sql
-- Usuários (gerenciado pelo Supabase Auth + tabela pública)
users (
  id            uuid primary key,
  email         text unique,
  username      text unique,
  display_name  text,
  avatar_url    text,
  created_at    timestamptz default now()
);

-- Perfil de streamer (Fase 1)
streamer_profiles (
  id            uuid primary key references users(id),
  display_name  varchar(200),
  twitch_url    text,
  youtube_url   text,
  kick_url      text,
  bio           text,
  is_verified   boolean default false,
  created_at    timestamptz default now()
);

-- Cronograma semanal (Fase 1)
schedule_entries (
  id              uuid primary key,
  streamer_id     uuid references streamer_profiles(id) on delete cascade,
  tmdb_id         integer not null,
  media_type      varchar(4) check (media_type in ('movie','tv')),
  day_of_week     smallint check (day_of_week between 0 and 6),
  time_of_day     time,
  season_number   int,
  episode_number  int,
  title           varchar(300),         -- título personalizado (opcional)
  label           varchar(50),          -- Live, Filme, Reacts, Sessão Dupla...
  has_nudity      boolean default false,
  notes           text,
  is_recurring    boolean default false,
  starts_at       date,
  ends_at         date,
  sort_order      int default 0,
  created_at      timestamptz default now(),
  updated_at      timestamptz
);

-- Configuração do embed (Fase 1)
embed_settings (
  id            uuid primary key references streamer_profiles(id) on delete cascade,
  theme         varchar(10) default 'dark',
  show_header   boolean default true,
  show_posters  boolean default true,
  custom_css    text
);

-- Seguir streamers (Fase 2)
follows (
  follower_id   uuid references users(id),
  following_id  uuid references streamer_profiles(id),
  created_at    timestamptz default now(),
  primary key (follower_id, following_id)
);

-- Watchlist pessoal (Fase 2)
watchlist (
  id            uuid primary key,
  user_id       uuid references users(id),
  tmdb_id       integer not null,
  media_type    varchar(4) check (media_type in ('movie','tv')),
  source_entry_id uuid references schedule_entries(id) on delete set null,
  notes         text,
  created_at    timestamptz default now(),
  unique(user_id, tmdb_id, media_type)
);

-- Histórico de reações assistidas (Fase 2)
viewing_history (
  id                uuid primary key,
  user_id           uuid references users(id),
  schedule_entry_id uuid references schedule_entries(id) on delete cascade,
  watched_at        timestamptz default now(),
  unique(user_id, schedule_entry_id)
);

-- Reações da comunidade (Fase 3)
reactions (
  id            uuid primary key,
  user_id       uuid references users(id),
  tmdb_id       integer not null,
  media_type    varchar(4) check (media_type in ('movie','tv')),
  platform      varchar(10) check (platform in ('youtube','twitch','kick','tiktok')),
  url           text not null,
  title         varchar(300),
  channel_name  varchar(200),
  content_type  varchar(10) check (content_type in ('live','vod','clip')),
  status        varchar(10) default 'pending' check (status in ('pending','approved','rejected')),
  created_at    timestamptz default now()
);

-- Votos em reações (Fase 3)
reaction_votes (
  id            uuid primary key,
  reaction_id   uuid references reactions(id) on delete cascade,
  user_id       uuid references users(id),
  vote          smallint check (vote in (1, -1)),
  unique(reaction_id, user_id)
);

-- Sessões ao vivo / agendadas (Fase 3)
stream_sessions (
  id            uuid primary key,
  streamer_id   uuid references streamer_profiles(id),
  tmdb_id       integer not null,
  media_type    varchar(4),
  platform      varchar(10),
  scheduled_for timestamptz,
  title         varchar(300),
  is_live       boolean default false,
  created_at    timestamptz default now()
);

-- Notificações (Fase 2)
notifications (
  id            uuid primary key,
  user_id       uuid references users(id),
  type          varchar(50),          -- 'new_schedule', 'streamer_followed', etc.
  title         varchar(300),
  body          text,
  data          jsonb,                -- dados contextuais (streamer_id, tmdb_id, etc.)
  read          boolean default false,
  created_at    timestamptz default now()
);
```
