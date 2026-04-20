# PARTE 6 — Painel Admin (editor.js)

## O que o admin consegue fazer

- ✏️ Editar qualquer texto (título, preço, parcelas, descrição, inclusos)
- 🖼️ Trocar fotos (upload do computador ou URL externa)
- 🔗 Editar links e botões
- 🎨 Mudar cores globais do site
- ➕ Adicionar novos pacotes
- 🗑️ Remover cards da home
- 🚀 Publicar tudo no ar em ~30 segundos

## Como ativar o modo editor

1. Acessar `/admin/login.html`
2. Digitar email e senha
3. Redireciona para `index.html?editor=1`
4. Barra escura aparece no topo com os botões

## data-eid — como marcar elementos editáveis

Todo elemento que o admin pode editar precisa de `data-eid` único:

```html
<!-- Texto simples -->
<h1 data-eid="hero-titulo" data-elabel="Título Principal">Texto aqui</h1>

<!-- Imagem -->
<img src="foto.jpg" data-eid="hero-foto" data-elabel="Foto do Hero">

<!-- Link/botão -->
<a href="https://wa.me/..." data-eid="btn-whatsapp" data-elabel="Botão WhatsApp">
    Falar no WhatsApp
</a>
```

**Regras do data-eid:**
- Único em todo o site
- Letras minúsculas, números e hífens
- Descritivo: `hero-titulo`, `sobre-foto`, `footer-email`
- Nos cards: sempre `{campo}-{pkgId}` — ex: `pix-gramado`, `titulo-gramado`
- Na página do pacote: sempre `{pkgId}-pkg-{campo}` — ex: `gramado-pkg-price`

## Botão de remoção nos cards

O editor injeta automaticamente um botão ✕ vermelho em cada card:

```javascript
injectRemoveButtons() {
    document.querySelectorAll('article.card[id]').forEach(card => {
        if (card.querySelector('.remove-btn')) return;
        const btn = document.createElement('button');
        btn.className = 'remove-btn';
        btn.innerHTML = '✕';
        btn.style.cssText = `
            position: absolute; top: 10px; right: 10px; z-index: 9999;
            width: 28px; height: 28px; border-radius: 50%;
            background: #DC2626; color: #fff; border: none;
            cursor: pointer; font-size: 14px; font-weight: 700;
        `;
        btn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.confirmRemoveCard(card);
        };
        card.style.position = 'relative';
        card.appendChild(btn);
    });
},

confirmRemoveCard(card) {
    if (!confirm('Remover este pacote da home?')) return;
    card.remove();
    const removed = this.cms.__removed_cards || [];
    if (!removed.includes(card.id)) removed.push(card.id);
    this.store('__removed_cards', removed);
    this.toast('Card removido. Publique para salvar.', 'ok');
},
```

## Adicionar novo pacote pelo admin

O formulário coleta todos os campos e salva em `__new_packages`:

```javascript
pAddPacote() {
    // ... formulário com campos: id, title, location, price, priceCartao,
    //     parcelas, flag, badge, images (3 URLs), desc, incluso, nao_incluso, roteiro

    // Ao confirmar:
    const novoPacote = {
        title, subtitle, location, duration,
        price, priceCartao, parcelas, flag, badge,
        images: [img1, img2, img3].filter(Boolean),
        desc, incluso, nao_incluso, roteiro,
        category: 'nacional' // padrão
    };

    const existing = this.cms.__new_packages || {};
    existing[id] = novoPacote;
    this.store('__new_packages', existing);

    // Injeta card imediatamente na home
    applyContent({ __new_packages: { [id]: novoPacote } });
    this.toast('Pacote criado! Publique para salvar.', 'ok');
},
```

## Publicar — fluxo completo

```javascript
async publish() {
    // 1. Mostra resumo do que será publicado
    // 2. Pede senha se não estiver salva
    // 3. POST /api/publish com { content: this.cms, secret }
    // 4. /api/publish faz commit do content.json no GitHub
    // 5. Vercel detecta commit → redeploy automático em ~30s
    // 6. Limpa localStorage, mostra "Publicado com sucesso!"
}
```

## Estrutura do content.json após publicação

```json
{
  "hero-titulo": { "html": "Novo título do hero" },
  "pix-gramado": { "html": "No cartão: <strong>R$ 2.800,00</strong>" },
  "img-gramado": { "src": "https://raw.githubusercontent.com/.../nova-foto.jpg" },
  "__db_overrides": {
    "gramado": {
      "priceCartao": "2.800,00",
      "price": "2.666,67"
    }
  },
  "__new_packages": {
    "cancun": { "title": "Cancún All Inclusive", "price": "5.990,00", ... }
  },
  "__removed_cards": ["card-balneario"],
  "colors": { "--primary": "#1B3A8C", "--accent": "#E8B84B" },
  "whatsapp": "5511999999999"
}
```

## Chaves de autenticação no localStorage

```javascript
// Salvar no login
localStorage.setItem('PROJETO_auth', JSON.stringify({
    email, ts: Date.now(),
    expires: Date.now() + (8 * 60 * 60 * 1000) // 8 horas
}));
localStorage.setItem('PROJETO_secret', senha);

// Verificar no editor.js
const auth    = JSON.parse(localStorage.getItem('PROJETO_auth') || 'null');
const isAdmin = auth && auth.expires > Date.now();
```

> Usar `localStorage` (não `sessionStorage`) para que a sessão persista ao navegar entre páginas.
