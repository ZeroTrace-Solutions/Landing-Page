import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShieldAlert, Users, Moon, Sun, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LiveDocGates = ({ 
  passwordState, 
  passwordInput, 
  setPasswordInput, 
  checkPassword,
  nameState,
  nameInput,
  setNameInput,
  submitName,
  theme,
  setTheme,
  t,
  i18n
}) => {
  if (passwordState !== 'authenticated') {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-500 ${theme === 'dark' ? 'bg-[#09090b] text-white' : 'bg-neutral-100 text-black'}`}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`w-full max-w-md p-8 rounded-3xl border ${theme === 'dark' ? 'bg-[#18181b] border-white/10 shadow-2xl' : 'bg-white border-black/10 shadow-xl'}`}>
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-4">
              <ShieldAlert className="text-blue-500" size={32} />
            </div>
            <h1 className="text-2xl font-black uppercase tracking-widest">{t('liveDocs.accessRequired')}</h1>
            <p className="text-[10px] uppercase tracking-widest opacity-50 font-bold mt-2">{t('liveDocs.protectedDocument')}</p>
          </div>

          <form onSubmit={checkPassword} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black tracking-widest opacity-50 ml-1">{t('liveDocs.enterPassword')}</label>
              <input
                autoFocus
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className={`w-full p-4 rounded-xl border ${theme === 'dark' ? 'bg-[#09090b] border-white/10 focus:border-blue-500' : 'bg-neutral-50 border-black/10 focus:border-blue-500'} outline-none transition-all text-center tracking-[0.5em] font-bold`}
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={passwordState === 'checking'}
              className={`w-full py-4 rounded-xl bg-blue-500 hover:bg-blue-400 text-black font-black uppercase tracking-widest transition-all shadow-lg active:scale-[0.98] ${passwordState === 'checking' ? 'opacity-50' : ''}`}
            >
              {passwordState === 'checking' ? t('liveDocs.verifying') : t('liveDocs.unlock')}
            </button>
            <AnimatePresence>
              {passwordState === 'error' && (
                <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="text-red-500 text-[10px] uppercase font-bold tracking-widest text-center">
                  {t('liveDocs.invalidPassword')}
                </motion.p>
              )}
            </AnimatePresence>
          </form>
        </motion.div>
      </div>
    );
  }

  if (nameState !== 'authenticated') {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-500 ${theme === 'dark' ? 'bg-[#09090b] text-white' : 'bg-neutral-100 text-black'}`}>
        <div className="fixed top-8 left-8 flex gap-4 no-print z-50">
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className={`p-3 rounded-full border ${theme === 'dark' ? 'bg-[#18181b] border-white/10 text-white hover:bg-white/5' : 'bg-white border-black/10 text-black hover:bg-black/5'} transition-all shadow-lg`}>
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'ar' : 'en')} className={`p-3 rounded-full border ${theme === 'dark' ? 'bg-[#18181b] border-white/10 text-white hover:bg-white/5' : 'bg-white border-black/10 text-black hover:bg-black/5'} transition-all shadow-lg flex items-center gap-2 text-[10px] font-black uppercase tracking-widest`}>
            <Globe size={18} /> {i18n.language === 'en' ? 'AR' : 'EN'}
          </button>
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={`w-full max-w-md p-8 rounded-3xl border ${theme === 'dark' ? 'bg-[#18181b] border-white/10 shadow-2xl' : 'bg-white border-black/10 shadow-xl'}`}>
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-4">
              <Users className="text-blue-500" size={32} />
            </div>
            <h1 className="text-2xl font-black uppercase tracking-widest">{t('liveDocs.whoAreYou')}</h1>
            <p className="text-[10px] uppercase tracking-widest opacity-50 font-bold mt-2">{t('liveDocs.sessionJoinInfo')}</p>
          </div>

          <form onSubmit={submitName} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black tracking-widest opacity-50 ml-1">{t('liveDocs.yourName')}</label>
              <input
                autoFocus
                type="text"
                maxLength={20}
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className={`w-full p-4 rounded-xl border ${theme === 'dark' ? 'bg-[#09090b] border-white/10 focus:border-blue-500' : 'bg-neutral-50 border-black/10 focus:border-blue-500'} outline-none transition-all text-center text-lg font-bold`}
              />
            </div>
            <button
              type="submit"
              disabled={nameState === 'checking'}
              className="w-full py-4 rounded-xl bg-blue-500 hover:bg-blue-400 text-black font-black uppercase tracking-widest transition-all shadow-lg active:scale-[0.98]"
            >
              {t('liveDocs.joinSession')}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return null;
};

export default LiveDocGates;
