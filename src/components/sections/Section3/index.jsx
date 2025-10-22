'use client';

import { motion } from 'framer-motion';
import MotionFillButton from '@/components/layout/Button';
import Education from './Education';
import SkillsCard from './SkillCard';
import useTranslation from '@/hooks/useTranslation';

const EASE = [0.22, 1, 0.36, 1];
const viewport = { once: true, amount: 0.25, margin: '-15% 0px -15% 0px' };
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

function Section3({ callForm }) {
  const { t, locale, i18n } = useTranslation('section3');

  const lang = (locale || i18n?.language || i18n?.resolvedLanguage || 'pt')
    .toLowerCase()
    .split('-')[0];

  const CV_URLS = {
    pt: 'https://drive.google.com/uc?export=download&id=1fAoSp9YE8C5NXbDv7XDeSWJCs2gCSRnZ',
    en: 'https://drive.google.com/uc?export=download&id=15MboH1sThQHO5p9NPuaTKJcOCcu6Yzec',
  };

  // Se não for 'en', cai no 'pt'
  const cvUrl = CV_URLS[lang] ?? CV_URLS.pt;

  return (
    <section>
      <div className="container-main grid grid-cols-[1fr_480px] lg:grid-cols-1 gap-10">
        <div className="column">
          <motion.h2
            className="text-vermelho leading-snug font-semibold lg:text-3xl lg:text-left lg:w-max lg:self-start"
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={viewport}
            custom={0}
          >
            {t('heading')}
          </motion.h2>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={viewport}
            custom={1}
          >
            <Education baseDelay={d(0.8)} />
          </motion.div>

          {/* 2 - botão */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={viewport}
            custom={2}
          >
            <MotionFillButton
              onClick={() => {
                window.location.href = cvUrl;
              }}
              className="button-pulse border-white hover:!border-white/0 lg:focus:!border-white/0 mb-20 lg:mb-8"
              fillClassName="bg-vermelho"
            >
              {t('download_cv')}
            </MotionFillButton>
          </motion.div>
        </div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewport}
          custom={3}
        >
          <SkillsCard baseDelay={d(2.5)} />
        </motion.div>
      </div>
    </section>
  );
}

export default Section3;
