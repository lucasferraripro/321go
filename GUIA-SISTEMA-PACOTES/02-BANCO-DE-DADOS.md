# PARTE 2 — Banco de Dados (database.js)

## Estrutura obrigatória de cada pacote

```javascript
const DB = {

    // ID do pacote — usado na URL: pacote.html?id=ESTE_ID
    nome_do_pacote: {
        category:    'nacional',        // 'nacional' | 'internacional' | 'copa' (para abas)
        title:       'Título do Pacote',
        subtitle:    'Subtítulo descritivo',
        location:    'Cidade, Estado/País',
        duration:    '5 dias / 4 noites',
        price:       '2.486,13',        // Preço PIX — só números e vírgula
        priceCartao: '2.605,80',        // Preço cartão — só números e vírgula
        parcelas:    '10x de R$ 260,58 sem juros',
        flag:        'Brasil 🇧🇷',
        badge:       '🔥 Oferta',       // '🔥 Oferta' | '⭐ Popular' | '💎 Premium'
        dates:       '📅 11/07 – 15/07/2026 · 1 pessoa',
        images: [
            'imagens/foto-principal.png',   // [0] = foto do card na home
            'imagens/foto-2.png',           // [1] = carrossel
            'imagens/foto-3.png'            // [2] = carrossel
        ],
        desc: 'Descrição completa do destino. 2-3 parágrafos.',
        incluso: [
            'Passagem aérea ida e volta',
            'Hospedagem com café da manhã',
            'Transfer In/Out',
            'Seguro viagem'
        ],
        nao_incluso: [
            'Almoços e jantares',
            'Passeios extras',
            'Gorjetas'
        ],
        roteiro: [
            { dia: '1º Dia', title: 'Chegada', desc: 'Descrição do dia 1.' },
            { dia: '2º Dia', title: 'Passeio', desc: 'Descrição do dia 2.' },
            { dia: '3º Dia', title: 'Retorno', desc: 'Descrição do dia 3.' }
        ]
    },

    outro_pacote: {
        // ... mesma estrutura
    }
};
```

## THUMB MAP — imagens dos cards

Separar as imagens dos cards em um mapa para fácil troca:

```javascript
const THUMB = {
    nome_do_pacote: 'imagens/foto-principal.png',
    outro_pacote:   'imagens/outra-foto.png'
};
```

## SITE — dados da agência

```javascript
const SITE = {
    nome:     'Nome da Agência',
    whatsapp: '5511999999999',   // com código do país, sem espaços
    email:    'contato@agencia.com.br',
    tel:      '(11) 99999-9999'
};
```

## mergeCMS — aplica overrides do admin ao DB

Adicionar no FINAL do database.js. Isso garante que edições do admin sincronizem:

```javascript
(function mergeCMS() {
    const CMS_KEY = 'NOME_DO_PROJETO_cms_v1'; // mesmo key do editor.js

    try {
        const draft = JSON.parse(localStorage.getItem(CMS_KEY) || '{}');

        // 1. Aplica overrides de preço/título editados pelo admin
        if (draft.__db_overrides) {
            Object.entries(draft.__db_overrides).forEach(([pkgId, ov]) => {
                if (DB[pkgId]) Object.assign(DB[pkgId], ov);
            });
        }

        // 2. Adiciona pacotes novos criados pelo admin
        if (draft.__new_packages) {
            Object.entries(draft.__new_packages).forEach(([id, pkg]) => {
                if (!pkg.category) pkg.category = 'nacional';
                DB[id] = pkg;
            });
        }

        // 3. Aplica overrides publicados no servidor
        const srv = window.__SRV_CMS; // exposto pelo editor.js
        if (srv) {
            if (srv.__db_overrides) {
                Object.entries(srv.__db_overrides).forEach(([pkgId, ov]) => {
                    if (DB[pkgId]) Object.assign(DB[pkgId], ov);
                });
            }
            if (srv.__new_packages) {
                Object.entries(srv.__new_packages).forEach(([id, pkg]) => {
                    DB[id] = pkg;
                });
            }
        }
    } catch (_) {}
})();
```

## Regras importantes

- `price` e `priceCartao` — **só números e vírgula**: `"2.486,13"` ✅ — nunca `"R$ 2.486,13"` ❌
- `images[0]` é sempre a foto do card na home
- `id` do pacote — letras minúsculas, números e `_` — sem espaços, sem acentos
- Carregar database.js **antes** de index.html e pacote.html renderizarem
