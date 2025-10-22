'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import useTranslation from '@/hooks/useTranslation';

function Section2({ id = 'sobre' }) {
  const { t } = useTranslation('section2');
  const roles = t('roles', { returnObjects: true });

  const EASE = [0.22, 1, 0.36, 1];
  const viewport = { once: true, amount: 0.25, margin: '-15% 0px -15% 0px' };
  const delay = i => i * 0.14;

  const fadeUp = {
    hidden: { opacity: 0, y: 12, scale: 0.98 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: EASE },
    },
  };

  const listVariants = {
    hidden: { opacity: 0, y: 8 },
    show: i => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: delay(i),
        ease: EASE,
        duration: 0.6,
        staggerChildren: 0.16,
        delayChildren: 0.12,
      },
    }),
  };

  const roleItem = {
    hidden: { opacity: 0, y: 8, scale: 0.94 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: 'spring', stiffness: 120, damping: 24 },
    },
  };

  // Pontinho vermelho com glow
  const dotGlow = {
    animate: {
      boxShadow: [
        '0 0 4px rgba(255,49,22,0.4)',
        '0 0 14px rgba(255,49,22,0.85)',
        '0 0 4px rgba(255,49,22,0.4)',
      ],
    },
    transition: { repeat: Infinity, duration: 3.4, ease: 'easeInOut' },
  };

  // Reveal da imagem (simplificado)
  const imageReveal = {
    hidden: {
      opacity: 0,
      y: 40,
      scale: 0.95,
    },
    show: i => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.8, ease: EASE, delay: delay(i) },
    }),
  };

  // ====== ORDEM dos itens na tela ======
  // 0: título
  // 1: roles (ul + li com stagger)
  // 2..5: parágrafos
  // 6: imagem

  return (
    <section
      id={id}
      className="text-white -lg:py-24 lg:pt-20 min-h-svh flex items-center"
    >
      <div className="container-full">
        <div className="column-full">
          {/* 0 - Título */}
          <motion.h2
            className="text-white font-semibold text-[56px] lg:text-4xl text-center mb-[72px] lg:mb-12"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={viewport}
            transition={{ ...fadeUp.show.transition, delay: delay(0) }}
          >
            {t('heading')}
          </motion.h2>

          <div className="flex lg:flex-col -lg:gap-9 items-center">
            <div className="max-w-[760px] [&_p]:leading-8 [&_p]:font-light">
              {/* 1 - ROLES (ul com stagger) */}
              <motion.ul
                custom={1}
                variants={listVariants}
                initial="hidden"
                whileInView="show"
                viewport={viewport}
                className="flex gap-8 items-center mb-10 lg:items-center lg:flex-wrap lg:justify-center"
              >
                {roles.map(role => (
                  <motion.li key={role} variants={roleItem} className="text-xl">
                    <div className="flex gap-4 items-center">
                      <motion.span
                        className="size-3 rounded-full"
                        style={{ backgroundColor: '#ff3116' }}
                        animate={dotGlow.animate}
                        transition={dotGlow.transition}
                        aria-hidden
                      />
                      <span
                        className="text-vermelho"
                        style={{ color: '#ff3116' }}
                      >
                        {role}
                      </span>
                    </div>
                  </motion.li>
                ))}
              </motion.ul>

              {/* 2..5 - Parágrafos */}
              <motion.p
                className="text-white text-lg mb-6"
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={viewport}
                transition={{ ...fadeUp.show.transition, delay: delay(2) }}
              >
                {t('paragraphs.0')}
              </motion.p>

              <motion.p
                className="text-white text-lg mb-6"
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={viewport}
                transition={{ ...fadeUp.show.transition, delay: delay(3) }}
              >
                {t('paragraphs.1')}
              </motion.p>

              <motion.p
                className="text-white text-lg mb-6"
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={viewport}
                transition={{ ...fadeUp.show.transition, delay: delay(4) }}
              >
                {t('paragraphs.2')}
              </motion.p>

              <motion.p
                className="text-white text-lg mb-6"
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={viewport}
                transition={{ ...fadeUp.show.transition, delay: delay(5) }}
              >
                {t('paragraphs.3')}
              </motion.p>
            </div>

            {/* 6 - Imagem (apenas fade + slide in) */}
            <motion.div
              custom={6}
              variants={imageReveal}
              initial="hidden"
              whileInView="show"
              viewport={viewport}
              className="relative shrink-0 rounded-3xl overflow-hidden"
            >
              <Image
                src="/images/lucas-souza.png"
                alt={t('profile_alt')}
                width={600}
                height={774}
                quality={100}
                className="-lg:max-w-[560px] rounded-3xl"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Section2;
