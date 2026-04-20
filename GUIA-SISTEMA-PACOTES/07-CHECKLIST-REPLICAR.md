# PARTE 7 — Checklist Completo para Replicar em Novo Site

## Antes de começar

- [ ] Criar repositório público no GitHub
- [ ] Criar projeto no Vercel conectado ao repositório
- [ ] Adicionar variáveis de ambiente no Vercel:
  - `GITHUB_TOKEN` — token com scope `repo`
  - `ADMIN_SECRET` — senha do painel admin
  - `GITHUB_OWNER` — seu usuário GitHub
  - `GITHUB_REPO` — nome do repositório

---

## 1. database.js

- [ ] Criar arquivo `js/database.js`
- [ ] Definir `const SITE` com dados da agência (nome, whatsapp, email)
- [ ] Definir `const THUMB` com mapa de imagens dos cards
- [ ] Definir `const DB` com todos os pacotes
- [ ] Cada pacote tem: `category`, `title`, `subtitle`, `location`, `duration`, `price`, `priceCartao`, `parcelas`, `flag`, `badge`, `dates`, `images[]`, `desc`, `incluso[]`, `nao_incluso[]`, `roteiro[]`
- [ ] `price` e `priceCartao` são só números: `"2.486,13"` — sem "R$"
- [ ] `images[0]` é a foto do card na home
- [ ] Adicionar `mergeCMS()` no final que aplica `__db_overrides` e `__new_packages`
- [ ] Carregar database.js antes de index.html e pacote.html renderizarem

---

## 2. index.html — Cards da Home

- [ ] `<div id="cards-grid">` vazio — cards gerados por JavaScript
- [ ] Carregar `<script src="js/database.js">` antes do script de render
- [ ] Função `buildCard(id, p)` gera HTML do card com todos os `data-eid`
- [ ] `data-eid` dos cards seguem padrão: `img-{id}`, `pix-{id}`, `parcel-{id}`, `titulo-{id}`, `dest-{id}`, `badge-{id}`, `incluso-{id}`, `data-{id}`
- [ ] Card tem `id="card-{id}"` para remoção pelo admin
- [ ] Click no card: verifica `body.classList.contains('go-on')` antes de navegar
- [ ] Botão "Ver detalhes" aponta para `pacote.html?id={id}`
- [ ] `renderCat()` aplica `__db_overrides` do servidor antes de renderizar
- [ ] Carregar `<script src="editor.js">` no final do body

---

## 3. pacote.html — Página de Detalhes

- [ ] Um único arquivo serve todos os pacotes via `?id=NOME`
- [ ] Boot é `async/await` — busca CMS antes de renderizar
- [ ] Aplica `__db_overrides` ao DB antes de chamar `renderPacote`
- [ ] `renderPacote(id, cms)` recebe CMS como parâmetro
- [ ] Usa `cmsText()` para ler do CMS com prioridade sobre DB
- [ ] Prefixar `data-eid` com ID do pacote: `pkg-price` → `gramado-pkg-price`
- [ ] Carrossel: slide e miniatura têm o **mesmo** `data-eid` (ex: `gramado-pkg-img-0`)
- [ ] `priceCartao` normalizado: remove "No cartão: R$" antes de exibir
- [ ] Botão WhatsApp com mensagem pré-preenchida usando dados do pacote
- [ ] `applyPacoteCmsOverrides(id, cms)` chamado após `renderPacote`
- [ ] Carregar `<script src="editor.js">` no final do body

---

## 4. editor.js — Painel Admin

- [ ] `CMS_KEY` único por projeto: `'nome-projeto_cms_v1'`
- [ ] `AUTH_KEY` e `SECRET_KEY` únicos por projeto
- [ ] `applyContent()` aplica `__db_overrides` ao DB antes do loop `data-eid`
- [ ] `loadAndApply()` expõe `window.__SRV_CMS = srv` sempre (não só com `__new_packages`)
- [ ] `store()` tem detecção de padrão e `extractValue()` para sincronização
- [ ] `injectRemoveButtons()` adiciona botão ✕ em cada `article.card[id]`
- [ ] `pAddPacote()` formulário completo para criar novo pacote
- [ ] Botão WA flutuante menor no modo editor: `body.go-on .wpp-float { width: 52px; ... }`

---

## 5. APIs (Vercel Serverless)

- [ ] `api/auth.js` — valida senha contra `process.env.ADMIN_SECRET`
- [ ] `api/content.js` — retorna `content.json` do GitHub sem cache
- [ ] `api/publish.js` — commita `content.json` no GitHub
- [ ] `api/upload.js` — faz upload de imagem para `/imagens/uploads/` no GitHub
- [ ] Todas as APIs têm headers CORS
- [ ] `GITHUB_OWNER` e `GITHUB_REPO` via `process.env` (não hardcoded)

---

## 6. admin/login.html

- [ ] Valida email específico da agência
- [ ] Chama `POST /api/auth` com a senha
- [ ] Salva auth em `localStorage` E `sessionStorage`
- [ ] Redireciona para `../index.html?editor=1`

---

## 7. content.json

- [ ] Começa como `{}` vazio em cada novo projeto
- [ ] Nunca commitar com dados de outro projeto

---

## 8. Testes obrigatórios antes de entregar

- [ ] Abrir home → cards aparecem com foto, preço e botão
- [ ] Clicar em card → vai para `pacote.html?id=NOME` correto
- [ ] Página do pacote mostra foto, carrossel, preços, inclusos, roteiro
- [ ] Botão WhatsApp abre com mensagem pré-preenchida
- [ ] Login admin funciona
- [ ] Editar preço na home → publicar → abrir pacote → mesmo valor ✅
- [ ] Editar preço no pacote → publicar → ver na home → mesmo valor ✅
- [ ] Trocar foto na home → publicar → foto atualizada ✅
- [ ] Adicionar novo pacote → aparece na home → página de detalhes funciona ✅
- [ ] Remover card → some da home → publicar → continua sumido ✅
- [ ] Testar no celular (375px)

---

## Erros comuns e soluções rápidas

| Erro | Causa | Solução |
|------|-------|---------|
| Preço diferente na home vs pacote | Sem `__db_overrides` | Ver Parte 5 |
| Clique no card navega em vez de editar | `onclick` no article | Usar `addEventListener` com verificação `go-on` |
| Foto não atualiza na miniatura | `data-eid` diferente do slide | Usar mesmo `data-eid` em slide e miniatura |
| Pacote não encontrado | ID da URL diferente do DB | Conferir `?id=NOME` bate com `DB.NOME` |
| Admin não consegue editar preço do pacote | `data-eid` sem prefixo | `renderPacote` deve prefixar com ID do pacote |
| Upload falha | Token sem scope `repo` | Regenerar token com scope `repo` completo |
| Site não atualiza após publicar | Cache Vercel | Aguardar 2-3 min ou commit vazio para forçar |
| Push rejeitado | Editor fez commit pelo CMS | `git pull --rebase origin master` antes do push |
