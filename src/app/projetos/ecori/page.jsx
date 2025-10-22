'use client';
import Divider from '@/components/projects/Divider';
import CaseHero from '@/components/projects/ProjectHero';
import HoverZoomLens from '@/components/ui/HoverZoomLens';
import Image from 'next/image';
import useTranslation from '@/hooks/useTranslation';

export default function Page() {
  const { t } = useTranslation('project_ecori');
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

            <p>{t('body.p9')}</p>

            <HoverZoomLens
              src="/images/ecori/prototipo-0.png"
              largeSrc="/images/ecori/prototipo-0.png"
              alt={t('images.flow_alt')}
              width={2560}
              height={906}
              zoom={1.5}
              lensSize={140}
              lensBorder={1}
              className=" w-full bg-neutral/10"
              lensClassName="border border-vermelho"
            />
            <div className="flex w-full gap-2 lg:gap-8 lg:flex-col">
              {/* Esquerda — 1466x906 */}
              <div className="relative min-w-0 aspect-[1466/906] flex-[1466_1_0]">
                <Image
                  src="/images/ecori/prototipo-1.png"
                  alt=""
                  fill
                  className="object-contain"
                />
              </div>

              <div className="relative min-w-0 aspect-[1078/906] flex-[1078_1_0]">
                <Image
                  src="/images/ecori/prototipo-2.png"
                  alt=""
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            <h3 className="text-4xl  lg:text-3xl text-neutral text-center my-12">
              {t('headings.results')}
            </h3>

            <p>{t('body.p10')}</p>

            <p>{t('body.p11')}</p>

            <p>{t('body.p12')}</p>
            <Image
              src="/images/ecori/celulares.png"
              alt=""
              width={1814}
              height={1126}
              className="mx-auto w-[min(100%,1000px)]"
              quality={100}
            />
            <h3 className="text-4xl  lg:text-3xl text-neutral text-center my-12">
              {t('headings.learnings')}
            </h3>

            {/* Lista com bullets no mesmo tom neutral */}

            <ul className="list-disc marker:text-neutral text-neutral pl-6 space-y-6 text-[22px] lg:text-lg leading-10">
              {t('body.bullets', { returnObjects: true }).map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
