import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { AssetSchema } from '@/lib/schemas';
import { v2 as cloudinary } from 'cloudinary';
import crypto from 'crypto';

const prisma = new PrismaClient();

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// POST /api/uploads - Upload de imagem
export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        { error: 'Nenhum arquivo fornecido' },
        { status: 400 },
      );
    }

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Apenas imagens são permitidas' },
        { status: 400 },
      );
    }

    // Gerar hash único para o arquivo
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const hash = crypto.createHash('sha256').update(buffer).digest('hex');

    // Verificar se já existe um asset com esse hash
    const existingAsset = await prisma.asset.findUnique({
      where: { hash },
    });

    if (existingAsset) {
      return NextResponse.json(existingAsset);
    }

    // Converter buffer para base64 para upload no Cloudinary
    const base64Image = `data:${file.type};base64,${buffer.toString('base64')}`;

    // Upload para Cloudinary
    const uploadResult = await cloudinary.uploader.upload(base64Image, {
      folder: 'portfolio', // Pasta no Cloudinary
      public_id: hash, // ID único baseado no hash
      resource_type: 'auto',
      // Otimizações automáticas
      quality: 'auto',
      fetch_format: 'auto',
    });

    // URL pública otimizada do Cloudinary
    const url = uploadResult.secure_url;
    const width = uploadResult.width;
    const height = uploadResult.height;

    // Criar registro no banco
    const asset = await prisma.asset.create({
      data: {
        url,
        width,
        height,
        mime: file.type,
        hash,
        alt: formData.get('alt') || '',
      },
    });

    return NextResponse.json(asset, { status: 201 });
  } catch (error) {
    console.error('Erro no upload:', error);

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

// GET /api/uploads - Listar assets
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;

    const [assets, total] = await Promise.all([
      prisma.asset.findMany({
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.asset.count(),
    ]);

    return NextResponse.json({
      assets,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Erro ao listar assets:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 },
    );
  }
}
