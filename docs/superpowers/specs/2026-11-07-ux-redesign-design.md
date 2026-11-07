# Redesign de UX/UI do Spotify Data Analyzer

## Intenção
Tirar a cara de template ("vibecoding") do app e melhorar a experiência: o usuário sobe o histórico do Spotify, se reconhece nos números e consegue explorá-los com clareza.

## Público e modo
Pessoas curiosas sobre o próprio histórico (não analistas). Modo Impeccable: **Operate** (clareza e escaneabilidade antes de efeito). *(Suposição minha, não confirmada.)*

## Metas
- Identidade visual própria, com PRODUCT.md e DESIGN.md.
- Hierarquia clara: um número "herói" narrativo seguido de seções (visão geral, artistas e músicas, hábitos, plataformas).
- Onboarding útil na tela de upload (como pedir o export, o que subir, privacidade 100% local).
- Tokens de design no lugar de cores fixas (inclusive tooltips/eixos do Recharts).
- Acessibilidade e responsividade verificadas (`audit`).

## Não-metas
- Mudar a lógica de `src/lib` (parsing/agregação) ou os testes.
- Novas análises/métricas, backend, trocar a stack.
- Estilo Wrapped inteiro (cards em rolagem). Só empresto a ousadia dele, não a estrutura.

## Anti-metas
- Continuar com verde Spotify genérico + glow + grade de KPIs idênticos.
- Perder a facilidade de filtrar por ano e explorar.

## Restrições
React 19 + Vite + Recharts, 100% client-side, pt-BR, tema escuro mantido.

## Abordagens
- **A. Polimento do visual atual:** rápido, mas mantém a cara de template.
- **B. Redesign com identidade própria (escolhida):** resolve a causa; mexe em todos os componentes e no CSS.
- **C. Estilo Wrapped:** memorável, mas ruim para exploração.
Escolha de B: confirmada pelo usuário. Doc aprovado pelo usuário em 2026-11-07.

## Decisões (minhas, a validar)
- Clima (decisão do usuário): **expressivo**. Tipografia grande e ousada, cor com personalidade, números enormes e composição com ponto de vista, longe do verde Spotify genérico. A paleta e as fontes exatas saem do `shape`.
- Equilíbrio (minha proposta): a expressão fica na abertura (número herói, narrativa) e nos títulos e cores dos gráficos. Filtros, listas e gráficos continuam fáceis de escanear. O Impeccable chama isso de "Operate com mais ambição".
- Fluxo: `init` → `shape` → implementar → `critique`/`audit` antes e depois → `polish`.

## Fica para o construtor
Paleta e fontes exatas, layout de cada seção, copy final, microinterações.

