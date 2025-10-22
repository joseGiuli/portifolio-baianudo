import { notFound } from 'next/navigation';
import DynamicProjectClient from './DynamicProjectClient';

// Lista de projetos estáticos existentes (para não interferir neles)
const STATIC_PROJECTS = ['ecori', 'joga-ai', 'spotify'];

// Componente principal da página (Server Component)
export default async function ProjectPage({ params }) {
  const { slug } = await params;

  // Se for um projeto estático, não renderizar aqui (eles têm suas próprias páginas)
  if (STATIC_PROJECTS.includes(slug)) {
    notFound();
  }

  // Renderizar projeto dinâmico
  return <DynamicProjectClient slug={slug} />;
}
