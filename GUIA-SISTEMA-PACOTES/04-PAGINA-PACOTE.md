# PARTE 4 — Página de Detalhes do Pacote (pacote.html)

## Conceito

Um único arquivo `pacote.html` serve TODOS os pacotes.
A URL define qual pacote mostrar: `pacote.html?id=gramado`

## Boot — OBRIGATÓRIO ser async

```javascript
// CRÍTICO: async/await para buscar CMS ANTES de renderizar
document.addEventListener('DOMContentLoaded', async () => {

    const id = new URLSearchParams(location.search).get('id') || 'pacote_padrao';

    // 1. Busca CMS do servidor (sempre, não só para pacotes novos)
    let srvCms = {};
    try {
        const r = await fetch('/api/content?_=' + Date.now());
        if (r.ok) srvCms = await r.json();
    } catch (_) {}

    // 2. Mescla com rascunho local do admin
    let localCms = {};
    try {
        localCms = JSON.parse(localStorage.getItem('PROJETO_cms_v1') || '{}');
    } catch (_) {}

    // CMS final: servidor + local (local tem prioridade)
    const cms = Object.assign({}, srvCms, localCms);

    // Expõe para editor.js e database.js usarem
    window.__SRV_CMS = srvCms;

    // 3. Aplica __db_overrides ao DB ANTES de renderizar
    if (cms.__db_overrides) {
        Object.entries(cms.__db_overrides).forEach(([pkgId, ov]) => {
            if (DB[pkgId]) Object.assign(DB[pkgId], ov);
        });
    }

    // 4. Adiciona pacotes novos criados pelo admin
    if (cms.__new_packages) {
        Object.entries(cms.__new_packages).forEach(([pkgId, pkg]) => {
            DB[pkgId] = pkg;
        });
    }

    // 5. Renderiza com DB já atualizado
    renderPacote(id, cms);
    applyPacoteCmsOverrides(id, cms);
});
```

## renderPacote — usa CMS com prioridade

```javascript
function renderPacote(id, cms) {
    cms = cms || {};
    const pkg = DB[id];
    if (!pkg) { /* redirecionar para home ou mostrar erro */ return; }

    // Prefixar data-eid com ID do pacote
    // 'pkg-price' vira 'gramado-pkg-price' — evita conflito entre pacotes
    ['pkg-badge','pkg-title','pkg-subtitle','pkg-desc',
     'pkg-price','pkg-price-cartao','pkg-parcelas'].forEach(eid => {
        const el = document.querySelector('[data-eid="' + eid + '"]');
        if (el) el.dataset.eid = id + '-' + eid;
    });

    // Helper: lê do CMS se existir, senão usa DB
    function cmsText(eid) {
        const d = cms[eid];
        if (!d) return null;
        const raw = d.html != null ? d.html : (d.text || '');
        return raw.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();
    }

    // Valores com prioridade: CMS > DB
    const price       = cmsText(id + '-pkg-price')       || pkg.price;
    const priceCartao = cmsText(id + '-pkg-price-cartao') || pkg.priceCartao;
    const parcelas    = cmsText(id + '-pkg-parcelas')     || pkg.parcelas;
    const title       = cmsText(id + '-pkg-title')        || pkg.title;
    const subtitle    = cmsText(id + '-pkg-subtitle')     || pkg.subtitle;
    const badge       = cmsText(id + '-pkg-badge')        || pkg.badge;
    const desc        = cmsText(id + '-pkg-desc')         || pkg.desc;

    // Preenche elementos
    document.title = title + ' — Nome da Agência';
    document.getElementById('pkg-title').textContent    = title;
    document.getElementById('pkg-subtitle').textContent = subtitle;
    document.getElementById('pkg-badge').textContent    = badge;
    document.getElementById('pkg-desc').textContent     = desc;
    document.getElementById('meta-loc').textContent     = pkg.location;
    document.getElementById('meta-dur').textContent     = pkg.duration;

    // Preços — normaliza para remover "No cartão: R$" se vier do CMS antigo
    document.getElementById('price-num').textContent = 'R$ ' + price;
    document.getElementById('price-parc').innerHTML  = 'ou <strong>' + parcelas + '</strong>';

    const numCartao = priceCartao
        .replace(/^No cart[aã]o:\s*/i, '')
        .replace(/^R\$\s*/, '')
        .replace(/<[^>]+>/g, '')
        .trim();
    document.getElementById('price-pix-info').innerHTML =
        'No cartão: <strong>R$ ' + numCartao + '</strong>';

    // Carrossel de fotos
    const track    = document.getElementById('track');
    const dotsEl   = document.getElementById('car-dots');
    const thumbsEl = document.getElementById('thumbs');
    let cur = 0;

    pkg.images.forEach((src, i) => {
        const eid = id + '-pkg-img-' + i; // data-eid único por pacote e foto

        // Slide
        const slide = document.createElement('div');
        slide.className = 'carousel-slide';
        const img = document.createElement('img');
        img.src = src; img.alt = title + ' ' + (i + 1);
        img.loading = i === 0 ? 'eager' : 'lazy';
        img.dataset.eid   = eid;
        img.dataset.elabel = title + ' — Foto ' + (i + 1);
        slide.appendChild(img);
        track.appendChild(slide);

        // Miniatura — MESMO data-eid que o slide (admin troca os dois juntos)
        const th = document.createElement('div');
        th.className = 'thumb' + (i === 0 ? ' on' : '');
        th.onclick = () => goTo(i);
        const ti = document.createElement('img');
        ti.src = src; ti.alt = ''; ti.loading = 'lazy';
        ti.dataset.eid = eid; // mesmo eid = atualiza slide e miniatura juntos
        th.appendChild(ti);
        thumbsEl.appendChild(th);

        // Dot
        const dot = document.createElement('div');
        dot.className = 'car-dot' + (i === 0 ? ' on' : '');
        dot.onclick = () => goTo(i);
        dotsEl.appendChild(dot);
    });

    function goTo(idx) {
        cur = idx;
        track.style.transform = `translateX(-${idx * 100}%)`;
        document.querySelectorAll('.car-dot').forEach((d, i) => d.classList.toggle('on', i === idx));
        document.querySelectorAll('.thumb').forEach((t, i) => t.classList.toggle('on', i === idx));
    }
    window.carMove = (dir) => goTo((cur + dir + pkg.images.length) % pkg.images.length);

    // Lista de inclusos (editáveis pelo admin)
    const inclEl = document.getElementById('incluso-list');
    pkg.incluso.forEach((item, idx) => {
        const li = document.createElement('li');
        li.dataset.eid   = id + '-incluso-' + idx;
        li.dataset.elabel = 'Incluso ' + (idx + 1);
        li.className = 'go-incluso'; // classe para editor detectar
        li.textContent = item;
        inclEl.appendChild(li);
    });

    // Lista de não inclusos
    const nEl = document.getElementById('nao-incluso-list');
    (pkg.nao_incluso || []).forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `<i class="fa-solid fa-circle-xmark"></i> ${item}`;
        nEl.appendChild(li);
    });

    // Roteiro
    const rotEl = document.getElementById('roteiro-list');
    pkg.roteiro.forEach((r, i) => {
        const div = document.createElement('div');
        div.className = 'rot-item';
        div.innerHTML = `
            <div class="rot-day">
                <div class="rot-day-num">${i + 1}</div>
                <div class="rot-day-lbl">dia</div>
            </div>
            <div class="rot-body">
                <h4>${r.title}</h4>
                <p>${r.desc}</p>
            </div>`;
        rotEl.appendChild(div);
    });

    // Botão WhatsApp com mensagem pré-preenchida
    const waMsg = encodeURIComponent(
        `Olá! Tenho interesse no pacote *${title}*\n\n` +
        `📍 Destino: ${pkg.location}\n` +
        `🌙 Período: ${pkg.duration}\n` +
        `👥 Qtd de Pessoas: \n` +
        `📅 Data Pretendida: \n\n` +
        `Vim pelo site e aguardo retorno!`
    );
    document.getElementById('btn-wa').href = `https://wa.me/${SITE.whatsapp}?text=${waMsg}`;
}
```

## applyPacoteCmsOverrides — aplica overrides nos data-eid

```javascript
function applyPacoteCmsOverrides(id, cms) {
    try {
        if (!cms) {
            const local = JSON.parse(localStorage.getItem('PROJETO_cms_v1') || '{}');
            const srv   = window.__SRV_CMS || {};
            cms = Object.assign({}, srv, local);
        }
        document.querySelectorAll('[data-eid]').forEach(el => {
            const d = cms[el.dataset.eid];
            if (!d) return;
            if (d.html != null) el.innerHTML = d.html;
            if (d.text != null) el.textContent = d.text;
            if (d.src  != null && el.tagName === 'IMG') el.src = d.src;
            if (d.style) Object.assign(el.style, d.style);
        });
    } catch (_) {}
}
```

## HTML mínimo da página

```html
<!-- Header com breadcrumb -->
<nav class="breadcrumb">
    <a href="index.html">Início</a> › <span id="breadcrumb-title">Pacote</span>
</nav>

<!-- Hero mini -->
<div class="hero-mini">
    <span id="pkg-badge" data-eid="pkg-badge">🔥 Oferta</span>
    <h1 id="pkg-title" data-eid="pkg-title">Título</h1>
    <p id="pkg-subtitle" data-eid="pkg-subtitle">Subtítulo</p>
    <div class="meta-row">
        <span id="meta-loc">Local</span>
        <span id="meta-dur">Duração</span>
    </div>
</div>

<!-- Layout: conteúdo + sidebar -->
<div class="pkg-layout">
    <div class="pkg-main">
        <!-- Carrossel -->
        <div class="carousel">
            <div class="carousel-track" id="track"></div>
            <button onclick="carMove(-1)">‹</button>
            <button onclick="carMove(1)">›</button>
            <div id="car-dots"></div>
        </div>
        <div id="thumbs"></div>

        <!-- Descrição -->
        <div class="cblock">
            <p id="pkg-desc" data-eid="pkg-desc"></p>
        </div>

        <!-- Inclusos -->
        <div class="cblock">
            <ul id="incluso-list"></ul>
            <ul id="nao-incluso-list"></ul>
        </div>

        <!-- Roteiro -->
        <div class="cblock">
            <div id="roteiro-list"></div>
        </div>
    </div>

    <!-- Sidebar com preço e botão -->
    <aside class="sidebar">
        <div class="price-card">
            <p>A partir de (PIX):</p>
            <div id="price-num" data-eid="pkg-price">R$ —</div>
            <p id="price-pix-info" data-eid="pkg-price-cartao"></p>
            <p id="price-parc" data-eid="pkg-parcelas"></p>
            <div>
                <span id="sb-loc"></span>
                <span id="sb-dur"></span>
            </div>
            <a id="btn-wa" href="#" class="btn btn-wa">
                Reservar pelo WhatsApp
            </a>
        </div>
    </aside>
</div>
```

## Padrão de data-eid na página do pacote

| Campo | data-eid (antes do prefixo) | data-eid (após prefixo) |
|-------|----------------------------|------------------------|
| Título | `pkg-title` | `gramado-pkg-title` |
| Subtítulo | `pkg-subtitle` | `gramado-pkg-subtitle` |
| Badge | `pkg-badge` | `gramado-pkg-badge` |
| Descrição | `pkg-desc` | `gramado-pkg-desc` |
| Preço PIX | `pkg-price` | `gramado-pkg-price` |
| Preço Cartão | `pkg-price-cartao` | `gramado-pkg-price-cartao` |
| Parcelas | `pkg-parcelas` | `gramado-pkg-parcelas` |
| Foto 1 | — | `gramado-pkg-img-0` |
| Foto 2 | — | `gramado-pkg-img-1` |
| Incluso 1 | — | `gramado-incluso-0` |

> O prefixo é adicionado automaticamente pelo `renderPacote` para evitar conflito entre pacotes.
