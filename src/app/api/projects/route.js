import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import {
  CreateProjectSchema,
  ProjectSearchSchema,
  generateSlug,
  transformBlocksFromDb,
} from '@/lib/schemas';

const prisma = new PrismaClient();

// GET /api/projects - Listar projetos (com busca e paginação)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams);

    const { status, locale, q, page, limit } =
      ProjectSearchSchema.parse(params);

    const where = {
      ...(status && { status }),
      ...(locale && { locale }),
      ...(q && {
        OR: [
          { title: { contains: q } },
          { subtitle: { contains: q } },
          { slug: { contains: q } },
        ],
      }),
    };

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        include: {
          coverImage: true,
          _count: {
            select: { blocks: true },
          },
        },
        orderBy: { updatedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.project.count({ where }),
    ]);

    return NextResponse.json({
      projects,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Erro ao buscar projetos:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 },
    );
  }
}

// POST /api/projects - Criar novo projeto
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      titlePt,
      subtitlePt,
      heroMetaPt,
      heroBackLabelPt,
      titleEn,
      subtitleEn,
      heroMetaEn,
      heroBackLabelEn,
      previewImage,
      previewTitlePt,
      previewTitleEn,
    } = CreateProjectSchema.parse(body);

    // Gerar slug único (usa título em português)
    let baseSlug = generateSlug(titlePt);
    let slug = baseSlug;
    let counter = 1;

    while (await prisma.project.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const project = await prisma.project.create({
      data: {
        slug,
        status: 'draft',
        titlePt,
        subtitlePt,
        heroMetaPt: heroMetaPt ? JSON.stringify(heroMetaPt) : null,
        heroBackLabelPt: heroBackLabelPt || 'Voltar para projetos',
        titleEn,
        subtitleEn,
        heroMetaEn: heroMetaEn ? JSON.stringify(heroMetaEn) : null,
        heroBackLabelEn: heroBackLabelEn || 'Back to projects',
        previewImage,
        previewTitlePt,
        previewTitleEn,
      },
      include: {
        coverImage: true,
        _count: {
          select: { blocks: true },
        },
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar projeto:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 },
    );
  }
}
