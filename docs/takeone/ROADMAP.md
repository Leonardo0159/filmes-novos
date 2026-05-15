# TakeOne — Roadmap

## Fase 1 — Fundação Social

Objetivo: MVP com núcleo social funcional.

### Features
- [ ] Supabase: setup do projeto, schema do banco
- [ ] Autenticação (email + Google via Supabase Auth)
- [ ] Perfil do usuário (avatar, username, bio)
- [ ] Watchlist: botão "Quero ver" / "Já vi" nas páginas de filme/série
- [ ] Sistema de avaliação (estrelas 1-5)
- [ ] Reviews escritos nas páginas de detalhe
- [ ] Header adaptado: avatar + menu do usuário logado

### Novos componentes
- `AuthModal` — modal de login/cadastro
- `WatchlistButton` — toggle assistir/assistido
- `StarRating` — input de avaliação
- `ReviewCard` — card de review na página do filme/série

### Novas API routes
- `/api/auth/*` — handlers Supabase Auth
- `/api/watchlist` — CRUD watchlist (GET/POST)
- `/api/reviews` — CRUD reviews (GET/POST)
- `/api/reviews/[id]` — deletar review (DELETE)

### Páginas modificadas
- `filme/[filme].tsx` — adicionar seção de reviews + watchlist button
- `serie/[serie].tsx` — adicionar seção de reviews + watchlist button
- `index.tsx` — seção "Atividade dos amigos" (se logado)

---

## Fase 2 — Hub de Reações

Objetivo: centralizar reações de streamers a filmes.

### Features
- [ ] Envio de links de reação (YouTube, Twitch, Kick, TikTok)
- [ ] Votos da comunidade (útil/não útil)
- [ ] Moderação básica (status: pending → approved/rejected)
- [ ] Aba "Reações" nas páginas de detalhe (ao lado de Reviews)
- [ ] Seção "Ao Vivo Agora" na Home
- [ ] Perfil de streamer com verificação

### Novos componentes
- `ReactionCard` — card de reação com embed/links
- `ReactionSubmitForm` — formulário pra enviar link
- `LiveNowBanner` — seção de lives ativas na home

### Novas API routes
- `/api/reactions` — CRUD reações (GET/POST)
- `/api/reactions/[id]/vote` — votar (POST)
- `/api/feed/live` — buscar lives ativas (GET)

---

## Fase 3 — Cronograma de Streamers

Objetivo: ferramenta que elimina a necessidade de site próprio pra streamers.

### Features
- [ ] Dashboard privado do streamer (`/streamer/dashboard`)
- [ ] Pesquisa de filmes via TMDB autocomplete
- [ ] Agendamento por dia da semana + horário
- [ ] Suporte a recorrência (ex: "toda quinta, S3 de Avatar")
- [ ] Labels customizáveis (Live, Filme, Reacts, Sessão Dupla, etc.)
- [ ] Página pública `/cronograma/[streamer]`
- [ ] Widget embedável (iframe sem header/footer)
- [ ] Wishlist pública do streamer
- [ ] Histórico de VODs assistidos

### Novas páginas
- `/cronograma/[streamer]` — grade semanal pública
- `/streamer/[username]` — perfil + histórico do streamer
- `/streamer/dashboard` — dashboard privado de gerenciamento
- `/embed/cronograma/[streamer]` — iframe embedável

### Novos componentes
- `ScheduleGrid` — grade semanal (arrastável/drop)
- `ScheduleEntryForm` — formulário de agendamento
- `StreamerProfileHeader` — header do perfil do streamer
- `EmbedWrapper` — layout limpo pra iframe

### Novas API routes
- `/api/schedule` — CRUD cronograma
- `/api/streamer/profile` — gerenciar perfil de streamer
- `/api/embed/settings` — configurar tema do embed

---

## Fase 4 — Engajamento Cruzado

Objetivo: fechar o ciclo social e aumentar retenção.

### Features
- [ ] Notificações push/email (seguidores avisados de nova sessão)
- [ ] Feed "Seus streamers estão vendo..."
- [ ] Seguir/deixar de seguir streamers
- [ ] Desafios comunitários / maratonas
- [ ] Estatísticas anuais ("seu ano em filmes")
- [ ] Recomendação personalizada baseada em watchlist + seguidos

### Schema Final

```sql
-- Usuários
users (
  id            uuid primary key,
  email         text unique,
  username      text unique,
  display_name  text,
  avatar_url    text,
  bio           text,
  created_at    timestamptz default now()
);

-- Watchlist
watchlist (
  id            uuid primary key,
  user_id       uuid references users(id),
  tmdb_id       integer not null,
  media_type    varchar(4) check (media_type in ('movie','tv')),
  status        varchar(20) check (status in ('quero_assistir','assistindo','assistido')),
  rating        smallint check (rating between 1 and 5),
  watched_at    timestamptz,
  created_at    timestamptz default now(),
  unique(user_id, tmdb_id, media_type)
);

-- Reviews
reviews (
  id            uuid primary key,
  user_id       uuid references users(id),
  tmdb_id       integer not null,
  media_type    varchar(4),
  content       text not null,
  rating        smallint check (rating between 1 and 5),
  created_at    timestamptz default now(),
  updated_at    timestamptz
);

-- Reações da comunidade
reactions (
  id            uuid primary key,
  user_id       uuid references users(id),
  tmdb_id       integer not null,
  media_type    varchar(4),
  platform      varchar(10) check (platform in ('youtube','twitch','kick','tiktok')),
  url           text not null,
  title         varchar(300),
  channel_name  varchar(200),
  content_type  varchar(10) check (content_type in ('live','vod','clip')),
  status        varchar(10) default 'pending' check (status in ('pending','approved','rejected')),
  created_at    timestamptz default now()
);

-- Votos em reações
reaction_votes (
  id            uuid primary key,
  reaction_id   uuid references reactions(id) on delete cascade,
  user_id       uuid references users(id),
  vote          smallint check (vote in (1, -1)),
  unique(reaction_id, user_id)
);

-- Perfil de streamer
streamer_profiles (
  id            uuid primary key references users(id),
  display_name  varchar(200),
  twitch_url    text,
  youtube_url   text,
  kick_url      text,
  bio           text,
  is_verified   boolean default false
);

-- Sessões ao vivo / agendadas
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

-- Cronograma semanal
schedule_entries (
  id            uuid primary key,
  streamer_id   uuid references streamer_profiles(id),
  tmdb_id       integer not null,
  media_type    varchar(4),
  day_of_week   smallint check (day_of_week between 0 and 6),
  time_of_day   time,
  season_number int,
  episode_number int,
  label         varchar(50),
  notes         text,
  is_recurring  boolean default false,
  starts_at     date,
  ends_at       date,
  sort_order    int default 0,
  created_at    timestamptz default now()
);

-- Seguidores
follows (
  follower_id   uuid references users(id),
  following_id  uuid references users(id),
  created_at    timestamptz default now(),
  primary key (follower_id, following_id)
);

-- Embed settings (streamer personaliza o iframe)
embed_settings (
  id            uuid primary key references streamer_profiles(id),
  theme         varchar(10) default 'dark',
  show_header   boolean default true,
  show_posters  boolean default true,
  custom_css    text
);
```
