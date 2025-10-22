import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import {
  UpdateProjectSchema,
  transformBlocksToDb,
  transformBlocksFromDb,
} from '@/lib/schemas';

const prisma = new PrismaClient();

// GET /api/projects/[id] - Buscar projeto específico
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const project = await prisma.project.findUnique({
      where: { id },
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
    console.error('Erro ao buscar projeto:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 },
    );
  }
}

// PATCH /api/projects/[id] - Atualizar projeto
export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const validatedData = UpdateProjectSchema.parse(body);
    const {
      blocks,
      heroMetaPt,
      heroMetaEn,
      heroBackLabelPt,
      heroBackLabelEn,
      previewImage,
      previewTitlePt,
      previewTitleEn,
      ...projectData
    } = validatedData;

    // Verificar se o projeto existe
    const existingProject = await prisma.project.findUnique({
      where: { id },
    });

    if (!existingProject) {
      return NextResponse.json(
        { error: 'Projeto não encontrado' },
        { status: 404 },
      );
    }

    // Preparar dados do projeto com heroMeta convertido para JSON
    const projectUpdateData = {
      ...projectData,
      ...(heroMetaPt !== undefined && {
        heroMetaPt: heroMetaPt ? JSON.stringify(heroMetaPt) : null,
      }),
      ...(heroMetaEn !== undefined && {
        heroMetaEn: heroMetaEn ? JSON.stringify(heroMetaEn) : null,
      }),
      ...(heroBackLabelPt !== undefined && { heroBackLabelPt }),
      ...(heroBackLabelEn !== undefined && { heroBackLabelEn }),
      ...(previewImage !== undefined && { previewImage }),
      ...(previewTitlePt !== undefined && { previewTitlePt }),
      ...(previewTitleEn !== undefined && { previewTitleEn }),
    };

    // Usar transação para atualizar projeto e blocos atomicamente
    const updatedProject = await prisma.$transaction(async tx => {
      // Atualizar dados do projeto
      const project = await tx.project.update({
        where: { id },
        data: projectUpdateData,
      });

      // Se blocos foram fornecidos, substituir todos
      if (blocks !== undefined) {
        // Remover blocos existentes
        await tx.projectBlock.deleteMany({
          where: { projectId: id },
        });

        // Criar novos blocos
        if (blocks.length > 0) {
          const blockData = transformBlocksToDb(blocks);
          await tx.projectBlock.createMany({
            data: blockData.map(block => ({
              ...block,
              projectId: id,
            })),
          });
        }
      }

      // Buscar projeto completo atualizado
      return await tx.project.findUnique({
        where: { id },
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
    });

    // Transformar blocos para o formato da API
    const transformedProject = {
      ...updatedProject,
      blocks: transformBlocksFromDb(updatedProject.blocks),
      heroMetaPt: updatedProject.heroMetaPt
        ? JSON.parse(updatedProject.heroMetaPt)
        : null,
      heroMetaEn: updatedProject.heroMetaEn
        ? JSON.parse(updatedProject.heroMetaEn)
        : null,
    };

    return NextResponse.json(transformedProject);
  } catch (error) {
    console.error('Erro ao atualizar projeto:', error);

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

// DELETE /api/projects/[id] - Remover projeto
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    // Verificar se o projeto existe
    const existingProject = await prisma.project.findUnique({
      where: { id },
    });

    if (!existingProject) {
      return NextResponse.json(
        { error: 'Projeto não encontrado' },
        { status: 404 },
      );
    }

    // Remover projeto (blocos serão removidos em cascata)
    await prisma.project.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao remover projeto:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 },
    );
  }
}
