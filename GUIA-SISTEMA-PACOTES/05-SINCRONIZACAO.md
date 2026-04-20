# PARTE 5 — Sincronização Home ↔ Página do Pacote

## O problema que NÃO pode acontecer

Home mostra: **R$ 2.550,00**  
Página do pacote mostra: **R$ 255,00**  
→ Dois valores diferentes para o mesmo pacote. ❌

## Por que acontece

A home salva edições com a chave `pix-gramado`.  
A página do pacote salva com a chave `gramado-pkg-price`.  
São chaves diferentes → nunca sincronizam.

## A solução: `__db_overrides`

Qualquer edição de preço/título em qualquer página vai para:
```json
{
  "__db_overrides": {
    "gramado": {
      "price": "2.550,00",
      "priceCartao": "2.550,00",
      "parcelas": "10x de R$ 255,00 sem juros"
    }
  }
}
```
Ambas as páginas leem do mesmo `DB.gramado` após os overrides serem aplicados.

## Implementação no editor.js — método store()

```javascript
store(key, val) {
    // Mapeamento: campo do CMS → campo do DB
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

    // Extrai valor limpo — "No cartão: <strong>R$ 2.550,00</strong>" → "2.550,00"
    function extractValue(html, dbField) {
        if (!html) return '';
        const plain = html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();
        if (dbField === 'priceCartao' || dbField === 'price') {
            const m = plain.match(/R\$\s*([\d.,]+)/);
            return m ? m[1] : plain;
        }
        return plain;
    }

    // Detecta padrão da PÁGINA DO PACOTE: "gramado-pkg-price"
    const pkgMatch = key.match(/^([a-z0-9_]+)-pkg-(.+)$/);
    if (pkgMatch) {
        const [, pkgId, field] = pkgMatch;
        const dbField = DB_FIELDS['pkg-' + field];
        if (dbField && typeof DB !== 'undefined' && DB[pkgId]) {
            const overrides = this.cms.__db_overrides || {};
            if (!overrides[pkgId]) overrides[pkgId] = {};
            const rawVal = val.html != null
                ? extractValue(val.html, dbField)
                : (val.text || '');
            if (rawVal) overrides[pkgId][dbField] = rawVal;
            this.cms.__db_overrides = overrides;
            Object.assign(DB[pkgId], overrides[pkgId]); // atualiza em memória
        }
    }

    // Detecta padrão da HOME: "pix-gramado"
    const homeMatch = key.match(/^(pix|parcel|titulo|dest|badge)-([a-z0-9_]+)$/);
    if (homeMatch) {
        const [, field, pkgId] = homeMatch;
        const dbField = HOME_FIELDS[field];
        if (dbField && typeof DB !== 'undefined' && DB[pkgId]) {
            const overrides = this.cms.__db_overrides || {};
            if (!overrides[pkgId]) overrides[pkgId] = {};
            const rawVal = val.html != null
                ? extractValue(val.html, dbField)
                : (val.text || '');
            if (rawVal) overrides[pkgId][dbField] = rawVal;
            this.cms.__db_overrides = overrides;
            Object.assign(DB[pkgId], overrides[pkgId]);
        }
    }

    // Salva normalmente também
    this.cms[key] = val;
    localStorage.setItem(CMS_KEY, JSON.stringify(this.cms));
    this.markDirty();
},
```

## Implementação no editor.js — applyContent()

```javascript
function applyContent(cms) {
    if (!cms || !Object.keys(cms).length) return;

    // CRÍTICO: aplica __db_overrides ao DB ANTES de qualquer render
    if (cms.__db_overrides && typeof DB !== 'undefined') {
        Object.entries(cms.__db_overrides).forEach(([pkgId, overrides]) => {
            if (DB[pkgId]) Object.assign(DB[pkgId], overrides);
        });
    }

    // Cores globais
    if (cms.colors) {
        Object.entries(cms.colors).forEach(([k, v]) => {
            document.documentElement.style.setProperty(k, v);
        });
    }

    // WhatsApp
    if (cms.whatsapp) {
        document.querySelectorAll('a[href*="wa.me/"]').forEach(a => {
            a.href = a.href.replace(/wa\.me\/\d+/, 'wa.me/' + cms.whatsapp);
        });
    }

    // Elementos com data-eid
    document.querySelectorAll('[data-eid]').forEach(el => {
        const d = cms[el.dataset.eid];
        if (!d) return;
        if (d.html  != null) el.innerHTML = d.html;
        if (d.text  != null) el.textContent = d.text;
        if (d.src   != null && el.tagName === 'IMG') el.src = d.src;
        if (d.href  != null) el.setAttribute('href', d.href);
        if (d.style) Object.assign(el.style, d.style);
    });
}
```

## Fluxo completo de sincronização

```
1. Admin edita preço na HOME (clica em "No cartão: R$ 2.550,00")
   → editor.js detecta data-eid="pix-gramado"
   → store() detecta padrão "pix-{pkgId}" → pkgId = "gramado"
   → salva __db_overrides.gramado.priceCartao = "2.550,00"
   → salva pix-gramado = { html: "No cartão: <strong>R$ 2.550,00</strong>" }

2. Admin clica Publicar
   → content.json no GitHub recebe __db_overrides + pix-gramado

3. Visitante abre index.html
   → database.js mergeCMS() aplica __db_overrides ao DB
   → DB.gramado.priceCartao = "2.550,00"
   → card renderiza com valor correto ✅

4. Visitante clica "Ver detalhes" → pacote.html?id=gramado
   → boot async: fetch /api/content → recebe __db_overrides
   → Object.assign(DB.gramado, { priceCartao: "2.550,00" })
   → renderPacote lê DB.gramado.priceCartao → "2.550,00" ✅

RESULTADO: home e pacote.html sempre mostram o mesmo valor ✅
```

## Checklist de sincronização

- [ ] `database.js` tem `mergeCMS()` que aplica `__db_overrides`
- [ ] `editor.js` `store()` tem detecção de padrão e `extractValue()`
- [ ] `editor.js` `applyContent()` aplica `__db_overrides` ao DB antes do loop
- [ ] `pacote.html` boot é `async/await` e busca CMS antes de renderizar
- [ ] `renderPacote(id, cms)` recebe CMS e usa `cmsText()` com prioridade
- [ ] `window.__SRV_CMS` é exposto sempre (não só quando tem `__new_packages`)
- [ ] Testar: editar na home → publicar → abrir pacote → mesmo valor ✅
- [ ] Testar: editar no pacote → publicar → ver na home → mesmo valor ✅
