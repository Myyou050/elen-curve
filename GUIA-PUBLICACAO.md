# 🚀 Guia Completo: Publicar a Elen Curve no Netlify com Painel Admin

## O que você vai ter no final:
- ✅ Site publicado em `https://elencurve.netlify.app` (ou domínio próprio)
- ✅ Painel admin em `https://elencurve.netlify.app/admin`
- ✅ Adicionar produtos com foto, sem tocar em código
- ✅ Editar banners, textos e configurações pelo painel
- ✅ Tudo gratuito

---

## PARTE 1 — Criar conta no GitHub (5 minutos)

1. Acesse **github.com** e clique em "Sign up"
2. Crie sua conta com e-mail e senha
3. Confirme seu e-mail

---

## PARTE 2 — Criar repositório e subir os arquivos (10 minutos)

1. No GitHub, clique no botão **"+"** (canto superior direito) → **"New repository"**
2. Em "Repository name" digite: `elen-curve`
3. Deixe marcado **"Public"**
4. Clique em **"Create repository"**

5. Na próxima tela, clique em **"uploading an existing file"** (link azul)

6. Arraste **TODOS** os arquivos e pastas deste projeto para a área de upload:
   ```
   index.html
   styles.css
   script.js
   netlify.toml
   admin/
     index.html
     config.yml
   _data/
     produtos.json
     banners.json
     configuracoes.json
     sobre.json
     politica.json
     trocas.json
   images/
     (suas fotos de produtos aqui)
   ```

7. Role para baixo e clique em **"Commit changes"**

---

## PARTE 3 — Publicar no Netlify (5 minutos)

1. Acesse **netlify.com** e clique em **"Sign up"**
2. Clique em **"Sign up with GitHub"** (usa a mesma conta que você acabou de criar)
3. No painel do Netlify, clique em **"Add new site"** → **"Import an existing project"**
4. Clique em **"GitHub"**
5. Selecione o repositório **"elen-curve"**
6. Não mude nada nas configurações — clique em **"Deploy site"**
7. Aguarde ~2 minutos. O site vai aparecer com um link como `https://meu-site-123.netlify.app`

> 💡 **Renomear o link:** No painel Netlify → Site configuration → Change site name → digite "elencurve"

---

## PARTE 4 — Ativar o painel Admin (10 minutos)

### 4.1 — Ativar Netlify Identity
1. No painel do seu site no Netlify, clique na aba **"Integrations"**
2. Procure por **"Identity"** e clique em **"Enable Identity"**

### 4.2 — Ativar Git Gateway
1. Ainda em Identity, role para baixo até **"Services"**
2. Clique em **"Enable Git Gateway"**
   - Isso permite que o painel admin salve no GitHub automaticamente

### 4.3 — Configurar convite de acesso
1. Em Identity → clique em **"Invite users"**
2. Digite **seu e-mail** e envie o convite
3. Abra o e-mail recebido e clique em **"Accept the invite"**
4. Crie uma senha para o painel admin

---

## PARTE 5 — Usar o painel Admin 🎉

1. Acesse `https://elencurve.netlify.app/admin`
2. Faça login com seu e-mail e senha
3. Você verá o painel com:

### 🛍 Produtos
- Clique em **"New Produto"**
- Preencha: nome, foto (upload direto!), categoria, preço, etc.
- Clique em **"Publish"**
- Em ~60 segundos o produto aparece no site!

### 🖼 Banners
- Edite os textos, imagens e botões dos banners do carrossel

### ⚙️ Configurações da Loja
- Nome da loja, WhatsApp, Instagram, e-mail
- Cor principal (mude a cor rosa para qualquer cor que quiser!)
- Valor mínimo para frete grátis

### 📄 Páginas de Texto
- Edite "Sobre Nós", "Política de Privacidade", "Trocas e Devoluções"

---

## Como adicionar um novo produto (passo a passo)

1. Acesse `/admin` e faça login
2. Clique em **"🛍 Produtos"** no menu lateral
3. Clique em **"New Produto"** (botão azul, canto superior direito)
4. Preencha os campos:
   - **Nome:** Ex: Vestido Floral Rosa
   - **Foto:** Clique em "Choose an image" e faça upload da foto do celular/computador
   - **Categoria:** Escolha na lista (vestidos, blusas, etc.)
   - **Preço atual:** Ex: 149.90
   - **Preço original:** Ex: 199.90 (vai aparecer riscado)
   - **Parcelamento:** Ex: ou 3x de R$ 49,96 sem juros
   - **Selo:** Novidade, Mais Vendido, ou -30%
   - **Ativo:** deixe marcado (✓)
5. Clique em **"Publish"**
6. Aguarde ~1 minuto — o produto aparece no site!

---

## Domínio próprio (opcional)

Se tiver o domínio `elencurve.com.br`:

1. No Netlify → Domain management → Add custom domain
2. Digite seu domínio e siga as instruções
3. O Netlify configura o SSL (cadeado de segurança) automaticamente e gratuito

---

## ⚠️ Dicas importantes

- **Fotos dos produtos:** Use sempre imagens de boa qualidade (mínimo 800x800px)
- **Formato:** JPG ou PNG (PNG tem fundo transparente, melhor para roupas)
- **Nome das fotos:** Sem espaços ou caracteres especiais. Ex: `vestido-floral-rosa.jpg`
- **Se o site demorar a atualizar:** Aguarde até 2 minutos após salvar no admin
- **Backup:** Todos os seus dados ficam salvos no GitHub automaticamente

---

## 📞 Resumo dos links importantes

| O que é | Link |
|---------|------|
| Seu site | `https://elencurve.netlify.app` |
| Painel admin | `https://elencurve.netlify.app/admin` |
| GitHub (backup) | `https://github.com/SEU_USUARIO/elen-curve` |
| Netlify (painel) | `https://app.netlify.com` |
