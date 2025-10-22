# 🚀 Início Rápido - 5 Minutos

## 📝 Pré-requisitos

- [ ] Node.js instalado
- [ ] pnpm instalado
- [ ] Git instalado
- [ ] Conta no GitHub

---

## ⚡ Setup em 5 Passos

### 1️⃣ Criar Banco no Neon (2 min)

1. Acesse: https://neon.tech
2. Clique em **"Sign Up"** (use GitHub)
3. **"Create Project"** → Escolha nome e região
4. **Copie a Connection String** (parecida com):
   ```
   postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require
   ```

---

### 2️⃣ Configurar Localmente (1 min)

**Crie arquivo `.env` na raiz:**

```env
DATABASE_URL="cole-aqui-a-connection-string-do-passo-1"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="rode-comando-abaixo-e-cole-aqui"
ADMIN_EMAIL="seu@email.com"
ADMIN_PASSWORD="SuaSenha123"
```

**Gere a chave secreta:**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

### 3️⃣ Instalar e Popular Banco (2 min)

```bash
# Instalar
pnpm install

# Configurar banco
pnpm prisma generate
pnpm prisma migrate dev --name init

# Popular com dados exemplo
pnpm db:seed
```

---

### 4️⃣ Rodar Localmente

```bash
pnpm dev
```

✅ Acesse: http://localhost:3000/admin/login
📧 Use o email/senha do seu `.env`

---

### 5️⃣ Deploy na Vercel (Quando estiver pronto)

```bash
# 1. Commit
git add .
git commit -m "Setup Neon"
git push

# 2. Vercel
# - Acesse: https://vercel.com/new
# - Importe seu repositório
# - Adicione as variáveis de ambiente (mesmo do .env)
# - Deploy!
```

---

## ✅ Tudo Funcionou?

Se você conseguiu acessar o admin, parabéns! 🎉

### Próximos Passos:

- [ ] Criar seus próprios projetos no admin
- [ ] Customizar o portfólio
- [ ] Fazer deploy na Vercel

### Deu Problema?

Consulte:

- **Problemas comuns**: `GUIA_DEPLOY_NEON_VERCEL.md` (seção Troubleshooting)
- **Comandos úteis**: `COMANDOS_RAPIDOS_NEON.md`
- **Detalhes técnicos**: `RESUMO_MUDANCAS_NEON.md`

---

## 📞 Suporte

Se precisar de ajuda:

1. Leia a seção de troubleshooting no guia completo
2. Verifique os logs do terminal
3. Certifique-se de que copiou a Connection String correta

---

**Tempo estimado total:** ⏱️ 5-10 minutos
**Dificuldade:** 🟢 Fácil



