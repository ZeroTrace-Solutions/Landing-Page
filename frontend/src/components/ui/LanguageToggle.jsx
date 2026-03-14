import { useTranslation } from 'react-i18next';

const LanguageToggle = () => {
  const { i18n } = useTranslation();
  const positionClass = i18n.language === 'ar' ? 'left-4' : 'right-4';

  const toggle = () => {
    const next = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(next);
  };

  const isWhitepaper = window.location.pathname === '/whitepaper';

  return (
    <button
      onClick={toggle}
      className={
        `fixed bottom-4 ${positionClass} z-50 w-12 h-12 grid place-items-center glass shadow-glow text-${isWhitepaper ? 'black' : 'white'} text-lg font-bold transition-transform hover:scale-110`
      }
    >
      {i18n.language === 'ar' ? 'EN' : 'ع'}
    </button>
  );
};

export default LanguageToggle;
