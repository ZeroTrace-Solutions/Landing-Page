import React, { useState, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import { Minus, Square, X, Maximize2 } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

export const DraggableWindow = ({ 
  title, 
  children, 
  isOpen, 
  onClose, 
  defaultSize = { width: 350, height: 450 },
  defaultPosition = { x: 50, y: 50 },
  noPadding = false,
  customBg = null
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const [parentBounds, setParentBounds] = useState({ width: 0, height: 0 });
  const containerRef = React.useRef(null);

  useEffect(() => {
    const updateSizes = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setParentBounds({ width: rect.width, height: rect.height });
      }
    };
    updateSizes();
    window.addEventListener('resize', updateSizes);
    return () => window.removeEventListener('resize', updateSizes);
  }, []);

  const toggleMinimize = () => {
    if (isMinimized) {
      setIsMinimized(false);
    } else {
      setIsMaximized(false);
      setIsMinimized(true);
    }
  };

  const toggleMaximize = () => {
    setIsMaximized((prev) => {
      const next = !prev;
      if (next) setIsMinimized(false);
      return next;
    });
  };

  const handleClose = () => {
    setIsMinimized(false);
    setIsMaximized(false);
    onClose();
  }

  if (!isOpen) return null;

  const effectiveWidth = parentBounds.width || viewport.width;
  const effectiveHeight = parentBounds.height || viewport.height;

  const maxWidth = Math.max(Math.floor(effectiveWidth * 0.9), 200);
  const maxHeight = Math.max(Math.floor(effectiveHeight * 0.9), 200);
  const normalizedWidth = Math.min(defaultSize.width, maxWidth);
  const normalizedHeight = Math.min(defaultSize.height, maxHeight);

  // Ensure the window is fully visible inside workspace by clamping position based on size
  const maxX = Math.max(10, effectiveWidth - normalizedWidth - 10);
  const maxY = Math.max(10, effectiveHeight - normalizedHeight - 10);

  const normalizedX = Math.min(defaultPosition.x, maxX);
  const normalizedY = Math.min(defaultPosition.y, maxY);

  // If the default position itself would push the window off-screen, reposition inside
  const safeX = defaultPosition.x + normalizedWidth > effectiveWidth ? maxX : normalizedX;
  const safeY = defaultPosition.y + normalizedHeight > effectiveHeight ? maxY : normalizedY;

  return (
    <AnimatePresence>
      <div ref={containerRef} className="absolute inset-0 pointer-events-none">
        <Rnd
        default={{
          x: isMaximized ? 0 : safeX,
          y: isMaximized ? 0 : safeY,
          width: isMaximized ? viewport.width : normalizedWidth,
          height: isMaximized ? viewport.height : normalizedHeight,
        }}
        size={isMaximized ? { width: viewport.width, height: viewport.height } : isMinimized ? { width: 340, height: 180 } : undefined}
        position={isMaximized ? { x: 0, y: 0 } : isMinimized ? { x: 20, y: 30 } : undefined}
        minWidth={200}
        minHeight={100}
        bounds={isMaximized ? 'window' : 'parent'}
        enableResizing={!isMinimized && !isMaximized}
        disableDragging={isMinimized || isMaximized}
        style={{
          zIndex: isMaximized ? 999 : 50,
          position: isMaximized ? 'fixed' : 'absolute',
          top: isMaximized ? 0 : undefined,
          left: isMaximized ? 0 : undefined,
          right: isMaximized ? 0 : undefined,
          bottom: isMaximized ? 0 : undefined,
          width: isMaximized ? '100vw' : undefined,
          height: isMaximized ? '100vh' : undefined,
          maxWidth: isMaximized ? '100vw' : undefined,
          maxHeight: isMaximized ? '100vh' : undefined,
          display: 'block',
          visibility: 'visible',
          margin: 0,
          padding: 0,
          overflow: 'hidden',
          pointerEvents: 'auto'
        }}
        className="window-container pointer-events-auto"
        dragHandleClassName="window-drag-handle"
      >
        <div
          className={`flex flex-col w-full h-full transition-all duration-300 border border-white/10 rounded-2xl overflow-hidden shadow-2xl ${customBg || 'bg-black/60 backdrop-blur-3xl'} ${isMaximized ? 'fixed inset-0 z-[100] !w-full !h-full rounded-none' : ''}`}
          style={{
            opacity: 1,
            transform: 'none'
          }}
        >
          {/* Header */}
          <div className="window-drag-handle flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/5 cursor-move active:cursor-grabbing">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-white/20" />
              <span className="text-[11px] font-bold text-white/70">{title}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <button 
                onClick={toggleMinimize}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/40 hover:text-white"
              >
                <Minus size={12} />
              </button>
              <button 
                onClick={toggleMaximize}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-white/40 hover:text-white"
              >
                {isMaximized ? <Square size={10} /> : <Maximize2 size={10} />}
              </button>
              <button 
                onClick={handleClose}
                className="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors text-white/40 hover:text-red-500"
              >
                <X size={12} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className={`flex-grow min-h-0 overflow-auto custom-scrollbar ${noPadding ? 'p-0' : 'p-4'}`}>
            {React.Children.map(children, child => 
              React.isValidElement(child) ? React.cloneElement(child, { isMaximized }) : child
            )}
          </div>
        </div>
        </Rnd>
      </div>
      {/* Minimized Placeholder in the Dock can be handled by the parent */}
    </AnimatePresence>
  );
};
