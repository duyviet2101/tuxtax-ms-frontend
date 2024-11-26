import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'vi',
    supportedLngs: ['vi', 'en', 'th'],
    debug: true,
    backend: {
      loadPath: '/locales/{{lng}}/translation.json', // Translation file path
    },
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
      caches: ['cookie'], // Cache the selected language in cookies
    },
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    }
  });

export default i18n;