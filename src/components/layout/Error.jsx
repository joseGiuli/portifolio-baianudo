'use client';
import useTranslation from '@/hooks/useTranslation';

const Error = () => {
  const { t } = useTranslation('common');
  return (
    <div className="form bg-white shadow-custom rounded-3xl px-4 py-20 flex flex-col items-center gap-4">
      <p className="text-xl font-bold text-red-500">
        {t('layout.error.title')}
      </p>
      <a href="/" className="text-lg hover:text-blue-500 hover:underline">
        {t('layout.error.link')}
      </a>
    </div>
  );
};

export default Error;
