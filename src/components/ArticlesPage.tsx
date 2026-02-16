
import React, { useMemo } from 'react';
import { BuildGuide, ContentCategory } from '../types';
import { LATEST_BUILDS } from '../constants';

interface ArticlesPageProps {
  initialCategory: string | null;
  onNavigateHome: () => void;
  onSelectBuild: (build: BuildGuide) => void;
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
}

const CATEGORIES: ContentCategory[] = [
  'Builds',
  'Do Zero ao RMT - Ragnatales',
  'Guias Essenciais',
  'MMO para o Pai de Família',
  'Patch Notes'
];

export const ArticlesPage: React.FC<ArticlesPageProps> = ({ 
  onNavigateHome, 
  onSelectBuild,
  selectedCategory,
  setSelectedCategory
}) => {
  
  const filteredArticles = useMemo(() => {
    if (!selectedCategory) return LATEST_BUILDS;
    return LATEST_BUILDS.filter(b => b.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="pt-24 min-h-screen bg-geki-paper dark:bg-geki-black transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 mb-12">
        {/* Breadcrumbs / Back */}
        <button
          onClick={onNavigateHome}
          className="reveal mb-6 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-geki-red transition-colors flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
          Voltar para Início
        </button>

        <header className="reveal text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-black text-geki-black dark:text-white mb-4 tracking-tight">
            PORTAL DE <span className="text-geki-red">CONTEÚDO</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 font-sans max-w-2xl mx-auto">
            Explore nossos guias, tutoriais e novidades. Use os filtros abaixo para encontrar o que procura.
          </p>
        </header>

        {/* Category Filter Chips */}
        <div className="reveal flex flex-wrap justify-center gap-3 mb-16" style={{ transitionDelay: '100ms' }}>
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 border-2 ${
              !selectedCategory 
                ? 'bg-geki-red border-geki-red text-white shadow-lg shadow-geki-red/20' 
                : 'bg-transparent border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:border-geki-red hover:text-geki-red'
            }`}
          >
            Todos
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 border-2 ${
                selectedCategory === cat 
                  ? 'bg-geki-red border-geki-red text-white shadow-lg shadow-geki-red/20' 
                  : 'bg-transparent border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:border-geki-red hover:text-geki-red'
              }`}
            >
              {cat.replace(' - Ragnatales', '')}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        <div className="reveal grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-20" style={{ transitionDelay: '200ms' }}>
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article) => (
              <ArticleGridCard key={article.id} article={article} onSelect={onSelectBuild} />
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-white/50 dark:bg-white/5 rounded-3xl border border-dashed border-slate-300 dark:border-white/10">
              <p className="text-xl font-bold text-slate-400">Nenhum artigo encontrado nesta categoria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Internal Card Component for the Articles Page (Simple reuse of logic)
const ArticleGridCard: React.FC<{ article: BuildGuide, onSelect: (b: BuildGuide) => void }> = ({ article, onSelect }) => {
    const [isFocused, setIsFocused] = React.useState(false);

    const handleInteraction = (e: React.MouseEvent) => {
        const isMobile = window.innerWidth < 768;

        if (isMobile && !isFocused) {
            e.preventDefault();
            e.stopPropagation();
            setIsFocused(true);
            return;
        }

        if (article.stages) {
            onSelect(article);
        } else if (article.videoUrl) {
            window.open(article.videoUrl, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <div
            onClick={handleInteraction}
            onMouseLeave={() => setIsFocused(false)}
            className={`group relative bg-white dark:bg-zinc-900/40 backdrop-blur-sm border transition-all duration-300 flex flex-col cursor-pointer ${
                isFocused 
                ? 'border-geki-red shadow-2xl shadow-geki-red/10 scale-[1.02] z-30'
                : 'border-slate-200 dark:border-white/5 hover:border-geki-red/50 hover:shadow-2xl hover:shadow-geki-red/5'
            }`}
        >
            <div className="relative h-48 overflow-hidden">
                <img
                    src={article.imageUrl}
                    alt={article.title}
                    className={`w-full h-full object-cover transition-transform duration-500 ${isFocused ? 'scale-110' : 'group-hover:scale-110'}`}
                />
                <div className="absolute top-0 right-0 p-3">
                   <span className="bg-geki-black/60 backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-widest px-2 py-1">
                      {article.category.replace(' - Ragnatales', '')}
                   </span>
                </div>
            </div>
            <div className="p-6">
                <h3 className={`text-lg font-display font-bold mb-2 line-clamp-2 leading-tight transition-colors ${isFocused ? 'text-geki-red' : 'text-geki-black dark:text-white group-hover:text-geki-red'}`}>
                    {article.title}
                </h3>
                <p className={`text-slate-600 dark:text-slate-400 text-xs mb-4 font-sans transition-all duration-300 ${isFocused ? 'line-clamp-none' : 'line-clamp-2'}`}>
                    {article.description}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{article.author}</span>
                    <span className={`text-[10px] font-black uppercase transition-colors ${isFocused ? 'text-geki-red underline' : 'text-geki-red'}`}>
                        {isFocused ? 'Abrir Build →' : 'Ler Agora →'}
                    </span>
                </div>
            </div>
        </div>
    );
};
