'use client';
import useTranslation from '@/hooks/useTranslation';

const Footer = () => {
  const { t } = useTranslation('common');
  return (
    <footer className="bg-preto border-t-[#2b2b2b] border py-6 ">
      <div className="container-full gap-8 ">
        <div className="column-full">
          <p className="text-neutral text-center spacing- text-[14px]">
            {t('layout.footer.copyright')} |{' '}
            <span className="text-vermelho font-semibold">
              {t('layout.footer.author')}
            </span>{' '}
            {t('layout.footer.year')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
