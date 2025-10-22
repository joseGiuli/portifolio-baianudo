# 🚀 Plano de Execução - Evolução do CMS

**Base:** Sistema 65% completo ✅  
**Objetivo:** Completar 100% com paridade ao SUPERPROMPT

---

## 📊 Priorização (MoSCoW)

### 🔴 MUST (Crítico - Segurança)

1. **Middleware server-side** - Proteger /admin e APIs
2. **Auth contra DB** - Remover credenciais hardcoded
3. **Variáveis de ambiente** - Secrets seguros

### 🟡 SHOULD (Alta Prioridade - Funcionalidade Core)

4. **Design Tokens** - Centralizar classes do CaseHero
5. **Blocos i18n** - Campos PT/EN em HEADING/PARAGRAPH/IMAGE
6. **Novos tipos de blocos** - HERO, QUOTE, LIST, VIDEO, IMAGE_GRID

### 🟢 COULD (Média Prioridade - Aprimoramentos)

7. **CSRF + Rate Limiting** - Proteção adicional
8. **Audit Log** - Rastreamento de mudanças
9. **Upload otimizado** - sharp + blurDataURL

### 🔵 WON'T (Baixa Prioridade - Futuro)

10. Migração para PostgreSQL (manter SQLite em dev)
11. Integração Cloudinary/UploadThing (opcional)
12. MFA/TOTP (feature avançada)

---

## 🎯 Fases de Implementação

### Fase 1: Segurança (1-2 dias) ⚠️

**Tarefas:**

- [x] ~~Análise de compatibilidade~~ ✅
- [ ] Criar `middleware.ts` (proteger rotas)
- [ ] Migrar auth para User do DB (bcrypt)
- [ ] Configurar `.env` com secrets
- [ ] Adicionar rate limiting básico

**Arquivos a modificar:**

```
+ middleware.ts (novo)
+ .env.example (novo)
+ src/lib/auth.js (atualizar authorize)
+ prisma/seed.mjs (adicionar admin user)
```

**Critérios de Aceitação:**

- ✅ `/admin/*` só acessível com session válida
- ✅ APIs `/api/projects/*` (exceto GET públicos) protegidas
- ✅ Login funciona contra DB com senha hasheada
- ✅ NEXTAUTH_SECRET em variável de ambiente

---

### Fase 2: Design Tokens (1 dia) ⭐

**Tarefas:**

- [ ] Criar `src/lib/design-system.js`
- [ ] Extrair tokens do `CaseHero.jsx`
- [ ] Refatorar `CaseHero` para usar tokens
- [ ] Documentar tokens no README

**Estrutura do design-system.js:**

```javascript
export const heroTokens = {
  section: 'relative -lg:pt-20',
  backLinkWrap: 'mb-6',
  backLink:
    'inline-flex items-center gap-2 text-neutral hover:text-vermelho transition-colors',
  // ... todos os tokens
};

export const typographyScale = {
  h1: 'text-vermelho font-bold text-5xl lg:text-3xl leading-tight tracking-tight',
  h2: 'text-4xl lg:text-3xl text-neutral',
  h3: 'text-4xl lg:text-3xl text-neutral text-center',
  p: 'text-[22px] lg:text-lg leading-10 text-neutral',
  // ...
};
```

**Critérios de Aceitação:**

- ✅ CaseHero renderiza identicamente usando tokens
- ✅ Tokens exportados e reutilizáveis
- ✅ Zero regressão visual

---

### Fase 3: Blocos Avançados (2-3 dias) 🎨

#### 3.1 - Migração i18n em blocos existentes

**Migration Prisma:**

```prisma
// Adicionar suporte a campos bilíngues no JSON dos blocos
// (não quebra compatibilidade - retrocompatível)
```

**Schemas Zod (src/lib/schemas.js):**

```javascript
// Atualizar HeadingBlockSchema
export const HeadingBlockSchema = z.object({
  type: z.literal('HEADING'),
  level: z.enum(['h1', 'h2', 'h3']).default('h3'),
  textPt: z.string().min(1),
  textEn: z.string().min(1),
});

// Atualizar ParagraphBlockSchema
export const ParagraphBlockSchema = z.object({
  type: z.literal('PARAGRAPH'),
  htmlPt: z.string(),
  htmlEn: z.string(),
});

// Atualizar ImageBlockSchema
export const ImageBlockSchema = z.object({
  type: z.literal('IMAGE'),
  assetId: z.string().min(1),
  altPt: z.string().min(1),
  altEn: z.string().min(1),
  captionPt: z.string().optional(),
  captionEn: z.string().optional(),
});
```

#### 3.2 - Novos tipos de blocos

**Adicionar ao src/lib/schemas.js:**

```javascript
// HERO Block (dinâmico)
export const HeroBlockSchema = z.object({
  type: z.literal('HERO'),
  kickerPt: z.string().optional(),
  kickerEn: z.string().optional(),
  titlePt: z.string().min(1),
  titleEn: z.string().min(1),
  subtitlePt: z.string().optional(),
  subtitleEn: z.string().optional(),
  assetId: z.string().optional(),
  align: z.enum(['left', 'center']).default('left'),
});

// QUOTE Block
export const QuoteBlockSchema = z.object({
  type: z.literal('QUOTE'),
  textPt: z.string().min(1),
  textEn: z.string().min(1),
  authorPt: z.string().optional(),
  authorEn: z.string().optional(),
});

// LIST Block
export const ListBlockSchema = z.object({
  type: z.literal('LIST'),
  style: z.enum(['bullet', 'numbered']),
  itemsPt: z.array(z.string()),
  itemsEn: z.array(z.string()),
});

// VIDEO Block
export const VideoBlockSchema = z.object({
  type: z.literal('VIDEO'),
  provider: z.enum(['youtube', 'vimeo', 'mux']),
  videoId: z.string(),
  captionPt: z.string().optional(),
  captionEn: z.string().optional(),
});

// IMAGE_GRID Block
export const ImageGridBlockSchema = z.object({
  type: z.literal('IMAGE_GRID'),
  columns: z.enum([1, 2, 3]).default(2),
  items: z.array(
    z.object({
      assetId: z.string(),
      altPt: z.string(),
      altEn: z.string(),
    }),
  ),
});
```

#### 3.3 - Atualizar Editor Admin

**Arquivo: src/app/admin/projects/[id]/page.jsx**

Adicionar componentes `BlockEditor` para cada novo tipo:

- `HeroBlockEditor` (tabs PT/EN, upload imagem, alinhamento)
- `QuoteBlockEditor` (tabs PT/EN, autor opcional)
- `ListBlockEditor` (tabs PT/EN, add/remove items, toggle bullet/numbered)
- `VideoBlockEditor` (provider select, videoId, caption PT/EN)
- `ImageGridBlockEditor` (upload múltiplo, columns select)

#### 3.4 - Atualizar Renderizador Público

**Arquivo: src/app/projetos/[slug]/DynamicProjectClient.jsx**

Adicionar cases no switch:

```javascript
case 'HERO':
  return <HeroBlock key={block.id} locale={currentLang} data={block} />;
case 'QUOTE':
  return <QuoteBlock key={block.id} locale={currentLang} data={block} />;
// ... etc
```

**Critérios de Aceitação:**

- ✅ Todos blocos têm campos PT/EN
- ✅ Editor admin mostra tabs PT/EN lado a lado
- ✅ Renderizador público muda conteúdo conforme idioma
- ✅ 5 novos tipos funcionando (HERO, QUOTE, LIST, VIDEO, IMAGE_GRID)

---

### Fase 4: Auditoria & Observabilidade (1 dia) 📊

**Migration Prisma:**

```prisma
model Audit {
  id        String   @id @default(cuid())
  userId    String?
  action    String   // 'CREATE' | 'UPDATE' | 'DELETE' | 'PUBLISH' | 'UNPUBLISH'
  entity    String   // 'Project' | 'Block' | 'Asset'
  entityId  String
  before    String?  // JSON
  after     String?  // JSON
  ip        String?
  userAgent String?
  createdAt DateTime @default(now())

  @@index([entityId])
  @@index([userId])
  @@map("audit_logs")
}
```

**Integração em APIs:**

```javascript
// Em cada mutation (CREATE/UPDATE/DELETE)
await prisma.audit.create({
  data: {
    userId: session.user.id,
    action: 'UPDATE',
    entity: 'Project',
    entityId: project.id,
    before: JSON.stringify(existingProject),
    after: JSON.stringify(updatedProject),
    ip: request.headers.get('x-forwarded-for'),
    userAgent: request.headers.get('user-agent'),
  },
});
```

**UI Admin:**

- [ ] Criar `/admin/audit` com lista de logs
- [ ] Filtros: usuário, ação, entidade, data
- [ ] Diff viewer (before/after)

---

### Fase 5: Otimizações (1 dia) 🚀

**Upload com sharp:**

```javascript
import sharp from 'sharp';

const metadata = await sharp(buffer).metadata();
const blurDataURL = await sharp(buffer)
  .resize(10, 10)
  .blur()
  .toBuffer()
  .then(buf => `data:image/jpeg;base64,${buf.toString('base64')}`);

const asset = await prisma.asset.create({
  data: {
    // ... campos existentes
    width: metadata.width,
    height: metadata.height,
    blurDataURL,
  },
});
```

**CSRF Protection:**

```javascript
// middleware.ts
import { csrf } from '@edge-runtime/csrf';
// Adicionar validação
```

**Rate Limiting:**

```javascript
import { Ratelimit } from '@upstash/ratelimit';
// Limitar login: 5 tentativas por 15min
```

---

## 📦 Dependências Adicionais

```bash
pnpm add sharp @upstash/ratelimit @upstash/redis
pnpm add -D @types/sharp
```

---

## 🧪 Testes de Aceitação

### Checklist Final

**Segurança:**

- [ ] Middleware bloqueia acessos não autorizados
- [ ] Auth funciona com DB (sem credenciais hardcoded)
- [ ] CSRF proteção ativa em mutations
- [ ] Rate limiting funcional em /api/auth

**Design Tokens:**

- [ ] `design-system.js` exporta todos tokens
- [ ] CaseHero usa tokens (zero regressão)
- [ ] Blocos dinâmicos usam tokens

**Blocos:**

- [ ] HEADING/PARAGRAPH/IMAGE têm campos PT/EN
- [ ] HERO, QUOTE, LIST, VIDEO, IMAGE_GRID funcionam
- [ ] Editor mostra tabs PT/EN lado a lado
- [ ] Renderizador público muda com idioma

**Auditoria:**

- [ ] Audit log grava todas mutations
- [ ] UI /admin/audit mostra histórico
- [ ] Diff viewer funciona

**Upload:**

- [ ] sharp extrai dimensões
- [ ] blurDataURL gerado
- [ ] Preview com placeholder funciona

---

## 🔄 Rollback Plan

Caso algo quebre:

1. **Fase 1 (Segurança):** Remover middleware.ts, reverter auth.js
2. **Fase 2 (Tokens):** Manter design-system.js, reverter CaseHero.jsx
3. **Fase 3 (Blocos):** Migration rollback, reverter schemas
4. **Fase 4 (Audit):** Migration rollback, remover /admin/audit
5. **Fase 5 (Upload):** Rollback package.json, remover sharp

**Feature Flags:**

```env
CMS_ENHANCED_BLOCKS=true
CMS_AUDIT_LOG=true
CMS_CSRF_PROTECTION=true
```

---

## 📚 Documentação a Produzir

1. **README_CMS.md** - Guia do editor (com GIFs)
2. **DESIGN_TOKENS.md** - Documentação de tokens
3. **.env.example** - Variáveis necessárias
4. **MIGRATION_GUIDE.md** - Como migrar projetos estáticos
5. **API_DOCS.md** - Documentação da API REST

---

## ✅ Conclusão

**Tempo estimado total:** 6-8 dias de desenvolvimento

**Entregas incrementais (PRs):**

- PR #1: Segurança (middleware + auth DB)
- PR #2: Design tokens
- PR #3: Blocos i18n + novos tipos
- PR #4: Audit log
- PR #5: Upload otimizado + CSRF/Rate limit

**Status atual:** ✅ Análise completa, pronto para execução

---

**Próximo passo:** Começar Fase 1 (Segurança) com criação do middleware.ts

