import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en/translation.json';
import ar from './locales/ar/translation.json';

const resources = {
  en: { translation: en },
  ar: { translation: ar }
};

const getInitialLanguage = () => {
  const saved = localStorage.getItem('app-language');
  if (saved) return saved;

  const browserLang = navigator.language.split('-')[0];
  return resources[browserLang] ? browserLang : 'en';
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getInitialLanguage(),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

i18n.on('languageChanged', (lng) => {
  localStorage.setItem('app-language', lng);
});

export default i18n;