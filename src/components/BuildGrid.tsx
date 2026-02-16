
import React, { useState } from 'react';
import { BuildGuide, ContentCategory } from '../types';
import { BuildModal } from './BuildModal';

const MAX_ITEMS_PER_CATEGORY = 6;

interface BuildGridProps {
  builds: BuildGuide[];
  categories?: ContentCategory[];
  forcedBuilds?: BuildGuide[];
  customTitle?: string;
}

export const BuildGrid: React.FC<BuildGridProps> = ({ builds, categories, forcedBuilds, customTitle }) => {
  const [selectedBuild, setSelectedBuild] = useState<BuildGuide | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const toggleCategory = (cat: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(cat)) {
        next.delete(cat);
      } else {
        next.add(cat);
      }
      return next;
    });
  };

  if (forcedBuilds) {
      return (
        <div id="build-grid-section" className="w-full max-w-7xl mx-auto px-4 pb-20 relative z-40 scroll-mt-24">
             {selectedBuild && (
                <BuildModal build={selectedBuild} onClose={() => setSelectedBuild(null)} />
            )}

            <section className="mb-24 reveal">
                <div className="mb-10 flex items-end gap-4 border-b border-slate-200 dark:border-white/10 pb-4">
                    <h2 className="text-4xl md:text-5xl font-display font-black text-geki-black dark:text-white uppercase tracking-tighter leading-none">
                        {customTitle || "Builds Selecionadas"}
                    </h2>
                    <span className="hidden sm:block text-slate-400 font-mono text-sm mb-1 opacity-70">
                        // {forcedBuilds.length} {forcedBuilds.length === 1 ? 'ARTIGO' : 'ARTIGOS'}
                    </span>
                </div>

                {forcedBuilds.length === 0 ? (
                    <div className="text-center py-20 bg-slate-100 dark:bg-zinc-900 rounded-lg">
                        <p className="text-xl text-slate-500 font-bold">Nenhuma build encontrada para esta categoria ainda.</p>
                        <p className="text-sm text-slate-400 mt-2">Nossos escribas estão trabalhando nisso!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {forcedBuilds.map((build) => (
                             <BuildCard key={build.id} build={build} onSelect={setSelectedBuild} />
                        ))}
                    </div>
                )}
            </section>
        </div>
      )
  }

  const displayCategories: ContentCategory[] = categories || ['Guias Essenciais', 'Do Zero ao RMT - Ragnatales'];

  const getFilteredBuilds = (cat: ContentCategory) => {
    return builds.filter(b => b.category === cat);
  };

  return (
    <div id="build-grid-section" className="w-full max-w-7xl mx-auto px-4 pb-20 relative z-40 scroll-mt-24">

      {selectedBuild && (
          <BuildModal build={selectedBuild} onClose={() => setSelectedBuild(null)} />
      )}

      {displayCategories.map((category) => {
        const categoryBuilds = getFilteredBuilds(category);

        if (categoryBuilds.length === 0) return null;

        const isExpanded = expandedCategories.has(category);
        const hasMore = categoryBuilds.length > MAX_ITEMS_PER_CATEGORY;
        const visibleBuilds = isExpanded ? categoryBuilds : categoryBuilds.slice(0, MAX_ITEMS_PER_CATEGORY);
        const hiddenCount = categoryBuilds.length - MAX_ITEMS_PER_CATEGORY;

        return (
          <section key={category} className="mb-24 last:mb-0 reveal">
            <div className="mb-10 flex items-end gap-4 border-b border-slate-200 dark:border-white/10 pb-4">
               <h2 className="text-4xl md:text-5xl font-display font-black text-geki-black dark:text-white uppercase tracking-tighter leading-none">
                  {category === 'Do Zero ao RMT - Ragnatales' ? (
                      <>
                        DO ZERO AO <span className="text-geki-gold text-glow-gold">RMT</span>
                      </>
                  ) : category === 'Guias Essenciais' ? (
                      <>
                         GUIAS <span className="text-geki-red">ESSENCIAIS</span>
                      </>
                  ) : category === 'Pai de Família' ? (
                      <>
                        PAI DE <span className="text-geki-red">FAMÍLIA</span>
                      </>
                  ) : category === 'Patch Notes' ? (
                      <>
                        PATCH <span className="text-geki-gold text-glow-gold">NOTES</span>
                      </>
                  ) : (
                      <>
                        NOSSAS <span className="text-geki-red">BUILDS</span>
                      </>
                  )}
               </h2>
               <span className="hidden sm:block text-slate-400 font-mono text-sm mb-1 opacity-70">
                   // {categoryBuilds.length} {categoryBuilds.length === 1 ? 'ARTIGO' : 'ARTIGOS'}
               </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {visibleBuilds.map((build) => (
                <BuildCard key={build.id} build={build} onSelect={setSelectedBuild} />
              ))}
            </div>

            {hasMore && (
              <div className="mt-10 text-center">
                <button
                  onClick={() => toggleCategory(category)}
                  className="group/more inline-flex items-center gap-2 px-6 py-3 border-2 border-slate-200 dark:border-white/10 text-sm font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 hover:border-geki-red hover:text-geki-red transition-all duration-300"
                >
                  {isExpanded ? (
                    <>
                      Mostrar menos
                      <svg className="w-4 h-4 transition-transform group-hover/more:-translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"/></svg>
                    </>
                  ) : (
                    <>
                      Ver mais {hiddenCount} artigo{hiddenCount > 1 ? 's' : ''}
                      <svg className="w-4 h-4 transition-transform group-hover/more:translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
                    </>
                  )}
                </button>
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
};

// YouTube icon SVG
const YouTubeIcon = () => (
  <svg className="w-12 h-12" viewBox="0 0 68 48" fill="none">
    <path d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55C3.97 2.33 2.27 4.81 1.48 7.74 0.06 13.05 0 24 0 24s0.06 10.95 1.48 16.26c0.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-0.06-10.95-1.48-16.26z" fill="#FF0000"/>
    <path d="M27 34V14l18 10-18 10z" fill="white"/>
  </svg>
);

// Extracted Card Component for reuse
const BuildCard: React.FC<{ build: BuildGuide, onSelect: (b: BuildGuide) => void }> = ({ build, onSelect }) => {
    return (
        <div
            onClick={() => {
                if (build.stages) {
                    onSelect(build);
                } else if (build.videoUrl) {
                    window.open(build.videoUrl, '_blank', 'noopener,noreferrer');
                }
            }}
            className={`group relative bg-white dark:bg-zinc-900/40 backdrop-blur-sm border border-slate-200 dark:border-white/5 rounded-none overflow-hidden transition-all duration-300 hover:border-geki-red/50 hover:shadow-2xl hover:shadow-geki-red/5 flex flex-col ${build.stages || build.videoUrl ? 'cursor-pointer' : ''}`}
        >
            {/* Card Header/Image */}
            <div className="relative h-52 overflow-hidden shrink-0">
                {build.videoUrl && !build.stages && (
                <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 pointer-events-none">
                    <YouTubeIcon />
                </div>
                )}

                {build.stages && (
                <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-geki-red/20 pointer-events-none">
                    <span className="bg-geki-red text-white font-black uppercase tracking-widest px-4 py-2 text-xs">
                        Ver Detalhes
                    </span>
                </div>
                )}

            {/* Image Hover Effect */}
            <div className="absolute inset-0 bg-geki-black/20 group-hover:bg-transparent transition-colors z-10"></div>
            <img
                src={build.imageUrl}
                alt={build.title}
                className="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-700 ease-in-out filter grayscale-[30%] group-hover:grayscale-0"
                onError={(e) => {
                    const img = e.currentTarget;
                    if (build.fallbackImageUrl && img.src !== build.fallbackImageUrl) {
                        img.src = build.fallbackImageUrl;
                    } else if (img.src.includes('maxresdefault')) {
                        img.src = img.src.replace('maxresdefault', 'hqdefault');
                    }
                }}
            />

            {/* Subcategory Badge (Floating Top Left) */}
            {build.subcategory && (
                <div className="absolute top-0 left-0 z-20">
                    <div className="bg-geki-black/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest px-3 py-2 border-r border-b border-white/10">
                        {build.subcategory}
                    </div>
                </div>
            )}

            {/* Difficulty/Type Badge */}
            {build.difficulty && (
                <div className="absolute bottom-0 right-0 z-20">
                        <div className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider text-geki-black ${
                        build.difficulty === 'Easy' ? 'bg-green-400' :
                        build.difficulty === 'Medium' ? 'bg-yellow-400' :
                        'bg-geki-gold'
                    }`}>
                        {build.difficulty}
                    </div>
                </div>
            )}
            </div>

            {/* Card Body */}
            <div className="p-6 flex flex-col flex-grow relative">
            {/* Decorative Line */}
            <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-slate-300 dark:via-white/20 to-transparent"></div>

            <div className="flex flex-wrap gap-2 mb-4 mt-2">
                {build.tags.map(tag => (
                    <span key={tag} className="text-[9px] uppercase font-bold text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/10 px-2 py-0.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
                        #{tag}
                    </span>
                ))}
            </div>

            <h3 className="text-xl font-display font-bold text-geki-black dark:text-white mb-3 leading-tight group-hover:text-geki-red transition-colors">
                {build.title}
            </h3>

            <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 line-clamp-3 leading-relaxed flex-grow font-sans">
                {build.description}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5 mt-auto">
                <div className="flex items-center gap-2">
                    {build.class && (
                        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{build.class}</span>
                    )}
                    {!build.class && (
                        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{build.author}</span>
                    )}
                </div>

                <button className="group/btn flex items-center gap-1 text-xs font-black uppercase tracking-widest text-geki-red hover:text-white hover:bg-geki-red px-3 py-1 transition-all">
                    {build.stages ? 'Ver Build' : build.videoUrl ? 'Assistir' : 'Ler Agora'}
                    <svg className="w-3 h-3 transition-transform group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                </button>
            </div>
            </div>
        </div>
    )
}
