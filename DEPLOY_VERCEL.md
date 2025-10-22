# 🚀 Deploy na Vercel - Guia Completo

## 📋 **Pré-requisitos:**

1. **Conta na Vercel** (gratuita)
2. **Conta no GitHub** (para conectar o repositório)
3. **Banco de dados em produção** (recomendado: PlanetScale, Neon, ou Supabase)

## 🔧 **Passo a Passo:**

### 1. **Preparar o Repositório:**

```bash
# Fazer commit de todas as mudanças
git add .
git commit -m "Preparar para deploy na Vercel"
git push origin main
```

### 2. **Configurar Banco de Dados em Produção:**

#### Opção A: PlanetScale (Recomendado)

1. Acesse [planetscale.com](https://planetscale.com)
2. Crie uma conta gratuita
3. Crie um novo banco de dados
4. Copie a URL de conexão

#### Opção B: Neon

1. Acesse [neon.tech](https://neon.tech)
2. Crie uma conta gratuita
3. Crie um novo projeto
4. Copie a URL de conexão

### 3. **Deploy na Vercel:**

1. **Acesse [vercel.com](https://vercel.com)**
2. **Clique em "New Project"**
3. **Conecte seu repositório GitHub**
4. **Configure as variáveis de ambiente:**

```
DATABASE_URL=sua-url-do-banco-aqui
NEXTAUTH_URL=https://seu-dominio.vercel.app
NEXTAUTH_SECRET=uma-chave-secreta-aleatoria-aqui
```

5. **Configure o Build Command:**
   - Build Command: `pnpm build`
   - Install Command: `pnpm install`
   - Output Directory: `.next`

### 4. **Pós-Deploy:**

1. **Acesse o painel da Vercel**
2. **Vá em "Functions" → "Terminal"**
3. **Execute os comandos do Prisma:**

```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

### 5. **Configurar Domínio (Opcional):**

1. **Vá em "Settings" → "Domains"**
2. **Adicione seu domínio personalizado**
3. **Configure os DNS conforme instruído**

## ⚠️ **Importante:**

- **Use um banco de dados real** (não SQLite) para produção
- **Configure as variáveis de ambiente** corretamente
- **Execute o seed** após o deploy
- **Teste todas as funcionalidades** após o deploy

## 🔍 **Troubleshooting:**

- **Erro de banco**: Verifique se a DATABASE_URL está correta
- **Erro de build**: Verifique se todas as dependências estão no package.json
- **Erro de autenticação**: Verifique se NEXTAUTH_SECRET está configurado

## 📞 **Suporte:**

Se tiver problemas, me chame que te ajudo! 🚀




