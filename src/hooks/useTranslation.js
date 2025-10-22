'use client';

import { useTranslation as useI18nTranslation } from 'react-i18next';
import '../i18n/config';

export function useTranslation(namespace = 'common') {
  return useI18nTranslation(namespace);
}

export default useTranslation;
