# 🔒 Instruções de Setup - Fase 1: Segurança

## ✅ O que foi implementado

### 1. Middleware Server-Side (`middleware.ts`)

- ✅ Proteção de rotas `/admin/*` (exceto `/admin/login`)
- ✅ Proteção de APIs `/api/projects` e `/api/uploads` (mutações requerem auth)
- ✅ Verificação de role `admin` em todas as operações protegidas
- ✅ Headers de segurança (X-Frame-Options, X-Content-Type-Options, etc.)
- ✅ Redirect para login com callback URL

### 2. Autenticação Contra DB (`src/lib/auth.js`)

- ✅ NextAuth configurado para buscar usuários no Prisma
- ✅ Verificação de senha com bcrypt
- ✅ Fallback temporário para desenvolvimento (se user sem senha no DB)
- ✅ Cookies seguros (HttpOnly, SameSite=lax, Secure em produção)
- ✅ Session JWT com role e id do usuário

### 3. Schema Prisma Atualizado (`prisma/schema.prisma`)

- ✅ Adicionado campo `password` (String?) ao modelo User
- ✅ Retrocompatível (campo opcional)

### 4. Seed Atualizado (`prisma/seed.mjs`)

- ✅ Cria usuário admin com senha hasheada (bcrypt)
- ✅ Credenciais padrão: `admin@example.com` / `admin123`
- ✅ Cria projeto exemplo completo com blocos
- ✅ Mensagens informativas e instruções

### 5. Documentação (`ENV_TEMPLATE.md`)

- ✅ Template de variáveis de ambiente
- ✅ Instruções para gerar secrets e hashes
- ✅ Checklist de setup para dev e produção

---

## 🚀 Como Aplicar as Mudanças

### Passo 1: Criar arquivo `.env`

Copie o template abaixo para um arquivo `.env` na raiz do projeto:

```env
# Banco de Dados
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="desenvolvimento-mude-para-producao"
```

**⚠️ IMPORTANTE:** Gere um `NEXTAUTH_SECRET` único para produção:

```bash
# PowerShell (Windows)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# ou Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Passo 2: Criar Migration do Prisma

Rode o comando para criar a migration que adiciona o campo `password`:

```bash
npx prisma migrate dev --name add_user_password_field
```

Isso irá:

1. Criar uma nova migration em `prisma/migrations/`
2. Aplicar a migration no banco de dados
3. Regenerar o Prisma Client

### Passo 3: Popular o Banco com Seed

Rode o seed para criar o usuário admin e projeto exemplo:

```bash
npx prisma db seed
```

Você verá algo como:

```
🌱 Iniciando seed...

✅ Usuário admin criado/atualizado
   📧 Email: admin@example.com
   🔑 Senha: admin123

✅ Asset de exemplo criado: xyz123
✅ Projeto exemplo criado
   🔗 Slug: projeto-exemplo
   📝 Título PT: Redesign do Aplicativo Ecori

✅ 9 blocos de conteúdo criados

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎉 Seed concluído com sucesso!

📌 Próximos passos:
   1. Acesse: http://localhost:3000/admin/login
   2. Use as credenciais acima para fazer login
   3. Explore o projeto em: /admin/projects
   4. Visualize públicamente em: /projetos/projeto-exemplo
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Passo 4: Rodar o Servidor de Desenvolvimento

```bash
pnpm dev
```

### Passo 5: Testar Autenticação

1. Acesse http://localhost:3000/admin
2. Você será redirecionado para `/admin/login`
3. Use as credenciais:
   - **Email:** `admin@example.com`
   - **Senha:** `admin123`
4. Após login bem-sucedido, você será redirecionado para `/admin/projects`

### Passo 6: Verificar Proteções

#### Teste 1: Rotas Admin Protegidas

- Tente acessar `/admin/projects` sem login → deve redirecionar para login ✅
- Faça login → deve permitir acesso ✅

#### Teste 2: API Protegida

- Tente fazer `POST /api/projects` sem auth → deve retornar 401 ✅
- Faça login → `POST /api/projects` deve funcionar ✅

#### Teste 3: APIs Públicas

- `GET /api/projects` → deve funcionar sem auth (filtra por published) ✅
- `GET /api/projects/slug/projeto-exemplo` → deve funcionar ✅

---

## 🔐 Segurança Implementada

### ✅ Proteções Ativas

| Proteção                   | Status   | Descrição                                                   |
| -------------------------- | -------- | ----------------------------------------------------------- |
| **Middleware server-side** | ✅ Ativo | Valida session em todas as rotas `/admin` e APIs protegidas |
| **Auth contra DB**         | ✅ Ativo | Credenciais verificadas no Prisma com bcrypt                |
| **Senhas hasheadas**       | ✅ Ativo | bcrypt com salt rounds=10                                   |
| **JWT sessions**           | ✅ Ativo | Tokens assinados com NEXTAUTH_SECRET                        |
| **Cookies seguros**        | ✅ Ativo | HttpOnly, SameSite=lax, Secure (produção)                   |
| **Headers de segurança**   | ✅ Ativo | X-Frame-Options, X-Content-Type-Options, etc.               |
| **Role-based access**      | ✅ Ativo | Apenas usuários com role=admin acessam /admin               |

### ⚠️ Próximas Melhorias (Fase Futura)

| Proteção             | Status      | Prioridade |
| -------------------- | ----------- | ---------- |
| **CSRF tokens**      | 🔴 Pendente | Média      |
| **Rate limiting**    | 🔴 Pendente | Média      |
| **MFA/TOTP**         | 🔴 Pendente | Baixa      |
| **Magic link login** | 🔴 Pendente | Baixa      |
| **Audit log**        | 🔴 Pendente | Alta       |

---

## 🐛 Troubleshooting

### Erro: "Prisma Client not found"

```bash
npx prisma generate
```

### Erro: "Table users doesn't exist"

```bash
npx prisma migrate dev
npx prisma db seed
```

### Erro: "Invalid credentials" no login

Verifique se o seed rodou corretamente:

```bash
# Resetar banco e recriar tudo
npx prisma migrate reset

# Confirme com 'y' quando perguntado
# Isso irá:
# 1. Dropar o banco
# 2. Recriar com migrations
# 3. Rodar o seed automaticamente
```

### Middleware não está protegendo

Verifique:

1. Arquivo `middleware.ts` está na **raiz** do projeto (não em `src/`)
2. Variável `NEXTAUTH_SECRET` está definida no `.env`
3. Servidor foi reiniciado após criar `.env`

---

## 📝 Checklist de Verificação

- [ ] Arquivo `.env` criado com NEXTAUTH_SECRET único
- [ ] Migration aplicada (`npx prisma migrate dev`)
- [ ] Seed executado (`npx prisma db seed`)
- [ ] Servidor rodando (`pnpm dev`)
- [ ] Login funciona em `/admin/login`
- [ ] Rotas `/admin/*` protegidas (redirect para login)
- [ ] APIs de mutação protegidas (401 sem auth)
- [ ] APIs GET públicas funcionam
- [ ] Projeto exemplo visível em `/projetos/projeto-exemplo`

---

## ✨ Próximos Passos

Após confirmar que a **Fase 1: Segurança** está funcionando:

1. **Fase 2:** Criar Design Tokens (`src/lib/design-system.js`)
2. **Fase 3:** Expandir blocos para suportar i18n (textPt/En, htmlPt/En)
3. **Fase 4:** Adicionar novos tipos de blocos (HERO, QUOTE, LIST, VIDEO, IMAGE_GRID)
4. **Fase 5:** Implementar Audit Log

Consulte `PLANO_EXECUCAO_CMS.md` para detalhes de cada fase.

---

**Status:** ✅ Fase 1 implementada — pronta para testes!

