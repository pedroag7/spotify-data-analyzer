# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Pessoas curiosas sobre o próprio histórico de audição. Elas pedem o export "Histórico de streaming estendido" ao Spotify, sobem os arquivos `Streaming_History_*.json` e querem se reconhecer nos números e explorá-los por ano.

## Product Purpose

Transformar o JSON de export do Spotify em estatísticas, insights e visualizações do histórico de audição. O sucesso é o usuário entender seus hábitos de escuta sem esforço e querer explorar mais.

## Positioning

100% client-side: os arquivos são lidos e processados no navegador e nada é enviado para servidores. O usuário analisa o próprio histórico sem entregar dados a terceiros.

## Operating Context

Fluxo em duas telas: upload (com instruções de como pedir o export em spotify.com/account/privacy, que leva alguns dias) e dashboard. O dashboard tem filtro por ano e botão para trocar os arquivos.

## Capabilities and Constraints

- Tempo total ouvido, reproduções, artistas e músicas únicas.
- Artistas, músicas e álbuns mais ouvidos.
- Evolução mensal, distribuição por hora do dia e dia da semana.
- Plataformas usadas e taxa de faixas puladas.
- Stack: React 19 + Vite + Recharts, sem backend.
- Idioma pt-BR, tema escuro.
- A lógica de parsing e agregação em `src/lib` não faz parte do redesign.

## Brand Commitments

Preservar o nome "Spotify Data Analyzer" e os textos atuais da interface (confirmado pelo usuário). O redesign muda a identidade visual e a estrutura, não a copy factual.

## Evidence on Hand

Nenhum dado real de usuário, depoimento ou métrica de uso. Nada disso deve ser inventado.

## Product Principles

- O número do usuário vem primeiro: a história pessoal é o ponto de entrada.
- Privacidade é parte da proposta e precisa ficar visível.
- Explorar é fácil: filtrar por ano e escanear listas e gráficos sem esforço.
- Expressivo na abertura, preciso nos dados.

