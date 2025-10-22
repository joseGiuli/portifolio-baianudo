# 🔐 Variáveis de Ambiente

Copie este conteúdo para um arquivo `.env` na raiz do projeto.

```env
# ====================================
# 🗄️ BANCO DE DADOS
# ====================================
DATABASE_URL="file:./dev.db"

# Para produção, use PostgreSQL:
# DATABASE_URL="postgresql://user:password@host:5432/database"

# ====================================
# 🔑 NEXTAUTH (Autenticação)
# ====================================
NEXTAUTH_URL="http://localhost:3000"

# Gere um secret seguro com:
# openssl rand -base64 32
NEXTAUTH_SECRET="desenvolvimento-mude-para-producao"

# ====================================
# 👤 USUÁRIO ADMIN (Seed)
# ====================================
# Estes valores são usados pelo script prisma/seed.mjs
ADMIN_EMAIL="admin@example.com"
ADMIN_NAME="Administrador"

# Para gerar hash da senha, use Node.js:
# node -e "console.log(require('bcryptjs').hashSync('SuaSenhaSegura', 10))"
ADMIN_PASSWORD_HASH="$2a$10$exemplo.hash.aqui"

# ====================================
# 📤 UPLOAD DE IMAGENS (Opcional)
# ====================================
# Se usar Cloudinary:
# CLOUDINARY_API_KEY=
# CLOUDINARY_API_SECRET=
# CLOUDINARY_CLOUD_NAME=

# Se usar UploadThing:
# UPLOADTHING_SECRET=
# UPLOADTHING_APP_ID=

# ====================================
# 🚦 RATE LIMITING (Opcional)
# ====================================
# Se usar Upstash Redis:
# UPSTASH_REDIS_REST_URL=
# UPSTASH_REDIS_REST_TOKEN=

# ====================================
# 🎛️ FEATURE FLAGS
# ====================================
CMS_ENHANCED_BLOCKS=false
CMS_AUDIT_LOG=false
CMS_CSRF_PROTECTION=false
```

---

## 📋 Checklist de Setup

### Desenvolvimento

- [ ] Copiar este template para `.env` na raiz do projeto
- [ ] Alterar `NEXTAUTH_SECRET` para um valor único (gerar com `openssl rand -base64 32`)
- [ ] Rodar `pnpm prisma generate` para gerar o Prisma Client
- [ ] Rodar `pnpm prisma migrate dev` para criar o banco de dados
- [ ] Rodar `pnpm prisma db seed` para popular dados iniciais
- [ ] Testar login em `http://localhost:3000/admin/login` com:
  - Email: `admin@example.com`
  - Senha: `admin123`

### Produção

- [ ] Usar `DATABASE_URL` com PostgreSQL (Neon, Supabase, etc.)
- [ ] Gerar `NEXTAUTH_SECRET` seguro e único
- [ ] Criar usuário admin via seed ou manualmente no banco
- [ ] Configurar variáveis no Vercel/Netlify/etc.
- [ ] Habilitar HTTPS (o middleware já configura cookies seguros em produção)

---

## 🔧 Como Gerar Credenciais

### NEXTAUTH_SECRET

```bash
# Terminal (Linux/Mac)
openssl rand -base64 32

# PowerShell (Windows)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### ADMIN_PASSWORD_HASH

```bash
# Node.js (tenha bcryptjs instalado)
node -e "console.log(require('bcryptjs').hashSync('SuaSenhaSegura', 10))"
```

Ou use o seed padrão que já gera o hash automaticamente.

---

## 🚨 Segurança

### ⚠️ NUNCA commite o arquivo `.env`!

O `.gitignore` já está configurado para ignorar `.env`, mas **sempre verifique**:

```bash
# Verificar se .env está no gitignore
grep ".env" .gitignore

# Se não estiver, adicione:
echo ".env" >> .gitignore
```

### 🔒 Em Produção

1. **Use senhas fortes** para usuários admin
2. **Rotacione o NEXTAUTH_SECRET** periodicamente
3. **Habilite HTTPS** (o middleware já protege cookies em produção)
4. **Use PostgreSQL** ao invés de SQLite
5. **Configure backups** regulares do banco de dados

---

## 📚 Referências

- [NextAuth.js - Environment Variables](https://next-auth.js.org/configuration/options#environment-variables)
- [Prisma - Environment Variables](https://www.prisma.io/docs/guides/development-environment/environment-variables)
- [Vercel - Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

