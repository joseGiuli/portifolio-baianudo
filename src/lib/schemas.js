import { z } from 'zod';

// Schema para bloco de título
export const HeadingBlockSchema = z
  .object({
    type: z.literal('HEADING'),
    level: z.enum(['h1', 'h2', 'h3']).default('h3'),
    textPt: z.string().optional(),
    textEn: z.string().optional(),
    text: z.string().optional(), // Manter retrocompatibilidade
  })
  .refine(
    data => data.textPt || data.textEn || data.text,
    'Título em pelo menos um idioma é obrigatório',
  );

// Schema para bloco de parágrafo
export const ParagraphBlockSchema = z
  .object({
    type: z.literal('PARAGRAPH'),
    htmlPt: z.string().optional(),
    htmlEn: z.string().optional(),
    html: z.string().optional(), // Manter retrocompatibilidade
    markdown: z.string().optional(),
  })
  .refine(
    data => data.htmlPt || data.htmlEn || data.html,
    'Conteúdo em pelo menos um idioma é obrigatório',
  );

// Schema para bloco de imagem
export const ImageBlockSchema = z.object({
  type: z.literal('IMAGE'),
  assetId: z.string().min(1, 'Asset ID é obrigatório'),
  alt: z.string().min(1, 'Texto alternativo é obrigatório'),
  caption: z.string().optional(),
  size: z
    .enum(['small', 'medium', 'large', 'full'])
    .optional()
    .default('large'),
  useCustomSize: z.boolean().optional(),
  customWidth: z.union([z.string(), z.number()]).optional(),
  customHeight: z.union([z.string(), z.number()]).optional(),
  objectFit: z.enum(['cover', 'contain', 'fill']).optional(),
  width: z.number().positive().optional(),
});

// Schema para bloco de botão
export const ButtonBlockSchema = z
  .object({
    type: z.literal('BUTTON'),
    textPt: z.string().optional(),
    textEn: z.string().optional(),
    text: z.string().optional(), // Manter retrocompatibilidade
    href: z.string().min(1, 'Link é obrigatório'),
  })
  .refine(
    data => data.textPt || data.textEn || data.text,
    'Texto do botão em pelo menos um idioma é obrigatório',
  )
  .refine(
    data => {
      try {
        const url = new URL(data.href);
        return url.protocol === 'http:' || url.protocol === 'https:';
      } catch {
        return false;
      }
    },
    {
      message:
        'Link inválido. Deve ser uma URL completa começando com http:// ou https://',
      path: ['href'],
    },
  );

// Schema para bloco de lista
export const ListBlockSchema = z
  .object({
    type: z.literal('LIST'),
    itemsPt: z.array(z.string()).optional(),
    itemsEn: z.array(z.string()).optional(),
    items: z.array(z.string()).optional(), // Manter retrocompatibilidade
  })
  .refine(
    data =>
      (data.itemsPt && data.itemsPt.some(item => item?.trim())) ||
      (data.itemsEn && data.itemsEn.some(item => item?.trim())) ||
      (data.items && data.items.some(item => item?.trim())),
    'Lista precisa ter pelo menos um item com conteúdo em pelo menos um idioma',
  );

// Schema para bloco de divisor
export const DividerBlockSchema = z.object({
  type: z.literal('DIVIDER'),
});

// Union discriminada para todos os tipos de blocos
export const ProjectBlockSchema = z.discriminatedUnion('type', [
  HeadingBlockSchema,
  ParagraphBlockSchema,
  ImageBlockSchema,
  ButtonBlockSchema,
  ListBlockSchema,
  DividerBlockSchema,
]);

// Schema para metadados do hero
export const HeroMetaSchema = z.object({
  label: z.string().min(1, 'Label é obrigatório'),
  value: z.string().min(1, 'Valor é obrigatório'),
});

// Schema para o payload completo do projeto
export const ProjectPayloadSchema = z.object({
  // Campos bilíngues - Português
  titlePt: z.string().min(1, 'Título em português é obrigatório'),
  subtitlePt: z.string().optional(),
  heroMetaPt: z.array(HeroMetaSchema).optional().nullable(),

  // Campos bilíngues - Inglês
  titleEn: z.string().min(1, 'Título em inglês é obrigatório'),
  subtitleEn: z.string().optional(),
  heroMetaEn: z.array(HeroMetaSchema).optional().nullable(),

  // Campos para preview na seção de projetos (temporariamente opcionais para debug)
  previewImage: z.string().optional(),
  previewTitlePt: z.string().optional(),
  previewTitleEn: z.string().optional(),

  status: z.enum(['draft', 'published']).default('draft'),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  coverImageId: z.string().optional(),
  blocks: z.array(ProjectBlockSchema).default([]),
});

// Schema para criação de projeto (sem ID)
export const CreateProjectSchema = z.object({
  // Campos bilíngues - Português
  titlePt: z.string().min(1, 'Título em português é obrigatório'),
  subtitlePt: z.string().optional(),
  heroMetaPt: z.array(HeroMetaSchema).optional().nullable(),

  // Campos bilíngues - Inglês
  titleEn: z.string().min(1, 'Título em inglês é obrigatório'),
  subtitleEn: z.string().optional(),
  heroMetaEn: z.array(HeroMetaSchema).optional().nullable(),

  // Campos para preview na seção de projetos (temporariamente opcionais para debug)
  previewImage: z.string().optional(),
  previewTitlePt: z.string().optional(),
  previewTitleEn: z.string().optional(),
});

// Schema para atualização de projeto (campos opcionais)
export const UpdateProjectSchema = ProjectPayloadSchema.partial();

// Schema para upload de asset
export const AssetSchema = z.object({
  url: z.string().url('URL inválida'),
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
  mime: z.string().min(1, 'Tipo MIME é obrigatório'),
  hash: z.string().min(1, 'Hash é obrigatório'),
  alt: z.string().optional(),
});

// Schema para query de busca de projetos
export const ProjectSearchSchema = z.object({
  status: z.enum(['draft', 'published']).optional(),
  locale: z.enum(['pt', 'en']).optional(),
  q: z.string().optional(), // query de busca
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().max(100).default(10),
});

// Schema para validação de slug
export const SlugSchema = z
  .string()
  .min(1, 'Slug é obrigatório')
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    'Slug deve conter apenas letras minúsculas, números e hífens',
  );

// Utilitários para transformação de dados
export function transformBlocksToDb(blocks) {
  return blocks.map((block, index) => {
    const { asset, assetId, ...blockData } = block;
    return {
      type: block.type,
      orderIndex: index,
      json: JSON.stringify(blockData),
      assetId: assetId || asset?.id || null,
    };
  });
}

export function transformBlocksFromDb(dbBlocks) {
  return dbBlocks
    .sort((a, b) => a.orderIndex - b.orderIndex)
    .map(block => ({
      id: block.id,
      ...JSON.parse(block.json),
      asset: block.asset,
      assetId: block.assetId,
    }));
}

// Função para gerar slug único a partir do título (usa título em português)
export function generateSlug(title) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
    .replace(/\s+/g, '-') // Substitui espaços por hífens
    .replace(/-+/g, '-') // Remove hífens duplicados
    .trim('-'); // Remove hífens no início e fim
}

// Validações customizadas
export function validateHeadingHierarchy(blocks) {
  const headings = blocks.filter(block => block.type === 'HEADING');
  const errors = [];

  for (let i = 1; i < headings.length; i++) {
    const current = headings[i];
    const previous = headings[i - 1];

    const currentLevel = parseInt(current.level.replace('h', ''));
    const previousLevel = parseInt(previous.level.replace('h', ''));

    if (currentLevel > previousLevel + 1) {
      errors.push(`Título "${current.text}" pula níveis de hierarquia`);
    }
  }

  return errors;
}
