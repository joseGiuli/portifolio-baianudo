# 🖼️ Guia Completo: Configuração do Cloudinary

Este guia explica como configurar o **Cloudinary** para hospedar as imagens do seu portfólio na nuvem.

## 📋 Por que Cloudinary?

✅ **Plano gratuito generoso** - 25 créditos/mês (~25GB de armazenamento e 25GB de tráfego)  
✅ **CDN global** - Imagens carregam super rápido em qualquer lugar do mundo  
✅ **Otimização automática** - Compressão e formato ideal (WebP, AVIF, etc.)  
✅ **Transformações dinâmicas** - Redimensionar, cortar e modificar imagens via URL  
✅ **Sem limite de imagens** - Apenas limite de espaço e transferência

---

## 🚀 Passo 1: Criar Conta no Cloudinary

1. **Acesse**: [https://cloudinary.com/users/register/free](https://cloudinary.com/users/register/free)

2. **Preencha o formulário**:

   - Nome
   - Email
   - Senha
   - Tipo de conta: **Escolha "Programmer"**

3. **Confirme seu email** - Verifique sua caixa de entrada

4. **Faça login** em [https://console.cloudinary.com/](https://console.cloudinary.com/)

---

## 🔑 Passo 2: Obter Credenciais

Após fazer login no **Dashboard do Cloudinary**:

1. Na página inicial, você verá um painel chamado **"Product Environment Credentials"**

2. **Copie as seguintes informações**:

   ```
   Cloud Name: exemplo_cloud_name
   API Key: 123456789012345
   API Secret: AbCdEfGhIjKlMnOpQrStUvWxYz
   ```

3. ⚠️ **IMPORTANTE**: Nunca compartilhe sua `API Secret` publicamente!

---

## ⚙️ Passo 3: Configurar Variáveis de Ambiente

### 3.1 - Criar arquivo `.env.local`

Na **raiz do seu projeto** (mesma pasta do `package.json`), crie um arquivo chamado **`.env.local`**:

```bash
# No Windows PowerShell ou CMD
cd "C:\Users\zelui\Área de Trabalho\portifolio-baiano-main"
type nul > .env.local
```

Ou crie manualmente pelo VS Code/Editor de texto.

### 3.2 - Adicionar as credenciais

Abra o arquivo `.env.local` e cole o seguinte conteúdo, **substituindo** pelos seus valores:

```env
# ====================================
# CLOUDINARY - Upload de Imagens
# ====================================
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=seu_cloud_name_aqui
CLOUDINARY_API_KEY=sua_api_key_aqui
CLOUDINARY_API_SECRET=seu_api_secret_aqui

# ====================================
# NEXTAUTH - Autenticação
# ====================================
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=sua_secret_key_aleatoria_super_segura_aqui
```

**Exemplo com valores reais:**

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dkj8ktaij
CLOUDINARY_API_KEY=427447545624745
CLOUDINARY_API_SECRET=kZjuOzKZX0TZzvkAxBCLUfc0MKM
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=xYz123AbC456DeF789GhI012JkL345MnO678PqR901StU234VwX567YzA890BcD
```

### 3.3 - Gerar NEXTAUTH_SECRET

Se você não tem uma `NEXTAUTH_SECRET`, gere uma com o seguinte comando:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copie o resultado e cole no `.env.local`.

---

## 🧪 Passo 4: Testar Localmente

1. **Reinicie o servidor de desenvolvimento**:

   ```bash
   pnpm dev
   ```

2. **Acesse o painel admin**: `http://localhost:3000/admin`

3. **Faça login** (se necessário)

4. **Tente fazer upload de uma imagem** em um projeto

5. **Verifique no Cloudinary**:
   - Acesse: [https://console.cloudinary.com/console/media_library/](https://console.cloudinary.com/console/media_library/)
   - Você deve ver suas imagens na pasta `portfolio/`

---

## 🚢 Passo 5: Deploy (Vercel/Netlify)

### Para Vercel:

1. Acesse o **Dashboard da Vercel**: [https://vercel.com/dashboard](https://vercel.com/dashboard)

2. Selecione seu projeto

3. Vá em **Settings** → **Environment Variables**

4. **Adicione cada variável** (uma por vez):

   ```
   Nome: NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
   Valor: seu_cloud_name

   Nome: CLOUDINARY_API_KEY
   Valor: sua_api_key

   Nome: CLOUDINARY_API_SECRET
   Valor: seu_api_secret

   Nome: NEXTAUTH_URL
   Valor: https://seu-dominio.vercel.app

   Nome: NEXTAUTH_SECRET
   Valor: sua_secret_key
   ```

5. **Marque todas as opções**: Production, Preview, Development

6. **Clique em "Save"**

7. **Faça um novo deploy** ou clique em "Redeploy" no último deploy

---

## 🔒 Segurança: Arquivo `.gitignore`

Certifique-se de que o arquivo `.env.local` **NÃO** seja enviado para o Git.

Verifique se o seu `.gitignore` contém:

```
# Variáveis de ambiente
.env
.env.local
.env.*.local
.env.development
.env.production
```

---

## 📁 Organização no Cloudinary

Por padrão, as imagens serão salvas em:

```
Cloudinary → Media Library → portfolio/
```

Você pode alterar a pasta no código, editando:

```javascript
// src/app/api/uploads/route.js
folder: 'portfolio', // ← Mude aqui se quiser outro nome
```

---

## 💰 Limites do Plano Gratuito

| Recurso        | Limite Gratuito |
| -------------- | --------------- |
| Armazenamento  | 25 GB           |
| Transferência  | 25 GB/mês       |
| Transformações | 25 créditos/mês |
| Imagens        | Ilimitadas      |

Para um portfólio pessoal, isso é mais do que suficiente! 🎉

---

## ❓ Problemas Comuns

### ❌ Erro: "Must supply api_key"

**Solução**: Verifique se as variáveis de ambiente estão corretas no `.env.local` e reinicie o servidor.

### ❌ Erro: "Invalid signature"

**Solução**: Verifique se o `API Secret` está correto (sem espaços extras).

### ❌ Imagens não aparecem no site

**Solução**:

1. Verifique o console do navegador (F12)
2. Verifique se a URL retornada começa com `https://res.cloudinary.com/`
3. Acesse a URL diretamente no navegador para confirmar que a imagem existe

### ❌ Upload funciona local, mas não na Vercel

**Solução**: Certifique-se de que adicionou as variáveis de ambiente na Vercel e fez um novo deploy.

---

## 🎯 Próximos Passos

- ✅ **Pronto!** Suas imagens agora estão na nuvem
- ✅ Não há mais risco de perder imagens ao fazer deploy
- ✅ Site mais rápido com CDN do Cloudinary
- ✅ Otimização automática de imagens

---

## 📚 Recursos Úteis

- **Documentação oficial**: [https://cloudinary.com/documentation](https://cloudinary.com/documentation)
- **Dashboard**: [https://console.cloudinary.com/](https://console.cloudinary.com/)
- **Media Library**: [https://console.cloudinary.com/console/media_library/](https://console.cloudinary.com/console/media_library/)
- **Transformações**: [https://cloudinary.com/documentation/image_transformations](https://cloudinary.com/documentation/image_transformations)

---

**✨ Tudo configurado!** Agora você pode fazer upload de imagens com segurança e velocidade! 🚀
