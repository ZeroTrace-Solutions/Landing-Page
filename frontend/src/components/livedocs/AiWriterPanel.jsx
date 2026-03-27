import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Minimize2, Check, Loader2, Play } from 'lucide-react';
import { toast } from 'sonner';

const AiWriterPanel = ({ editor, theme, currentUser, t }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [streamingText, setStreamingText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [puterLoaded, setPuterLoaded] = useState(false);
  const [showInsertChoice, setShowInsertChoice] = useState(false);

  useEffect(() => {
    if (isOpen && editor) {
      // Get selected text from tiptap
      const { from, to } = editor.state.selection;
      setShowInsertChoice(false);
      if (from !== to) {
        const text = editor.state.doc.textBetween(from, to, ' ');
        if (text && text.trim()) {
          setPrompt(`${t('liveDocs.referencing') || 'Reference'}: "${text.trim()}"\n\n`);
        }
      }
    }
  }, [isOpen, editor, t]);

  useEffect(() => {
    if (!currentUser?.isAdmin) return;
    
    // Load puter.js dynamically if not already present
    if (window.puter) {
      setPuterLoaded(true);
      return;
    }

    const scriptId = 'puter-js-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = "https://js.puter.com/v2/";
      script.onload = () => setPuterLoaded(true);
      script.onerror = () => console.error('Failed to load puter.js');
      document.body.appendChild(script);
    }
  }, [currentUser]);

  if (!currentUser?.isAdmin) return null;

  const formatToHtml = (text) => {
    // Stage 1: Absolute Normalization
    // Strip carriage returns and ensure every section starting with #, ---, or > is on a new line
    let cleanText = text
      .replace(/\r/g, '')
      .replace(/([^\n])(#{1,6}\s?)/g, '$1\n$2') 
      .replace(/([^\n])(---)/g, '$1\n$2')
      .replace(/([^\n])(>\s)/g, '$1\n$2');

    // Convert Markdown Tables (multiline block)
    const tableRegex = /^\|(.+)\|$\n^\|[ :\-]+|$\n((?:^\|.+|$\n?)+)/gm;
    let html = cleanText.replace(tableRegex, (match) => {
      const rows = match.trim().split('\n');
      const headerRow = rows[0].split('|').filter(c => c.trim()).map(c => `<th>${c.trim()}</th>`).join('');
      const bodyRows = rows.slice(2).map(row => {
        const cells = row.split('|').filter(c => c.trim()).map(c => `<td>${c.trim()}</td>`).join('');
        return `<tr>${cells}</tr>`;
      }).join('');
      return `<div class="table-wrapper"><table border="1"><thead><tr>${headerRow}</tr></thead><tbody>${bodyRows}</tbody></table></div>\n`;
    });

    const lines = html.split('\n');
    let result = '';
    let currentListType = null; // 'ul', 'ol', or null

    const processInline = (str) => {
      // Support bold (***, **, __) and italic (*, _)
      return str
        .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/__(.*?)__/g, '<strong>$1</strong>')
        .replace(/_(.*?)_/g, '<em>$1</em>');
    };

    const closeList = () => {
      if (currentListType === 'ul') result += '</ul>';
      else if (currentListType === 'ol') result += '</ol>';
      currentListType = null;
    };

    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed) {
        closeList();
        return;
      }

      // 1. Horizontal Rule
      if (trimmed === '---') {
        closeList();
        result += '<hr />';
        return;
      }

      // 2. Headers
      const headerMatch = trimmed.match(/^(#{1,6})\s+(.*)$/) || trimmed.match(/^(#{1,6})(.*)$/);
      if (headerMatch) {
         closeList();
         const level = headerMatch[1].length;
         const content = headerMatch[2].trim();
         result += `<h${level}>${processInline(content)}</h${level}>`;
         return;
      }

      // 3. Lists
      // Check for Ordered (1.) and Unordered (-, *)
      const olMatch = line.match(/^(\s*)(\d+)\.\s+(.*)$/);
      const ulMatch = line.match(/^(\s*)([-*])\s+(.*)$/);

      if (olMatch) {
        if (currentListType !== 'ol') {
          closeList();
          result += '<ol>';
          currentListType = 'ol';
        }
        result += `<li>${processInline(olMatch[3].trim())}</li>`;
        return;
      }

      if (ulMatch) {
        if (currentListType !== 'ul') {
          closeList();
          result += '<ul>';
          currentListType = 'ul';
        }
        const indentLevel = ulMatch[1].length;
        const subLevelStyle = indentLevel > 1 ? ' style="margin-left: 20px; list-style-type: circle;"' : '';
        result += `<li${subLevelStyle}>${processInline(ulMatch[3].trim())}</li>`;
        return;
      }

      // 4. Blockquotes
      if (trimmed.startsWith('> ')) {
        closeList();
        result += `<blockquote>${processInline(trimmed.substring(2).trim())}</blockquote>`;
        return;
      }

      // 5. Normal Paragraphs or Pre-formatted HTML (Tables)
      if (/^<[a-z]/.test(trimmed)) {
        closeList();
        result += trimmed;
      } else {
        closeList();
        result += `<p>${processInline(trimmed)}</p>`;
      }
    });

    closeList();
    return result;
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || !window.puter) return;
    setIsGenerating(true);
    setStreamingText('');

    try {
      // Enhanced prompt with system instruction to ensure clear Markdown
      const systemContext = "You are an AI assistant for project document drafting. Always use proper Markdown for headers (###), lists, and tables. Be concise.";
      const fullPrompt = `${systemContext}\n\nUser Request: ${prompt}`;

      const response = await window.puter.ai.chat(
        fullPrompt,
        { stream: true, model: "gpt-5.4-nano" }
      );
      
      let fullText = '';
      for await (const part of response) {
        if (part?.text) {
          fullText += part.text;
          setStreamingText(fullText);
        }
      }
    } catch (err) {
      console.error("AI Generation Error:", err);
      toast.error("Failed to generate text. Check console.");
    } finally {
      setIsGenerating(false);
    }
  };

  const performInsert = (mode) => {
    if (!streamingText || !editor) return;
    const htmlText = formatToHtml(streamingText);
    
    if (mode === 'replace') {
      editor.chain().focus()
        .deleteSelection()
        .insertContent(htmlText)
        .run();
    } else {
      // Append: move to end of current selection if any
      const { to } = editor.state.selection;
      editor.chain().focus()
        .setTextSelection(to)
        .insertContent('\n') // Add newline before append for clarity
        .insertContent(htmlText)
        .run();
    }
    
    toast.success(t('liveDocs.aiInserted'));
    setStreamingText('');
    setPrompt('');
    setIsOpen(false);
    setShowInsertChoice(false);
  };

  const handleInsertClick = () => {
    if (!streamingText || !editor) return;
    const { from, to } = editor.state.selection;
    if (from !== to) {
      setShowInsertChoice(true);
    } else {
      performInsert('append');
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-8 right-8 z-[95] no-print"
          >
            <button
              onClick={() => setIsOpen(true)}
              className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.5)] hover:bg-blue-500 hover:scale-110 active:scale-95 transition-all outline-none"
              title={t('liveDocs.aiAssistant')}
            >
              <Sparkles size={24} className="animate-pulse" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded AI Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute bottom-20 right-0 z-[100] w-[400px] h-[580px] no-print"
          >
            {/* SVG Filter for Metaballs */}
            <svg style={{ position: 'absolute', width: 0, height: 0 }}>
              <defs>
                <filter id="gooey">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
                  <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
                  <feComposite in="SourceGraphic" in2="goo" operator="atop" />
                </filter>
              </defs>
            </svg>

            <div className="relative w-full h-full">
              {/* Metaballs Background container */}
              <div 
                className="absolute inset-0 overflow-hidden rounded-[2rem] bg-[#09090b] pointer-events-none" 
                style={{ filter: "url(#gooey)" }}
              >
                {/* Static base layer */}
                <div className="absolute inset-x-0 bottom-0 h-32 bg-blue-600/30 blur-2xl rounded-full" />
                
                {/* Animated Orbs */}
                <motion.div 
                  animate={{ 
                    x: [0, 50, -50, 0],
                    y: [0, -60, 20, 0],
                    scale: [1, 1.2, 0.8, 1]
                  }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute w-32 h-32 bg-blue-500 rounded-full top-20 left-10 blur-xl opacity-60"
                />
                <motion.div 
                  animate={{ 
                    x: [0, -60, 40, 0],
                    y: [0, 50, -70, 0],
                    scale: [1, 0.9, 1.3, 1]
                  }}
                  transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute w-40 h-40 bg-purple-500 rounded-full bottom-10 right-10 blur-xl opacity-60"
                />
              </div>

              {/* Glassy Foreground Card */}
              <div className="absolute inset-0 rounded-[2rem] border border-white/10 bg-[#18181b]/60 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b border-white/5 flex items-center justify-between shrink-0 bg-black/20">
                  <div className="flex items-center gap-2 text-white">
                    <Sparkles size={16} className="text-blue-400" />
                    <span className="text-xs font-black uppercase tracking-widest text-blue-400">{t('liveDocs.aiNode')}</span>
                  </div>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="p-2 h-8 w-8 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white flex items-center justify-center transition-colors"
                  >
                    <Minimize2 size={14} />
                  </button>
                </div>

                {/* Body */}
                <div className="flex-1 p-4 flex flex-col gap-4 overflow-hidden">
                  <div className="relative shrink-0">
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder={t('liveDocs.aiPlaceholder')}
                      className="w-full h-24 bg-black/40 border border-white/10 rounded-xl p-3 text-white text-sm outline-none focus:border-blue-500/50 resize-none transition-colors custom-scrollbar"
                      disabled={isGenerating}
                    />
                    <button
                      onClick={handleGenerate}
                      disabled={!prompt.trim() || isGenerating || !puterLoaded}
                      className="absolute bottom-3 right-3 p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20"
                    >
                      {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} className="ml-0.5" />}
                    </button>
                  </div>

                  {/* Preview Area */}
                  <div className="flex-[2] bg-black/20 rounded-xl border border-white/5 p-4 overflow-auto custom-scrollbar relative">
                    {!streamingText ? (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30 select-none">
                        <Sparkles size={48} />
                      </div>
                    ) : (
                      <div className="text-white/90 text-sm whitespace-pre-wrap leading-relaxed pb-4">
                        {streamingText}
                        {isGenerating && <span className="inline-block w-1.5 h-4 ml-1 bg-blue-500 animate-pulse align-middle" />}
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 border-t border-white/5 flex shrink-0">
                  {showInsertChoice ? (
                    <div className="flex gap-2 w-full animate-in fade-in slide-in-from-bottom-2">
                       <button
                         onClick={() => performInsert('replace')}
                         className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-black uppercase tracking-widest text-[10px] hover:bg-blue-500 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                       >
                         {t('liveDocs.replaceSelected')}
                       </button>
                       <button
                         onClick={() => performInsert('append')}
                         className="flex-1 py-3 rounded-xl bg-white text-black font-black uppercase tracking-widest text-[10px] hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                       >
                         {t('liveDocs.appendAfter')}
                       </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleInsertClick}
                      disabled={!streamingText || isGenerating}
                      className="w-full py-3 rounded-xl bg-white text-black font-black uppercase tracking-widest text-xs hover:bg-neutral-200 disabled:opacity-30 disabled:hover:bg-white transition-colors flex items-center justify-center gap-2 active:scale-[0.98]"
                    >
                      <Check size={14} /> {t('liveDocs.insertContext')}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AiWriterPanel;
