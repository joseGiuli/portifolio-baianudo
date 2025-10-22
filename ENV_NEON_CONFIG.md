# 🔧 Configuração de Variáveis de Ambiente para Neon

## Passo 1: Criar arquivo .env

Crie um arquivo chamado `.env` na raiz do projeto com o seguinte conteúdo:

```env
# ==========================================
# DATABASE - NEON (PostgreSQL)
# ==========================================
# Cole aqui a Connection String que você copiou do Neon
# Exemplo: postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require
DATABASE_URL="postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/neondb?sslmode=require"

# ==========================================
# NEXTAUTH - Autenticação
# ==========================================
# Para desenvolvimento:
NEXTAUTH_URL="http://localhost:3000"

# Gere uma chave secreta executando no terminal:
# openssl rand -base64 32
NEXTAUTH_SECRET="sua-chave-secreta-aqui"

# ==========================================
# ADMIN USER (Seed inicial)
# ==========================================
ADMIN_EMAIL="admin@exemplo.com"
ADMIN_PASSWORD="SuaSenhaSegura@123"
```

## Passo 2: Gerar NEXTAUTH_SECRET

Execute no terminal:

```bash
openssl rand -base64 32
```

Copie o resultado e cole no `.env` no campo `NEXTAUTH_SECRET`.

## Passo 3: Substituir DATABASE_URL

Substitua o valor de `DATABASE_URL` pela Connection String que você copiou do Neon.

## Passo 4: Configurar e-mail e senha do admin

Altere `ADMIN_EMAIL` e `ADMIN_PASSWORD` com suas credenciais desejadas.



