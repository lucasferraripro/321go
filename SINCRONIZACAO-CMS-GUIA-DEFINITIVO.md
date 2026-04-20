# GUIA DEFINITIVO — Sincronização de Dados entre Home e Página do Pacote

> Criado em: 20/04/2026  
> Baseado em: sessão real de debugging no projeto 321 GO!  
> Aplica-se a: todos os projetos com estrutura home + pacote.html

---

## ⚠️ O PROBLEMA QUE CUSTOU MUITO TEMPO

**Sintoma:** Admin edita o preço do Gramado na home → R$ 255,00.  
Abre `pacote.html?id=gramado` → ainda mostra R$ 2.550,00.  
São dois valores diferentes para o mesmo pacote.

**Por que acontecia:**

| Página | Campo editado | Chave salva no CMS |
|--------|--------------|-------------------|
| `index.html` (home) | Preço cartão | `pix-gramado` |
| `pacote.html?id=gramado` | Preço PIX | `gramado-pkg-price` |

São **duas chaves diferentes** para o mesmo dado.  
O `pacote.html` usava `getElementById('price-num').textContent = pkg.price` — lendo direto do DB, **ignorando completamente** o CMS.

---

## ✅ A SOLUÇÃO DEFINITIVA

### Conceito: `__db_overrides` — Fonte Única de Verdade

Qualquer edição de preço/título/parcela em **qualquer página** é salva em:

```json
{
  "__db_overrides": {
    "gramado": {
      "price": "2.550,00",
      "priceCartao": "2.550,00",
      "parcelas": "10x de R$ 255,00 sem juros",
      "title": "Gramado + Noite Gaúcha"
    }
  }
}
```

Ambas as páginas leem do mesmo `DB[pkgId]` após os overrides serem aplicados.

---

## 📋 IMPLEMENTAÇÃO PASSO A PASSO

### PASSO 1 — `editor.js`: método `store()` com detecção automática

Quando o admin salva qualquer campo, o `store()` detecta se é um campo do DB e salva em `__db_overrides`:

```javascript
store(key, val) {
    const DB_FIELDS = {
        'pkg-price':        'price',
        'pkg-price-cartao': 'priceCartao',
        'pkg-parcelas':     'parcelas',
        'pkg-title':        'title',
        'pkg-subtitle':     'subtitle',
        'pkg-badge':        'badge',
        'pkg-desc':         'desc',
    };
    const HOME_FIELDS = {
        'pix':    'priceCartao',
        'parcel': 'parcelas',
        'titulo': 'title',
        'dest':   'location',
        'badge':  'badge',
    };

    // Extrai valor limpo do HTML
    // "No cartão: <strong>R$ 2.550,50</strong>" → "2.550,50"
    function extractValue(html, dbField) {
        if (!html) return '';
        const plain = html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g,' ').trim();
        if (dbField === 'priceCartao' || dbField === 'price') {
            const m = plain.match(/R\$\s*([\d.,]+)/);
            return m ? m[1] : plain;
        }
        return plain;
    }

    // Padrão pacote.html: "gramado-pkg-price"
    const pkgMatch = key.match(/^([a-z0-9_]+)-pkg-(.+)$/);
    if (pkgMatch) {
        const [, pkgId, field] = pkgMatch;
        const dbField = DB_FIELDS['pkg-' + field];
        if (dbField && typeof DB !== 'undefined' && DB[pkgId]) {
            const overrides = this.cms.__db_overrides || {};
            if (!overrides[pkgId]) overrides[pkgId] = {};
            const rawVal = val.html != null ? extractValue(val.html, dbField) : (val.text || '');
            if (rawVal) overrides[pkgId][dbField] = rawVal;
            this.cms.__db_overrides = overrides;
            Object.assign(DB[pkgId], overrides[pkgId]); // atualiza em memória
        }
    }

    // Padrão home: "pix-gramado"
    const homeMatch = key.match(/^(pix|parcel|titulo|dest|badge)-([a-z0-9_]+)$/);
    if (homeMatch) {
        const [, field, pkgId] = homeMatch;
        const dbField = HOME_FIELDS[field];
        if (dbField && typeof DB !== 'undefined' && DB[pkgId]) {
            const overrides = this.cms.__db_overrides || {};
            if (!overrides[pkgId]) overrides[pkgId] = {};
            const rawVal = val.html != null ? extractValue(val.html, dbField) : (val.text || '');
            if (rawVal) overrides[pkgId][dbField] = rawVal;
            this.cms.__db_overrides = overrides;
            Object.assign(DB[pkgId], overrides[pkgId]);
        }
    }

    this.cms[key] = val;
    localStorage.setItem(CMS_KEY, JSON.stringify(this.cms));
    this.markDirty();
},
```

---

### PASSO 2 — `editor.js`: `applyContent()` aplica overrides ao DB

Adicionar **antes** do loop `querySelectorAll('[data-eid]')`:

```javascript
function applyContent(cms) {
    if (!cms || typeof cms !== 'object' || !Object.keys(cms).length) return;

    // ── CRÍTICO: aplica __db_overrides ao DB antes de qualquer render ──
    if (cms.__db_overrides && typeof DB !== 'undefined') {
        Object.entries(cms.__db_overrides).forEach(([pkgId, overrides]) => {
            if (DB[pkgId]) Object.assign(DB[pkgId], overrides);
        });
    }

    // ... resto do applyContent (colors, whatsapp, data-eid, etc.)
}
```

---

### PASSO 3 — `database.js`: aplica overrides no boot

No final do arquivo, dentro da função `mergeCMS()`:

```javascript
(function mergeCMS() {
    try {
        const draft = JSON.parse(localStorage.getItem('321go_cms_v1') || '{}');

        // 1. CRÍTICO: aplica __db_overrides primeiro
        if (draft.__db_overrides) {
            Object.entries(draft.__db_overrides).forEach(([pkgId, ov]) => {
                if (DB[pkgId]) Object.assign(DB[pkgId], ov);
            });
        }

        // 2. Mescla pacotes novos
        if (draft.__new_packages) {
            Object.entries(draft.__new_packages).forEach(([id, pkg]) => {
                if (!pkg.category) pkg.category = 'nacional';
                DB[id] = pkg;
            });
        }

        // 3. Aplica do servidor também
        const srv = window.__321GO_SRV_CMS;
        if (srv) {
            if (srv.__db_overrides) {
                Object.entries(srv.__db_overrides).forEach(([pkgId, ov]) => {
                    if (DB[pkgId]) Object.assign(DB[pkgId], ov);
                });
            }
            if (srv.__new_packages) {
                Object.entries(srv.__new_packages).forEach(([id, pkg]) => {
                    if (!pkg.category) pkg.category = 'nacional';
                    DB[id] = pkg;
                });
            }
        }
    } catch (_) {}
})();
```

---

### PASSO 4 — `pacote.html`: boot async que busca CMS ANTES de renderizar

**CRÍTICO:** O `pacote.html` deve buscar o CMS e aplicar overrides **antes** de chamar `renderPacote`. Se renderizar primeiro e aplicar depois, o valor errado já foi escrito no DOM.

```javascript
document.addEventListener('DOMContentLoaded', async () => {
    const id = new URLSearchParams(location.search).get('id') || 'balneario';

    // 1. Busca CMS do servidor
    let srvCms = {};
    try {
        const r = await fetch('/api/content?_=' + Date.now());
        if (r.ok) srvCms = await r.json();
    } catch (_) {}

    // 2. Mescla com rascunho local
    let localCms = {};
    try { localCms = JSON.parse(localStorage.getItem('321go_cms_v1') || '{}'); } catch (_) {}

    const cms = Object.assign({}, srvCms, localCms);
    window.__321GO_SRV_CMS = srvCms;

    // 3. Aplica __db_overrides ao DB — ANTES de renderizar
    if (cms.__db_overrides) {
        Object.entries(cms.__db_overrides).forEach(([pkgId, ov]) => {
            if (DB[pkgId]) Object.assign(DB[pkgId], ov);
        });
    }

    // 4. Mescla pacotes novos
    if (cms.__new_packages) {
        Object.entries(cms.__new_packages).forEach(([pkgId, pkg]) => {
            DB[pkgId] = pkg;
        });
    }

    // 5. Renderiza com DB já atualizado, passando o CMS
    renderPacote(id, cms);
    applyPacoteCmsOverrides(id, cms);
});
```

---

### PASSO 5 — `renderPacote()`: usa CMS com prioridade sobre DB

```javascript
function renderPacote(id, cms) {
    cms = cms || {};
    const pkg = DB[id] || DB.balneario;

    // Helper: lê do CMS se existir, senão usa DB
    function cmsText(eid) {
        const d = cms[eid];
        if (!d) return null;
        if (d.html != null) return d.html.replace(/<[^>]+>/g,'').replace(/&nbsp;/g,' ').trim();
        if (d.text != null) return d.text.trim();
        return null;
    }

    // Valores com prioridade: CMS > DB
    const price       = cmsText(id+'-pkg-price')       || pkg.price;
    const priceCartao = cmsText(id+'-pkg-price-cartao') || pkg.priceCartao;
    const parcelas    = cmsText(id+'-pkg-parcelas')     || pkg.parcelas;
    const title       = cmsText(id+'-pkg-title')        || pkg.title;
    // ... etc

    document.getElementById('price-num').textContent = 'R$ ' + price;
    document.getElementById('price-parc').innerHTML  = 'ou <strong>' + parcelas + '</strong>';
    
    // Normaliza priceCartao (pode vir como "2.550,00" ou "No cartão: R$ 2.550,00")
    const numOnly = priceCartao.replace(/^No cart[aã]o:\s*/i,'').replace(/^R\$\s*/,'').replace(/<[^>]+>/g,'').trim();
    document.getElementById('price-pix-info').innerHTML = 'No cartão: <strong>R$ ' + numOnly + '</strong>';
}
```

---

### PASSO 6 — `index.html`: aplica overrides do servidor antes de renderizar cards

```javascript
function renderCat(cat) {
    // Aplica __db_overrides do servidor (para visitantes sem localStorage)
    const srvCms = window.__321GO_SRV_CMS || {};
    if (srvCms.__db_overrides && typeof DB !== 'undefined') {
        Object.entries(srvCms.__db_overrides).forEach(([pkgId, ov]) => {
            if (DB[pkgId]) Object.assign(DB[pkgId], ov);
        });
    }
    // ... resto do render
}
```

---

## 🔑 REGRA DE OURO

> **Nunca escreva dados do pacote em duas chaves diferentes no CMS.**  
> Use `__db_overrides[pkgId][campo]` como fonte única de verdade.  
> O `data-eid` é só para localizar o elemento na tela — não é a fonte dos dados.

---

## 📊 FLUXO COMPLETO DE SINCRONIZAÇÃO

```
Admin edita preço na HOME (pix-gramado)
    ↓
store() detecta padrão "pix-{pkgId}"
    ↓
Salva em __db_overrides.gramado.priceCartao = "2.550,00"
    ↓
Publica → content.json no GitHub tem __db_overrides
    ↓
Visitante abre pacote.html?id=gramado
    ↓
Boot async: fetch /api/content → recebe __db_overrides
    ↓
Object.assign(DB.gramado, { priceCartao: "2.550,00" })
    ↓
renderPacote lê DB.gramado.priceCartao → "2.550,00" ✅
    ↓
Home também lê DB.gramado.priceCartao → "2.550,00" ✅
```

---

## ❌ O QUE NÃO FAZER (erros que cometemos)

1. **Não fazer:** `renderPacote()` sem parâmetro `cms` — renderiza com DB antigo e depois tenta sobrescrever
2. **Não fazer:** Expor `window.__SRV_CMS` só quando tem `__new_packages` — precisa expor sempre
3. **Não fazer:** `rawText` extraindo `"No cartão: R$ 2.550,00"` inteiro para o campo `priceCartao` — extrair só o número
4. **Não fazer:** Aplicar overrides depois do render — aplicar ANTES
5. **Não fazer:** Duas chaves para o mesmo dado (`pix-gramado` E `gramado-pkg-price`) sem sincronizá-las

---

## ✅ CHECKLIST PARA NOVOS PROJETOS

Antes de entregar qualquer site com home + página de pacote:

- [ ] `database.js` tem `mergeCMS()` que aplica `__db_overrides` no boot
- [ ] `editor.js` método `store()` tem detecção de padrão e salva em `__db_overrides`
- [ ] `editor.js` `applyContent()` aplica `__db_overrides` ao DB antes do loop `data-eid`
- [ ] `pacote.html` boot é `async` e faz `await fetch('/api/content')` antes de `renderPacote`
- [ ] `renderPacote(id, cms)` recebe o CMS e usa `cmsText()` com prioridade sobre DB
- [ ] `index.html` aplica `__db_overrides` do servidor antes de renderizar cards
- [ ] `window.__SRV_CMS` é exposto sempre (não só quando tem `__new_packages`)
- [ ] Testar: editar preço na home → publicar → abrir página do pacote → mesmo valor ✅
- [ ] Testar: editar preço na página do pacote → publicar → ver na home → mesmo valor ✅

---

## 📅 LINHA DO TEMPO — O QUE ACONTECEU NESSA SESSÃO

### Problema inicial
- Site 321go com valores errados nos cards da home (Curitiba R$ 304, Bariloche R$ 892)
- Causa: `database.js` com preços corretos nunca tinha sido publicado no GitHub

### Tentativa 1 — Corrigir content.json
- Corrigimos os valores no `content.json`
- Resultado: valores corretos na home, mas pacote.html ainda mostrava valores do DB antigo

### Tentativa 2 — `__db_overrides` no store()
- Adicionamos lógica no `store()` para salvar em `__db_overrides`
- Problema: `applyContent()` não aplicava ao DB, e `pacote.html` não lia os overrides

### Tentativa 3 — `applyContent()` aplica overrides
- Adicionamos aplicação de `__db_overrides` no `applyContent()`
- Problema: `pacote.html` renderizava ANTES do `editor.js` rodar, então os overrides chegavam tarde

### Tentativa 4 — `pacote.html` boot async
- Reescrevemos o boot do `pacote.html` para ser `async/await`
- Problema: `renderPacote` ainda usava `pkg.price` do DB direto, ignorando o CMS

### Solução final ✅
- `renderPacote(id, cms)` recebe o CMS como parâmetro
- Usa `cmsText()` que verifica o CMS primeiro, DB como fallback
- `extractValue()` normaliza o HTML para extrair só o número
- `priceCartao` normalizado para remover "No cartão: R$" antes de exibir
- **Resultado: sincronização total confirmada pelo cliente**

---

## 🔧 ARQUIVOS MODIFICADOS NESSA SESSÃO (321go)

| Arquivo | O que mudou |
|---------|-------------|
| `js/database.js` | `mergeCMS()` aplica `__db_overrides` do localStorage e servidor |
| `editor.js` | `store()` com detecção automática + `extractValue()` + `applyContent()` com overrides |
| `pacote.html` | Boot `async`, `renderPacote(id, cms)`, `cmsText()`, normalização de `priceCartao` |
| `index.html` | `renderCat()` aplica overrides do servidor antes de renderizar |
| `style.css` | Botão WA flutuante menor no modo editor (`body.go-on`) |
| `content.json` | Limpo: removidos pacotes teste, valores corretos para todos os pacotes |

---

*Documento criado após sessão de debugging — 20/04/2026*  
*Nunca mais cometer esses erros. Seguir o checklist acima em todo novo projeto.*
