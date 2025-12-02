import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import es from './locales/es.json';
import so from './locales/so.json';
import hmn from './locales/hmn.json';

// Initialize i18n
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es },
      so: { translation: so },
      hmn: { translation: hmn }
    },
    fallbackLng: 'en',
    lng: 'en', // Set default language explicitly
    debug: false,
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    },
    react: {
      useSuspense: false // Disable suspense to avoid loading issues
    }
  });

export default i18n;
