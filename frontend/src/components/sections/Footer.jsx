import DecryptedText from '@/components/DecryptedText'
import { useTranslation } from 'react-i18next'

export const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="pb-32 px-12 relative z-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-12 pt-16 border-t border-white/5">
        <div className="flex flex-col gap-6">
          <div className="text-xl font-black tracking-tighter">ZERO TRACE</div>
          <DecryptedText
            text={t('footerCopyright')}
            className="text-white/20 text-[10px] font-bold uppercase tracking-widest"
          />
        </div>
        <div className="flex gap-16 text-[10px] font-bold text-white/20 uppercase tracking-[0.4em]">
          <a href="#" className="hover:text-white transition-colors">{t('endpoint')}</a>
          <a href="#" className="hover:text-white transition-colors">{t('protocol')}</a>
          <a href="#" className="hover:text-white transition-colors">{t('source')}</a>
        </div>
      </div>
    </footer>
  )
}
