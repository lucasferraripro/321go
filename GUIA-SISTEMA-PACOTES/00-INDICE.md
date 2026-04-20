# GUIA SISTEMA DE PACOTES — Índice

> Como implementar o sistema completo de cards de pacotes com foto, preço, sincronização e painel admin.
> Dividido em partes para facilitar leitura e replicação.

## Arquivos deste guia

- `01-VISAO-GERAL.md` — O que é o sistema, como funciona, arquitetura
- `02-BANCO-DE-DADOS.md` — Como estruturar o database.js (fonte única de verdade)
- `03-CARDS-HOME.md` — Como construir os cards na página inicial com foto, preço, botão
- `04-PAGINA-PACOTE.md` — Como construir a página de detalhes do pacote
- `05-SINCRONIZACAO.md` — Como sincronizar dados entre home e página do pacote
- `06-EDITOR-ADMIN.md` — Como o painel admin edita fotos, preços e textos
- `07-CHECKLIST-REPLICAR.md` — Checklist completo para replicar em novo site

---

## Resumo em 1 parágrafo

O sistema tem um **banco de dados central** (`database.js`) com todos os pacotes.
A **home** lê esse banco e gera cards com foto, título, preço e botão "Ver detalhes".
Ao clicar, vai para `pacote.html?id=NOME` que lê o mesmo banco e mostra tudo.
O **painel admin** edita qualquer campo e salva em `content.json` no GitHub.
A **sincronização** garante que home e página do pacote sempre mostrem os mesmos valores via `__db_overrides`.
