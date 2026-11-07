# spotify-data-analyzer

Explore your Spotify listening data through detailed statistics, insights, and visualizations generated from your Spotify JSON export.

Aplicação 100% client-side (React + Vite): os arquivos são lidos e processados no navegador, nada é enviado para servidores.

## Como usar

1. Acesse [spotify.com/account/privacy](https://www.spotify.com/account/privacy/) e solicite o **Histórico de streaming estendido**.
2. Aguarde o e-mail do Spotify e extraia o `.zip` recebido.
3. Rode a aplicação e importe todos os arquivos `Streaming_History_*.json`.

## Scripts

```bash
npm install
npm run dev      # ambiente de desenvolvimento
npm run build    # build de produção
npm run preview  # serve o build de produção
npm test         # testes da lógica de parsing/agregação
npm run lint     # oxlint
```

## O que é analisado

- Tempo total ouvido, reproduções, artistas e músicas únicas
- Artistas, músicas e álbuns mais ouvidos
- Evolução mensal e filtro por ano
- Distribuição por horário do dia e dia da semana
- Plataformas usadas e taxa de faixas puladas

Suporta o formato atual (`Streaming_History_Audio_*.json`) e o formato antigo (`StreamingHistory_music_*.json`).
