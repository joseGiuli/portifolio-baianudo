# 📊 Relatório de Compatibilidade CMS

**Data:** 01/10/2025  
**Projeto:** Portfolio Baiano - Sistema CMS Dinâmico  
**Análise:** Implementação Atual vs. Requisitos do SUPERPROMPT

---

## 🎯 Resumo Executivo

O projeto **JÁ POSSUI** aproximadamente **65% da infraestrutura** solicitada no SUPERPROMPT implementada e funcionando. A arquitetura existente é sólida e compatível com os requisitos. As melhorias necessárias são principalmente **incrementais** e de **aprimoramento de segurança**.

### ✅ Status Geral por Pilar

| Pilar                      | Status      | Compatível?    | Ação Recomendada                      |
| -------------------------- | ----------- | -------------- | ------------------------------------- |
| **Auth (NextAuth)**        | 🟡 Parcial  | ✅ Sim         | **Adaptar** (fortalecer segurança)    |
| **DB/ORM (Prisma)**        | 🟢 Completo | ✅ Sim         | **Reutilizar** (ajustar schema)       |
| **i18n (i18next)**         | 🟢 Completo | ✅ Sim         | **Reutilizar** (estender para blocos) |
| **DnD (@dnd-kit)**         | 🟢 Completo | ✅ Sim         | **Reutilizar** (já implementado)      |
| **Upload (File System)**   | 🟡 Básico   | ⚠️ Limitado    | **Adaptar** (melhorar com sharp)      |
| **Rotas /admin**           | 🟢 Completo | ✅ Sim         | **Reutilizar** (adicionar middleware) |
| **API CRUD**               | 🟢 Completo | ✅ Sim         | **Reutilizar** (adicionar CSRF)       |
| **Tokens de Design**       | 🔴 Ausente  | ⚠️ N/A         | **Criar** do zero                     |
| **Middleware de Proteção** | 🔴 Ausente  | ❌ Gap crítico | **Criar** do zero                     |
| **Blocos Dinâmicos**       | 🟡 Parcial  | ✅ Sim         | **Adaptar** (expandir tipos)          |

---

## 📋 Inventário Detalhado

### 1. ✅ Autenticação (NextAuth)

**Encontrado:**

- ✅ NextAuth v4 configurado (`src/lib/auth.js`)
- ✅ CredentialsProvider com JWT sessions
- ✅ Role-based access control (campo `role` no user)
- ✅ Página de login em `/admin/login`
- ✅ Proteção client-side com `useSession`

**Gaps Identificados:**

- ❌ Middleware de proteção server-side ausente
- ❌ Credenciais hardcoded (admin@example.com/admin123)
- ❌ NEXTAUTH_SECRET está fixo em dev
- ❌ Sem MFA/TOTP
- ❌ Sem magic link
- ❌ Sem rate limiting em login
- ❌ Cookies não configurados com HttpOnly/Secure/SameSite

**Ação:** **ADAPTAR** - Manter NextAuth, adicionar:

1. Middleware server-side (`middleware.ts`)
2. Auth contra DB real (tabela User do Prisma)
3. Variáveis de ambiente para secrets
4. Rate limiting no endpoint de login
5. Cookie security headers

---

### 2. ✅ Banco de Dados & ORM (Prisma)

**Encontrado:**

- ✅ Prisma Client configurado
- ✅ SQLite em desenvolvimento (`prisma/dev.db`)
- ✅ Modelos existentes:
  - `User` (id, email, name, role)
  - `Project` (com campos bilíngues PT/EN **já implementados**)
  - `ProjectBlock` (type, orderIndex, json, assetId)
  - `Asset` (url, width, height, mime, hash)
- ✅ Migrations funcionais
- ✅ Cascata de delete configurada

**Compatibilidade com SUPERPROMPT:**
| Campo do SUPERPROMPT | Campo Existente | Status |
|----------------------|-----------------|--------|
| `titlePt/titleEn` | ✅ `titlePt/titleEn` | Idêntico |
| `subtitlePt/subtitleEn` | ✅ `subtitlePt/subtitleEn` | Idêntico |
| `heroMetaPt/heroMetaEn` | ✅ `heroMetaPt/heroMetaEn` (JSON) | Idêntico |
| `heroBackLabelPt/En` | ✅ `heroBackLabelPt/En` | Idêntico |
| `status` (draft/published) | ✅ `status` | Idêntico |
| `blocks` relação | ✅ `blocks: ProjectBlock[]` | Idêntico |
| `coverImage` relação | ✅ `coverImage: Asset` | Idêntico |

**Gaps Identificados:**

- ⚠️ SQLite (SUPERPROMPT sugere PostgreSQL para produção)
- ❌ Falta modelo `Audit` para logs
- ❌ Blocos não têm campos i18n separados (todo conteúdo no `json`)

**Ação:** **REUTILIZAR** - Schema está 95% pronto. Adicionar:

1. Modelo `Audit` (userId, action, entity, before, after, ip, createdAt)
2. Documentar migração para PostgreSQL em produção (Neon/Supabase)
3. Manter SQLite para dev

---

### 3. ✅ Internacionalização (i18next)

**Encontrado:**

- ✅ i18next + react-i18next configurado
- ✅ Namespaces por seção (`section1`, `project_ecori`, etc.)
- ✅ LanguageDetector (localStorage + navigator)
- ✅ Suporte PT/EN
- ✅ Hook `useTranslation` funcional

**Estrutura Atual:**

```javascript
{
  pt: { section1, section2, ..., project_ecori, layout },
  en: { section1, section2, ..., project_ecori, layout }
}
```

**Ação:** **REUTILIZAR** - Sistema i18n já funciona perfeitamente. Apenas:

1. Adicionar namespace `cms` para admin UI
2. Blocos dinâmicos já usam campos bilíngues do DB (titlePt/En)

---

### 4. ✅ Drag & Drop (@dnd-kit)

**Encontrado:**

- ✅ `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` instalados
- ✅ Implementação funcional em `/admin/projects/[id]/page.jsx`:
  - `DndContext` com `closestCenter`
  - `SortableContext` com `verticalListSortingStrategy`
  - `PointerSensor` + `KeyboardSensor` com `sortableKeyboardCoordinates`
  - `arrayMove` para reordenação
- ✅ ARIA labels e acessibilidade básica

**Ação:** **REUTILIZAR** - Implementação já atende os requisitos do SUPERPROMPT.

---

### 5. ⚠️ Upload de Imagens (File System)

**Encontrado:**

- ✅ Componente `ImageUpload.jsx` com drag & drop
- ✅ API `/api/uploads` funcional
- ✅ Deduplicação por hash SHA-256
- ✅ Validação de tipo e tamanho (max 5MB)
- ✅ Armazenamento em `public/uploads/`
- ✅ Modelo `Asset` no DB

**Gaps Identificados:**

- ❌ Sem `blurDataURL` (placeholder para loading)
- ❌ Sem otimização de imagens (sharp/imagemin)
- ❌ Sem CDN (SUPERPROMPT sugere UploadThing/Cloudinary)
- ❌ Dimensões (width/height) não estão sendo extraídas

**Ação:** **ADAPTAR** - Manter sistema atual para dev, adicionar:

1. `sharp` para obter dimensões e gerar `blurDataURL`
2. Documentar integração opcional com Cloudinary
3. Adicionar campo `blurDataURL` no modelo Asset

---

### 6. ✅ Rotas Admin (/admin)

**Encontrado:**

- ✅ `/admin` - Redirect para login ou projects
- ✅ `/admin/login` - Tela de login completa
- ✅ `/admin/projects` - Lista de projetos com busca, filtros, paginação
- ✅ `/admin/projects/new` - Criar novo projeto
- ✅ `/admin/projects/[id]` - Editor completo com:
  - Campos bilíngues PT/EN lado a lado ✅
  - HeroMeta com add/remove dinâmico ✅
  - Editor de blocos com DnD ✅
  - Preview em tempo real ✅
  - Auto-save funcional ✅

**Ação:** **REUTILIZAR** - UI admin já está excelente!

---

### 7. ✅ API REST (/api)

**Encontrado:**

- ✅ `GET /api/projects` - Listar com busca, paginação, filtros
- ✅ `POST /api/projects` - Criar projeto
- ✅ `GET /api/projects/[id]` - Buscar por ID
- ✅ `PATCH /api/projects/[id]` - Atualizar projeto (com transação atômica)
- ✅ `DELETE /api/projects/[id]` - Deletar projeto
- ✅ `GET /api/projects/slug/[slug]` - Buscar por slug (implícito)
- ✅ `POST /api/uploads` - Upload de imagens
- ✅ Validação Zod em todas as rotas
- ✅ Error handling estruturado

**Gaps Identificados:**

- ❌ Sem CSRF tokens
- ❌ Sem rate limiting
- ❌ Sem headers de segurança (CORS, CSP)

**Ação:** **REUTILIZAR** - API está bem estruturada. Adicionar:

1. CSRF protection (edge middleware ou lib)
2. Rate limiting (@upstash/ratelimit ou similar)
3. Headers de segurança

---

### 8. ⚠️ Blocos de Conteúdo (Tipos)

**Implementado Atualmente:**
| Tipo | Status | i18n? |
|------|--------|-------|
| `HEADING` (h1/h2/h3) | ✅ Funcional | ❌ Monolíngue |
| `PARAGRAPH` | ✅ Funcional | ❌ Monolíngue |
| `IMAGE` | ✅ Funcional | ❌ Alt monolíngue |

**Tipos Faltantes (SUPERPROMPT):**
| Tipo | Status |
|------|--------|
| `HERO` (bloco dinâmico) | ❌ Hero é estático no Project |
| `IMAGE_GRID` | ❌ Não implementado |
| `QUOTE` | ❌ Não implementado |
| `LIST` (bullets/números) | ❌ Não implementado |
| `VIDEO` | ❌ Não implementado |
| `RICH_TEXT` (i18n) | ❌ PARAGRAPH não tem PT/EN |

**Ação:** **ADAPTAR** - Expandir sistema de blocos:

1. Adicionar tipos: HERO, IMAGE_GRID, QUOTE, LIST, VIDEO
2. Migrar blocos para terem campos i18n (textPt/textEn, htmlPt/htmlEn)
3. Atualizar schemas Zod
4. Atualizar editor admin
5. Atualizar renderizador público

---

### 9. 🔴 Tokens de Design (Centralização)

**Encontrado:**

- ❌ Não existe arquivo `lib/design-system.ts/js`
- ✅ Classes estão no `CaseHero.jsx` (fonte de verdade)
- ✅ Classes também replicadas em `tailwind.config.js` (cores, breakpoints)

**Classes Identificadas no CaseHero:**

```javascript
{
  section: "relative -lg:pt-20",
  backLinkWrap: "mb-6",
  backLink: "inline-flex items-center gap-2 text-neutral hover:text-vermelho transition-colors",
  backIcon: "size-8",
  backText: "text-2xl lg:text-xl",
  title: "text-vermelho font-bold text-5xl lg:text-3xl leading-tight tracking-tight",
  subtitle: "text-neutral text-4xl lg:text-2xl mt-2 max-w-4xl",
  metaWrap: "mt-8 grid grid-cols-1 gap-y-6 gap-x-8 -lg:grid-cols-4",
  metaLabel: "text-vermelho text-xl lg:text-base",
  metaValue: "text-neutral text-xl lg:text-base mt-1",
}
```

**Ação:** **CRIAR** do zero:

1. Arquivo `src/lib/design-system.js` com tokens extraídos
2. Refatorar `CaseHero` para importar tokens
3. Usar tokens no renderizador de blocos dinâmicos

---

### 10. 🔴 Middleware de Proteção

**Encontrado:**

- ❌ Nenhum arquivo `middleware.ts/js` no root ou src/
- ✅ Proteção client-side com `useSession` + `useRouter`

**Gaps de Segurança:**

- API `/api/projects` está **desprotegida** (qualquer um pode chamar)
- Rotas `/admin/*` acessíveis sem server-side check
- Sem validação de role em mutações

**Ação:** **CRIAR** do zero:

1. `middleware.ts` no root
2. Proteger `/admin/*` e `/api/projects` (exceto GET public)
3. Verificar session + role

---

### 11. ✅ Renderização Pública

**Encontrado:**

- ✅ Rota `/projetos/[slug]` implementada
- ✅ `DynamicProjectClient.jsx` funcional:
  - Busca projeto por slug
  - Verifica `status === 'published'`
  - Renderiza `CaseHero` com dados i18n
  - Renderiza blocos dinamicamente
  - Suporte a idioma atual (pt/en)

**Ação:** **REUTILIZAR** - Funciona bem. Apenas expandir quando novos tipos de bloco forem adicionados.

---

## 🚨 Gaps Críticos Identificados

### Segurança

1. ❌ **Middleware server-side** - rotas admin acessíveis sem proteção adequada
2. ❌ **CSRF protection** - mutações sem token anti-CSRF
3. ❌ **Rate limiting** - sem proteção contra brute-force
4. ❌ **Credenciais hardcoded** - auth não usa DB

### Funcionalidade

5. ❌ **Tokens de design centralizados** - classes duplicadas, sem single source of truth
6. ❌ **Blocos i18n** - HEADING/PARAGRAPH sem campos PT/EN separados
7. ❌ **Tipos de blocos** - faltam HERO, QUOTE, LIST, VIDEO, IMAGE_GRID
8. ❌ **Audit log** - sem rastreamento de mudanças

### Otimização

9. ⚠️ **Upload de imagens** - sem sharp, sem blurDataURL, sem CDN
10. ⚠️ **DB em produção** - SQLite não é ideal (migrar para PostgreSQL)

---

## 📊 Matriz de Compatibilidade

| Requisito SUPERPROMPT | Implementação Atual                  | Gap (%) | Ação       |
| --------------------- | ------------------------------------ | ------- | ---------- |
| Auth + Sessions       | NextAuth + JWT                       | 20%     | Adaptar    |
| DB Models             | Prisma (User, Project, Block, Asset) | 5%      | Reutilizar |
| i18n                  | i18next PT/EN                        | 0%      | Reutilizar |
| Drag & Drop           | @dnd-kit                             | 0%      | Reutilizar |
| Upload                | File System + Asset DB               | 30%     | Adaptar    |
| Admin UI              | /admin/\* completo                   | 10%     | Reutilizar |
| API CRUD              | RESTful + Zod                        | 15%     | Reutilizar |
| Blocos                | 3 tipos (HEADING, PARAGRAPH, IMAGE)  | 60%     | Adaptar    |
| Tokens Design         | Ausente                              | 100%    | Criar      |
| Middleware            | Ausente                              | 100%    | Criar      |
| Render Público        | DynamicProjectClient                 | 10%     | Reutilizar |
| Audit Log             | Ausente                              | 100%    | Criar      |

**Média de Gap Geral:** **35%** (ou seja, **65% pronto**)

---

## ✅ Decisões de Arquitetura

### Reutilizar (Compatível 100%)

- ✅ NextAuth (apenas fortalecer)
- ✅ Prisma + schema bilíngue
- ✅ i18next
- ✅ @dnd-kit
- ✅ Admin UI existente
- ✅ API REST existente

### Adaptar (Compatível com extensões)

- 🧩 Sistema de blocos (expandir tipos + i18n)
- 🧩 Upload (adicionar sharp + blurDataURL)
- 🧩 Auth (migrar para DB, secrets)

### Criar do Zero (Gap)

- 🆕 Middleware de proteção server-side
- 🆕 Design tokens (`lib/design-system.js`)
- 🆕 CSRF + Rate limiting
- 🆕 Audit log
- 🆕 Blocos: HERO, QUOTE, LIST, VIDEO, IMAGE_GRID

---

## 🎯 Recomendações de Implementação

### Fase 1 - Segurança (Crítico) ⚠️

1. Criar `middleware.ts` para proteger `/admin` e `/api/projects`
2. Mover auth para DB (hash bcrypt de senhas)
3. Variáveis de ambiente (`NEXTAUTH_SECRET`, `DATABASE_URL`)
4. Rate limiting em `/api/auth`
5. CSRF tokens em mutations

### Fase 2 - Tokens de Design ⭐

6. Criar `src/lib/design-system.js` com tokens do `CaseHero`
7. Refatorar `CaseHero` para usar tokens
8. Documentar tokens (README)

### Fase 3 - Blocos Avançados 🎨

9. Migrar blocos para i18n (textPt/En, htmlPt/En, altPt/En)
10. Adicionar tipos: HERO, IMAGE_GRID, QUOTE, LIST, VIDEO
11. Atualizar schemas Zod + DB migration
12. Expandir editor admin
13. Expandir renderizador público

### Fase 4 - Auditoria & Observabilidade 📊

14. Modelo `Audit` + logging em mutations
15. Dashboard de auditoria em `/admin/audit`

### Fase 5 - Otimizações 🚀

16. Integrar `sharp` para dimensões + blurDataURL
17. Documentar migração para PostgreSQL
18. Opcional: integrar Cloudinary/UploadThing

---

## 🔧 Variáveis de Ambiente Necessárias

```env
# Existente (presumido)
DATABASE_URL=file:./prisma/dev.db

# A ADICIONAR
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<gerar com openssl rand -base64 32>
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD_HASH=<bcrypt hash>

# Opcional (Fase 5)
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
UPLOADTHING_SECRET=...
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
```

---

## 📝 Conclusão

O projeto está **muito bem encaminhado** — a arquitetura core (DB, API, Admin UI, i18n) está **sólida e compatível**. Os gaps são principalmente de:

1. **Segurança** (middleware, CSRF, rate limit)
2. **Extensão de funcionalidades** (novos tipos de blocos, i18n em blocos)
3. **Centralização de tokens** (design system)

**Nenhuma reescrita ou refatoração grande é necessária.** Podemos implementar as melhorias de forma **incremental e sem quebrar o existente**.

---

**Próximos Passos:**

1. Revisar este relatório com o desenvolvedor
2. Priorizar fases (sugestão: Fase 1 → Fase 2 → Fase 3)
3. Criar TODO list detalhado
4. Implementar em PRs atômicos

**Status Final:** ✅ **PROJETO COMPATÍVEL — PRONTO PARA EVOLUÇÃO**

