import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...\n');

  // ==========================================
  // 1. Criar usuário admin com senha hasheada
  // ==========================================
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  const adminPasswordHash = await bcrypt.hash(adminPassword, 10);
  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: adminPasswordHash,
    },
    create: {
      email: adminEmail,
      name: 'Administrador',
      password: adminPasswordHash,
      role: 'admin',
    },
  });

  console.log('✅ Usuário admin criado/atualizado');
  console.log('   📧 Email:', adminUser.email);
  console.log('   🔑 Senha:', adminPassword, '\n');

  // ==========================================
  // 2. Criar asset de exemplo
  // ==========================================
  const exampleAsset = await prisma.asset.upsert({
    where: { hash: 'example-ecori-hash' },
    update: {},
    create: {
      url: '/images/projetos/ecori.png',
      width: 800,
      height: 600,
      mime: 'image/png',
      hash: 'example-ecori-hash',
      alt: 'Interface do projeto Ecori',
    },
  });

  console.log('✅ Asset de exemplo criado:', exampleAsset.id, '\n');

  // ==========================================
  // 3. Criar projeto exemplo
  // ==========================================
  const exampleProject = await prisma.project.upsert({
    where: { slug: 'projeto-exemplo' },
    update: {},
    create: {
      slug: 'projeto-exemplo',
      status: 'published',

      // Campos PT
      titlePt: 'Redesign do Aplicativo Ecori',
      subtitlePt:
        'Transformando a experiência do usuário em uma plataforma de e-commerce sustentável',
      heroMetaPt: JSON.stringify([
        { label: 'Cliente', value: 'Ecori Brasil' },
        { label: 'Ano', value: '2024' },
        { label: 'Tipo', value: 'UX/UI Design' },
        { label: 'Plataforma', value: 'Mobile App' },
      ]),
      heroBackLabelPt: 'Voltar',

      // Campos EN
      titleEn: 'Ecori App Redesign',
      subtitleEn:
        'Transforming user experience in a sustainable e-commerce platform',
      heroMetaEn: JSON.stringify([
        { label: 'Client', value: 'Ecori Brazil' },
        { label: 'Year', value: '2024' },
        { label: 'Type', value: 'UX/UI Design' },
        { label: 'Platform', value: 'Mobile App' },
      ]),
      heroBackLabelEn: 'Back',

      // SEO
      seoTitle: 'Projeto Exemplo - Ecori App Redesign',
      seoDescription:
        'Case study do redesign completo do aplicativo Ecori com foco em UX e sustentabilidade',

      // Cover
      coverImageId: exampleAsset.id,
    },
  });

  console.log('✅ Projeto exemplo criado');
  console.log('   🔗 Slug:', exampleProject.slug);
  console.log('   📝 Título PT:', exampleProject.titlePt);
  console.log('   📝 Título EN:', exampleProject.titleEn, '\n');

  // ==========================================
  // 4. Criar blocos de conteúdo
  // ==========================================
  const blocks = [
    {
      type: 'HEADING',
      orderIndex: 0,
      json: JSON.stringify({
        level: 'h3',
        text: 'O Desafio',
      }),
    },
    {
      type: 'PARAGRAPH',
      orderIndex: 1,
      json: JSON.stringify({
        html: 'A Ecori, pioneira no mercado de produtos sustentáveis, enfrentava um grande desafio: seu aplicativo móvel não refletia a qualidade e valores da marca. A experiência do usuário estava comprometida por problemas de navegação, fluxo de compra confuso e design ultrapassado.',
      }),
    },
    {
      type: 'PARAGRAPH',
      orderIndex: 2,
      json: JSON.stringify({
        html: 'Nossa missão era clara: reimaginar completamente a experiência do aplicativo, tornando-o intuitivo, moderno e alinhado com os valores de sustentabilidade da marca, enquanto aumentávamos as taxas de conversão.',
      }),
    },
    {
      type: 'HEADING',
      orderIndex: 3,
      json: JSON.stringify({
        level: 'h3',
        text: 'A Solução',
      }),
    },
    {
      type: 'PARAGRAPH',
      orderIndex: 4,
      json: JSON.stringify({
        html: 'Desenvolvemos um sistema de design completo baseado em pesquisa com usuários reais. O novo design prioriza clareza visual, navegação simplificada e um checkout em apenas 3 passos.',
      }),
    },
    {
      type: 'IMAGE',
      orderIndex: 5,
      assetId: exampleAsset.id,
      json: JSON.stringify({
        alt: 'Telas do aplicativo Ecori mostrando o novo design',
        caption:
          'Interface redesenhada com foco em usabilidade e sustentabilidade',
      }),
    },
    {
      type: 'PARAGRAPH',
      orderIndex: 6,
      json: JSON.stringify({
        html: 'Implementamos também um sistema de recompensas gamificado que incentiva compras sustentáveis, resultando em 65% de aumento no engajamento dos usuários.',
      }),
    },
    {
      type: 'HEADING',
      orderIndex: 7,
      json: JSON.stringify({
        level: 'h3',
        text: 'Resultados',
      }),
    },
    {
      type: 'PARAGRAPH',
      orderIndex: 8,
      json: JSON.stringify({
        html: 'O redesign do aplicativo Ecori superou todas as expectativas: <strong>+85% nas conversões</strong>, <strong>+120% no tempo médio de sessão</strong> e <strong>4.8 estrelas</strong> de avaliação nas lojas. Mais importante, conseguimos criar uma experiência que genuinamente reflete os valores de sustentabilidade da marca.',
      }),
    },
  ];

  let createdBlocks = 0;
  for (const blockData of blocks) {
    await prisma.projectBlock.create({
      data: {
        ...blockData,
        projectId: exampleProject.id,
      },
    });
    createdBlocks++;
  }

  console.log(`✅ ${createdBlocks} blocos de conteúdo criados\n`);

  // ==========================================
  // 5. Resumo final
  // ==========================================
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🎉 Seed concluído com sucesso!\n');
  console.log('📌 Próximos passos:');
  console.log('   1. Acesse: http://localhost:3000/admin/login');
  console.log('   2. Use as credenciais acima para fazer login');
  console.log('   3. Explore o projeto em: /admin/projects');
  console.log('   4. Visualize públicamente em: /projetos/projeto-exemplo');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error('❌ Erro no seed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
