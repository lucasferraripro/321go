# 321 GO! — Registro de Sessão de Desenvolvimento
**Data:** 18/04/2026  
**Projeto:** Site 321 GO! Agência de Viagens  
**Repositório:** https://github.com/lucasferraripro/321go  
**Site publicado:** https://321go-psi.vercel.app  

---

## 📁 Estrutura do Projeto

```
/
├── index.html          → Home do site (cards de pacotes nacionais + Copa 2026)
├── pacote.html         → Página de detalhe de cada pacote (?id=NOME)
├── editor.js           → CMS visual do painel admin (toda a lógica do editor)
├── style.css           → Estilos da home
├── content.json        → Conteúdo publicado (salvo via API no Vercel)
├── main.js             → JS da home
├── admin/login.html    → Página de login do painel admin
├── api/
│   ├── auth.js         → Autenticação admin
│   ├── content.js      → GET /api/content → retorna content.json
│   ├── publish.js      → POST /api/publish → salva content.json
│   └── upload.js       → POST /api/upload → upload de imagens
├── imagens/            → Imagens dos pacotes
└── vercel.json         → Configuração do Vercel
```

---

## 🔑 Como funciona o CMS

- Login em `/admin/login.html` → salva token em `localStorage` com chave `321go_auth`
- Para entrar no modo editor: `index.html?editor=1` ou `pacote.html?id=X&editor=1`
- Rascunhos salvos em `localStorage` com chave `321go_cms_v1`
- Publicar → envia `POST /api/publish` com o conteúdo → salva em `content.json` no Vercel
- `applyContent(cms)` em `editor.js` aplica o conteúdo do CMS nos elementos com `data-eid`

---

## ✅ O QUE FOI IMPLEMENTADO NESTA SESSÃO

### 1. 🏷️ Ícones editáveis nos itens do pacote (pacote.html)
**Status: FUNCIONANDO ✅**

- Cada `<li>` da lista "O que está incluso" em `pacote.html` recebe `data-eid`, `data-elabel` e classe `go-incluso`
- No modo editor, clicar num item abre painel com dois campos: **Emoji/Ícone** e **Texto**
- Salva com chave `{id}-incluso-{idx}` no CMS
- `applyContent` aplica via `d.text`

**Código relevante em `editor.js`:**
```javascript
pInclusoItem(el) { ... }  // método que abre o painel de edição
```

**Código relevante em `pacote.html`:**
```javascript
pkg.incluso.forEach((item, idx) => {
    const li = document.createElement('li');
    li.dataset.eid    = id + '-incluso-' + idx;
    li.dataset.elabel = 'Incluso ' + (idx + 1);
    li.className = 'go-incluso';
    li.textContent = item;
    inclEl.appendChild(li);
});
```

---

### 2. ❌ Remover cards da home (index.html)
**Status: FUNCIONANDO ✅**

- Botão ✕ vermelho aparece no canto superior direito de cada card no modo editor
- Clicando abre painel de confirmação
- Salva ID do card em `cms.__removed_cards` (array)
- `applyContent` remove os cards pelo ID
- Cards de pacotes novos (`card-new-PKGID`) também são removidos de `__new_packages` ao excluir

**Código relevante em `editor.js`:**
```javascript
injectRemoveButtons()    // injeta botão ✕ em article.card e article.copa-card
confirmRemoveCard(article) // painel de confirmação + lógica de remoção
```

---

### 3. ➕ Adicionar novo pacote
**Status: PARCIALMENTE FUNCIONANDO ⚠️**

**O que funciona:**
- Botão "➕ Pacote" aparece na barra do editor
- Formulário abre com todos os campos
- Pacote é salvo em `cms.__new_packages[id]`
- Card aparece na home após publicar (via `applyContent`)
- Página `pacote.html?id=SEU_ID` carrega o pacote

**O que NÃO está funcionando (PENDENTE):**
- ❌ Após publicar (🚀 Publicar), o pacote novo não aparece para visitantes sem rascunho no localStorage
- ❌ O formulário mostra apenas 1 campo de imagem visível (os campos 2 e 3 foram adicionados no código mas pode haver problema de scroll/visibilidade no painel)
- ❌ As fotos não aparecem no carrossel da página do pacote novo após publicar

---

## 🔴 PROBLEMAS PENDENTES (não resolvidos)

### Problema A — Pacote novo não aparece após publicar para visitantes
**Descrição:**  
Quando o admin cria um pacote e clica em 🚀 Publicar, o `content.json` é atualizado com `__new_packages`. Mas quando um visitante (sem rascunho no localStorage) acessa `pacote.html?id=novo_id`, o pacote não carrega.

**Causa raiz:**  
O script inline do `pacote.html` roda no `DOMContentLoaded` e tenta mesclar `__new_packages` do localStorage. Para visitantes, o localStorage está vazio. O fallback via `fetch('/api/content')` foi implementado mas pode não estar funcionando corretamente porque:
1. O `editor.js` tem `defer` — roda depois do script inline
2. O `renderPacote(id)` é chamado antes do fetch completar em alguns casos

**Tentativas feitas:**
- Mover `mergeNewPackages` para fora do `DOMContentLoaded` (execução imediata)
- Adicionar `fetch('/api/content')` como fallback quando `DB[id]` não existe
- Expor `window.__321GO_SRV_CMS` para compartilhar dados entre scripts
- Adicionar `applyContent` para mesclar `__new_packages` no `DB` global

**Código atual em `pacote.html` (início do script inline):**
```javascript
document.addEventListener('DOMContentLoaded', () => {
    const id = new URLSearchParams(location.search).get('id') || 'balneario';

    if (!DB[id]) {
        // Tenta localStorage primeiro
        try {
            const draft = JSON.parse(localStorage.getItem('321go_cms_v1') || '{}');
            if (draft.__new_packages && draft.__new_packages[id]) {
                Object.assign(DB, draft.__new_packages);
            }
        } catch (_) {}

        // Se ainda não encontrou, busca do servidor
        if (!DB[id]) {
            fetch('/api/content?_=' + Date.now())
                .then(r => r.ok ? r.json() : {})
                .then(srv => {
                    if (srv && srv.__new_packages) Object.assign(DB, srv.__new_packages);
                    renderPacote(id);
                })
                .catch(() => renderPacote(id));
            return;
        }
    }
    renderPacote(id);
});
```

**O que tentar:**  
- Fazer o `pacote.html` sempre buscar `/api/content` primeiro (antes de tentar o DB local), e só depois renderizar
- Ou: ao publicar, além de salvar em `content.json`, fazer um segundo request que atualiza o `DB` hardcoded no `pacote.html` (mais complexo)
- Ou: criar uma rota `/api/package?id=X` que retorna os dados do pacote diretamente

---

### Problema B — Formulário de adicionar pacote: campos de imagem não aparecem / só 1 opção
**Descrição:**  
O formulário tem 3 campos de imagem (Imagem 1, 2 e 3) mas o usuário reporta que só aparece 1 opção e as fotos não aparecem no carrossel.

**Causa provável:**  
1. O painel `.go-panel` tem `max-height: calc(100vh - 130px)` com `overflow-y: auto` — os campos extras podem estar fora da área visível (precisa rolar)
2. As URLs de imagem são salvas corretamente no array `images[]` mas o carrossel do `pacote.html` pode não estar lendo corretamente para pacotes novos

**Código atual dos campos de imagem no formulário:**
```javascript
<div class="go-f"><label>Imagem 1 — Principal (URL)</label>
    <input type="url" id="gp-img" placeholder="https://site.com/foto1.jpg">
</div>
<div class="go-f"><label>Imagem 2 (URL) — opcional</label>
    <input type="url" id="gp-img2" placeholder="https://site.com/foto2.jpg">
</div>
<div class="go-f"><label>Imagem 3 (URL) — opcional</label>
    <input type="url" id="gp-img3" placeholder="https://site.com/foto3.jpg">
</div>
```

**O que tentar:**
- Verificar se o painel está com scroll funcionando (testar rolar o painel até o final)
- Adicionar um botão "Pré-visualizar imagem" ao lado de cada campo para confirmar que a URL está correta
- Verificar se o array `images` está sendo salvo corretamente no `__new_packages` (inspecionar `localStorage` no DevTools)

---

### Problema C — 2 tipos de pacotes na home
**Descrição:**  
A home tem dois tipos de cards:
1. **Pacotes nacionais** — seção `#pacotes`, cards com classe `article.card`
2. **Copa 2026** — seção `#copa2026`, cards com classe `article.copa-card`

Quando um pacote novo é criado, ele só aparece na seção de pacotes nacionais (`.cards-grid`). Não há opção de criar um pacote Copa 2026.

**O que tentar:**
- Adicionar campo "Tipo de pacote" no formulário: `[ ] Pacote Nacional` ou `[ ] Copa 2026`
- Se Copa 2026, injetar na `.copa-grid` com o HTML correto de `article.copa-card`

---

## 📋 COMMITS DESTA SESSÃO

```
b275e9f fix: excluir card novo remove de __new_packages, formulario com 3 campos de imagem
0584180 (commit do Vercel/remoto)
740a414 fix: novo pacote carrega do localStorage e API, card aparece na home apos publicar
7efd318 fix: novo pacote carrega corretamente - merge DB antes do render e fallback via API
e87432a feat: icones editaveis incluso, botao adicionar pacote, remover cards home
b48d62d fix: corrige contaminação de preços entre pacotes no editor admin
```

---

## 🛠️ ARQUIVOS MODIFICADOS NESTA SESSÃO

### `editor.js` — principais adições:
- `pInclusoItem(el)` — editar emoji + texto de item incluso
- `injectRemoveButtons()` — injeta botão ✕ nos cards
- `confirmRemoveCard(article)` — confirmação de remoção + lógica de `__new_packages`
- `pAddPacote()` — formulário completo de criação de pacote
- `applyContent()` — adicionado suporte a `d.text`, `__removed_cards`, `__new_packages` (injeção de cards e merge no DB)
- `buildBar()` — adicionado botão "➕ Pacote"
- `dispatch()` — adicionado case para `.go-incluso`
- `loadAndApply()` — expõe `window.__321GO_SRV_CMS`

### `pacote.html` — principais adições:
- `mergeNewPackages()` — executa imediatamente após definição do DB
- `renderPacote(id)` — função extraída do DOMContentLoaded para permitir chamada assíncrona
- Fetch fallback para `/api/content` quando pacote não existe no DB
- Itens incluso com `data-eid`, `data-elabel` e classe `go-incluso`

---

## 💡 SUGESTÃO DE ABORDAGEM PARA RESOLVER OS PENDENTES

A solução mais limpa para o **Problema A** seria:

```javascript
// No início do script do pacote.html, SEMPRE buscar o servidor primeiro:
fetch('/api/content?_=' + Date.now())
    .then(r => r.ok ? r.json() : {})
    .then(srv => {
        // Mesclar pacotes do servidor no DB
        if (srv.__new_packages) Object.assign(DB, srv.__new_packages);
        // Mesclar rascunho local por cima
        try {
            const draft = JSON.parse(localStorage.getItem('321go_cms_v1') || '{}');
            if (draft.__new_packages) Object.assign(DB, draft.__new_packages);
        } catch(_) {}
        // Só então renderizar
        renderPacote(new URLSearchParams(location.search).get('id') || 'balneario');
    })
    .catch(() => {
        renderPacote(new URLSearchParams(location.search).get('id') || 'balneario');
    });
```

Isso garante que o servidor é sempre consultado antes de renderizar, independente do localStorage.

---

## 🔗 Links úteis

- **Site:** https://321go-psi.vercel.app
- **Editor:** https://321go-psi.vercel.app/index.html?editor=1
- **Login admin:** https://321go-psi.vercel.app/admin/login.html
- **Repositório:** https://github.com/lucasferraripro/321go
- **Vercel dashboard:** https://vercel.com/lucasferraris-projects-65d9de34/321go
