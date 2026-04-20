# 321 GO! — Demandas da Cliente (Patrícia/Tatiana)
**Atualizado:** 20/04/2026

---

## 📋 DEMANDAS PENDENTES — Por Prioridade

---

### 🔴 PRIORIDADE 1 — Separar Pacotes: Nacionais x Internacionais

**O que a cliente quer:**
- Pacotes nacionais em uma seção/página separada
- Pacotes internacionais em outra seção/página separada
- Atualmente todos os pacotes criados caem no mesmo lugar na home

**Situação atual:**
- A home já tem abas "🇧🇷 Nacional" e "🌍 Internacional" implementadas no código
- Mas ao criar um novo pacote pelo botão ➕, não há opção de escolher a categoria
- Todos os pacotes novos aparecem juntos sem separação

**O que precisa ser feito:**
1. Adicionar campo **"Categoria"** no formulário de criação de pacote:
   - `[ ] Nacional` 
   - `[ ] Internacional`
2. Ao criar, salvar `category: 'nacional'` ou `category: 'internacional'` no objeto do pacote
3. O sistema de abas já existe — só precisa ler esse campo `category` corretamente

**Observação da cliente:**
> "Eu vou ficar criando pacotes, depois que criar suficientes me avisa que você organiza"

---

### 🔴 PRIORIDADE 2 — Imagens dos Pacotes: Como Adicionar

**O que a cliente quer:**
- Saber como colocar imagem ao criar um novo pacote
- Atualmente o formulário tem 3 campos de URL de imagem mas a cliente não sabe usar

**Problema relatado:**
- Tem pacote com imagem de praia errada (nome do arquivo JPEG é de outro estado/praia)
- A cliente percebeu pelo nome do arquivo, não pela imagem em si

**O que precisa ser feito:**
1. **Corrigir imagens erradas** nos pacotes existentes — verificar todos os pacotes e garantir que a imagem corresponde ao destino correto
2. **Melhorar o formulário** de criação para facilitar o upload de imagem:
   - Adicionar botão de upload direto (não só URL)
   - Ou adicionar pré-visualização da imagem ao colar a URL
3. **Documentar para a cliente** como adicionar imagem:
   - Opção A: Colar URL de imagem do Google (clicar com botão direito → "Copiar endereço da imagem")
   - Opção B: Fazer upload pelo campo de arquivo (só funciona no site publicado, não local)

---

### 🟡 PRIORIDADE 3 — Menu de Navegação Editável

**O que a cliente quer:**
- Poder editar os itens do menu pelo painel admin
- Adicionar "Pacotes Nacionais" e "Pacotes Internacionais" como itens separados no menu
- Remover ou ocultar itens que não existem (ex: "Clientes" aparece no painel mas a página está oculta)

**Situação atual:**
- O menu está hardcoded no HTML: Início | Pacotes | Sobre | Fale Conosco
- "Copa 2026" ainda aparece no menu mobile (ver screenshot da cliente — marcado em verde)
- A página "Clientes" existe no código mas está oculta/sem conteúdo

**O que precisa ser feito:**
1. Remover "Copa 2026" do menu mobile (já foi removido do desktop)
2. Tornar o menu editável pelo painel admin (adicionar `data-eid` nos links do nav)
3. Ou: atualizar o menu manualmente para refletir a nova estrutura:
   - Início | Pacotes Nacionais | Pacotes Internacionais | Sobre | Fale Conosco

---

### 🟡 PRIORIDADE 4 — Página "Clientes" (Oculta)

**O que a cliente quer:**
- Entender o que é essa página "Clientes" que aparece no painel de navegação
- Decidir se quer usar ou remover

**Situação atual:**
- No painel de navegação do editor aparece "⭐ Clientes" → `clientes.html`
- Mas a página não existe ou está vazia no site publicado
- Não aparece no menu principal

**O que precisa ser feito:**
- Perguntar à cliente se quer uma página de depoimentos/avaliações de clientes
- Se sim: criar a página `clientes.html` com layout de depoimentos
- Se não: remover do painel de navegação do editor

---

## ✅ JÁ RESOLVIDO NESTA SESSÃO

- ✅ Seção Copa 2026 (fundo escuro) removida da home
- ✅ Link "Copa 2026" removido do menu desktop
- ✅ Home agora tem só estilo light
- ✅ Botão ➕ para adicionar novos pacotes funcionando
- ✅ Botão ✕ para remover cards funcionando
- ✅ Ícones editáveis nos itens "incluso" do pacote

---

## 📝 FLUXO DE TRABALHO DA CLIENTE (como ela usa o site)

1. Acessa `tatiana321go.com.br/admin/login.html`
2. Faz login
3. Vai para `index.html?editor=1`
4. Clica no ➕ para criar novo pacote
5. Preenche os dados e clica em "Criar Pacote"
6. Clica em 🚀 Publicar para tornar visível para todos

**Dúvida pendente da cliente:**
> "Depois que eu criar os novos pacotes e te avisar, você vai ter como organizar eles em nacionais e internacionais?"
> **Resposta: SIM** — basta adicionar o campo categoria no formulário e o sistema de abas já funciona.

---

## 🖼️ IMAGENS COM PROBLEMA (verificar)

Os pacotes abaixo podem ter imagens incorretas (nome do arquivo não corresponde ao destino):

| Pacote | Imagem atual | Verificar |
|--------|-------------|-----------|
| Gramado | `imagens/bariloche.png` | ❌ Imagem de Bariloche usada em Gramado |
| Bariloche | `imagens/bariloche_montanhas_alt.png` | ⚠️ Arquivo pode não existir |
| Gramado | `imagens/curitiba_trem.png` | ❌ Imagem de Curitiba usada em Gramado |

**Ação necessária:**
- Substituir por imagens corretas de cada destino
- Usar o editor visual: clicar na imagem no modo editor → trocar URL ou fazer upload

---

## 💬 FRASES DA CLIENTE (para referência)

> "Eu vou ficar criando pacotes aleatoriamente e queria que depois você organizasse em nacionais e internacionais"

> "Eu não consigo separar pelo painel — tudo vai para o mesmo lugar"

> "Tem um pacote com imagem de outra praia — percebi pelo nome do arquivo JPEG"

> "Como faço para colocar imagem quando criar um pacote novo?"

> "A página Clientes aparece no painel mas não aparece no site"

> "Quero muito que tivesse separado: pacotes nacionais, pacotes internacionais"
