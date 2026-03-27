import React from 'react';
import { Bold, Italic, Underline as UnderlineIcon, Strikethrough, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

const ToolbarButton = ({ onClick, active, children, title, theme }) => (
  <button
    onClick={onClick}
    className={`p-2 rounded transition-all ${
      active
        ? (theme === 'dark' ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-500 text-white shadow-lg')
        : (theme === 'dark' ? 'text-white/50 hover:bg-white/5 hover:text-white' : 'text-black/50 hover:bg-black/5 hover:text-black')
    }`}
    title={title}
  >
    {children}
  </button>
);

const DocToolbar = ({ editor, theme }) => {
  if (!editor) return null;

  return (
    <div className={`flex items-center gap-1 p-1 rounded-lg border ${theme === 'dark' ? 'bg-[#18181b] border-white/10' : 'bg-neutral-100 border-black/10 shadow-inner'}`}>
      <div className="flex items-center gap-0.5 border-r border-white/10 pr-1 mr-1">
        <select
          onChange={(e) => {
            if (e.target.value === 'p') editor.chain().focus().setParagraph().run();
            else editor.chain().focus().toggleHeading({ level: parseInt(e.target.value) }).run();
          }}
          value={
            editor.isActive('heading', { level: 1 }) ? '1' :
            editor.isActive('heading', { level: 2 }) ? '2' :
            editor.isActive('heading', { level: 3 }) ? '3' :
            editor.isActive('heading', { level: 4 }) ? '4' : 'p'
          }
          className={`h-8 px-2 text-[10px] font-black uppercase tracking-tighter rounded border bg-transparent outline-none transition-all ${
            theme === 'dark' 
              ? 'text-white/70 border-white/10 hover:border-white/20' 
              : 'text-black/70 border-black/10 hover:border-black/20'
          }`}
          title="Text Style"
        >
          <option value="p" className={theme === 'dark' ? 'bg-[#18181b] text-white' : 'bg-white text-black'}>Normal</option>
          <option value="1" className={theme === 'dark' ? 'bg-[#18181b] text-white' : 'bg-white text-black'}>H1</option>
          <option value="2" className={theme === 'dark' ? 'bg-[#18181b] text-white' : 'bg-white text-black'}>H2</option>
          <option value="3" className={theme === 'dark' ? 'bg-[#18181b] text-white' : 'bg-white text-black'}>H3</option>
          <option value="4" className={theme === 'dark' ? 'bg-[#18181b] text-white' : 'bg-white text-black'}>H4</option>
        </select>
      </div>

      <div className="flex items-center gap-0.5 border-r border-white/10 pr-1 mr-1">
        <ToolbarButton
          theme={theme}
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          title="Bold (Mod+B)"
        >
          <Bold size={16} />
        </ToolbarButton>
        <ToolbarButton
          theme={theme}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          title="Italic (Mod+I)"
        >
          <Italic size={16} />
        </ToolbarButton>
        <ToolbarButton
          theme={theme}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive('underline')}
          title="Underline (Mod+U)"
        >
          <UnderlineIcon size={16} />
        </ToolbarButton>
        <ToolbarButton
          theme={theme}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive('strike')}
          title="Strikethrough (Mod+Shift+X)"
        >
          <Strikethrough size={16} />
        </ToolbarButton>
      </div>

      <div className="flex items-center gap-0.5 border-r border-white/10 pr-1 mr-1">
        <select
          onChange={(e) => editor.chain().focus().setFontSize(e.target.value).run()}
          value={editor.getAttributes('textStyle').fontSize || '16px'}
          className={`h-8 px-2 text-[10px] font-bold rounded border bg-transparent outline-none transition-all ${
            theme === 'dark' 
              ? 'text-white/70 border-white/10 hover:border-white/20' 
              : 'text-black/70 border-black/10 hover:border-black/20'
          }`}
          title="Font Size"
        >
          {['12px', '14px', '16px', '18px', '20px', '24px', '30px', '36px', '48px'].map(size => (
            <option key={size} value={size} className={theme === 'dark' ? 'bg-[#18181b] text-white' : 'bg-white text-black'}>
              {size.replace('px', '')}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-0.5">
        <ToolbarButton
          theme={theme}
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          active={editor.isActive({ textAlign: 'left' })}
          title="Align Left"
        >
          <AlignLeft size={16} />
        </ToolbarButton>
        <ToolbarButton
          theme={theme}
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          active={editor.isActive({ textAlign: 'center' })}
          title="Align Center"
        >
          <AlignCenter size={16} />
        </ToolbarButton>
        <ToolbarButton
          theme={theme}
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          active={editor.isActive({ textAlign: 'right' })}
          title="Align Right"
        >
          <AlignRight size={16} />
        </ToolbarButton>
      </div>
    </div>
  );
};

export default DocToolbar;
