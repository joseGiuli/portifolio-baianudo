import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { transformBlocksFromDb } from '@/lib/schemas';

const prisma = new PrismaClient();

// GET /api/projects/slug/[slug] - Buscar projeto por slug (público)
export async function GET(request, { params }) {
  try {
    const { slug } = await params;

    const project = await prisma.project.findUnique({
      where: {
        slug,
        status: 'published', // Apenas projetos publicados
      },
      include: {
        coverImage: true,
        blocks: {
          include: {
            asset: true,
          },
          orderBy: { orderIndex: 'asc' },
        },
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Projeto não encontrado' },
        { status: 404 },
      );
    }

    // Transformar blocos do formato do banco para o formato da API
    const transformedProject = {
      ...project,
      blocks: transformBlocksFromDb(project.blocks),
      heroMetaPt: project.heroMetaPt ? JSON.parse(project.heroMetaPt) : null,
      heroMetaEn: project.heroMetaEn ? JSON.parse(project.heroMetaEn) : null,
    };

    return NextResponse.json(transformedProject);
  } catch (error) {
    console.error('Erro ao buscar projeto por slug:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 },
    );
  }
}
