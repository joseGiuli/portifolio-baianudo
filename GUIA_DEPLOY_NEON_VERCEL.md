# 🚀 Guia Completo: Deploy com Neon + Vercel

Este guia te ajudará a fazer o deploy completo da sua aplicação usando Neon (PostgreSQL) e Vercel.

---

## 📋 PARTE 1: Configurar o Neon (Banco de Dados)

### Passo 1: Criar conta e projeto no Neon

1. Acesse: https://neon.tech
2. Clique em **"Sign Up"** e crie uma conta (use GitHub para facilitar)
3. Após fazer login, clique em **"Create Project"**
4. Configure:
   - **Project Name**: `portifolio-baiano` (ou o nome que preferir)
   - **Region**: Escolha **US East (Ohio)** ou **Europe (Frankfurt)** (melhor latência para o Brasil)
   - **PostgreSQL Version**: Deixe a versão mais recente (16)
5. Clique em **"Create Project"**

### Passo 2: Copiar a Connection String

1. Após criar o projeto, você verá a **Connection String**
2. Certifique-se de que está no formato **Pooled connection**
3. A string deve parecer com:
   ```
   postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require
   ```
4. **Copie essa string completa!** Você precisará dela em breve.

### Passo 3: (Opcional) Habilitar autosuspend

1. No dashboard do Neon, vá em **Settings** > **Compute**
2. Habilite **"Auto-suspend"** para economizar recursos
3. Configure para suspender após **5 minutos** de inatividade (plano gratuito tem limites)

---

## 💻 PARTE 2: Configurar Localmente

### Passo 4: Criar arquivo .env

Na raiz do projeto, crie um arquivo chamado `.env` com o seguinte conteúdo:

```env
# DATABASE
DATABASE_URL="cole-aqui-a-connection-string-do-neon"

# NEXTAUTH
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="gere-uma-chave-aqui"

# ADMIN USER
ADMIN_EMAIL="seu-email@exemplo.com"
ADMIN_PASSWORD="SuaSenhaSegura123"
```

### Passo 5: Gerar NEXTAUTH_SECRET

Execute no terminal (PowerShell):

```powershell
# Opção 1: Usar Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Opção 2: Usar OpenSSL (se tiver instalado)
openssl rand -base64 32
```

Copie o resultado e cole no `.env` na linha `NEXTAUTH_SECRET`.

### Passo 6: Configurar suas credenciais

No arquivo `.env`, substitua:

- `DATABASE_URL`: Cole a Connection String do Neon (passo 2)
- `NEXTAUTH_SECRET`: Cole a chave gerada (passo 5)
- `ADMIN_EMAIL`: Seu e-mail para login no painel admin
- `ADMIN_PASSWORD`: Uma senha forte

### Passo 7: Instalar dependências e rodar migrações

Execute no terminal:

```bash
# Instalar dependências
pnpm install

# Gerar Prisma Client
pnpm prisma generate

# Criar as tabelas no banco Neon
pnpm prisma migrate dev --name init

# Popular o banco com dados iniciais
pnpm db:seed
```

### Passo 8: Testar localmente

```bash
# Rodar o projeto em desenvolvimento
pnpm dev
```

Acesse:

- Frontend: http://localhost:3000
- Admin: http://localhost:3000/admin/login
- Use as credenciais do `.env` para fazer login

---

## ☁️ PARTE 3: Deploy na Vercel

### Passo 9: Preparar o projeto para deploy

1. Certifique-se de que todas as mudanças estão commitadas no Git:

```bash
git add .
git commit -m "Configurar Neon e preparar para produção"
git push
```

### Passo 10: Criar projeto na Vercel

1. Acesse: https://vercel.com
2. Faça login (use a mesma conta do GitHub)
3. Clique em **"Add New Project"**
4. Selecione o repositório do seu portfólio
5. Configure:
   - **Framework Preset**: Next.js (detectado automaticamente)
   - **Root Directory**: `.` (raiz)
   - **Build Command**: `pnpm build` (já configurado)
   - **Install Command**: `pnpm install` (já configurado)

### Passo 11: Configurar variáveis de ambiente na Vercel

Antes de fazer deploy, adicione as variáveis de ambiente:

1. Na página do projeto na Vercel, vá em **"Environment Variables"**
2. Adicione cada uma das seguintes variáveis:

| Nome              | Valor                                                          |
| ----------------- | -------------------------------------------------------------- |
| `DATABASE_URL`    | Cole a Connection String do Neon                               |
| `NEXTAUTH_URL`    | `https://seu-dominio.vercel.app` (a Vercel mostrará o domínio) |
| `NEXTAUTH_SECRET` | Cole a mesma chave gerada no passo 5                           |
| `ADMIN_EMAIL`     | Seu e-mail de admin                                            |
| `ADMIN_PASSWORD`  | Sua senha de admin                                             |

⚠️ **IMPORTANTE**:

- Para `NEXTAUTH_URL`, use o domínio que a Vercel fornecer (ex: `https://seu-projeto.vercel.app`)
- Você pode editar isso depois do primeiro deploy

### Passo 12: Fazer o primeiro deploy

1. Clique em **"Deploy"**
2. Aguarde a build terminar (pode levar 2-5 minutos)
3. Se houver erro, verifique os logs

### Passo 13: Atualizar NEXTAUTH_URL

Após o primeiro deploy:

1. Copie o domínio fornecido pela Vercel (ex: `https://seu-projeto.vercel.app`)
2. Vá em **Settings** > **Environment Variables**
3. Edite a variável `NEXTAUTH_URL` e cole o domínio correto
4. Clique em **"Save"**
5. Vá em **"Deployments"** > **"Redeploy"**

### Passo 14: Popular o banco de produção

⚠️ **ATENÇÃO**: O seed não roda automaticamente no deploy por segurança.

Você tem duas opções para popular o banco:

**Opção A: Via Vercel CLI (Recomendado)**

1. Instale o Vercel CLI:

```bash
npm install -g vercel
```

2. Faça login:

```bash
vercel login
```

3. Link com o projeto:

```bash
vercel link
```

4. Execute o seed em produção:

```bash
vercel env pull .env.production
DATABASE_URL="sua-connection-string-neon" pnpm db:seed
```

**Opção B: Manualmente via Prisma Studio**

1. Abra o Prisma Studio conectado ao Neon:

```bash
DATABASE_URL="sua-connection-string-neon" pnpm db:studio
```

2. Crie manualmente:
   - Um usuário admin na tabela `users`
   - Hash a senha usando bcrypt antes de inserir

---

## 🔐 PARTE 4: Segurança e Otimizações

### Passo 15: Proteger variáveis sensíveis

✅ **Checklist de segurança:**

- [ ] Arquivo `.env` está no `.gitignore` (já está ✓)
- [ ] Nunca compartilhe sua Connection String do Neon publicamente
- [ ] Use senhas fortes para ADMIN_PASSWORD
- [ ] Gere um NEXTAUTH_SECRET único (nunca reutilize)

### Passo 16: Configurar domínio personalizado (Opcional)

1. Na Vercel, vá em **Settings** > **Domains**
2. Adicione seu domínio personalizado
3. Configure os DNS conforme instruções da Vercel
4. Atualize `NEXTAUTH_URL` com o novo domínio

### Passo 17: Monitorar o banco de dados

No dashboard do Neon:

- **Monitoring**: Veja uso de CPU, memória e storage
- **Query history**: Monitore queries lentas
- **Branches**: Crie branches do banco para testes (recurso avançado)

---

## 🎯 PARTE 5: Comandos Úteis

### Desenvolvimento local

```bash
# Rodar em desenvolvimento
pnpm dev

# Ver banco de dados no navegador
pnpm db:studio

# Criar nova migração
pnpm db:migrate

# Resetar banco (CUIDADO: apaga tudo!)
pnpm db:reset
```

### Produção

```bash
# Build de produção
pnpm build

# Rodar build de produção localmente
pnpm start

# Deploy manual (se não usar Git)
vercel --prod
```

---

## 🐛 PARTE 6: Solução de Problemas

### Erro: "Can't reach database server"

**Causa**: Connection string incorreta ou Neon suspenso
**Solução**:

1. Verifique se copiou a Connection String completa
2. Acesse o dashboard do Neon e "acorde" o banco (clique em qualquer coisa)
3. Certifique-se de que termina com `?sslmode=require`

### Erro: "Invalid `prisma.xxx.create()` invocation"

**Causa**: Schema desatualizado ou migrations não rodadas
**Solução**:

```bash
pnpm prisma generate
pnpm prisma migrate deploy
```

### Erro: "NextAuth URL configuration error"

**Causa**: NEXTAUTH_URL está incorreta
**Solução**:

1. Para desenvolvimento: `http://localhost:3000`
2. Para produção: `https://seu-dominio.vercel.app` (sem barra no final)

### Build falha na Vercel

**Causa**: Variáveis de ambiente não configuradas
**Solução**:

1. Vá em Settings > Environment Variables
2. Adicione todas as variáveis listadas no passo 11
3. Redeploy

### Erro: "P1017: Server has closed the connection"

**Causa**: Neon suspendeu por inatividade
**Solução**:

- É normal no plano free
- O Neon reabre automaticamente na próxima requisição (pode levar 1-2 segundos)
- Para evitar, considere o plano pago ou um "ping" periódico

---

## ✅ Checklist Final

Antes de considerar o deploy completo:

- [ ] Neon configurado e Connection String copiada
- [ ] Arquivo `.env` criado localmente com todas as variáveis
- [ ] Migrations rodadas no banco Neon
- [ ] Seed executado (usuário admin criado)
- [ ] Aplicação testada localmente (`pnpm dev`)
- [ ] Código commitado e pushed para GitHub
- [ ] Projeto criado na Vercel
- [ ] Todas as variáveis de ambiente configuradas na Vercel
- [ ] Deploy realizado com sucesso
- [ ] `NEXTAUTH_URL` atualizada com domínio correto
- [ ] Login no admin funcionando em produção
- [ ] Domínio personalizado configurado (opcional)

---

## 📚 Recursos Adicionais

- **Documentação Neon**: https://neon.tech/docs
- **Documentação Prisma**: https://www.prisma.io/docs
- **Documentação Vercel**: https://vercel.com/docs
- **NextAuth.js**: https://next-auth.js.org

---

## 🎉 Pronto!

Sua aplicação está rodando em produção! 🚀

Acesse:

- **Site público**: https://seu-dominio.vercel.app
- **Painel admin**: https://seu-dominio.vercel.app/admin/login

Se tiver problemas, volte para a seção "Solução de Problemas" ou me consulte! 😊

