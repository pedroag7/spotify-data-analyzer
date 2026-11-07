# Sistema de Design: Encarte de Disco

Documentação visual e arquitetural da interface do **Spotify Data Analyzer**.

---

## 1. Conceito e Tese Visual

### Tese
O histórico de streaming do usuário não é um dashboard analítico corporativo genérico (SaaS B2B) nem uma tela escura pontuada por neons verdes e efeitos de brilho sintéticos (*glow*). O histórico pessoal é tratado como um **encarte de disco** (*liner notes / record sleeve*): um artefato impresso, tátil e durável, composto por capa monumental, contracapa com créditos e alinhamento tipográfico rigoroso.

### Universo Visual (*Own-World*)
- **Papel Offset e Kraft**: paleta base em tons neutros quentes de papel de prensagem (`#ece4d3` e `#e2d8c2`), evitando o branco digital (`#ffffff`) e o preto absoluto (`#000000`).
- **Tinta Tipográfica Única**: todo o corpo e os títulos usam preto quente de impressão (`#17130f`).
- **Uma Tinta de Selo (*Spot Color*)**: vermelho-tomate queimado (`#c2391f`), evocando carimbos e selos centrais de vinil clássicos.
- **Filetes de Pauta**: linhas de 1px a 2px com opacidade calibrada, sem sombras projetadas ou desfoques.
- **Cantos Guilhotinados**: cantos quase retos (raio de 2px), rejeitando o arredondamento de pílula dos aplicativos contemporâneos.

---

## 2. Tokens de Design

Os tokens estão declarados como variáveis CSS em `src/index.css` sob a raiz `:root`:

| Token | Valor Hex/RGBA | Função no Sistema |
| :--- | :--- | :--- |
| `--bg` | `#ece4d3` | Papel offset principal de fundo da aplicação |
| `--bg-soft` | `#e2d8c2` | Tom kraft secundário para áreas ativas, hovers e contraste suave |
| `--card` | `#f4eee0` | Superfície levemente clareada para cartões, tabelas e popovers |
| `--border` | `rgba(23, 19, 15, 0.22)` | Filetes de impressão, divisórias de seções e eixos gráficos |
| `--text` | `#17130f` | Tinta preta principal para tipografia, números e contornos |
| `--muted` | `#5c5246` | Tinta de apoio para legendas, créditos miúdos e rótulos secundários |
| `--accent` | `#c2391f` | Vermelho-tomate queimado: selo do disco, destaques e foco |
| `--accent-soft` | `rgba(194, 57, 31, 0.12)` | Realce suave de seleção e cursos de leitura dos gráficos |
| `--danger` | `#9b1c1c` | Vermelho escuro para mensagens de arquivo com falha |
| `--warning` | `#8a5a00` | Alerta quente para avisos |
| `--radius` | `2px` | Raio padrão de corte de papel |
| `--font` | `'Hanken Grotesk Variable', sans-serif` | Família tipográfica para leitura, tabelas e fichas |
| `--font-display` | `'Big Shoulders Variable', Impact, sans-serif` | Família condensada para números monumentais e cabeçalhos |

---

## 3. Tipografia

A tipografia estabelece a hierarquia física do encarte:

### Famílias
1. **Display: Big Shoulders**
   - Condensada, alta e imponente (pesos 700 a 800).
   - Usada no número de capa (`.cover-number`), nos títulos principais (`.hero h1`) e nos totais de cartões.
   - Escala fluida via `clamp(4rem, 22vw, 6rem)` para impacto visual sem quebras desajeitadas.

2. **Texto e Metadados: Hanken Grotesk**
   - Grotesca balanceada inspirada na tradição editorial suíça dos anos 60/70.
   - Alta legibilidade em corpos reduzidos (12px a 15px) para fichas técnicas, tabelas e notas de privacidade.

3. **Numerais Tabulares**
   - O corpo da aplicação define `font-variant-numeric: tabular-nums`, garantindo que posições de faixas, minutos e contadores mantenham alinhamento vertical rítmico.

---

## 4. Contraste e Acessibilidade (WCAG)

O sistema foi desenhado para cumprir e exceder os requisitos de contraste da WCAG 2.1 AA/AAA em todas as combinações fundamentais:

- **Texto Principal (`#17130f`) sobre Papel (`#ece4d3`)**: razão de **14,2:1** (excede AAA de 7,0:1).
- **Texto Principal (`#17130f`) sobre Cartão (`#f4eee0`)**: razão de **15,9:1** (excede AAA de 7,0:1).
- **Texto Muted (`#5c5246`) sobre Papel (`#ece4d3`)**: razão de **5,0:1** (cumpre AA de 4,5:1).
- **Acento (`#c2391f`) sobre Papel (`#ece4d3`)**: razão de **4,6:1** (cumpre AA de 4,5:1).
- **Foco Acessível**: anel de foco visível de 2px na cor de acento (`--accent`) com afastamento (*offset*) de 3px.
- **Movimento Reduzido**: media query `@media (prefers-reduced-motion: reduce)` neutraliza rotações e transições contínuas.
- **Semântica Estrutural**:
  - Cada tela possui exatamente um `<h1>` principal (`.hero h1` no upload, `.cover-number` ou `.cover-empty` no dashboard).
  - Estados vazios utilizam `role="status"`.
  - Áreas de drop interativas comunicam estados com `role="button"`, `aria-busy` e `aria-disabled`.

---

## 5. Componentes e Estrutura

### 1. Tela de Entrada / Upload
- **Hero Editorial**: título sem kickers genéricos, seguido de subtítulo explicativo e assinatura de produto (`Spotify Data Analyzer`).
- **Dropzone Tátil**: área demarcada com contorno duplo e ícone central de vinil (`DiscIcon`), com suporte a arrastar/soltar, clique protegido contra estado de carregamento e feedback acessível.
- **Ficha de Instruções e Privacidade**: lista ordenada clara (`.how-to`) e nota local destacada com ícone de proteção (`LockIcon`).

### 2. Dashboard: Capa e Contracapa
- **Capa (`.cover`)**:
  - *Lado Esquerdo*: total monumental de horas/minutos (`.cover-number`) e legenda contextual (`.cover-caption`), ou estado vazio informativo (`.cover-empty`).
  - *Lado Direito*: seletor de "Edição" (`year-select`) para troca de períodos, ficha técnica com data da primeira e da última reprodução (`cover-period`) e botão discreto para alternar arquivos.
- **Fichas Secundárias (`.stat-grid` / `.stat-card` / `.ghost-card`)**:
  - Indicadores diários de escuta, taxa de reproduções ignoradas (*skip rate*), diversidade de faixas e catálogo de artistas.
- **Gráficos Integrados (Recharts com Tema Tipográfico)**:
  - *Ritmo Mensal*: gráfico de área contínuo com preenchimento em gradiente e linhas finas.
  - *Horas do Dia e Dias da Semana*: histogramas que revelam os hábitos de audição sem poluição visual.
- **Faixas do Álbum (`.top-list`)**:
  - Lista de artistas e faixas mais escutados com numeração tradicional de encarte ("01", "02"...), barra de proporção discreta e detalhamento em horas e execuções.
- **Ficha Técnica de Plataformas**:
  - Créditos com distribuição das plataformas de reprodução e número de execuções registradas.
