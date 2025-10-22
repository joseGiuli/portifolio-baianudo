'use client';
import useTranslation from '@/hooks/useTranslation';

const Loader = () => {
  const { t } = useTranslation('common');
  return (
    <div className="form bg-white shadow-custom rounded-3xl px-4 py-20 flex flex-col items-center gap-4">
      <p className="text-xl font-medium">{t('layout.loader.loading')}</p>
      <div className="w-12 h-12 rounded-full animate-spin border-8 border-solid border-loader border-t-transparent shadow-md" />
    </div>
  );
};

export default Loader;
