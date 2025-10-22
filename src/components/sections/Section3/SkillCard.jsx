'use client';

import { useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import useTranslation from '@/hooks/useTranslation';

export default function SkillsCard({ baseDelay = 0 }) {
  const { t, i18n } = useTranslation('section3');
  const skills = [
    {
      label: t('skills.items.0.label'),
      value: Number(t('skills.items.0.value')),
    },
    {
      label: t('skills.items.1.label'),
      value: Number(t('skills.items.1.value')),
    },
    {
      label: t('skills.items.2.label'),
      value: Number(t('skills.items.2.value')),
    },
    {
      label: t('skills.items.3.label'),
      value: Number(t('skills.items.3.value')),
    },
    {
      label: t('skills.items.4.label'),
      value: Number(t('skills.items.4.value')),
    },
    {
      label: t('skills.items.5.label'),
      value: Number(t('skills.items.5.value')),
    },
  ];
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-20% 0px' });

  useEffect(() => {
    if (inView) {
      controls.set('hidden');
      controls.start('show');
    }
  }, [inView, controls, i18n.language]);

  const sectionEnter = {
    hidden: { opacity: 0, y: 24, scale: 0.98, filter: 'blur(6px)' },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        type: 'spring',
        stiffness: 130,
        damping: 18,
        mass: 0.8,
        delay: baseDelay,
      },
    },
  };

  const container = {
    hidden: { opacity: 0, y: 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.18,
        delayChildren: baseDelay + 0.2, // <- filhos respeitam a ordem
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 6 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', damping: 26 } },
  };

  const barGrow = {
    hidden: { width: 0 },
    show: custom => ({
      width: `${custom}%`,
      transition: { type: 'spring', stiffness: 140, damping: 22 },
    }),
  };

  return (
    <motion.section
      ref={ref}
      variants={sectionEnter}
      initial="hidden"
      animate={controls}
      className="rounded-[60px] lg:max-w-[400px] lg:mx-auto bg-[#181818] p-14 text-neutral-200 shadow-xl transform-gpu will-change-transform will-change-opacity"
      aria-labelledby="skills-heading"
    >
      <motion.div variants={container} initial="hidden" animate={controls}>
        <h3
          id="skills-heading"
          className="mb-4 text-4xl font-semibold text-[#ff3116]"
        >
          {t('skills.title')}
        </h3>

        {skills.map((s, i) => (
          <motion.div key={`skill-${i}`} className="mb-6" variants={item}>
            <div className="mb-2">
              <span className="text-xl">{s.label}</span>
            </div>

            <div
              className="h-2 w-full rounded-full bg-neutral-700/70"
              aria-hidden="true"
            >
              <motion.div
                className="h-2 rounded-full"
                custom={Number(s.value) || 0}
                variants={barGrow}
                style={{
                  backgroundImage:
                    'linear-gradient(90deg, #ff3116 0%, #ff5a3c 50%, #ff3116 100%)',
                  backgroundSize: '200% 100%',
                }}
                animate={{
                  boxShadow: [
                    '0 0 6px rgba(255,49,22,0.35)',
                    '0 0 16px rgba(255,49,22,0.75)',
                    '0 0 6px rgba(255,49,22,0.35)',
                  ],
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3.6,
                  ease: 'easeInOut',
                }}
                role="progressbar"
                aria-valuenow={s.value}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}
