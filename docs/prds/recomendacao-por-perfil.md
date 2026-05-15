# PRD: Algoritmo de Recomendação por Perfil de Usuário

## 1. Resumo

Implementar um sistema de recomendação de filmes e séries baseado no perfil do usuário, utilizando `localStorage` para armazenamento local e a API do TMDB (`/discover`) para gerar sugestões personalizadas.

## 2. Problema

O site atualmente exibe apenas conteúdo genérico (populares, lançamentos, catálogo por streaming). Não há qualquer personalização — todo usuário vê exatamente o mesmo conteúdo, independentemente de seus gostos.

## 3. Objetivo

Permitir que o usuário indique seus gêneros favoritos e receba uma seção personalizada de recomendações na página inicial.

## 4. Requisitos Funcionais

### RF1 — Onboarding de gêneros
- Na primeira visita ao site, um modal fullscreen é exibido solicitando a seleção de gêneros favoritos.
- Os gêneros são carregados da TMDB (`/genre/movie/list`, `/genre/tv/list`) em português (pt-BR).
- O usuário pode selecionar um mínimo de 3 e máximo de 10 gêneros.
- Cada gênero é exibido como um chip clicável com feedback visual (selecionado = borda gold).
- Um botão "Confirmar" só fica ativo quando o mínimo de 3 gêneros é atingido.
- Após confirmar, o modal desaparece e o perfil é salvo no `localStorage`.
- O modal só reaparece se o usuário limpar o `localStorage` ou se houver um mecanismo de edição (futuro).

### RF2 — Seção "Recomendados para Você"
- Na página inicial (`/`), uma nova seção entre o `CarouselBanner` e o `FeaturedMovies`.
- Título: "Recomendados para Você" com a tipografia Bebas Neue (padrão do site).
- Exibe até 10 itens (filmes + séries combinados) em um grid 5-col (mesmo padrão do `FeaturedMovies`).
- Cada card segue o mesmo design: poster, título, data, nota.
- Se o usuário ainda não completou o onboarding, a seção não é exibida (ou exibe um call-to-action sutil).

### RF3 — Algoritmo de recomendação
- Consulta `/discover/movie?with_genres=X,Y,Z&sort_by=vote_average.desc&vote_count.gte=200&language=pt-BR`.
- Consulta `/discover/tv?with_genres=X,Y,Z&sort_by=vote_average.desc&vote_count.gte=200&language=pt-BR`.
- Os resultados são combinados e ordenados por score ponderado:
  - `vote_average * 0.5`
  - `popularidade normalizada (0-10) * 0.3`
  - `bônus de match de gênero * 0.2`
- Os top 10 são exibidos.
- Resultados duplicados (mesmo TMDB ID) são removidos.

### RF4 — Persistência local
- Perfil salvo na chave `filmes-novos-user-profile` do `localStorage`.
- Estrutura:
  ```typescript
  interface UserProfile {
    favoriteGenres: number[];
    onboardingDone: boolean;
  }
  ```
- Leitura é feita na inicialização do app via contexto React.
- Escrita ocorre ao confirmar a seleção de gêneros.

## 5. Requisitos Não Funcionais

- **Sem autenticação**: Todo o perfil é local ao navegador.
- **Sem dependências externas**: Apenas `localStorage` + TMDB API.
- **Performance**: As chamadas `/discover` podem ser cacheadas com `useMemo` ou cache simples em memória durante a sessão.
- **Acessibilidade**: Modal de onboarding deve ser fechável com ESC, foco gerenciado, e elementos clicáveis via teclado.
- **Responsividade**: Modal e grid de recomendações devem funcionar em mobile (grid 2-col em mobile, 5-col em desktop).
- **Fallback**: Se a TMDB falhar, a seção simplesmente não aparece (sem quebrar a página).

## 6. Arquitetura

### 6.1 Novos arquivos

| Arquivo | Finalidade |
|---|---|
| `src/types/profile.ts` | Interface `UserProfile` |
| `src/hooks/useUserProfile.ts` | Hook + Context `UserProfileProvider` para ler/escrever `localStorage` |
| `src/components/GenreOnboarding/index.tsx` | Modal de seleção de gêneros |
| `src/components/GenreOnboarding/GenreOnboarding.interfaces.ts` | Tipos do onboarding |
| `src/components/RecommendedForYou/index.tsx` | Seção de recomendações na home |
| `src/components/RecommendedForYou/RecommendedForYou.interfaces.ts` | Tipos das recomendações |

### 6.2 Arquivos modificados

| Arquivo | Mudança |
|---|---|
| `src/pages/_app.tsx` | Adicionar `UserProfileProvider` e `GenreOnboarding` |
| `src/pages/index.tsx` | Adicionar `<RecommendedForYou />` |

### 6.3 Fluxo de dados

```
App init → UserProfileProvider lê localStorage
         → se !onboardingDone → renderiza GenreOnboarding (modal)
         → usuário seleciona gêneros → salva no localStorage
         → onboardingDone = true → modal some
         → RecommendedForYou lê favoriteGenres do contexto
         → faz fetch /discover com os gêneros
         → renderiza grid com resultados
```

## 7. Endpoints TMDB

| Endpoint | Parâmetros | Uso |
|---|---|---|
| `GET /genre/movie/list` | `language=pt-BR` | Listar gêneros de filmes |
| `GET /genre/tv/list` | `language=pt-BR` | Listar gêneros de séries |
| `GET /discover/movie` | `with_genres=ID1,ID2`, `sort_by=vote_average.desc`, `vote_count.gte=200`, `language=pt-BR` | Filmes recomendados |
| `GET /discover/tv` | `with_genres=ID1,ID2`, `sort_by=vote_average.desc`, `vote_count.gte=200`, `language=pt-BR` | Séries recomendadas |

## 8. Critérios de Aceitação

1. Usuário novo vê o modal de onboarding ao acessar o site pela primeira vez.
2. Usuário consegue selecionar/deselecionar gêneros com feedback visual.
3. Botão "Confirmar" fica desabilitado com menos de 3 gêneros selecionados.
4. Após confirmar, o modal fecha e nunca mais aparece (a menos que o `localStorage` seja limpo).
5. A seção "Recomendados para Você" aparece na home com conteúdo relevante aos gêneros escolhidos.
6. Em caso de erro na TMDB, a seção não aparece e não quebra a página.
7. A seção é responsiva (grid adaptável).
8. O perfil persiste entre sessões (fechar/abrir navegador).

## 9. Possíveis Evoluções Futuras

- Adicionar "curtir" filmes/séries individuais para refinar recomendações.
- Usar `/movie/{id}/recommendations` e `/similar` baseado em conteúdo curtido.
- Sincronizar perfil com backend (autenticação).
- "Não recomendar" (deslike) para remover conteúdo específico.
- Histórico de visualização para evitar repetições.
