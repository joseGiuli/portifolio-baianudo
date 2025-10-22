'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

import HeroBackgroundVideo from '@/components/videos/BackgroundVideo';
import ScrollDownIndicator from '@/components/layout/ScrollDownIndicator';
import MotionFillButton from '@/components/layout/Button';
import useTranslation from '@/hooks/useTranslation';

function Section1({}) {
  const { t } = useTranslation('section1');
  const playbackId = process.env.NEXT_PUBLIC_MUX_PLAYBACK_ID;
  const sectionRef = useRef(null);
  const prefersReduced = useReducedMotion();

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden min-h-svh pt-44 pb-20 lg:pb-16 lg:pt-24 lg:h-700:pt-18 bg-black"
    >
      <HeroBackgroundVideo
        playbackId={playbackId}
        className=" opacity-20 scale-[1.1]"
        objectPosition="bottom"
      />
      <div className="absolute bottom-0 left-0 w-full h-44 bg-gradient-to-b from-50% from-transparent  to-black "></div>

      <div className="container-full relative z-10">
        <div className="column-full">
          <div className="max-w-[960px]">
            <h2 className="text-neutral font-semibold [&_span]:text-vermelho mb-6 lg:text-4xl text-[64px] xs:h-700:text-[32px]">
              {t('greeting')} <span>{t('name')}</span>
              <br />
              <span>{t('title_designer')}</span> {t('title_experiences')}{' '}
              <br className="-lg:hidden" />
              <span>{t('title_digital')}</span>
            </h2>
            <h3 className="text-2xl lg:text-lg text-neutral mb-8 xs:h-700:text-base">
              {t('subtitle')}
            </h3>

            <div className="flex lg:flex-col lg:items-center gap-4">
              <MotionFillButton
                onClick={() =>
                  window.open(
                    'https://wa.me/5517991411492?text=Ol%C3%A1!%20Vim%20pelo%20site%20e%20quero%20conversar%20mais',
                    '_blank',
                    'noopener,noreferrer',
                  )
                }
                className="button-pulse bg-vermelho !border-none lg:h-700:text-[14px]"
                fillClassName="bg-[#d61900] border-none"
              >
                {t('button_contact')}
              </MotionFillButton>
              <MotionFillButton
                onClick={() =>
                  document
                    .getElementById('projetos')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }
                className="button-pulse border-white hover:!border-white/0 lg:focus:!border-white/0 lg:h-700:text-[14px]"
                fillClassName="bg-vermelho"
              >
                {t('button_work')}
              </MotionFillButton>
            </div>
          </div>
          <div className="text-right mt-24 lg:mt-10 lg:h-700:mt-6  lg:w-full">
            <p className="text-neutral text-lg lg:text-[14px]">{t('email')}</p>
            <p className="text-vermelho lg:text-[14px]">{t('explore')}</p>
          </div>
        </div>
      </div>
      <div className="absolute left-1/2 bottom-2 -translate-x-1/2">
        <ScrollDownIndicator variant="mouse" targetId="section-hero" />
      </div>
    </section>
  );
}

export default Section1;
