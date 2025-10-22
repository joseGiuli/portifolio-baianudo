'use client';

'use client';
import MotionFillButton from '@/components/layout/Button';
import Divider from '@/components/projects/Divider';
import CaseHero from '@/components/projects/ProjectHero';
import Image from 'next/image';
import useTranslation from '@/hooks/useTranslation';

export default function Page() {
  const { t } = useTranslation('project_joga_ai');
  return (
    <section>
      <div className="container-full">
        <div className="column-full">
          <CaseHero
            title={t('hero.title')}
            subtitle={t('hero.subtitle')}
            meta={t('hero.meta', { returnObjects: true })}
            backLabel={t('hero.backLabel')}
          />

          {/* Corpo */}
          <div className="[&_p]:text-[22px] lg:[&_p]:text-lg [&_p]:leading-10 [&_p]:text-neutral mt-12 lg:mt-2 space-y-8">
            <p>{t('body.p1')}</p>

            <p>{t('body.p2')}</p>

            <Divider className="my-18" />

            <h3 className="text-4xl lg:text-3xl text-neutral text-center my-12">
              {t('headings.challenge')}
            </h3>

            <p>{t('body.p3')}</p>

            <p>{t('body.p4')}</p>

            <h3 className="text-4xl  lg:text-3xl text-neutral text-center my-12">
              {t('headings.solution')}
            </h3>

            <p>{t('body.p5')}</p>

            <p>{t('body.p6')}</p>

            <p>{t('body.p7')}</p>

            <p>{t('body.p8')}</p>

            <Image
              src="/images/joga-ai/celular.png"
              alt={t('images.main_alt')}
              width={1672}
              height={1054}
              className="mx-auto w-[min(100%,1000px)]"
              quality={100}
            />
            <h3 className="text-4xl  lg:text-3xl text-neutral text-center my-12">
              {t('headings.learnings')}
            </h3>

            <ul className="list-disc marker:text-neutral text-neutral pl-6 space-y-6 text-[22px] lg:text-lg leading-10">
              {t('body.bullets', { returnObjects: true }).map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>

            <div className="flex lg:flex-col lg:items-center gap-12 lg:gap-6">
              {/* <MotionFillButton
                className="button-pulse border-white hover:!border-white/0 lg:focus:!border-white/0 lg:h-700:text-[14px]"
                fillClassName="bg-vermelho"
              >
                Ver mais sobre o projeto
              </MotionFillButton> */}
              <MotionFillButton
                onClick={() =>
                  window.open(
                    'https://www.figma.com/design/et58pOZan19ngMBJ0keZ5e/Joga-A%C3%AD-2.0?node-id=17-310&t=4N9oZFEZcIaU3Sw7-1',
                    '_blank',
                    'noopener,noreferrer',
                  )
                }
                className="button-pulse border-white hover:!border-white/0 lg:focus:!border-white/0 lg:h-700:text-[14px]"
                fillClassName="bg-vermelho"
              >
                {t('body.figma_cta')}
              </MotionFillButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
