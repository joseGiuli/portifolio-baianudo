'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Arquivos de tradução por seção
import ptSection1 from './translations/pt/section1.json';
import enSection1 from './translations/en/section1.json';
import ptSection2 from './translations/pt/section2.json';
import enSection2 from './translations/en/section2.json';
import ptSection3 from './translations/pt/section3.json';
import enSection3 from './translations/en/section3.json';
import ptSection4 from './translations/pt/section4.json';
import enSection4 from './translations/en/section4.json';
import ptSection5 from './translations/pt/section5.json';
import enSection5 from './translations/en/section5.json';
// projetos
import ptProjectEcori from './translations/pt/project_ecori.json';
import enProjectEcori from './translations/en/project_ecori.json';
import ptProjectSpotify from './translations/pt/project_spotify.json';
import enProjectSpotify from './translations/en/project_spotify.json';
import ptProjectJogaAi from './translations/pt/project_joga_ai.json';
import enProjectJogaAi from './translations/en/project_joga_ai.json';
import ptLayout from './translations/pt/layout.json';
import enLayout from './translations/en/layout.json';

// Recursos de tradução: common (navbar) inline; sections por namespace via arquivos
const resources = {
  pt: {
    common: {
      navbar: {
        about: 'Sobre mim',
        projects: 'Projetos',
        contact: 'Contato',
        language: 'Português',
        menu_open: 'Abrir menu',
      },
      layout: ptLayout,
    },
    section1: ptSection1,
    section2: ptSection2,
    section3: ptSection3,
    section4: ptSection4,
    section5: ptSection5,
    project_ecori: ptProjectEcori,
    project_spotify: ptProjectSpotify,
    project_joga_ai: ptProjectJogaAi,
  },
  en: {
    common: {
      navbar: {
        about: 'About me',
        projects: 'Projects',
        contact: 'Contact',
        language: 'English',
        menu_open: 'Open menu',
      },
      layout: enLayout,
    },
    section1: enSection1,
    section2: enSection2,
    section3: enSection3,
    section4: enSection4,
    section5: enSection5,
    project_ecori: enProjectEcori,
    project_spotify: enProjectSpotify,
    project_joga_ai: enProjectJogaAi,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: process.env.NODE_ENV === 'development',
    fallbackLng: 'pt',
    ns: [
      'common',
      'section1',
      'section2',
      'section3',
      'section4',
      'section5',
      'project_ecori',
      'project_spotify',
      'project_joga_ai',
    ],
    defaultNS: 'common',
    resources,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
