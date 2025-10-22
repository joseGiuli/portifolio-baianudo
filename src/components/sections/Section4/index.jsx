'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import useTranslation from '@/hooks/useTranslation';
import { useI18n } from '@/components/providers/I18nProvider';

function Section4({ callForm }) {
  const { t } = useTranslation('section4');
  const { i18n } = useI18n();
  const [dynamicProjects, setDynamicProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const staticProjects = t('projects', { returnObjects: true }).map(
    (p, idx) => ({
      ...p,
      image: idx === 0 ? 'ecori' : idx === 1 ? 'spotify' : 'joga-ai',
      href:
        idx === 0
          ? '/projetos/ecori'
          : idx === 1
            ? '/projetos/spotify'
            : '/projetos/joga-ai',
      isStatic: true,
    }),
  );

  // Buscar projetos dinâmicos publicados
  useEffect(() => {
    const fetchDynamicProjects = async () => {
      try {
        const response = await fetch('/api/projects?status=published');
        if (response.ok) {
          const data = await response.json();
          const formattedProjects = data.projects.map(project => ({
            id: project.id,
            title:
              i18n.language === 'pt'
                ? project.previewTitlePt ||
                  `| Projeto profissional | ${project.titlePt}`
                : project.previewTitleEn ||
                  `| Professional project | ${project.titleEn}`,
            name: '', // Deixar vazio pois o título já inclui tudo
            image: project.previewImage,
            href: `/projetos/${project.slug}`,
            isStatic: false,
          }));
          setDynamicProjects(formattedProjects);
        }
      } catch (error) {
        console.error('Erro ao buscar projetos dinâmicos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDynamicProjects();
  }, [i18n.language]);

  // Combinar projetos estáticos e dinâmicos
  const allProjects = [...staticProjects, ...dynamicProjects];

  const EASE = [0.22, 1, 0.36, 1];
  const viewport = { once: true, amount: 0.1, margin: '-10% 0px -10% 0px' };
  const d = i => i * 0.14;

  const fadeUp = {
    hidden: { opacity: 0, y: 12, scale: 0.98 },
    show: i => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: EASE, delay: d(i) },
    }),
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.96, filter: 'blur(4px)' },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: { duration: 0.55, ease: 'easeOut' },
    },
  };

  const itemViewport = { once: true, amount: 0.35 };

  return (
    <section id="projetos">
      <div className="container-full">
        <div className="column-full text-center">
          {/* 0 - título */}
          <motion.h2
            className="text-white text-[56px] mb-8 font-semibold lg:text-3xl"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={viewport}
            custom={0}
          >
            {t('heading')}
          </motion.h2>

          <motion.p
            className="text-neutral mb-16"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={viewport}
            custom={1}
          >
            {t('description')}
          </motion.p>

          <motion.ul className="grid grid-cols-3 gap-6 lg:grid-cols-1 lg:gap-8">
            {allProjects.map((project, index) => (
              <motion.li
                key={project.id || project.name || index}
                className="text-white text-lg"
                variants={itemVariants}
                initial="hidden"
                whileInView="show"
                viewport={itemViewport}
              >
                <Link href={project.href} className="block group">
                  {project.isStatic ? (
                    <Image
                      src={`/images/projetos/${project.image}.png`}
                      alt={project.name}
                      width={617}
                      height={602}
                      quality={100}
                      className="rounded-3xl mb-3 transition-transform duration-300 group-hover:scale-[1.02] group-hover:shadow-lg w-full"
                    />
                  ) : (
                    <div className="relative w-full aspect-[617/602] overflow-hidden rounded-3xl mb-3 transition-transform duration-300 group-hover:scale-[1.02] group-hover:shadow-lg bg-gray-900">
                      {project.image ? (
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-800">
                          <span className="text-gray-500">Sem imagem</span>
                        </div>
                      )}
                    </div>
                  )}
                  <span className="block group-hover:text-vermelho transition-colors">
                    {project.title} {project.name}
                  </span>
                </Link>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}

export default Section4;
