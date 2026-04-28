# 321 GO! — Pendências, Erros e Solicitações

> Última atualização: 20/04/2026

---

## ✅ FEITO — Correções aplicadas hoje (28/04/2026)

### 1. Cabeçalho Premium e Textos
**Solicitação:** Colocar um cabeçalho com texto e fundo paradisíaco, mantendo a foto redonda do lado esquerdo. Textos: "Viage com Patrícia e Tatiana" e "3,2,1 GO!".
**Status:** ✅ Feito e publicado! O novo cabeçalho substituiu o antigo layout básico.

### 2. Formulário de Orçamento
**Solicitação:** Formulário de solicitação de orçamento direto para WhatsApp.
**Status:** ✅ Feito e publicado! A seção "#orcamento" foi implementada com campos interativos redirecionando para o número correto.

### 3. Recuperação da Copa 2026 e Novos Pacotes
**Solicitação:** Recuperar os pacotes da Copa e adicionar mais destinos.
**Status:** ✅ Feito! A aba "🏆 Copa 2026" foi restaurada contendo 5 pacotes (México, Miami, Nova York, Cancún e a Grande Final). 

### 4. Reorganização do Menu Mobile
**Solicitação:** Organizar o Menu (3 tracinhos) com Nacionais, Internacionais e Copa.
**Status:** ✅ Feito! O menu lateral (hambúrguer) agora abre focado na navegação destas categorias, além dos links institucionais e de orçamento.

---

## ⚠️ PENDENTE — Ainda precisa ser verificado/testado

### 5. Seção "Explorar Mais" / "Outros Destinos" — destinos internacionais
**Solicitação:** Aproveitar a seção "Explorar Mais" (outros destinos) para mostrar destinos internacionais.
**Status:** Solicitado mas ainda não implementado. Precisa definir quais destinos internacionais mostrar nessa seção.


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
