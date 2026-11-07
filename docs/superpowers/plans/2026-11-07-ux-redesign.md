# Redesign expressivo de UX/UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dar identidade visual própria e expressiva ao app, com uma hierarquia que conte a história do histórico do usuário.

**Architecture:** O Impeccable captura o contexto (PRODUCT.md, DESIGN.md) e define tokens CSS. Os componentes existentes são reestruturados em cima desses tokens. A lógica em `src/lib` não muda, exceto por um helper de texto da narrativa, que é testado.

**Tech Stack:** React 19, Vite, Recharts, Vitest, oxlint. Skill Impeccable em `.agent/skills/impeccable`.

**Spec:** `docs/superpowers/specs/2026-11-07-ux-redesign-design.md`

## Global Constraints

- Stack mantida: React 19 + Vite + Recharts, 100% client-side, sem backend.
- Idioma pt-BR, tema escuro.
- Não alterar o parsing e a agregação em `src/lib/streaming.ts` nem `streaming.test.ts`.
- Cores só via tokens CSS, incluindo tooltips e eixos do Recharts (hoje `#141a16` e `#8fa096` estão fixos em `Dashboard.tsx`).
- Sem verde Spotify genérico, sem `dashboard-glow` nem `upload-glow`, sem grade de KPIs idênticos.
- Clima: expressivo, com a expressão na abertura e nos títulos. Filtros, listas e gráficos continuam escaneáveis.
- Verificação: `npm test`, `npm run lint` e `npm run build` passam ao fim de cada task.

## Review Focus

- Período com poucos dados (um mês, uma música): a narrativa e os gráficos não quebram nem mostram "NaN".
- Ano filtrado sem reproduções: estado vazio legível, sem gráfico em branco.
- Nomes muito longos de artista ou música: truncam sem quebrar o layout.
- Celular (360px): sem rolagem horizontal e com alvos de toque utilizáveis.
- `prefers-reduced-motion`: nenhuma animação obrigatória para entender o conteúdo.

---

### Task 1: Contexto e direção visual

**Files:**
- Create: `PRODUCT.md`, `DESIGN.md` (gerados pelo Impeccable)
- Modify: `src/index.css` (tokens)

**Interfaces:**
- Produces: tokens CSS em `:root` (`--color-*`, `--font-*`, `--space-*`, `--radius-*`) que as tasks 2 a 5 consomem.

- [ ] **Step 1:** Rodar `.agent/skills/impeccable/scripts/impeccable.cmd context` e depois `init`. Registrar público (curiosos sobre o próprio histórico), tom expressivo e anti-referências (verde Spotify genérico, glow, KPIs idênticos).
- [ ] **Step 2:** Rodar `shape` para escolher o mundo visual (paleta, par de fontes, escala tipográfica) e gerar o `DESIGN.md`.
- [ ] **Step 3:** Rodar `critique` e `audit` no estado atual e salvar o resumo da nota inicial em `docs/superpowers/plans/baseline-critique.md`.
- [ ] **Step 4:** Implementar os tokens do `DESIGN.md` em `src/index.css`, com fontes carregadas por `index.html` e sem alterar componentes ainda.
- [ ] **Step 5:** Verificar com `npm run build`. Esperado: sucesso. Commit `feat: add design context and tokens`.

### Task 2: Narrativa do número herói (único código com teste)

**Files:**
- Modify: `src/lib/format.ts`
- Test: `src/lib/format.test.ts`

**Interfaces:**
- Produces: `heroHeadline(totalMs: number, totalPlays: number): { value: string; unit: string; caption: string }` para a Task 4.

- [ ] **Step 1:** Escrever testes em `format.test.ts`:
  - `heroHeadline(0, 0)` devolve `value: '0'` e uma `caption` que não contém "NaN".
  - `heroHeadline(3_600_000 * 4212, 90000).value` é `'4.212'` e `unit` é `'horas'`.
  - `heroHeadline(3_600_000, 10).unit` é `'hora'` (singular).
- [ ] **Step 2:** Rodar `npm test -- format` e confirmar que falha com "heroHeadline is not a function".
- [ ] **Step 3:** Implementar `heroHeadline` em `format.ts`, usando `formatNumber` e pt-BR. Para menos de 1 hora, expressar em minutos.
- [ ] **Step 4:** Rodar `npm test`. Esperado: tudo verde, incluindo `streaming.test.ts` intacto.
- [ ] **Step 5:** Commit `feat: add heroHeadline helper`.

### Task 3: Tela de upload

**Files:**
- Modify: `src/components/UploadScreen.tsx`, `src/App.css`

**Interfaces:**
- Consumes: tokens da Task 1. Props atuais `onFiles`, `isLoading` e `errors` ficam inalteradas.

- [ ] **Step 1:** Redesenhar o hero com tipografia grande e composição própria, removendo `upload-glow`. Trocar os emojis (🎧, ⏳, 🔒) por SVG ou elementos tipográficos.
- [ ] **Step 2:** Tornar o "Como pegar seu histórico" uma sequência numerada e escaneável, ao lado da dropzone em telas largas. Manter o texto do aviso de privacidade.
- [ ] **Step 3:** Garantir estados de foco visível, arrastar, carregando e erro com contraste adequado. Manter o acesso por teclado (`Enter` e `Espaço`).
- [ ] **Step 4:** Verificar no navegador em 1280px e 360px e rodar `npm run lint && npm run build`.
- [ ] **Step 5:** Commit `feat: redesign upload screen`.

### Task 4: Abertura e KPIs do dashboard

**Files:**
- Modify: `src/components/Dashboard.tsx`, `src/components/StatCard.tsx`, `src/App.css`

**Interfaces:**
- Consumes: `heroHeadline` (Task 2) e os tokens (Task 1). `DashboardProps` fica inalterado.

- [ ] **Step 1:** Criar a seção de abertura com o número herói vindo de `heroHeadline(analysis.totalMs, analysis.totalPlays)`, o período e o seletor de ano com destaque. Remover `dashboard-glow`.
- [ ] **Step 2:** Reduzir `StatCard` a métricas secundárias (artistas, músicas, skip) em linha, sem a variante `accent` e a grade uniforme.
- [ ] **Step 3:** Cobrir o ano sem dados com um estado vazio explícito e o aviso de arquivos ignorados com um estilo novo.
- [ ] **Step 4:** Verificar no navegador com dados reais e um ano vazio, depois `npm run lint && npm run build`.
- [ ] **Step 5:** Commit `feat: redesign dashboard header and KPIs`.

### Task 5: Gráficos e listas

**Files:**
- Modify: `src/components/Dashboard.tsx`, `src/components/TopList.tsx`, `src/App.css`

**Interfaces:**
- Consumes: tokens da Task 1. `TopListProps` fica inalterado.

- [ ] **Step 1:** Mover `tooltipStyle` e `axisTick` para valores lidos dos tokens, com um helper local único `chartTheme` em `Dashboard.tsx`.
- [ ] **Step 2:** Reorganizar as seções (visão geral, artistas e músicas, hábitos, plataformas) com títulos expressivos e ritmo de espaçamento variado.
- [ ] **Step 3:** Redesenhar `TopList`: o primeiro item ganha destaque, nomes longos truncam com `title`, e a barra de proporção usa os tokens.
- [ ] **Step 4:** Verificar em 360px (sem rolagem horizontal) e com `prefers-reduced-motion`, depois `npm run lint && npm run build`.
- [ ] **Step 5:** Commit `feat: redesign charts and lists`.

### Task 6: Revisão final

**Files:**
- Modify: conforme os achados.

- [ ] **Step 1:** Rodar `audit` e `critique` e comparar com o `baseline-critique.md`. Corrigir os achados P0 e P1.
- [ ] **Step 2:** Rodar `polish`.
- [ ] **Step 3:** Rodar `npm test && npm run lint && npm run build`. Esperado: tudo verde.
- [ ] **Step 4:** Atualizar o README se alguma descrição visual mudou. Commit `chore: final polish`.

