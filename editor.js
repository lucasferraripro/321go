/**
 * 321 GO! — EDITOR VISUAL CMS v2
 *
 * BUGS CORRIGIDOS vs v1:
 *  1. fetchContent() retorna {} em file:// sem lançar erro de rede
 *  2. Chaves sessionStorage unificadas (321go_auth / 321go_secret)
 *  3. Branch detectada via env — sem hardcoding de 'main'
 *  4. applyContent() tolerante a CMS vazio
 */
(function () {
    'use strict';

    /* ─── CHAVES (mesmo valor usado no login.html) ───────────── */
    const CMS_KEY     = '321go_cms_v1';
    const AUTH_KEY    = '321go_auth';       // DEVE ser igual ao login.html
    const SECRET_KEY  = '321go_secret';     // DEVE ser igual ao login.html
    const CONTENT_URL = '/api/content';

    /* ─── AUTH ─────────────────────────────────────────────────  */
    const auth     = JSON.parse(sessionStorage.getItem(AUTH_KEY) || 'null');
    const isAdmin  = auth && auth.expires > Date.now();
    const params   = new URLSearchParams(location.search);
    const editMode = isAdmin && (params.get('editor') === '1' || sessionStorage.getItem('editor_active') === '1');

    /* ─── APLICAR CONTEÚDO ──────────────────────────────────── */
    function applyContent(cms) {
        if (!cms || typeof cms !== 'object' || !Object.keys(cms).length) return;

        if (cms.colors && typeof cms.colors === 'object') {
            Object.entries(cms.colors).forEach(([k, v]) => {
                document.documentElement.style.setProperty(k, v);
            });
        }
        if (cms.whatsapp) {
            document.querySelectorAll('a[href*="wa.me/"]').forEach(a => {
                a.href = a.href.replace(/wa\.me\/\d+/, 'wa.me/' + cms.whatsapp);
            });
        }
        document.querySelectorAll('[data-eid]').forEach(el => {
            const d = cms[el.dataset.eid];
            if (!d) return;
            if (d.html  != null) el.innerHTML = d.html;
            if (d.src   != null && el.tagName === 'IMG') el.src = d.src;
            if (d.href  != null) el.setAttribute('href', d.href);
            if (d.target!= null) el.setAttribute('target', d.target);
            if (d.style && typeof d.style === 'object') Object.assign(el.style, d.style);
        });
    }

    /* ─── FETCH CONTENT ─────────────────────────────────────── */
    async function fetchContent() {
        // file:// não tem servidor — retorna {} sem tentar fetch
        if (location.protocol === 'file:') return {};
        try {
            const r = await fetch(CONTENT_URL + '?_=' + Date.now());
            if (!r.ok) return {};
            const data = await r.json();
            return (data && typeof data === 'object') ? data : {};
        } catch (_) { return {}; }
    }

    async function loadAndApply(srv) {
        let merged = (srv && typeof srv === 'object') ? { ...srv } : {};
        if (editMode) {
            try {
                const draft = JSON.parse(localStorage.getItem(CMS_KEY) || '{}');
                merged = { ...merged, ...draft };
            } catch (_) { /* localStorage corrompido, ignora */ }
        }
        applyContent(merged);
        return merged;
    }

    /* ─── CSS DO EDITOR ─────────────────────────────────────── */
    function injectCSS() {
        if (document.getElementById('go-cms-css')) return;
        const s = document.createElement('style');
        s.id = 'go-cms-css';
        s.textContent = `
        #go-bar{position:fixed;top:0;left:0;right:0;z-index:99999;height:54px;background:#0f1623;display:flex;align-items:center;gap:6px;padding:0 14px;box-shadow:0 2px 20px rgba(0,0,0,.6);font-family:'Poppins',-apple-system,sans-serif;font-size:13px;border-bottom:1px solid rgba(255,255,255,.08);}
        #go-bar *{box-sizing:border-box;}
        .go-brand{color:#fff;font-weight:800;display:flex;align-items:center;gap:8px;padding-right:14px;border-right:1px solid rgba(255,255,255,.12);white-space:nowrap;margin-right:4px;font-size:14px;letter-spacing:-.01em;}
        .go-brand .go-logo-text{color:#E05220;}
        .go-dot{width:8px;height:8px;border-radius:50%;background:#22C55E;flex-shrink:0;animation:gopulse 1.5s infinite;}
        @keyframes gopulse{0%,100%{opacity:1}50%{opacity:.3}}
        .go-hint{color:rgba(255,255,255,.5);font-size:12px;white-space:nowrap;}
        .go-btn{padding:7px 13px;border:none;border-radius:8px;background:transparent;color:rgba(255,255,255,.75);cursor:pointer;font-size:12px;font-weight:600;display:inline-flex;align-items:center;gap:5px;transition:all .15s;white-space:nowrap;outline:none;font-family:inherit;}
        .go-btn:hover{background:rgba(255,255,255,.1);color:#fff;}
        .go-btn.orange{background:#E05220;color:#fff;}
        .go-btn.orange:hover{background:#c04418;}
        .go-btn.green{background:#16A34A;color:#fff;}
        .go-btn.green:hover{background:#15803D;}
        .go-btn.red{color:rgba(255,255,255,.4);font-size:12px;}
        .go-btn.red:hover{color:#F87171;background:rgba(248,113,113,.1);}
        .go-sep{width:1px;height:28px;background:rgba(255,255,255,.1);margin:0 3px;flex-shrink:0;}
        .go-spacer{flex:1;}
        .go-last-pub{color:rgba(255,255,255,.3);font-size:11px;white-space:nowrap;}

        body.go-on{padding-top:54px!important;}
        body.go-on [data-eid]{cursor:pointer!important;position:relative;transition:outline .1s;}
        body.go-on [data-eid]:hover{outline:2px dashed #E05220!important;outline-offset:3px;}
        body.go-on [data-eid]:hover::after{content:attr(data-elabel);position:absolute;top:-26px;left:0;background:#E05220;color:#fff;font-size:10px;font-weight:700;padding:2px 8px;border-radius:4px;white-space:nowrap;z-index:99997;pointer-events:none;font-family:-apple-system,sans-serif;}
        body.go-on [data-eid].go-sel{outline:2px solid #22A8C9!important;outline-offset:3px;}

        .go-panel{position:fixed;top:64px;right:18px;width:320px;background:#fff;border-radius:16px;z-index:99998;box-shadow:0 20px 60px rgba(0,0,0,.25);font-family:'Poppins',-apple-system,sans-serif;overflow:hidden;}
        .go-ph{background:#0f1623;color:#fff;padding:13px 16px;display:flex;align-items:center;justify-content:space-between;cursor:move;user-select:none;border-bottom:2px solid #E05220;}
        .go-ph h3{font-size:13px;font-weight:700;margin:0;}
        .go-px{background:none;border:none;color:rgba(255,255,255,.55);font-size:18px;cursor:pointer;padding:0 2px;line-height:1;}
        .go-px:hover{color:#fff;}
        .go-pb{padding:16px;max-height:calc(100vh - 130px);overflow-y:auto;}
        .go-f{margin-bottom:13px;}
        .go-f label{display:block;font-size:11px;font-weight:700;color:#374151;margin-bottom:5px;text-transform:uppercase;letter-spacing:.06em;}
        .go-f input[type=text],.go-f input[type=url],.go-f input[type=password],.go-f textarea,.go-f select{width:100%;padding:8px 11px;border:1.5px solid #E5E7EB;border-radius:8px;font-size:13px;outline:none;font-family:inherit;resize:vertical;transition:border .15s;}
        .go-f input:focus,.go-f textarea:focus,.go-f select:focus{border-color:#E05220;}
        .go-rich{min-height:70px;padding:9px 11px;border:1.5px solid #E5E7EB;border-radius:8px;font-size:13px;outline:none;transition:border .15s;line-height:1.5;}
        .go-rich:focus{border-color:#E05220;}
        .go-fmts{display:flex;gap:5px;margin-top:6px;}
        .go-fmts button{padding:4px 11px;border:1.5px solid #E5E7EB;border-radius:6px;background:#fff;cursor:pointer;font-size:13px;font-weight:700;transition:background .1s;}
        .go-fmts button:hover{background:#F3F4F6;}
        .go-cr{display:flex;align-items:center;gap:10px;margin-bottom:9px;}
        .go-cr label{flex:1;font-size:12.5px;color:#374151;}
        .go-cr input[type=color]{width:40px;height:32px;padding:2px;border:1.5px solid #E5E7EB;border-radius:6px;cursor:pointer;}
        .go-prev{width:100%;height:110px;object-fit:cover;border-radius:9px;margin-bottom:10px;background:#F3F4F6;display:block;}
        .go-acts{display:flex;gap:8px;margin-top:14px;}
        .go-ok{flex:1;padding:9px;background:#E05220;color:#fff;border:none;border-radius:8px;font-weight:700;font-size:13px;cursor:pointer;transition:background .15s;font-family:inherit;}
        .go-ok:hover{background:#c04418;}
        .go-ko{padding:9px 14px;background:#F3F4F6;color:#374151;border:none;border-radius:8px;font-size:13px;cursor:pointer;font-family:inherit;}
        .go-ko:hover{background:#E5E7EB;}
        .go-hint-txt{font-size:11px;color:#9CA3AF;margin-top:4px;line-height:1.5;}
        .go-hr{border:none;border-top:1px solid #F3F4F6;margin:12px 0;}
        .go-g2{display:grid;grid-template-columns:1fr 1fr;gap:8px;}
        .go-info{font-size:12px;color:#6B7280;background:#F9FAFB;border-radius:8px;padding:10px;margin-bottom:12px;line-height:1.5;}

        .go-toast{position:fixed;bottom:28px;left:50%;transform:translateX(-50%) translateY(16px);background:#0f1623;color:#fff;padding:11px 22px;border-radius:50px;font-size:13px;font-weight:600;z-index:999999;opacity:0;transition:all .28s;white-space:nowrap;box-shadow:0 8px 24px rgba(0,0,0,.3);font-family:inherit;}
        .go-toast.show{opacity:1;transform:translateX(-50%) translateY(0);}
        .go-toast.ok{background:#16A34A;}
        .go-toast.err{background:#DC2626;}

        .go-pub-box{background:#F0FDF4;border:1px solid #BBF7D0;border-radius:10px;padding:14px;font-size:13px;color:#166534;line-height:1.6;}
        .go-pub-err{background:#FEF2F2;border:1px solid #FCA5A5;border-radius:10px;padding:14px;font-size:13px;color:#991B1B;line-height:1.6;}
        .go-spin{font-size:26px;animation:gospin 1s linear infinite;display:block;margin-bottom:8px;}
        @keyframes gospin{to{transform:rotate(360deg)}}
        .go-loading{text-align:center;padding:24px 16px;color:#6B7280;font-size:13px;}
        .go-dirty-dot{display:inline-block;width:8px;height:8px;border-radius:50%;background:#FCD34D;margin-right:4px;flex-shrink:0;}

        .go-local-warn{background:#FFF7ED;border:1px solid #FED7AA;border-radius:8px;padding:10px 12px;font-size:11px;color:#C2410C;margin-bottom:12px;line-height:1.5;}

        @media(max-width:600px){
            #go-bar{padding:0 8px;gap:2px;}
            .go-hint,.go-sep,.go-last-pub{display:none;}
            .go-brand{padding-right:8px;font-size:12px;}
            .go-btn{padding:7px 9px;font-size:13px;}
            .go-btn-lbl{display:none;}
            .go-panel{left:6px;right:6px;width:auto;top:60px;}
            .go-pb{max-height:none;padding:14px;}
            .go-ph{cursor:default;}
        }
        `;
        document.head.appendChild(s);
    }

    /* ─── EDITOR ─────────────────────────────────────────────── */
    const isLocal = location.protocol === 'file:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1';

    const ED = {
        cms: {},
        panel: null,

        async start(srv) {
            injectCSS();
            let draft = {};
            try { draft = JSON.parse(localStorage.getItem(CMS_KEY) || '{}'); } catch (_) {}
            this.cms = { ...(srv || {}), ...draft };

            document.body.classList.add('go-on');
            sessionStorage.setItem('editor_active', '1');
            this.buildBar();
            this.bindAll();
            if (Object.keys(draft).length > 0) this.markDirty();
        },

        buildBar() {
            if (document.getElementById('go-bar')) return;
            const bar = document.createElement('div');
            bar.id = 'go-bar';
            const lastPub = localStorage.getItem('321go_last_pub') || '';
            bar.innerHTML = `
            <div class="go-brand"><span class="go-logo-text">321 GO!</span><span class="go-dot"></span></div>
            <span class="go-hint">👆 Clique em qualquer elemento para editar</span>
            <div class="go-spacer"></div>
            ${lastPub ? `<span class="go-last-pub">Pub: ${lastPub}</span><div class="go-sep"></div>` : ''}
            <button class="go-btn orange" id="go-colors">🎨 <span class="go-btn-lbl">Cores</span></button>
            <div class="go-sep"></div>
            <button class="go-btn green" id="go-pub">🚀 <span class="go-btn-lbl">Publicar</span></button>
            <div class="go-sep"></div>
            <button class="go-btn" id="go-revert" title="Descartar rascunho">↩ <span class="go-btn-lbl">Reverter</span></button>
            <button class="go-btn red" id="go-exit">✕ <span class="go-btn-lbl">Sair</span></button>`;
            document.body.prepend(bar);
            document.getElementById('go-colors').onclick = () => this.pColors();
            document.getElementById('go-pub').onclick    = () => this.publish();
            document.getElementById('go-revert').onclick = () => this.revert();
            document.getElementById('go-exit').onclick   = () => this.exit();
        },

        bindAll() {
            document.querySelectorAll('[data-eid]').forEach(el => {
                if (el._goBound) return;
                el._goBound = true;
                el.addEventListener('click', e => {
                    e.preventDefault();
                    e.stopPropagation();
                    document.querySelectorAll('.go-sel').forEach(x => x.classList.remove('go-sel'));
                    el.classList.add('go-sel');
                    this.dispatch(el);
                });
            });
        },

        dispatch(el) {
            if (el.tagName === 'IMG')    this.pImage(el);
            else if (el.tagName === 'A') this.pLink(el);
            else                         this.pText(el);
        },

        /* ── TEXTO ── */
        pText(el) {
            const origHTML  = el.innerHTML;
            const origStyle = el.getAttribute('style') || '';
            const cs = getComputedStyle(el);
            let colorChanged = false, sizeChanged = false;
            const p = this.panel_('✏️ Editar Texto — ' + (el.dataset.elabel || ''));
            p.innerHTML += `<div class="go-pb">
                <div class="go-f"><label>Conteúdo</label>
                    <div class="go-rich" contenteditable="true" id="gor">${el.innerHTML}</div>
                    <div class="go-fmts">
                        <button onmousedown="event.preventDefault();document.execCommand('bold')"><b>N</b></button>
                        <button onmousedown="event.preventDefault();document.execCommand('italic')"><i>I</i></button>
                        <button onmousedown="event.preventDefault();document.execCommand('underline')"><u>S</u></button>
                    </div>
                </div>
                <div class="go-g2">
                    <div class="go-f"><label>Cor do texto</label><input type="color" id="gotc" value="${this.hex(cs.color)}"></div>
                    <div class="go-f"><label>Tamanho (px)</label><input type="text" id="gofs" value="${parseInt(cs.fontSize)||16}"></div>
                </div>
                <div class="go-acts">
                    <button class="go-ok" id="goa">✓ Aplicar</button>
                    <button class="go-ko" id="goc">Cancelar</button>
                </div>
            </div>`;
            const rich = p.querySelector('#gor');
            const tc   = p.querySelector('#gotc');
            const fs   = p.querySelector('#gofs');
            rich.oninput = () => el.innerHTML = rich.innerHTML;
            tc.oninput   = () => { colorChanged = true; el.style.color = tc.value; };
            fs.oninput   = () => { sizeChanged  = true; el.style.fontSize = fs.value + 'px'; };
            p.querySelector('#goa').onclick = () => {
                const styleOverride = {};
                if (colorChanged) styleOverride.color = tc.value;
                if (sizeChanged)  styleOverride.fontSize = fs.value + 'px';
                const entry = { html: el.innerHTML };
                if (Object.keys(styleOverride).length) entry.style = styleOverride;
                this.store(el.dataset.eid, entry);
                this.closePanel();
                this.toast('✓ Texto salvo no rascunho', 'ok');
            };
            p.querySelector('#goc').onclick = () => {
                el.innerHTML = origHTML;
                el.setAttribute('style', origStyle);
                this.closePanel();
            };
        },

        /* ── IMAGEM ── */
        pImage(el) {
            const origSrc  = el.src;
            const origAttr = el.getAttribute('src') || el.src;
            const p = this.panel_('🖼️ Trocar Imagem — ' + (el.dataset.elabel || ''));
            const localWarn = isLocal ? `<div class="go-local-warn">⚠️ <strong>Modo local:</strong> Upload de arquivos só funciona no site publicado (Vercel). Use uma URL de imagem abaixo.</div>` : '';
            p.innerHTML += `<div class="go-pb">
                ${localWarn}
                <img class="go-prev" id="goprev" src="${origSrc}" style="background:#F3F4F6;">
                <div class="go-f">
                    <label>Enviar do computador</label>
                    <button id="gobtn" style="width:100%;padding:10px;border:2px dashed #E5E7EB;border-radius:8px;background:#F9FAFB;cursor:pointer;font-size:13px;color:#374151;transition:border .15s;"${isLocal?' disabled title="Disponível apenas no site publicado"':''}>
                        📂 Escolher arquivo (JPG, PNG, WEBP)
                    </button>
                    <input type="file" id="gofile" accept="image/jpeg,image/png,image/webp,image/gif" style="display:none">
                    <div id="goupstatus" class="go-hint-txt" style="margin-top:6px;"></div>
                </div>
                <div class="go-f">
                    <label>Ou cole uma URL de imagem</label>
                    <input type="url" id="goiu" value="${origAttr}" placeholder="https://site.com/foto.jpg">
                    <p class="go-hint-txt">Cole qualquer URL de imagem da internet (JPG, PNG, WEBP)</p>
                </div>
                <div class="go-acts">
                    <button class="go-ok" id="goa">✓ Aplicar</button>
                    <button class="go-ko" id="goc">Cancelar</button>
                </div>
            </div>`;
            const ui     = p.querySelector('#goiu');
            const pv     = p.querySelector('#goprev');
            const btn    = p.querySelector('#gobtn');
            const file   = p.querySelector('#gofile');
            const status = p.querySelector('#goupstatus');
            let debounce;

            if (!isLocal) {
                btn.onclick = () => file.click();
                btn.onmouseenter = () => btn.style.borderColor = '#E05220';
                btn.onmouseleave = () => btn.style.borderColor = '#E5E7EB';

                file.onchange = async () => {
                    const f = file.files[0];
                    if (!f) return;
                    if (f.size > 3 * 1024 * 1024) {
                        status.textContent = '❌ Arquivo muito grande (máx 3MB). Comprima antes.';
                        status.style.color = '#DC2626';
                        return;
                    }
                    const reader = new FileReader();
                    reader.onload = async ev => {
                        const dataUrl = ev.target.result;
                        el.src = dataUrl;
                        pv.src = dataUrl;
                        btn.textContent = '⏳ Enviando…';
                        btn.disabled = true;
                        status.textContent = 'Enviando para o servidor…';
                        status.style.color = '#6B7280';
                        try {
                            const b64 = dataUrl.split(',')[1];
                            const secret = sessionStorage.getItem(SECRET_KEY) || '';
                            const res = await fetch('/api/upload', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ filename: f.name, base64: b64, secret })
                            });
                            const data = await res.json();
                            if (res.ok && data.url) {
                                document.querySelectorAll(`[data-eid="${el.dataset.eid}"]`).forEach(e => {
                                    if (e.tagName === 'IMG') e.src = data.url;
                                });
                                pv.src = data.url;
                                ui.value = data.url;
                                btn.textContent = '✅ Imagem enviada!';
                                status.textContent = 'Clique em ✓ Aplicar para salvar.';
                                status.style.color = '#16A34A';
                            } else {
                                throw new Error(data.error || 'Erro no upload');
                            }
                        } catch (err) {
                            el.src = origSrc;
                            pv.src = origSrc;
                            btn.textContent = '📂 Escolher arquivo';
                            btn.disabled = false;
                            status.textContent = '❌ ' + err.message;
                            status.style.color = '#DC2626';
                        }
                    };
                    reader.readAsDataURL(f);
                };
            }

            ui.oninput = () => {
                clearTimeout(debounce);
                debounce = setTimeout(() => {
                    const v = ui.value.trim();
                    if (v) { el.src = v; pv.src = v; }
                }, 500);
            };
            p.querySelector('#goa').onclick = () => {
                clearTimeout(debounce);
                const src = ui.value.trim() || origSrc;
                pv.src = src;
                document.querySelectorAll(`[data-eid="${el.dataset.eid}"]`).forEach(e => {
                    if (e.tagName === 'IMG') e.src = src;
                });
                this.store(el.dataset.eid, { src });
                this.closePanel();
                this.toast('✓ Imagem salva no rascunho', 'ok');
            };
            p.querySelector('#goc').onclick = () => {
                el.src = origSrc;
                this.closePanel();
            };
        },

        /* ── LINK ── */
        pLink(el) {
            const origHTML   = el.innerHTML;
            const origStyle  = el.getAttribute('style') || '';
            const origHref   = el.getAttribute('href') || '';
            const origTarget = el.getAttribute('target') || '_self';
            const cs = getComputedStyle(el);
            const p = this.panel_('🔗 Editar Botão/Link — ' + (el.dataset.elabel || ''));
            p.innerHTML += `<div class="go-pb">
                <div class="go-f"><label>Texto</label><input type="text" id="gobt" value="${el.textContent.trim()}"></div>
                <div class="go-f"><label>Link (URL)</label><input type="url" id="gobh" value="${origHref}" placeholder="https://wa.me/..."></div>
                <div class="go-f"><label>Abrir em</label>
                    <select id="gotgt">
                        <option value="_self" ${origTarget!=='_blank'?'selected':''}>Mesma aba</option>
                        <option value="_blank" ${origTarget==='_blank'?'selected':''}>Nova aba</option>
                    </select>
                </div>
                <div class="go-g2">
                    <div class="go-f"><label>Cor de fundo</label><input type="color" id="gobbg" value="${this.hex(cs.backgroundColor)}"></div>
                    <div class="go-f"><label>Cor do texto</label><input type="color" id="gobfg" value="${this.hex(cs.color)}"></div>
                </div>
                <div class="go-acts">
                    <button class="go-ok" id="goa">✓ Aplicar</button>
                    <button class="go-ko" id="goc">Cancelar</button>
                </div>
            </div>`;
            const bt  = p.querySelector('#gobt');
            const bh  = p.querySelector('#gobh');
            const tgt = p.querySelector('#gotgt');
            const bbg = p.querySelector('#gobbg');
            const bfg = p.querySelector('#gobfg');
            let bgChanged = false, fgChanged = false;
            bt.oninput  = () => { const ic = el.querySelector('i'); el.textContent = bt.value; if(ic) el.prepend(ic.cloneNode(true)); };
            bbg.oninput = () => { bgChanged = true; el.style.backgroundColor = bbg.value; };
            bfg.oninput = () => { fgChanged = true; el.style.color = bfg.value; };
            p.querySelector('#goa').onclick = () => {
                el.setAttribute('href', bh.value);
                el.setAttribute('target', tgt.value);
                const styleOverride = {};
                if (bgChanged) styleOverride.backgroundColor = bbg.value;
                if (fgChanged) styleOverride.color = bfg.value;
                const entry = { html: el.innerHTML, href: bh.value, target: tgt.value };
                if (Object.keys(styleOverride).length) entry.style = styleOverride;
                this.store(el.dataset.eid, entry);
                this.closePanel();
                this.toast('✓ Botão salvo no rascunho', 'ok');
            };
            p.querySelector('#goc').onclick = () => {
                el.innerHTML = origHTML;
                el.setAttribute('style', origStyle);
                el.setAttribute('href', origHref);
                this.closePanel();
            };
        },

        /* ── CORES GLOBAIS ── */
        pColors() {
            const root = document.documentElement;
            const g = v => getComputedStyle(root).getPropertyValue(v).trim() || '#000000';
            const p = this.panel_('🎨 Cores Globais do Site');
            p.innerHTML += `<div class="go-pb">
                <div class="go-info">Altera as cores principais em todo o site de uma só vez.</div>
                <div class="go-cr"><label>🟠 Laranja principal</label><input type="color" id="gog1" value="${this.hex(g('--orange'))||'#E05220'}"></div>
                <div class="go-cr"><label>🟠 Laranja escuro</label><input type="color" id="gog2" value="${this.hex(g('--orange-dark'))||'#c04418'}"></div>
                <div class="go-cr"><label>🔵 Azul destaque</label><input type="color" id="gog3" value="${this.hex(g('--blue'))||'#22A8C9'}"></div>
                <div class="go-cr"><label>⬛ Fundo dark</label><input type="color" id="gog4" value="${this.hex(g('--dark'))||'#0f1623'}"></div>
                <hr class="go-hr">
                <div class="go-f"><label>📱 Número do WhatsApp</label>
                    <input type="text" id="gogwa" value="${this.cms.whatsapp||''}" placeholder="5521966501302">
                    <p class="go-hint-txt">Somente números com DDD e código do país. Atualiza todos os botões do site.</p>
                </div>
                <div class="go-acts">
                    <button class="go-ok" id="goa">✓ Aplicar cores</button>
                    <button class="go-ko" id="goc">Cancelar</button>
                </div>
            </div>`;
            const vars   = ['--orange','--orange-dark','--blue','--dark'];
            const inputs = ['gog1','gog2','gog3','gog4'].map(id => p.querySelector('#'+id));
            const waInp  = p.querySelector('#gogwa');
            inputs.forEach((inp, i) => {
                inp.oninput = () => root.style.setProperty(vars[i], inp.value);
            });
            waInp.oninput = () => {
                const num = waInp.value.replace(/\D/g, '');
                if (num) document.querySelectorAll('a[href*="wa.me/"]').forEach(a => {
                    a.href = a.href.replace(/wa\.me\/\d+/, 'wa.me/' + num);
                });
            };
            p.querySelector('#goa').onclick = () => {
                const colors = {};
                vars.forEach((v, i) => colors[v] = inputs[i].value);
                this.cms.colors = { ...(this.cms.colors || {}), ...colors };
                const num = waInp.value.replace(/\D/g, '');
                if (num) this.cms.whatsapp = num;
                localStorage.setItem(CMS_KEY, JSON.stringify(this.cms));
                this.markDirty();
                this.closePanel();
                this.toast('✓ Cores salvas no rascunho', 'ok');
            };
            p.querySelector('#goc').onclick = () => {
                vars.forEach(v => root.style.removeProperty(v));
                applyContent(this.cms);
                this.closePanel();
            };
        },

        /* ── REVERTER ── */
        revert() {
            let hasDraft = false;
            try { hasDraft = Object.keys(JSON.parse(localStorage.getItem(CMS_KEY) || '{}')).length > 0; } catch (_) {}
            if (!hasDraft) { this.toast('Não há rascunho para descartar', ''); return; }
            if (!confirm('Descartar todas as alterações não publicadas? O site voltará ao conteúdo publicado.')) return;
            localStorage.removeItem(CMS_KEY);
            document.querySelectorAll('.go-dirty-dot').forEach(d => d.remove());
            this.toast('Rascunho descartado. Recarregando…', '');
            setTimeout(() => location.reload(), 900);
        },

        /* ── PUBLICAR ── */
        async publish() {
            if (isLocal) {
                this.toast('⚠️ Publicar só funciona no site no Vercel', 'err');
                this.panel_('⚠️ Publicação Indisponível').innerHTML += `<div class="go-pb">
                    <div class="go-local-warn" style="margin-bottom:0;">
                        <strong>Você está no modo local.</strong><br>
                        Para publicar, acesse o editor pelo site publicado:<br><br>
                        <a href="https://321go-psi.vercel.app/admin/login.html" target="_blank" style="color:#C2410C;font-weight:700;">
                            → Abrir site no Vercel
                        </a>
                    </div>
                    <button class="go-ko" style="width:100%;margin-top:14px" onclick="this.closest('.go-panel').remove()">Fechar</button>
                </div>`;
                return;
            }

            const elems   = Object.keys(this.cms).filter(k => k !== 'colors' && k !== 'whatsapp');
            const hasCols = this.cms.colors && Object.keys(this.cms.colors).length > 0;
            const hasWA   = !!this.cms.whatsapp;
            const total   = elems.length + (hasCols ? 1 : 0) + (hasWA ? 1 : 0);

            if (total === 0) { this.toast('Nenhuma alteração para publicar', ''); return; }

            let items = '';
            if (elems.length) items += `<li>${elems.length} elemento(s) editados</li>`;
            if (hasCols) items += `<li>Cores globais do site</li>`;
            if (hasWA)   items += `<li>WhatsApp: ${this.cms.whatsapp}</li>`;

            const hasSavedSecret = !!sessionStorage.getItem(SECRET_KEY);
            const p = this.panel_('🚀 Publicar Alterações');
            p.innerHTML += `<div class="go-pb">
                <div class="go-info" style="background:#EFF6FF;border:1px solid #BFDBFE;color:#1E40AF;border-radius:10px;padding:14px;margin-bottom:14px;line-height:1.8;">
                    <strong>O que será publicado:</strong><ul style="margin:8px 0 0 16px;">${items}</ul>
                </div>
                ${!hasSavedSecret ? `<div class="go-f"><label>🔑 Senha de acesso</label>
                    <input type="password" id="gopwd" placeholder="Digite sua senha admin"></div>` : ''}
                <p class="go-hint-txt">Estas mudanças ficarão visíveis para todos os visitantes em ~30 segundos.</p>
                <div class="go-acts" style="margin-top:14px;">
                    <button class="go-ok" id="goa">✓ Confirmar e publicar</button>
                    <button class="go-ko" id="goc">Cancelar</button>
                </div>
            </div>`;

            p.querySelector('#goc').onclick = () => this.closePanel();
            p.querySelector('#goa').onclick = async () => {
                const pwdEl = p.querySelector('#gopwd');
                let secret = sessionStorage.getItem(SECRET_KEY) || '';
                if (pwdEl) {
                    if (!pwdEl.value) { pwdEl.focus(); pwdEl.style.borderColor='#DC2626'; return; }
                    secret = pwdEl.value;
                    sessionStorage.setItem(SECRET_KEY, secret);
                }
                p.querySelector('.go-pb').innerHTML = `<div class="go-loading"><span class="go-spin">⏳</span>Publicando alterações…</div>`;
                try {
                    const res = await fetch('/api/publish', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ content: this.cms, secret })
                    });
                    const data = await res.json();
                    if (res.ok && data.success) {
                        localStorage.removeItem(CMS_KEY);
                        const now = new Date().toLocaleString('pt-BR', {day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'});
                        localStorage.setItem('321go_last_pub', now);
                        document.querySelectorAll('.go-dirty-dot').forEach(d => d.remove());
                        const lp = document.querySelector('.go-last-pub');
                        if (lp) lp.textContent = 'Pub: ' + now;
                        applyContent(this.cms);
                        p.querySelector('.go-pb').innerHTML = `
                            <div class="go-pub-box">✅ <strong>Publicado com sucesso!</strong><br>
                            Visitantes verão as mudanças em alguns segundos.</div>
                            <button class="go-ok" style="width:100%;margin-top:12px" onclick="this.closest('.go-panel').remove()">✓ OK</button>`;
                        this.toast('✅ Publicado com sucesso!', 'ok');
                    } else {
                        throw new Error(data.error || 'Erro desconhecido');
                    }
                } catch (err) {
                    p.querySelector('.go-pb').innerHTML = `
                        <div class="go-pub-err">❌ <strong>Erro:</strong> ${err.message}</div>
                        <button class="go-ko" style="width:100%;margin-top:12px" onclick="this.closest('.go-panel').remove()">Fechar</button>`;
                    this.toast('❌ Erro ao publicar', 'err');
                }
            };
        },

        /* ── SAIR ── */
        exit() {
            let hasDraft = false;
            try { hasDraft = Object.keys(JSON.parse(localStorage.getItem(CMS_KEY) || '{}')).length > 0; } catch (_) {}
            if (hasDraft && !confirm('Sair do editor? Você tem alterações não publicadas (rascunho salvo).')) return;
            sessionStorage.removeItem('editor_active');
            const u = new URL(location.href);
            u.searchParams.delete('editor');
            location.replace(u.toString());
        },

        /* ── HELPERS ── */
        panel_(title) {
            this.closePanel();
            const p = document.createElement('div');
            p.className = 'go-panel';
            p.innerHTML = `<div class="go-ph"><h3>${title}</h3><button class="go-px" title="Fechar">✕</button></div>`;
            document.body.appendChild(p);
            p.querySelector('.go-px').onclick = () => this.closePanel();
            this.drag_(p);
            this.panel = p;
            return p;
        },

        closePanel() {
            document.querySelectorAll('.go-panel').forEach(x => x.remove());
            document.querySelectorAll('.go-sel').forEach(x => x.classList.remove('go-sel'));
            this.panel = null;
        },

        drag_(el) {
            if (window.matchMedia('(max-width:600px)').matches) return;
            const h = el.querySelector('.go-ph');
            let d=false, sx=0, sy=0, ox=0, oy=0;
            h.onmousedown = e => { d=true; sx=e.clientX; sy=e.clientY; ox=el.offsetLeft; oy=el.offsetTop; e.preventDefault(); };
            document.addEventListener('mousemove', e => { if(!d) return; el.style.left=ox+e.clientX-sx+'px'; el.style.top=oy+e.clientY-sy+'px'; });
            document.addEventListener('mouseup', () => d=false);
        },

        store(key, val) {
            this.cms[key] = val;
            localStorage.setItem(CMS_KEY, JSON.stringify(this.cms));
            this.markDirty();
        },

        markDirty() {
            const btn = document.getElementById('go-pub');
            if (btn && !btn.querySelector('.go-dirty-dot')) {
                const dot = document.createElement('span');
                dot.className = 'go-dirty-dot';
                btn.prepend(dot);
            }
        },

        toast(msg, type='') {
            document.querySelectorAll('.go-toast').forEach(t => t.remove());
            const t = document.createElement('div');
            t.className = 'go-toast' + (type?' '+type:'');
            t.textContent = msg;
            document.body.appendChild(t);
            requestAnimationFrame(() => requestAnimationFrame(() => t.classList.add('show')));
            setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 320); }, 3000);
        },

        hex(rgb) {
            if (!rgb || rgb === 'transparent' || rgb.includes('rgba(0, 0, 0, 0)')) return '#ffffff';
            if (rgb.startsWith('#')) return rgb;
            const m = rgb.match(/\d+/g);
            if (!m || m.length < 3) return '#ffffff';
            return '#' + m.slice(0,3).map(n => (+n).toString(16).padStart(2,'0')).join('');
        }
    };

    /* ─── BOOT ──────────────────────────────────────────────── */
    document.addEventListener('DOMContentLoaded', async () => {
        const srv = await fetchContent();
        await loadAndApply(srv);
        if (editMode) {
            await ED.start(srv);
            setTimeout(() => ED.bindAll(), 500);
        }
    });

    window._GO_CMS = ED;
})();
