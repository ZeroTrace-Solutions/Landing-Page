import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Search, X } from 'lucide-react';
import { getWhitepaperData } from '../services/dataService';
import { Button } from '../components/ui/button';
import { Calendar } from '../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';

const LINK_PATTERN = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;

const renderLineWithLinks = (line, lineIndex) => {
  const nodes = [];
  let lastIndex = 0;
  let match;

  LINK_PATTERN.lastIndex = 0;

  while ((match = LINK_PATTERN.exec(line)) !== null) {
    const [fullMatch, label, url] = match;
    const start = match.index;

    if (start > lastIndex) {
      nodes.push(
        <React.Fragment key={`text-${lineIndex}-${lastIndex}`}>
          {line.slice(lastIndex, start)}
        </React.Fragment>
      );
    }

    nodes.push(
      <a
        key={`link-${lineIndex}-${start}`}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="mx-1 inline-flex items-center rounded-md border border-black/10 bg-black/5 px-2 py-1 text-base font-semibold not-italic text-black no-underline transition-colors hover:border-black/20 hover:bg-black/10 md:text-lg"
      >
        {label}
      </a>
    );

    lastIndex = start + fullMatch.length;
  }

  if (lastIndex < line.length) {
    nodes.push(
      <React.Fragment key={`tail-${lineIndex}-${lastIndex}`}>
        {line.slice(lastIndex)}
      </React.Fragment>
    );
  }

  return nodes;
};

const renderContentWithTaggedLinks = (content) => {
  if (!content) return null;

  const lines = content.split('\n');
  const result = [];
  let lineOffset = 0;

  for (const line of lines) {
    const key = `line-${lineOffset}-${line.length}`;
    result.push(
      <React.Fragment key={key}>
        {renderLineWithLinks(line, lineOffset)}
      </React.Fragment>
    );

    lineOffset += line.length;

    if (lineOffset < content.length) {
      result.push(<br key={`br-${lineOffset}`} />);
    }

    lineOffset += 1;
  }

  return result;
};

const parseArticleDate = (article) => {
  if (article?.id && /^\d{4}-\d{2}-\d{2}$/.test(article.id)) {
    const parsed = new Date(`${article.id}T00:00:00`);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }

  if (article?.date) {
    const parsed = new Date(article.date);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }

  return null;
};

const isSameDay = (dateA, dateB) => {
  if (!dateA || !dateB) return false;

  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  );
};

export const Whitepaper = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isRTL = i18n.language === 'ar';
  const [selectedNews, setSelectedNews] = useState(null);
  const [whitepaperData, setWhitepaperData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(undefined);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      try {
        const data = await getWhitepaperData();
        setWhitepaperData(data);
      } catch (error) {
        console.error("Failed to fetch whitepapers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    if (selectedNews) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
    };
  }, [selectedNews]);

  const normalizedSearchQuery = searchQuery.trim().toLowerCase();

  const filteredWhitepaperData = whitepaperData.filter((news) => {
    const title = isRTL ? news.titleAr : news.title;
    const excerpt = isRTL ? news.excerptAr : news.excerpt;
    const content = isRTL ? news.contentAr : news.content;

    const matchesText =
      !normalizedSearchQuery ||
      [title, excerpt, content]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(normalizedSearchQuery));

    const matchesDate = !selectedDate || isSameDay(parseArticleDate(news), selectedDate);

    return matchesText && matchesDate;
  });

  const formattedSelectedDate = selectedDate
    ? new Intl.DateTimeFormat(isRTL ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(selectedDate)
    : t('filterByDate');

  const hasActiveFilters = Boolean(normalizedSearchQuery || selectedDate);

  return (
    <div className="relative min-h-screen bg-[#f5f5f5] text-[#1a1a1a] selection:bg-black/10 p-4 md:p-12 font-serif overflow-x-hidden">
      {/* Texture Layer */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/recycled-paper.png')] z-50" />

      <Motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`max-w-5xl mx-auto bg-white shadow-[0_0_50px_rgba(0,0,0,0.05)] border border-black/5 p-8 md:p-20 relative min-h-[90vh] ${isRTL ? 'text-right font-newspaper' : 'text-left'}`}
      >
        {/* Navigation / Top Bar */}
        <div className="flex justify-between items-center border-b border-black/10 pb-6 mb-12 uppercase tracking-[0.2em] text-[10px] font-bold text-black/40">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 hover:text-black transition-colors"
          >
            {isRTL ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            {t('backToCommand')}
          </button>
          <div className="hidden sm:block italic">{t('whitepaperSubtitle')}</div>
          <div>{t('whitepaperDate')}</div>
        </div>

        {/* Masthead */}
        <header className="text-center mb-20 border-b-2 border-black/5 pb-12">
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-4 text-black">
            {t('whitepaperTitle')}
          </h1>
          <div className="flex justify-center items-center gap-6">
            <div className="h-px bg-black/10 flex-grow max-w-[100px]" />
            <span className="text-[10px] tracking-[0.8em] text-black/20 font-sans uppercase">{t('whitepaperVersionLabel')}</span>
            <div className="h-px bg-black/10 flex-grow max-w-[100px]" />
          </div>

          <div className={`mt-10 grid grid-cols-1 md:grid-cols-12 gap-3 ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className="md:col-span-6 relative">
              <Search size={16} className={`absolute top-1/2 -translate-y-1/2 text-black/40 ${isRTL ? 'right-3' : 'left-3'}`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={t('searchArticlesPlaceholder')}
                className={`w-full h-10 rounded-md border border-black/10 bg-white px-10 text-sm text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-black/10 ${isRTL ? 'pr-10 pl-3' : 'pl-10 pr-3'}`}
              />
            </div>

            <div className="md:col-span-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full h-10 justify-start border-black/10 bg-white text-black hover:bg-black/5 hover:text-black"
                  >
                    <CalendarIcon size={16} />
                    <span className="truncate">{formattedSelectedDate}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align={isRTL ? 'end' : 'start'}>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="md:col-span-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedDate(undefined);
                }}
                disabled={!hasActiveFilters}
                className="w-full h-10 hover:text-black border-black/10 bg-white text-black hover:bg-black/5"
              >
                {t('clearFilters')}
              </Button>
            </div>
          </div>
        </header>

        {/* News Feed / Array Rendering */}
        <div className="space-y-24">
          {loading ? (
            <div className="flex flex-col items-center gap-6 py-20">
              <div className="w-12 h-12 border-t-2 border-black/10 rounded-full animate-spin" />
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-black/20 italic animate-pulse">
                {t('loadingArchive')}
              </span>
            </div>
          ) : filteredWhitepaperData.length > 0 ? (
            filteredWhitepaperData.map((news) => (
              <Motion.article
                key={news.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`grid grid-cols-1 md:grid-cols-12 gap-10 group cursor-pointer`}
                onClick={() => setSelectedNews(news)}
              >
                {/* Meta info Column */}
                <div className="md:col-span-3 border-t md:border-t-0 md:border-l-[1px] border-black/5 pt-4 md:pt-0 md:pl-6 order-2 md:order-1">
                  <div className="text-[10px] uppercase font-sans font-black text-black/20 tracking-widest mb-2">
                    {isRTL ? news.categoryAr : news.category}
                  </div>
                  <div className="text-xs font-bold font-sans text-black/40">
                    {isRTL ? news.dateAr : news.date}
                  </div>
                </div>

                {/* Content Column */}
                <div className="md:col-span-9 order-1 md:order-2">
                  <h2 className="text-3xl md:text-5xl font-bold leading-none mb-6 group-hover:underline decoration-1 underline-offset-8 transition-all">
                    {isRTL ? news.titleAr : news.title}
                  </h2>
                  <p className="text-lg md:text-xl text-black/60 leading-relaxed italic">
                    {isRTL ? news.excerptAr : news.excerpt}
                  </p>
                  <div className="mt-8 flex items-center gap-2 text-[10px] font-sans font-bold uppercase tracking-widest text-black/20 group-hover:text-black transition-colors">
                    <span>{t('readFullArticle')}</span>
                    {isRTL ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
                  </div>
                </div>
              </Motion.article>
            ))
          ) : (
            <div className="py-20 flex flex-col items-center justify-center gap-4 border border-dashed border-black/10 rounded-xl animate-pulse">
              <div className="w-8 h-px bg-black/10" />
              <span className="italic text-black/40 uppercase tracking-[0.5em] text-[10px] font-black">
                {hasActiveFilters ? t('noFilteredRecords') : t('noRecords')}
              </span>
              <div className="w-8 h-px bg-black/10" />
            </div>
          )}
        </div>

        {/* Footer Meta */}
        <footer className="mt-32 pt-12 border-t border-black/5 flex justify-between items-center text-[9px] font-sans font-bold uppercase tracking-[0.5em] text-black/20">
          <div>{t('archivalSystem')}</div>
          <div className="text-right">{t('dataImmutable')}</div>
        </footer>
      </Motion.div>

      {/* Article Detail Modal */}
      <AnimatePresence>
        {selectedNews && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            data-lenis-prevent
            data-lenis-prevent-wheel
            data-lenis-prevent-touch
            className="fixed inset-0 z-[100] h-screen bg-white/95 backdrop-blur-sm p-4 md:p-12 overflow-y-auto overscroll-contain"
          >
            <div className="max-w-3xl mx-auto relative pt-20">
              <button
                onClick={() => setSelectedNews(null)}
                className="fixed top-8 right-8 p-3 hover:bg-black/5 rounded-full transition-colors z-[110]"
              >
                <X size={24} />
              </button>

              <div className={`${isRTL ? 'text-right font-newspaper' : 'text-left'}`}>
                <div className="text-xs font-sans font-black text-black/30 uppercase tracking-[0.5em] mb-10 border-b border-black/5 pb-4 flex justify-between">
                  <span>{isRTL ? selectedNews.categoryAr : selectedNews.category}</span>
                  <span>{isRTL ? selectedNews.dateAr : selectedNews.date}</span>
                </div>

                <h1 className="text-4xl md:text-7xl font-black mb-12 leading-[0.9] tracking-tighter">
                  {isRTL ? selectedNews.titleAr : selectedNews.title}
                </h1>

                <div className={`text-xl md:text-2xl leading-relaxed text-black/70 ${isRTL ? 'font-arabic' : ''}`}>
                  {renderContentWithTaggedLinks(isRTL ? selectedNews.contentAr : selectedNews.content)}
                </div>

                <div className="mt-20 pt-10 border-t border-black/10 flex justify-center">
                  <button
                    onClick={() => setSelectedNews(null)}
                    className="px-10 py-4 border border-black/10 text-[10px] font-sans font-black uppercase tracking-[0.5em] hover:bg-black hover:text-white transition-all"
                  >
                    {t('closeArchive')}
                  </button>
                </div>
              </div>
            </div>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Whitepaper;
