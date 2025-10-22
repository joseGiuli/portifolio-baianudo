'use client';

import { motion, useReducedMotion } from 'framer-motion';
import useTranslation from '@/hooks/useTranslation';

const makeItemVariants = (reduced, baseDelay = 0) => ({
  hidden: { opacity: 0, x: -40, skewX: reduced ? 0 : 6 },
  visible: idx => ({
    opacity: 1,
    x: 0,
    skewX: 0,
    transition: {
      type: 'spring',
      stiffness: 120,
      damping: 18,
      mass: 0.7,
      duration: 0.65,
      delay: baseDelay + idx * 0.1, // <- encaixa na ordem global
      when: 'beforeChildren',
      staggerChildren: 0.05,
    },
  }),
});

const childVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function Education({ baseDelay = 0 }) {
  const { t } = useTranslation('section3');
  const education = t('education', { returnObjects: true });
  const prefersReducedMotion = useReducedMotion();
  const itemVariants = makeItemVariants(prefersReducedMotion, baseDelay);

  return (
    <section className="bg-black py-12 px-0">
      <div className="w-full">
        {education.map((item, idx) => (
          <motion.article
            key={`${item.titulo}-${idx}`}
            className="mb-10 last:mb-0"
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ amount: 0.3, once: true }}
            custom={idx}
            style={{ willChange: 'transform, opacity' }}
          >
            <motion.h3
              variants={childVariants}
              className="text-base font-semibold text-white italic"
            >
              {item.titulo}
            </motion.h3>

            <motion.div
              variants={childVariants}
              className="mt-1 flex items-center gap-3 text-base text-neutral-300"
            >
              <motion.span variants={childVariants}>
                {item.periodo.inicio} - {item.periodo.fim}
              </motion.span>
              <motion.span
                aria-hidden
                className="h-2 w-2 rounded-full bg-neutral-400"
                variants={childVariants}
              />
              <motion.span variants={childVariants}>
                {item.instituicao}
              </motion.span>
            </motion.div>

            <motion.p
              variants={childVariants}
              className="mt-3 max-w-3xl leading-relaxed text-neutral-300"
            >
              {item.descricao}
            </motion.p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
