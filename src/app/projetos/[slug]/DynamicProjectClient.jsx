'use client';

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import CaseHero from '@/components/projects/ProjectHero';
import MotionFillButton from '@/components/layout/Button';
import HoverZoomLens from '@/components/ui/HoverZoomLens';
import { useTranslation } from 'react-i18next';

export default function DynamicProjectClient({ slug }) {
  const { i18n } = useTranslation();
  const [project, setProject] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProject() {
      try {
        // Buscar projeto dinâmico pelo slug
        const response = await fetch(`/api/projects/slug/${slug}`);

        if (!response.ok) {
          if (response.status === 404) {
            setError('not_found');
          } else {
            setError('server_error');
          }
          return;
        }

        const data = await response.json();
        setProject(data);
        setBlocks(data.blocks || []);
      } catch (err) {
        console.error('Erro ao carregar projeto:', err);
        setError('server_error');
      } finally {
        setLoading(false);
      }
    }

    fetchProject();
  }, [slug]);

  if (loading) {
    return (
      <div className="container-full">
        <div className="column-full">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-neutral">Carregando projeto...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error === 'not_found') {
    notFound();
  }

  if (error === 'server_error') {
    return (
      <div className="container-full">
        <div className="column-full">
          <div className="text-center py-12">
            <h1 className="text-2xl text-neutral mb-4">
              Erro ao carregar projeto
            </h1>
            <p className="text-neutral/70">Tente novamente mais tarde.</p>
          </div>
        </div>
      </div>
    );
  }

  // Verificar se o projeto está publicado
  if (project?.status !== 'published') {
    notFound();
  }

  // Selecionar campos baseados no idioma
  const currentLang = i18n.language || 'pt';
  const isPt = currentLang === 'pt';

  const title = isPt ? project.titlePt : project.titleEn;
  const subtitle = isPt ? project.subtitlePt : project.subtitleEn;
  const heroBackLabel = isPt ? 'Voltar' : 'Back';

  // Parsear heroMeta se existir
  const heroMetaField = isPt ? project.heroMetaPt : project.heroMetaEn;
  const heroMeta = heroMetaField
    ? typeof heroMetaField === 'string'
      ? JSON.parse(heroMetaField)
      : heroMetaField
    : null;

  return (
    <section>
      <div className="container-full">
        <div className="column-full">
          {/* Hero do projeto usando componente CaseHero */}
          <CaseHero
            title={title}
            subtitle={subtitle}
            meta={heroMeta}
            backLabel={heroBackLabel}
          />

          {/* Conteúdo dinâmico */}
          <div className="[&_p]:text-[22px] lg:[&_p]:text-lg [&_p]:leading-10 [&_p]:text-neutral mt-12 lg:mt-2 space-y-8">
            {blocks.map((block, index) => {
              switch (block.type) {
                case 'HEADING':
                  const headingText = isPt
                    ? block.textPt || block.text
                    : block.textEn || block.text;
                  return (
                    <h3
                      key={block.id || index}
                      className="text-4xl lg:text-3xl text-neutral text-center my-12"
                    >
                      {headingText}
                    </h3>
                  );

                case 'PARAGRAPH':
                  const paragraphHtml = isPt
                    ? block.htmlPt || block.html
                    : block.htmlEn || block.html;
                  return (
                    <p
                      key={block.id || index}
                      dangerouslySetInnerHTML={{
                        __html: paragraphHtml || block.markdown || '',
                      }}
                    />
                  );

                case 'IMAGE':
                  if (!block.asset?.url) return null;

                  // Gerar classes de visibilidade
                  const visibilityClasses = `${
                    block.hideOnMobile ? 'lg:hidden' : ''
                  } ${block.hideOnDesktop ? '-lg:hidden' : ''}`.trim();

                  // Se zoom estiver habilitado, usar HoverZoomLens
                  if (block.enableZoom) {
                    return (
                      <figure
                        key={block.id || index}
                        className={visibilityClasses}
                      >
                        <HoverZoomLens
                          src={block.asset.url}
                          largeSrc={block.asset.url}
                          alt={block.alt}
                          width={block.asset.width || 2560}
                          height={block.asset.height || 906}
                          zoom={block.zoomLevel || 2.2}
                          lensSize={block.lensSize || 120}
                          lensBorder={block.lensBorder || 1}
                          className="mx-auto w-[min(100%,1000px)]"
                          lensClassName="border border-vermelho"
                        />
                        {block.caption && (
                          <figcaption className="text-center text-sm text-neutral/70 mt-2">
                            {block.caption}
                          </figcaption>
                        )}
                      </figure>
                    );
                  }

                  // Renderização normal sem zoom
                  // Usar tamanho customizado ou tamanho padrão
                  let imageClass = 'mx-auto';
                  let imageStyle = { maxWidth: '100%' };

                  if (block.useCustomSize && block.customWidth) {
                    // Tamanho personalizado usando inline styles
                    const width = parseInt(block.customWidth);
                    imageStyle.width = `min(100%, ${width}px)`;

                    if (block.customHeight) {
                      // Se altura foi definida
                      const height = parseInt(block.customHeight);
                      imageStyle.height = `${height}px`;
                      imageStyle.objectFit = block.objectFit || 'cover';
                    } else {
                      // Manter proporção
                      imageStyle.height = 'auto';
                    }
                  } else {
                    // Mapear tamanho para inline styles também
                    const sizeMap = {
                      small: 'min(100%, 400px)',
                      medium: 'min(100%, 600px)',
                      large: 'min(100%, 1000px)',
                      full: '100%',
                    };
                    imageStyle.width = sizeMap[block.size] || sizeMap.large;
                    imageStyle.height = 'auto';
                  }

                  return (
                    <figure
                      key={block.id || index}
                      className={visibilityClasses}
                    >
                      <img
                        src={block.asset.url}
                        alt={block.alt}
                        className={imageClass}
                        style={imageStyle}
                      />
                      {block.caption && (
                        <figcaption className="text-center text-sm text-neutral/70 mt-2">
                          {block.caption}
                        </figcaption>
                      )}
                    </figure>
                  );

                case 'BUTTON':
                  const buttonText = isPt
                    ? block.textPt || block.text
                    : block.textEn || block.text;

                  if (!buttonText || !block.href) return null;

                  return (
                    <div
                      key={block.id || index}
                      className="flex justify-center my-8"
                    >
                      <MotionFillButton
                        onClick={() =>
                          window.open(
                            block.href,
                            '_blank',
                            'noopener,noreferrer',
                          )
                        }
                        className="button-pulse border-white hover:!border-white/0 lg:focus:!border-white/0 lg:h-700:text-[14px]"
                        fillClassName="bg-vermelho"
                      >
                        {buttonText}
                      </MotionFillButton>
                    </div>
                  );

                case 'LIST':
                  // Selecionar itens baseados no idioma
                  const listItems = isPt
                    ? block.itemsPt || block.items
                    : block.itemsEn || block.items;

                  // Filtrar itens vazios
                  const validListItems = (listItems || []).filter(item =>
                    item?.trim(),
                  );

                  if (validListItems.length === 0) return null;

                  return (
                    <ul
                      key={block.id || index}
                      className="list-disc marker:text-neutral text-neutral pl-6 space-y-6 text-[22px] lg:text-lg leading-10"
                    >
                      {validListItems.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  );

                case 'DIVIDER':
                  return (
                    <div key={block.id || index} className="my-12 relative">
                      <div className="flex items-center">
                        <div className="flex-grow border-t border-vermelho"></div>
                        <div className="w-2 h-2 bg-vermelho rounded-full mx-4"></div>
                        <div className="flex-grow border-t border-vermelho"></div>
                      </div>
                    </div>
                  );

                default:
                  return null;
              }
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
