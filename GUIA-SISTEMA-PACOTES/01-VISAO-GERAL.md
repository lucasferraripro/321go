# PARTE 1 — Visão Geral do Sistema

## O que é

Um sistema de cards de pacotes de viagem com:
- Grid de cards na home com foto, título, preços e botão
- Página de detalhes por pacote (`pacote.html?id=NOME`)
- Painel admin visual para editar tudo sem código
- Sincronização total entre home e página do pacote

## Arquitetura de arquivos

```
projeto/
├── index.html          ← Home com grid de cards
├── pacote.html         ← Página de detalhes (1 arquivo, N pacotes via ?id=)
├── js/
│   └── database.js     ← FONTE ÚNICA DE VERDADE — todos os pacotes aqui
├── editor.js           ← CMS visual (painel admin)
├── content.json        ← Overrides salvos pelo admin (começa como {})
├── imagens/            ← Fotos dos pacotes
└── api/
    ├── auth.js         ← Valida senha do admin
    ├── content.js      ← Retorna content.json
    ├── publish.js      ← Salva content.json no GitHub
    └── upload.js       ← Faz upload de imagem
```

## Fluxo de dados

```
database.js (DB)
    ↓ lido por
index.html → gera cards → clique → pacote.html?id=NOME
                                        ↓ lê DB[NOME]
                                        ↓ mostra detalhes

Admin edita preço na home
    ↓ editor.js salva em content.json (__db_overrides)
    ↓ próxima visita: database.js aplica overrides ao DB
    ↓ home E pacote.html mostram o mesmo valor ✅
```

## Tecnologia

- HTML + CSS + JavaScript puro (sem frameworks)
- Vercel (hospedagem gratuita + serverless)
- GitHub (banco de dados via API)
- Nenhuma dependência de backend próprio
