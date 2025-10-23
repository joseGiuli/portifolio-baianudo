'use client';

import Image from 'next/image';
import MotionFillButton from '@/components/layout/Button';
import HoverZoomLens from '@/components/ui/HoverZoomLens';
import {
  renderHeading,
  renderParagraph,
  renderImage,
  renderContentWrapper,
  processContent,
} from '@/lib/adapters';

// Componente para renderizar um bloco individual
function BlockRenderer({ block }) {
  switch (block.type) {
    case 'HEADING': {
      const { tag: Tag, className } = renderHeading(block.level, block.text);
      return <Tag className={className}>{block.text}</Tag>;
    }

    case 'PARAGRAPH': {
      const { className } = renderParagraph('');
      const content = processContent(block.html, block.markdown);

      return (
        <p
          className={className}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      );
    }

    case 'IMAGE': {
      if (!block.asset?.url) {
        return (
          <div className="bg-gray-200 rounded-lg p-8 text-center text-gray-500">
            Imagem não encontrada
          </div>
        );
      }

      // Gerar classes de visibilidade
      const visibilityClasses = `${
        block.hideOnMobile ? 'lg:hidden' : ''
      } ${block.hideOnDesktop ? '-lg:hidden' : ''}`.trim();

      // Se zoom estiver habilitado, usar HoverZoomLens
      if (block.enableZoom) {
        return (
          <figure className={visibilityClasses}>
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
      const { props } = renderImage(block.asset?.url || '', block.alt, {
        width: block.width || block.asset?.width,
        height: block.asset?.height,
      });

      return (
        <figure className={visibilityClasses}>
          <Image
            src={block.asset.url}
            alt={block.alt}
            width={props.width || 1000}
            height={props.height || 600}
            quality={props.quality}
            className={props.className}
          />
          {block.caption && (
            <figcaption className="text-center text-sm text-neutral/70 mt-2">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
    }

    case 'BUTTON': {
      if (!block.text || !block.href) {
        return null;
      }

      return (
        <div className="flex justify-center my-8">
          <MotionFillButton
            onClick={() =>
              window.open(block.href, '_blank', 'noopener,noreferrer')
            }
            className="button-pulse border-white hover:!border-white/0 lg:focus:!border-white/0 lg:h-700:text-[14px]"
            fillClassName="bg-vermelho"
          >
            {block.text}
          </MotionFillButton>
        </div>
      );
    }

    case 'LIST': {
      // Filtrar itens vazios
      const items = block.items || [];
      const validItems = items.filter(item => item?.trim());

      if (validItems.length === 0) {
        return null;
      }

      return (
        <ul className="list-disc marker:text-neutral text-neutral pl-6 space-y-6 text-[22px] lg:text-lg leading-10">
          {validItems.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      );
    }

    case 'DIVIDER': {
      return (
        <div className="my-12 relative">
          <div className="flex items-center">
            <div className="flex-grow border-t border-vermelho"></div>
            <div className="w-2 h-2 bg-vermelho rounded-full mx-4"></div>
            <div className="flex-grow border-t border-vermelho"></div>
          </div>
        </div>
      );
    }

    default:
      return null;
  }
}

// Componente principal do renderer
export default function ProjectRenderer({ project, blocks = [] }) {
  const { tag: WrapperTag, className: wrapperClassName } =
    renderContentWrapper();

  return (
    <section>
      <div className="container-full">
        <div className="column-full">
          {/* Hero do projeto usando o mesmo componente dos projetos estáticos */}
          {project && (
            <div className="mb-12 lg:mb-8">
              <h1 className="text-vermelho font-bold text-5xl lg:text-3xl leading-tight tracking-tight">
                {project.title}
              </h1>

              {project.subtitle && (
                <p className="text-neutral text-4xl lg:text-2xl mt-2 max-w-4xl">
                  {project.subtitle}
                </p>
              )}
            </div>
          )}

          {/* Conteúdo dos blocos */}
          <WrapperTag className={wrapperClassName}>
            {blocks.map((block, index) => (
              <BlockRenderer key={block.id || index} block={block} />
            ))}
          </WrapperTag>
        </div>
      </div>
    </section>
  );
}
