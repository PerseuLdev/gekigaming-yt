
import React, { useRef } from 'react';
import { GalleryItem } from '../types';

interface ExpandingGalleryProps {
  items: GalleryItem[];
  onClassSelect: (className: string) => void;
  onViewAll: () => void;
}

export const ExpandingGallery: React.FC<ExpandingGalleryProps> = ({ items, onClassSelect, onViewAll }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === 'left' ? -300 : 300;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full flex flex-col items-center justify-start py-10 md:py-16 relative overflow-hidden bg-geki-paper dark:bg-geki-black transition-colors duration-300">
      
      {/* Header & Mobile Navigation */}
      <div className="w-full max-w-7xl px-4 mb-8 flex items-end justify-between relative z-10">
        <div className="max-w-xl">
            <div className="inline-block px-3 py-1 mb-3 border border-geki-red/30 rounded-full">
                <span className="text-geki-red text-[10px] font-bold uppercase tracking-[0.2em]">O Guia Definitivo</span>
            </div>
          <h2 className="text-3xl md:text-5xl font-display font-black text-geki-black dark:text-white leading-none tracking-tight">
            BUILDS POR <span className="text-geki-red">CLASSE</span>
          </h2>
          <p className="hidden md:block text-slate-600 dark:text-slate-400 font-medium mt-3 text-lg leading-relaxed">
            Selecione sua classe abaixo e descubra os segredos para dominar o PvP e PvM no Ragnatales.
          </p>
        </div>

        {/* Mobile Navigation Buttons (Top Right) */}
        <div className="flex md:hidden gap-2">
          <button 
            onClick={() => scroll('left')}
            className="w-10 h-10 flex items-center justify-center bg-white dark:bg-zinc-800 border border-slate-200 dark:border-white/10 rounded-full shadow-lg active:scale-95 transition-transform text-geki-black dark:text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button 
            onClick={() => scroll('right')}
            className="w-10 h-10 flex items-center justify-center bg-geki-red border border-geki-red rounded-full shadow-lg active:scale-95 transition-transform text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>

      {/* Gallery Container */}
      <div className="w-full max-w-[1400px] mx-auto relative group/gallery h-[450px] md:h-[550px]">
        
        {/* Desktop & Mobile Combined Logic */}
        <div 
          ref={scrollRef}
          className="flex h-full w-full overflow-x-auto md:overflow-hidden scrollbar-hide snap-x snap-mandatory md:snap-none px-4 md:px-0 py-4 md:py-0"
        >
          {items.map((item, index) => (
            <div
              key={item.id}
              onClick={() => onClassSelect(item.title)}
              className={`
                relative flex-shrink-0 md:flex-shrink md:flex-grow
                w-[280px] md:w-auto 
                h-full
                transition-all duration-500 ease-out
                transform -skew-x-12 md:hover:flex-grow-[4]
                overflow-hidden
                border-r-4 border-geki-paper dark:border-geki-black
                first:ml-4 md:first:ml-0 last:mr-4 md:last:mr-0
                snap-center
                group
                cursor-pointer
              `}
            >
              {/* Image Container (Un-skewed) */}
              <div className="absolute inset-[-20%] transform skew-x-12 origin-center">
                <div className="absolute inset-0 bg-geki-black/40 group-hover:bg-geki-black/20 transition-colors duration-500 z-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90 z-10" />
                <img
                  className="h-full w-full object-cover object-center filter grayscale-[60%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                  src={item.imageOverride || item.imageUrl}
                  alt={item.title}
                />
              </div>

              {/* Horizontal Content Overlay - hidden by default, shown on hover (Desktop) / always shown (Mobile) */}
              <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-end pb-12 pl-12 pr-6 transform skew-x-12 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-500">
                <div className="translate-y-4 md:translate-y-8 md:group-hover:translate-y-0 transition-transform duration-500">
                  <span className="inline-block bg-geki-red text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 mb-3">
                    {item.subtitle}
                  </span>
                  <h3 className="text-white font-display font-black text-3xl md:text-5xl uppercase leading-none drop-shadow-lg mb-4">
                    {item.title}
                  </h3>

                  {/* Detailed Description on Hover */}
                  <div className="max-h-0 md:max-h-[0px] overflow-hidden md:group-hover:max-h-[200px] transition-all duration-700 ease-in-out opacity-0 md:group-hover:opacity-100">
                      <p className="text-slate-200 text-sm md:text-base font-medium leading-relaxed max-w-sm border-l-2 border-geki-red pl-3">
                          {item.hoverDescription}
                      </p>
                      <div className="mt-4 flex items-center gap-2 text-geki-red text-xs font-black uppercase tracking-widest">
                          Ver Builds <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                      </div>
                  </div>
                </div>
              </div>

              {/* Vertical Text for collapsed state (Desktop only) */}
              <div className="hidden md:flex absolute inset-0 items-center justify-center z-20 pointer-events-none transition-all duration-500 opacity-100 group-hover:opacity-0 skew-x-12">
                <span className="text-white/80 font-display font-black text-4xl uppercase tracking-[0.1em] -rotate-90 whitespace-nowrap drop-shadow-lg">
                  {item.title}
                </span>
              </div>
              
            </div>
          ))}
        </div>
      </div>

      {/* "See All" Fixed Link Below */}
      <div className="w-full flex justify-center mt-8 md:mt-12">
        <button 
          onClick={onViewAll}
          className="group flex items-center gap-3 px-8 py-3 bg-transparent border-b-2 border-slate-300 dark:border-white/20 hover:border-geki-red transition-all"
        >
          <span className="text-sm font-black uppercase tracking-[0.2em] text-geki-black dark:text-white group-hover:text-geki-red transition-colors">
            Ver todas as builds
          </span>
          <svg 
            className="w-5 h-5 text-slate-400 group-hover:text-geki-red group-hover:translate-y-1 transition-all" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      </div>

    </section>
  );
};
