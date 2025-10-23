# ⚡ Comandos Rápidos - Neon Setup

## 🎯 Setup Inicial (Faça apenas UMA vez)

### 1. Criar arquivo .env

```bash
# Na raiz do projeto, crie o arquivo .env com:
```

```env
DATABASE_URL="cole-sua-connection-string-do-neon-aqui"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="gere-uma-chave-aqui"
ADMIN_EMAIL="seu-email@exemplo.com"
ADMIN_PASSWORD="SuaSenhaSegura123"
```

### 2. Gerar NEXTAUTH_SECRET

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 3. Instalar e Configurar Banco

```bash
# Instalar dependências
pnpm install

# Gerar Prisma Client
pnpm prisma generate

# Criar tabelas no banco
pnpm prisma migrate dev --name init

# Popular banco com dados iniciais
pnpm db:seed
```

### 4. Rodar em Desenvolvimento

```bash
pnpm dev
```

Acesse: http://localhost:3000/admin/login

---

## 🚀 Deploy na Vercel

### 1. Commit e Push

```bash
git add .
git commit -m "Configurar Neon para produção"
git push
```

### 2. Configurar na Vercel

1. Criar novo projeto: https://vercel.com/new
2. Importar repositório
3. Adicionar variáveis de ambiente:

   - `DATABASE_URL` = Connection String do Neon
   - `NEXTAUTH_URL` = https://seu-dominio.vercel.app
   - `NEXTAUTH_SECRET` = (mesma chave do .env local)
   - `ADMIN_EMAIL` = seu e-mail
   - `ADMIN_PASSWORD` = sua senha

4. Deploy

### 3. Popular banco de produção (após primeiro deploy)

**Via Vercel CLI:**

```bash
# Instalar CLI
npm install -g vercel

# Login
vercel login

# Link projeto
vercel link

# Seed
DATABASE_URL="sua-connection-string-neon" pnpm db:seed
```

---

## 🛠️ Comandos Úteis Dia a Dia

### Desenvolvimento

```bash
# Rodar projeto
pnpm dev

# Ver banco no navegador
pnpm db:studio

# Criar nova migração
pnpm db:migrate

# Resetar banco (CUIDADO: apaga tudo!)
pnpm db:reset

# Ver migrações pendentes
pnpm prisma migrate status
```

### Produção

```bash
# Build local
pnpm build

# Rodar build localmente
pnpm start

# Deploy manual
vercel --prod
```

---

## 🔍 Troubleshooting Rápido

### ❌ Erro: "Can't reach database server"

```bash
# Verificar connection string no .env
cat .env | grep DATABASE_URL

# Regenerar Prisma Client
pnpm prisma generate
```

### ❌ Erro: "P1017: Server has closed the connection"

- Normal no Neon (free tier suspende após inatividade)
- Aguarde 2-3 segundos e tente novamente

### ❌ Build falha na Vercel

1. Verificar variáveis de ambiente
2. Ver logs de build
3. Testar build localmente: `pnpm build`

---

## 📝 Checklist Rápido

**Local:**

- [ ] Arquivo `.env` criado
- [ ] `DATABASE_URL` configurada
- [ ] `pnpm install` executado
- [ ] `pnpm prisma migrate dev` executado
- [ ] `pnpm db:seed` executado
- [ ] `pnpm dev` funcionando

**Produção:**

- [ ] Código commitado e pushed
- [ ] Projeto criado na Vercel
- [ ] Variáveis de ambiente configuradas
- [ ] Deploy bem-sucedido
- [ ] Banco populado (seed)
- [ ] Login admin funcionando

---

## 📚 Links Úteis

- **Neon Dashboard**: https://console.neon.tech
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Prisma Studio**: `pnpm db:studio`
- **Docs Neon**: https://neon.tech/docs
- **Docs Prisma**: https://www.prisma.io/docs




