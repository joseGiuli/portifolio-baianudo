// Adapters para renderização dinâmica baseados na estrutura detectada
// Mapa de tags hardcoded baseado na análise dos projetos existentes
const tagMap = {
  heading: {
    defaultTag: 'h3',
    defaultClasses: 'text-4xl lg:text-3xl text-neutral text-center my-12',
    patterns: [
      {
        tag: 'h3',
        classes: 'text-4xl lg:text-3xl text-neutral text-center my-12',
        usage: 'section-title',
      },
      {
        tag: 'h1',
        classes:
          'text-vermelho font-bold text-5xl lg:text-3xl leading-tight tracking-tight',
        usage: 'hero-title',
      },
    ],
  },
  paragraph: {
    defaultTag: 'p',
    defaultClasses: 'text-[22px] lg:text-lg leading-10 text-neutral',
    wrapperClasses:
      '[&_p]:text-[22px] lg:[&_p]:text-lg [&_p]:leading-10 [&_p]:text-neutral mt-12 lg:mt-2 space-y-8',
    patterns: [
      {
        tag: 'p',
        classes: 'text-[22px] lg:text-lg leading-10 text-neutral',
        usage: 'body-text',
      },
    ],
  },
  image: {
    defaultTag: 'Image',
    defaultClasses: 'mx-auto w-[min(100%,1000px)]',
    defaultProps: {
      quality: 100,
      className: 'mx-auto w-[min(100%,1000px)]',
    },
  },
};

const adapters = {
  heading: (level, children, usage = 'section-title') => {
    const pattern =
      tagMap.heading.patterns.find(p => p.tag === level && p.usage === usage) ||
      tagMap.heading.patterns.find(p => p.tag === level);

    const Tag = pattern?.tag || tagMap.heading.defaultTag;
    const classes = pattern?.classes || tagMap.heading.defaultClasses;

    return { tag: Tag, classes, children };
  },

  paragraph: (children, usage = 'body-text') => {
    const pattern =
      tagMap.paragraph.patterns.find(p => p.usage === usage) ||
      tagMap.paragraph.patterns[0];

    const classes = pattern?.classes || tagMap.paragraph.defaultClasses;

    return { tag: 'p', classes, children };
  },

  image: (src, alt, options = {}) => {
    return {
      tag: 'Image',
      props: {
        src,
        alt,
        quality: 100,
        className: 'mx-auto w-[min(100%,1000px)]',
        ...options,
      },
    };
  },

  list: items => {
    return {
      tag: 'ul',
      classes:
        'list-disc marker:text-neutral text-neutral pl-6 space-y-6 text-[22px] lg:text-lg leading-10',
      items,
    };
  },

  contentWrapper: children => {
    return {
      tag: 'div',
      classes: tagMap.paragraph.wrapperClasses,
      children,
    };
  },
};

// Adapter para títulos/headings
export function renderHeading(level, children, usage = 'section-title') {
  const result = adapters.heading(level, children, usage);
  return {
    tag: result.tag,
    className: result.classes,
    children: result.children,
  };
}

// Adapter para parágrafos
export function renderParagraph(children, usage = 'body-text') {
  const result = adapters.paragraph(children, usage);
  return {
    tag: result.tag,
    className: result.classes,
    children: result.children,
  };
}

// Adapter para imagens
export function renderImage(src, alt, options = {}) {
  const result = adapters.image(src, alt, options);
  return {
    tag: result.tag,
    props: result.props,
  };
}

// Adapter para listas
export function renderList(items) {
  const result = adapters.list(items);
  return {
    tag: result.tag,
    className: result.classes,
    items: result.items,
  };
}

// Adapter para wrapper de conteúdo
export function renderContentWrapper(children) {
  const result = adapters.contentWrapper(children);
  return {
    tag: result.tag,
    className: result.classes,
    children: result.children,
  };
}

// Função utilitária para processar HTML/Markdown
export function processContent(html, markdown) {
  if (html) {
    return html;
  }

  if (markdown) {
    // Conversão básica de Markdown para HTML
    // Em produção, use uma biblioteca como 'marked' ou 'remark'
    return markdown
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>');
  }

  return '';
}

// Mapa de componentes para renderização
export const componentMap = {
  heading: renderHeading,
  paragraph: renderParagraph,
  image: renderImage,
  list: renderList,
  contentWrapper: renderContentWrapper,
};

export default {
  renderHeading,
  renderParagraph,
  renderImage,
  renderList,
  renderContentWrapper,
  processContent,
  componentMap,
};
