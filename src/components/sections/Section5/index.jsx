'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import BehanceIcon from '../../../../public/icons/svg/behance.svg';
import LinkedinIcon from '../../../../public/icons/svg/linkedin.svg';
import InstagramIcon from '../../../../public/icons/svg/instagram.svg';
import TelIcon from '../../../../public/icons/svg/tel.svg';
import LocIcon from '../../../../public/icons/svg/loc.svg';
import WhatsappIcon from '../../../../public/icons/svg/whatsapp.svg';
import MotionFillButton from '@/components/layout/Button';
import useTranslation from '@/hooks/useTranslation';

function Section5({ callForm }) {
  const { t } = useTranslation('section5');
  const socialLinks = [
    {
      name: t('socials.0'),
      Icon: LinkedinIcon,
      url: 'https://www.linkedin.com/in/lucashssantos/',
    },
    {
      name: t('socials.1'),
      Icon: BehanceIcon,
      url: 'https://www.behance.net/lucassouza504',
    },
    {
      name: t('socials.2'),
      Icon: InstagramIcon,
      url: 'https://www.instagram.com/hss_lucaas',
    },
  ];

  // ---- Helpers / timings
  const EASE = [0.22, 1, 0.36, 1];
  const viewport = { once: true, amount: 0.2, margin: '-15% 0px -15% 0px' };
  const d = i => i * 0.14;

  // ---- Variants
  const fadeUp = {
    hidden: { opacity: 0, y: 12, scale: 0.98 },
    show: i => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: EASE, delay: d(i) },
    }),
  };

  // “Da esquerda pro centro”
  const fromLeft = {
    hidden: { opacity: 0, x: -60, skewX: 6, scale: 0.99, filter: 'blur(3px)' },
    show: i => ({
      opacity: 1,
      x: 0,
      skewX: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: { type: 'spring', stiffness: 120, damping: 18, delay: d(i) },
    }),
  };

  // Sociais: UL com stagger
  const listVariants = {
    hidden: { opacity: 0, y: 8 },
    show: {
      opacity: 1,
      y: 0,
      transition: { delayChildren: d(6), staggerChildren: 0.14 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 20, scale: 0.96, filter: 'blur(2px)' },
    show: {
      opacity: 1,
      x: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <section id="contato">
      <div className="container-main">
        <div className="column">
          {/* 0 - título */}
          <motion.h2
            className="text-vermelho text-[56px] lg:text-4xl w-full mb-8 font-bold"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={viewport}
            custom={0}
          >
            {t('heading')}
          </motion.h2>

          {/* 1 - descrição (linha 1) */}
          <motion.p
            className="text-neutral"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={viewport}
            custom={1}
          >
            {t('line1')}
          </motion.p>

          {/* 2 - descrição (linha 2) */}
          <motion.p
            className="text-neutral mb-4"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={viewport}
            custom={2}
          >
            {t('line2')}
          </motion.p>

          {/* 3 - Telefone (da esquerda) */}
          <motion.div
            className="flex gap-3 mb-2 items-center group w-max"
            variants={fromLeft}
            initial="hidden"
            whileInView="show"
            viewport={viewport}
            custom={3}
          >
            <TelIcon
              className="size-6 text-neutral group-hover:text-vermelho transition-colors duration-500"
              aria-hidden="true"
            />
            <p
              className="text-neutral  group-hover:text-vermelho transition-colors duration-500 hover:cursor-pointer"
              onClick={() =>
                window.open(
                  'https://wa.me/5517991411492?text=Ol%C3%A1!%20Vim%20pelo%20site%20e%20quero%20conversar%20mais',
                  '_blank',
                  'noopener,noreferrer',
                )
              }
            >
              {t('phone_label')}
            </p>
          </motion.div>

          {/* 4 - Localização (da esquerda) */}
          <motion.div
            className="flex gap-3 mb-6 -lg:items-center group w-max"
            variants={fromLeft}
            initial="hidden"
            whileInView="show"
            viewport={viewport}
            custom={4}
          >
            <LocIcon
              className="size-6 text-neutral group-hover:text-vermelho transition-colors duration-500 "
              aria-hidden="true"
            />
            <p className="text-neutral group-hover:text-vermelho transition-colors  duration-500">
              {t('location')}
            </p>
          </motion.div>

          <MotionFillButton
            onClick={() =>
              window.open(
                'https://wa.me/5517991411492?text=Ol%C3%A1!%20Vim%20pelo%20site%20e%20quero%20conversar%20mais',
                '_blank',
                'noopener,noreferrer',
              )
            }
            className="group button-pulse !border-vermelho hover:!border-vermelho/0 lg:focus:!border-white/0 "
            fillClassName="bg-vermelho !border-none lg:!border-none"
          >
            <span className="flex gap-4 text-vermelho group-hover:text-white group-focus:text-white">
              <WhatsappIcon className="size-6" aria-hidden="true" />
              {t('cta_contact')}
            </span>
          </MotionFillButton>
        </div>

        {/* 6.. - Sociais com stagger */}
        <div className="column flex items-end lg:items-center justify-center lg:mt-12">
          <motion.ul
            variants={listVariants}
            initial="hidden"
            whileInView="show"
            viewport={viewport}
          >
            {socialLinks.map(({ name, Icon, url }) => (
              <motion.li key={name} variants={itemVariants}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-full rounded-xl p-2 flex items-center gap-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vermelho"
                  aria-label={name}
                >
                  <Icon
                    className="size-10 text-neutral transition-all group-hover:text-vermelho group-hover:-rotate-6"
                    aria-hidden="true"
                  />
                  <span className="text-white transition-colors group-hover:text-vermelho font-bold ">
                    {name}
                  </span>
                </a>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}

export default Section5;
