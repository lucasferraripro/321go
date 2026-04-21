# 321 GO! — Histórico Completo de Desenvolvimento
**Projeto:** Site 321 GO! Agência de Viagens  
**Cliente:** Patrícia e Tatiana  
**Site:** https://321go-psi.vercel.app  
**Repositório:** https://github.com/lucasferraripro/321go  
**Período:** 18–20/04/2026  

---

## 🗂️ ESTRUTURA DO PROJETO

```
/
├── index.html              → Home do site
├── pacote.html             → Página de detalhe de cada pacote (?id=NOME)
├── editor.js               → CMS visual completo (toda lógica do editor admin)
├── style.css               → Estilos da home
├── content.json            → Conteúdo publicado (salvo via API no Vercel)
├── main.js                 → JS auxiliar da home
├── admin/login.html        → Página de login do painel admin
├── api/
│   ├── auth.js             → Autenticação admin
│   ├── content.js          → GET /api/content
│   ├── publish.js          → POST /api/publish
│   └── upload.js           → POST /api/upload
├── imagens/                → Imagens dos pacotes
├── js/database.js          → Banco de dados dos pacotes (DB)
├── vercel.json             → Configuração do Vercel
└── 321go/                  → Pasta de documentação
    ├── HISTORICO_COMPLETO.md
    ├── DEMANDAS_CLIENTE.md
    ├── SESSAO_DESENVOLVIMENTO.md
    └── STATUS_FINAL.md
```

---

## 🔑 COMO FUNCIONA O SISTEMA

### Login Admin
- URL: `/admin/login.html`
- Token salvo em `localStorage` com chave `321go_auth`
- Expiração configurada no login

### Modo Editor
- Ativar: `index.html?editor=1` ou `pacote.html?id=X&editor=1`
- Barra laranja/escura aparece no topo com botões de ação
- Clicar em qualquer elemento editável abre painel lateral

### Rascunho e Publicação
- Edições salvas em `localStorage` com chave `321go_cms_v1`
- Botão 🚀 Publicar → envia `POST /api/publish` → salva em `content.json` no Vercel
- `applyContent(cms)` em `editor.js` aplica o conteúdo nos elementos com `data-eid`

### Pacotes
- Banco de dados em `js/database.js` (objeto `DB` e `THUMB`)
- Cada pacote tem: `title, subtitle, location, duration, price, priceCartao, parcelas, flag, badge, images[], desc, incluso[], nao_incluso[], roteiro[], category`
- Página de detalhe: `pacote.html?id=NOME_DO_PACOTE`

---

## 📋 TUDO QUE FOI IMPLEMENTADO — PASSO A PASSO

---

### PASSO 1 — Ícones editáveis nos itens "O que está incluso" (pacote.html)

**Problema:** Os itens da lista "incluso" eram texto fixo, não editáveis pelo admin.

**Solução implementada:**
- Cada `<li>` da lista recebe `data-eid`, `data-elabel` e classe `go-incluso`
- No modo editor, clicar num item abre painel com dois campos: Emoji e Texto
- Salva com chave `{id}-incluso-{idx}` no CMS

**Código em `pacote.html`:**
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

**Código em `editor.js`:**
```javascript
pInclusoItem(el) {
    // Separa emoji do texto
    const full = el.textContent.trim();
    const spaceIdx = full.indexOf(' ');
    const origEmoji = spaceIdx > -1 ? full.slice(0, spaceIdx) : '';
    const origText  = spaceIdx > -1 ? full.slice(spaceIdx + 1) : full;
    // Abre painel com campos de emoji e texto
    // Salva via this.store(eid, { text: newText })
}
```

**Status:** ✅ Funcionando

---

### PASSO 2 — Botão ➕ Adicionar Novo Pacote na barra do editor

**Problema:** Não havia como criar novos pacotes pelo painel admin.

**Solução implementada:**
- Botão "➕ Pacote" adicionado na barra do editor
- Abre formulário completo com todos os campos
- Campos: ID, Título, Subtítulo, Localização, Duração, Preço PIX, Preço Cartão, Parcelas, Flag, Badge, **Categoria** (Nacional/Internacional), Imagem 1, Imagem 2, Imagem 3, Descrição, Incluso (um por linha), Não incluso, Roteiro (Título | Descrição)
- Pacote salvo em `cms.__new_packages[id]`
- Card aparece na home automaticamente após criar
- Página `pacote.html?id=SEU_ID` carrega o pacote

**Como usar:**
1. Entrar no modo editor
2. Clicar no botão ➕ na barra laranja
3. Preencher todos os campos
4. Clicar "✓ Criar Pacote"
5. Clicar 🚀 Publicar para tornar permanente

**Status:** ✅ Funcionando (card aparece na home, página do pacote carrega)

**Pendente:** Após publicar, visitantes sem localStorage precisam do fetch da API para ver o pacote — funciona mas pode ter delay.

---

### PASSO 3 — Botão ✕ Remover Cards da Home

**Problema:** Não havia como remover pacotes da home pelo painel admin.

**Solução implementada:**
- Botão ✕ vermelho aparece no canto superior direito de cada card no modo editor
- Clicando abre painel de confirmação com aviso
- Card some com animação
- ID salvo em `cms.__removed_cards[]`
- `applyContent` remove os cards pelo ID ao carregar
- Cards de pacotes novos também removem de `__new_packages`

**Código em `editor.js`:**
```javascript
injectRemoveButtons() {
    document.querySelectorAll('article.card[id]').forEach(article => {
        // Injeta botão ✕ vermelho
    });
}

confirmRemoveCard(article) {
    // Painel de confirmação
    // Salva em __removed_cards
    // Se card-new-X, também remove de __new_packages
}
```

**Status:** ✅ Funcionando

---

### PASSO 4 — Campo Categoria (Nacional/Internacional) no formulário

**Problema:** Todos os pacotes criados iam para o mesmo lugar, sem separação.

**Solução implementada:**
- Campo `<select>` no formulário com opções: 🇧🇷 Nacional / 🌍 Internacional
- Salva `category: 'nacional'` ou `category: 'internacional'` no objeto do pacote
- As abas já existem na home — leem o campo `category` para filtrar

**Status:** ✅ Campo existe no formulário

**Pendente:** Pacotes existentes no `js/database.js` precisam ter `category` adicionado manualmente.

---

### PASSO 5 — Remoção da Seção Copa 2026 (fundo escuro)

**Problema:** A seção Copa 2026 com fundo escuro tinha problemas de sincronização de preços e a cliente preferiu remover.

**O que foi removido:**
- Seção `<section class="copa-section" id="copa2026">` completa do `index.html`
- Link "Copa 2026 🏆" do menu desktop do `index.html`
- Link "Copa 2026 🏆" do menu desktop e mobile do `pacote.html`
- Coluna "Copa 2026" do footer do `index.html` (virou "Internacionais")
- Coluna "Copa 2026" do footer do `pacote.html` (virou "Internacionais")
- Stat "Copa 2026 – EUA/CA/MX" no hero (virou "Nacionais e Internacionais")
- Subtítulo hero que mencionava Copa 2026

**Observação:** Os pacotes Copa 2026 ainda existem no banco de dados (`copa_mexico`, `copa_miami`, `copa_ny`, `copa_cancun`, `copa_final`) e podem ser acessados via `pacote.html?id=copa_mexico` etc. Apenas a seção visual foi removida.

**Status:** ✅ Removida completamente

---

### PASSO 6 — Correção de Encoding UTF-8 Corrompido

**Problema:** O arquivo `pacote.html` estava com encoding corrompido. Todos os caracteres especiais do português apareciam como símbolos estranhos:
- `incríveis` → `incr├¡veis`
- `Patrícia` → `Patr├¡cia`
- `Não incluso` → `N├úo incluso`
- `Início` → `In├¡cio`
- `Agência` → `Ag├¬ncia`
- `©` → `┬®`
- `…` → `ÔÇª`
- `—` → `ÔÇö`

**Causa:** O arquivo foi salvo em encoding diferente de UTF-8 em algum momento durante a edição.

**Solução:** Script PowerShell para substituir todos os caracteres corrompidos:
```powershell
$content = Get-Content -Path "pacote.html" -Raw -Encoding UTF8
$fixed = $content -replace '├¡','í' -replace '├í','á' # ... etc
Set-Content -Path "pacote.html" -Value $fixed -Encoding UTF8
```

**Status:** ✅ Corrigido — zero caracteres corrompidos

---

### PASSO 7 — Correção de Comentários CSS Corrompidos

**Problema:** Comentários CSS no `pacote.html` tinham `ÔöÇ` em vez de `─`:
```css
/* ÔöÇ SIDEBAR ÔöÇ */  →  /* ─ SIDEBAR ─ */
```

**Status:** ✅ Corrigido

---

### PASSO 8 — Abas Nacional / Internacional na Home

**O que existe:**
- Dois botões de aba: "🇧🇷 Nacional" e "🌍 Internacional"
- Filtram os cards pelo campo `category` do pacote
- Renderização dinâmica via JavaScript

**Código em `index.html`:**
```html
<div class="pkg-tabs" id="pkg-tabs">
    <button class="pkg-tab active" data-cat="nacional">🇧🇷 Nacional</button>
    <button class="pkg-tab" data-cat="internacional">🌍 Internacional</button>
</div>
```

**Status:** ✅ Funcionando — mas pacotes existentes precisam ter `category` definido no `js/database.js`

---

## 🔴 PENDÊNCIAS PARA PRÓXIMA SESSÃO

### 1. Adicionar `category` nos pacotes existentes do database.js
Todos os pacotes em `js/database.js` precisam ter o campo `category` adicionado:
```javascript
balneario: {
    category: 'nacional',  // ← adicionar
    title: 'Balneário Camboriú...',
    ...
}
```
- Nacionais: `balneario`, `maceio`, `curitiba`, `gramado`, `porto`
- Internacionais: `bariloche`, `copa_mexico`, `copa_miami`, `copa_ny`, `copa_cancun`, `copa_final`

### 2. Corrigir imagens erradas nos pacotes
Identificados no `pacote.html` (DB):
- **Gramado** usa `imagens/bariloche.png` ❌ (foto de Bariloche)
- **Gramado** usa `imagens/curitiba_trem.png` ❌ (foto de Curitiba)
- **Bariloche** usa `imagens/bariloche_montanhas_alt.png` ⚠️ (arquivo pode não existir)

### 3. Como adicionar imagem ao criar pacote (instruir cliente)
- Colar URL da imagem nos campos "Imagem 1, 2, 3" do formulário
- Para pegar URL: Google Imagens → botão direito → "Copiar endereço da imagem"
- Upload direto: só funciona no site publicado (não local)

### 4. Página "Clientes" — decidir destino
- Aparece no painel de navegação do editor
- Não existe no site publicado
- Perguntar à cliente: quer página de depoimentos ou remove?

### 5. Menu editável pelo painel
- Cliente quer poder editar itens do menu
- Adicionar `data-eid` nos links do nav

---

## 📊 CHECKLIST FINAL

| Item | Status |
|------|--------|
| Ícones editáveis nos itens incluso | ✅ |
| Botão ➕ adicionar pacote | ✅ |
| Formulário com 3 campos de imagem | ✅ |
| Campo Categoria no formulário | ✅ |
| Botão ✕ remover cards | ✅ |
| Seção Copa 2026 removida | ✅ |
| Menu sem "Copa 2026" (index + pacote) | ✅ |
| Encoding UTF-8 corrigido | ✅ |
| Subtítulo hero atualizado | ✅ |
| Stats hero atualizados | ✅ |
| Footer atualizado | ✅ |
| Deploy no Vercel | ✅ |
| Documentação salva | ✅ |
| `category` nos pacotes existentes | ❌ Pendente |
| Imagens erradas corrigidas | ❌ Pendente |
| Página "Clientes" | ❌ Pendente |
| Menu editável | ❌ Pendente |

---

## 🔗 LINKS IMPORTANTES

| Recurso | URL |
|---------|-----|
| Site publicado | https://321go-psi.vercel.app |
| Modo editor | https://321go-psi.vercel.app/index.html?editor=1 |
| Login admin | https://321go-psi.vercel.app/admin/login.html |
| Repositório GitHub | https://github.com/lucasferraripro/321go |
| Vercel Dashboard | https://vercel.com/lucasferraris-projects-65d9de34/321go |

---

## 📝 COMMITS DESTA SESSÃO (ordem cronológica)

```
e87432a  feat: ícones editáveis incluso, botão adicionar pacote, remover cards home
7efd318  fix: novo pacote carrega corretamente - merge DB antes do render e fallback via API
740a414  fix: novo pacote carrega do localStorage e API, card aparece na home após publicar
b4af9c1  fix: excluir card novo remove de __new_packages, formulário com 3 campos de imagem
c57c3bc  feat: remove seção Copa 2026 da home, mantém só seção light de pacotes
eea8840  docs: registro completo da sessão de desenvolvimento
0ab0a34  docs: demandas organizadas da cliente
918dfd4  fix: corrige encoding UTF-8 corrompido em todo o pacote.html
747dcd1  fix: remove Copa 2026 do menu pacote.html, corrige stat hero, salva STATUS_FINAL
7c5f280  fix: remove todas referências Copa 2026, corrige comentários CSS, subtítulo hero
```

---

## 💬 CONTEXTO DA CLIENTE

- Prefere estilo **light** (fundo branco) — não dark
- Vai criar pacotes pelo botão ➕ e depois pede para organizar em nacionais/internacionais
- Quer separação clara: Pacotes Nacionais | Pacotes Internacionais
- Identificou imagem errada pelo nome do arquivo JPEG
- Não sabe ainda como adicionar imagens ao criar pacote
- Quer menu editável pelo painel
