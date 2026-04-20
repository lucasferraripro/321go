# Guia: Sincronização de Preços entre Home e Página do Pacote

> Criado em: 20/04/2026  
> Aplica-se a: 321 GO!, Me Guia Viagens, e qualquer projeto com estrutura similar

---

## O Problema (o que estava acontecendo)

O site tem **duas páginas que mostram dados do mesmo pacote**:

| Página | Como renderiza |
|--------|---------------|
| `index.html` (home) | Lê `DB[pkgId].priceCartao`, `DB[pkgId].parcelas` etc. e usa `data-eid="pix-gramado"` |
| `pacote.html?id=gramado` | Lê `DB[pkgId].price`, `DB[pkgId].parcelas` etc. e usa `data-eid="gramado-pkg-price"` |

Quando o admin editava o preço na **página do pacote**, salvava com a chave `gramado-pkg-price`.  
Quando editava na **home**, salvava com a chave `pix-gramado`.  

**São duas chaves diferentes para o mesmo dado → nunca sincronizavam.**

---

## A Solução Implementada

### Nova seção no CMS: `__db_overrides`

```json
{
  "__db_overrides": {
    "gramado": {
      "price": "2.550,00",
      "priceCartao": "2.550,00",
      "parcelas": "10x de R$ 255,00 sem juros",
      "title": "Gramado + Noite Gaúcha"
    },
    "curitiba": {
      "price": "1.794,00",
      "priceCartao": "1.882,50"
    }
  }
}
```

**Como funciona:**
1. Admin edita qualquer campo em qualquer página
2. O `editor.js` detecta automaticamente se é um campo do DB (preço, título, parcelas, etc.)
3. Salva em `__db_overrides[pkgId][campo]` **além** da chave normal
4. Ao carregar qualquer página, o `database.js` aplica os overrides ao `DB` **antes** de renderizar
5. Resultado: home e pacote.html sempre leem do mesmo `DB` → sempre sincronizados

---

## Campos que sincronizam automaticamente

| Campo editado em qualquer página | Sincroniza para |
|----------------------------------|-----------------|
| Preço PIX | `DB[pkgId].price` |
| Preço Cartão | `DB[pkgId].priceCartao` |
| Parcelas | `DB[pkgId].parcelas` |
| Título | `DB[pkgId].title` |
| Subtítulo | `DB[pkgId].subtitle` |
| Badge (ex: 🔥 Oferta) | `DB[pkgId].badge` |
| Descrição | `DB[pkgId].desc` |
| Localização | `DB[pkgId].location` |

---

## Como replicar em outros projetos

### Passo 1 — `editor.js`: atualizar o método `store()`

Adicionar a lógica de detecção de padrão antes de salvar:

```javascript
store(key, val) {
    // Detecta "gramado-pkg-price" → salva em __db_overrides.gramado.price
    const DB_FIELDS = {
        'pkg-price': 'price', 'pkg-price-cartao': 'priceCartao',
        'pkg-parcelas': 'parcelas', 'pkg-title': 'title',
        'pkg-subtitle': 'subtitle', 'pkg-badge': 'badge', 'pkg-desc': 'desc',
    };
    const HOME_FIELDS = {
        'pix': 'priceCartao', 'parcel': 'parcelas',
        'titulo': 'title', 'dest': 'location', 'badge': 'badge',
    };

    // Padrão pacote.html: "gramado-pkg-price"
    const pkgMatch = key.match(/^([a-z0-9_]+)-pkg-(.+)$/);
    if (pkgMatch) {
        const [, pkgId, field] = pkgMatch;
        const dbField = DB_FIELDS['pkg-' + field];
        if (dbField && typeof DB !== 'undefined' && DB[pkgId]) {
            const overrides = this.cms.__db_overrides || {};
            if (!overrides[pkgId]) overrides[pkgId] = {};
            const rawText = val.html != null
                ? val.html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g,' ').trim()
                : (val.text || '');
            if (rawText) overrides[pkgId][dbField] = rawText;
            this.cms.__db_overrides = overrides;
            Object.assign(DB[pkgId], overrides[pkgId]);
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
            const rawText = val.html != null
                ? val.html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g,' ').trim()
                : (val.text || '');
            if (rawText) overrides[pkgId][dbField] = rawText;
            this.cms.__db_overrides = overrides;
            Object.assign(DB[pkgId], overrides[pkgId]);
        }
    }

    this.cms[key] = val;
    localStorage.setItem(CMS_KEY, JSON.stringify(this.cms));
    this.markDirty();
},
```

### Passo 2 — `editor.js`: atualizar `applyContent()`

Adicionar antes do loop `querySelectorAll('[data-eid]')`:

```javascript
// Aplica __db_overrides ao DB antes de qualquer render
if (cms.__db_overrides && typeof DB !== 'undefined') {
    Object.entries(cms.__db_overrides).forEach(([pkgId, overrides]) => {
        if (DB[pkgId]) Object.assign(DB[pkgId], overrides);
    });
}
```

### Passo 3 — `database.js` (ou onde o DB é definido): aplicar overrides no boot

No final do arquivo, dentro da função `mergeCMS()`:

```javascript
// Aplica __db_overrides do localStorage (admin) e do servidor (visitantes)
const draft = JSON.parse(localStorage.getItem('SEU_CMS_KEY') || '{}');
if (draft.__db_overrides) {
    Object.entries(draft.__db_overrides).forEach(([pkgId, ov]) => {
        if (DB[pkgId]) Object.assign(DB[pkgId], ov);
    });
}
const srv = window.__SEU_SRV_CMS;
if (srv && srv.__db_overrides) {
    Object.entries(srv.__db_overrides).forEach(([pkgId, ov]) => {
        if (DB[pkgId]) Object.assign(DB[pkgId], ov);
    });
}
```

### Passo 4 — `index.html`: aplicar overrides do servidor antes de renderizar cards

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

## Regra de ouro para evitar esse erro

> **Nunca salve dados do pacote em duas chaves diferentes.**  
> Sempre use `__db_overrides[pkgId][campo]` como fonte única de verdade para campos do DB.  
> O `data-eid` é apenas para localizar o elemento na tela — não é a fonte dos dados.

---

## Checklist para novos projetos

- [ ] O DB dos pacotes está centralizado em um único arquivo (`database.js` ou similar)?
- [ ] O `editor.js` tem a lógica de `__db_overrides` no método `store()`?
- [ ] O `applyContent()` aplica `__db_overrides` ao DB antes do render?
- [ ] O `database.js` aplica overrides do localStorage E do servidor no boot?
- [ ] A home aplica overrides do servidor antes de renderizar os cards?
- [ ] Os `data-eid` dos campos de preço seguem o padrão `pix-{pkgId}` na home e `{pkgId}-pkg-price` na página do pacote?
