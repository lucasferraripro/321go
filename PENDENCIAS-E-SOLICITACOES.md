# 321 GO! — Pendências, Erros e Solicitações

> Última atualização: 20/04/2026

---

## ✅ FEITO — Correções aplicadas hoje

### 1. Preços errados nos cards da home (lado de fora)
**Problema:** Os cards exibiam valores incorretos:
- Curitiba mostrava **R$ 304** (errado) → correto é **R$ 1.794,00** (PIX) / R$ 1.882,50 (cartão)
- Maceió mostrava **R$ 4.281** (estava certo no DB mas sobrescrito)
- Bariloche mostrava **R$ 892** (era a parcela, não o preço total)
- Gramado mostrava **R$ 255** (era a parcela, não o preço total)

**Causa:** O `database.js` com os preços corretos nunca tinha sido publicado no GitHub. O site usava uma versão antiga.

**Correção aplicada:**
- `js/database.js` publicado com todos os preços corretos
- `content.json` limpo com valores corretos para todos os pacotes

**Valores corretos publicados:**
| Pacote | PIX | Cartão | Parcelas |
|--------|-----|--------|----------|
| Balneário Camboriú | R$ 2.486,13 | R$ 2.605,80 | 10x R$ 260,58 |
| Maceió | R$ 4.281,83 | R$ 4.502,69 | 10x R$ 450,27 |
| Curitiba | R$ 1.794,00 | R$ 1.882,50 | 10x R$ 188,25 |
| Gramado | R$ 2.550,00 | R$ 2.550,00 | 10x R$ 255,00 |
| Bariloche | R$ 10.704,00 | R$ 10.704,00 | 12x R$ 892,00 |
| Porto Seguro | R$ 2.399,72 | R$ 2.399,72 | 10x R$ 239,97 |

---

### 2. Clique no card redireciona em vez de abrir o editor
**Problema:** No modo editor, ao clicar em qualquer elemento do card (preço, título, etc.) para editar, o site navegava para a página do pacote em vez de abrir o painel de edição.

**Causa:** O `article` tinha `onclick="location.href=..."` que disparava antes do editor capturar o evento.

**Correção aplicada:** Substituído por `addEventListener('click')` que verifica se o modo editor está ativo (`body.classList.contains('go-on')`) antes de navegar.

---

### 3. Pacotes de teste aparecendo no site
**Problema:** Pacotes `teste` e `teste_a` (criados durante testes do editor) estavam salvos no `content.json` e apareciam na home.

**Correção aplicada:** Removidos do `content.json`. Apenas `copa-final` permanece na lista de removidos (foi removido intencionalmente).

---

## ⚠️ PENDENTE — Ainda precisa ser verificado/testado

### 4. Seção "Explorar Mais" / "Outros Destinos" — destinos internacionais
**Solicitação:** Aproveitar a seção "Explorar Mais" (outros destinos) para mostrar destinos internacionais.

**Status:** Solicitado mas ainda não implementado. Precisa definir quais destinos internacionais mostrar nessa seção.

---

### 5. Verificar se os preços aparecem corretos após deploy
**O que testar:**
- Abrir https://321go-psi.vercel.app
- Verificar aba **Nacional**: Curitiba deve mostrar R$ 1.794,00, Gramado R$ 2.550,00, Bariloche R$ 10.704,00
- Verificar aba **Internacional**: Bariloche deve aparecer com preço correto
- No modo editor: clicar no preço de um card deve abrir o painel de edição (não navegar)

---

## 📋 HISTÓRICO DE SOLICITAÇÕES

### Me Guia Viagens — Painel Admin completo
**Solicitação:** Replicar o sistema de admin da Lovisa/321go no site Me Guia Viagens, com:
- ✅ Adicionar novos pacotes (botão ➕ Pacote na barra do editor)
- ✅ Remover cards da home (botão ✕ vermelho em cada card)
- ✅ Editar todos os textos, imagens, links e cores
- ✅ Publicar via GitHub → Vercel automático
- ✅ `pacote.html` suporta pacotes criados pelo editor

**Credenciais Me Guia Viagens:**
- URL admin: https://meguiaviagens.vercel.app/admin/login.html
- Email: admin@meguiaviagens.com.br
- Senha: MeGuia@2025

---

## 🔑 REFERÊNCIA RÁPIDA

### URLs dos sites
| Site | URL | Admin |
|------|-----|-------|
| 321 GO! | https://321go-psi.vercel.app | https://321go-psi.vercel.app/admin/login.html |
| Me Guia Viagens | https://meguiaviagens.vercel.app | https://meguiaviagens.vercel.app/admin/login.html |

### Credenciais
| Site | Email | Senha |
|------|-------|-------|
| 321 GO! | admin@321go.com.br | 321Go@2026 |
| Me Guia Viagens | admin@meguiaviagens.com.br | MeGuia@2025 |

### Repositórios GitHub
| Site | Repo |
|------|------|
| 321 GO! | https://github.com/lucashenrquebread/321go |
| Me Guia Viagens | https://github.com/lucashenrquebread/meguiaviagens-site |

### Variáveis de ambiente necessárias no Vercel
- `GITHUB_TOKEN` — token pessoal do GitHub para o CMS gravar conteúdo
- `ADMIN_SECRET` — senha do painel admin
- `GITHUB_OWNER` — dono do repositório
- `GITHUB_REPO` — nome do repositório

---

## 🐛 BUGS CONHECIDOS / A MONITORAR

1. **Vercel cache** — às vezes o Vercel demora mais que 30s para refletir mudanças. Se o site não atualizar, aguardar 2-3 minutos ou fazer um commit vazio para forçar redeploy.

2. **localStorage vs sessionStorage** — o editor do Me Guia usa `lovisa_auth` / `lovisa_secret` como chaves (herdado da Lovisa). Funciona, mas pode causar confusão se os dois sites forem abertos no mesmo browser.

3. **Seção "Explorar Mais" na home do 321go** — os cards dessa seção não têm `data-eid` nos preços, então não são editáveis pelo painel. Precisa adicionar `data-eid` nesses elementos se quiser editar pelo admin.
