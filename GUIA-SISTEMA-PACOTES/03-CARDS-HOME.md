# PARTE 3 — Cards na Home (index.html)

## O que o card mostra (ver print)

```
┌─────────────────────────────┐
│  [FOTO DO PACOTE]      [✕]  │  ← botão remover (só no admin)
│                             │
│  CIDADE · ESTADO            │  ← location
│  Título do Pacote           │  ← title
│  ✓ Item incluso 1           │  ← incluso[0..4]
│  ✓ Item incluso 2           │
│  📅 Datas · X pessoas       │  ← dates
│                             │
│  No cartão: R$ X.XXX,XX     │  ← priceCartao
│  ou 10x de R$ XXX,XX        │  ← parcelas
│                             │
│  [Ver detalhes completos →] │  ← link para pacote.html?id=ID
└─────────────────────────────┘
```

## HTML do card (gerado dinamicamente)

```javascript
function buildCard(id, p) {
    // Foto: usa THUMB map se existir, senão images[0]
    const thumb = (typeof THUMB !== 'undefined' && THUMB[id])
        ? THUMB[id]
        : (p.images && p.images[0]) || 'imagens/default.jpg';

    const badgeCls = p.badge.includes('💎') ? 'card-badge--premium'
                   : p.badge.includes('⭐') ? 'card-badge--popular'
                   : 'card-badge--hot';

    const incItems = (p.incluso || []).slice(0, 5)
        .map(i => `<li>${i}</li>`).join('');

    const article = document.createElement('article');
    article.className = 'card';
    article.id = 'card-' + id;  // ← ID obrigatório para remoção pelo admin

    // CRÍTICO: em modo editor NÃO navega — deixa o editor capturar o clique
    article.addEventListener('click', function(e) {
        if (document.body.classList.contains('go-on')) return;
        location.href = 'pacote.html?id=' + id;
    });
    article.style.cursor = 'pointer';

    article.innerHTML = `
        <div class="card-img-wrap">
            <img src="${thumb}" alt="${p.title}" class="card-img" loading="lazy"
                 data-eid="img-${id}" data-elabel="Foto – ${p.title}" />
            <div class="card-badge ${badgeCls}"
                 data-eid="badge-${id}" data-elabel="Badge – ${p.title}">
                ${p.badge}
            </div>
        </div>
        <div class="card-body">
            <div class="card-dest"
                 data-eid="dest-${id}" data-elabel="Destino – ${p.title}">
                ${p.location}
            </div>
            <h3 class="card-title"
                data-eid="titulo-${id}" data-elabel="Título – ${p.title}">
                ${p.title}
            </h3>
            <ul class="card-includes"
                data-eid="incluso-${id}" data-elabel="Inclusos – ${p.title}">
                ${incItems}
            </ul>
            <div class="card-dates"
                 data-eid="data-${id}" data-elabel="Datas – ${p.title}">
                ${p.dates || ''}
            </div>
            <div class="card-price-block">
                <div class="card-pix"
                     data-eid="pix-${id}" data-elabel="Preço Cartão – ${p.title}">
                    No cartão: <strong>R$ ${p.priceCartao}</strong>
                </div>
                <div class="card-parcel"
                     data-eid="parcel-${id}" data-elabel="Parcela – ${p.title}">
                    ${p.parcelas}
                </div>
            </div>
            <a href="pacote.html?id=${id}" class="btn btn-card">
                Ver detalhes completos →
            </a>
        </div>`;

    return article;
}
```

## Padrão de data-eid nos cards

| Campo | data-eid | Exemplo |
|-------|----------|---------|
| Foto | `img-{id}` | `img-gramado` |
| Badge | `badge-{id}` | `badge-gramado` |
| Destino | `dest-{id}` | `dest-gramado` |
| Título | `titulo-{id}` | `titulo-gramado` |
| Inclusos | `incluso-{id}` | `incluso-gramado` |
| Datas | `data-{id}` | `data-gramado` |
| Preço cartão | `pix-{id}` | `pix-gramado` |
| Parcelas | `parcel-{id}` | `parcel-gramado` |

## Renderizar todos os cards

```javascript
function renderCat(cat) {
    const grid = document.getElementById('cards-grid');
    grid.innerHTML = '';

    const cms = JSON.parse(localStorage.getItem('PROJETO_cms_v1') || '{}');

    // Aplica __db_overrides do servidor (visitantes sem localStorage)
    const srvCms = window.__SRV_CMS || {};
    if (srvCms.__db_overrides) {
        Object.entries(srvCms.__db_overrides).forEach(([pkgId, ov]) => {
            if (DB[pkgId]) Object.assign(DB[pkgId], ov);
        });
    }

    // Pega lista de cards removidos
    const removed = Array.isArray(cms.__removed_cards) ? cms.__removed_cards : [];

    Object.entries(DB).forEach(([id, p]) => {
        if ((p.category || 'nacional') !== cat) return;
        if (removed.includes('card-' + id)) return;

        const card = buildCard(id, p);
        grid.appendChild(card);

        // Aplica overrides do CMS (edições do admin)
        ['pix','parcel','dest','titulo','badge','data','incluso','img'].forEach(field => {
            const eid = field + '-' + id;
            const el = card.querySelector(`[data-eid="${eid}"]`);
            if (!el || !cms[eid]) return;
            if (field === 'img' && cms[eid].src) el.src = cms[eid].src;
            else if (cms[eid].html !== undefined) el.innerHTML = cms[eid].html;
            if (cms[eid].style) Object.assign(el.style, cms[eid].style);
        });
    });
}
```

## CSS mínimo dos cards

```css
.cards-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
}
@media (max-width: 768px) {
    .cards-grid { grid-template-columns: 1fr; }
}

.card {
    background: #fff;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 3px 14px rgba(0,0,0,.07);
    transition: transform .3s, box-shadow .3s;
    position: relative; /* necessário para botão ✕ do admin */
}
.card:hover { transform: translateY(-6px); box-shadow: 0 14px 36px rgba(0,0,0,.12); }

.card-img-wrap { position: relative; height: 220px; overflow: hidden; }
.card-img { width: 100%; height: 100%; object-fit: cover; transition: transform .5s; }
.card:hover .card-img { transform: scale(1.06); }

.card-badge {
    position: absolute; top: 12px; left: 12px;
    padding: 4px 12px; border-radius: 50px;
    font-size: 11px; font-weight: 700; color: #fff;
}
.card-badge--hot     { background: #E05220; }
.card-badge--popular { background: #F59E0B; }
.card-badge--premium { background: #7C3AED; }

.card-body { padding: 18px; }
.card-dest { font-size: 11px; font-weight: 700; color: #E05220;
             text-transform: uppercase; letter-spacing: .08em; margin-bottom: 6px; }
.card-title { font-size: 1rem; font-weight: 700; margin-bottom: 10px; }
.card-includes { list-style: none; font-size: 12px; color: #6B7280;
                 margin-bottom: 10px; display: flex; flex-direction: column; gap: 4px; }
.card-dates { font-size: 11px; color: #9CA3AF; margin-bottom: 12px; }
.card-price-block { background: #F9FAFB; border-radius: 10px;
                    padding: 12px 14px; margin-bottom: 14px; }
.card-pix { font-size: 13px; color: #374151; }
.card-pix strong { color: #111827; font-size: 15px; }
.card-parcel { font-size: 12px; color: #6B7280; margin-top: 3px; }
.btn-card { display: block; text-align: center; padding: 12px;
            background: #E05220; color: #fff; border-radius: 50px;
            font-weight: 700; font-size: 14px; transition: background .2s; }
.btn-card:hover { background: #c04418; }
```
