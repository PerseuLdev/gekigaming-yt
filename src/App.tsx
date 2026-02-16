
import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ExpandingGallery } from './components/ExpandingGallery';
import { BuildGrid } from './components/BuildGrid';
import { YoutubeCta } from './components/YoutubeCta';
import { Footer } from './components/Footer';
import { GALLERY_ITEMS, LATEST_BUILDS, CLASS_GROUPS } from './constants';
import { PageView } from './types';
import { useReveal } from './hooks/useReveal';

function App() {
  const [currentPage, setCurrentPage] = useState<PageView>(PageView.HOME);
  const [selectedClassFilter, setSelectedClassFilter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Defaulting to Light Mode as requested ("fundo branco")
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage, selectedClassFilter]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  useReveal();

  // Build search hints from builds data
  const searchHints = useMemo(() => {
    const builds = LATEST_BUILDS.filter(b => b.category === 'Builds');
    const hints = new Set<string>();
    builds.forEach(b => {
      hints.add(b.title);
      if (b.class) hints.add(b.class);
      b.tags.forEach(tag => hints.add(tag));
    });
    return Array.from(hints);
  }, []);

  // Handlers for Navigation
  const handleClassSelect = (className: string) => {
    setSelectedClassFilter(className);
    setSearchTerm(""); // Clear search when selecting a class from gallery
    setCurrentPage(PageView.BUILDS);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setSelectedClassFilter(null);
    setCurrentPage(PageView.BUILDS);
  };

  const handleViewAllBuilds = () => {
    setSelectedClassFilter(null); // Null means "Show All"
    setSearchTerm("");
    setCurrentPage(PageView.BUILDS);
  };

  const handleNavigate = (page: PageView) => {
      if (page === currentPage) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
      }
      
      setCurrentPage(page);
      if (page === PageView.BUILDS) {
          setSelectedClassFilter(null);
          setSearchTerm("");
      }
  };

  const renderContent = () => {
    switch (currentPage) {
      case PageView.BUILDS:
        // Logic for filtering builds
        let displayedBuilds = LATEST_BUILDS.filter(b => b.category === 'Builds');
        let title = "Todas as Builds";

        // Filter by Class (Gallery Selection) using CLASS_GROUPS
        if (selectedClassFilter) {
            const classGroup = CLASS_GROUPS[selectedClassFilter];
            if (classGroup) {
                // Gallery group filter (e.g. "Espadachim" → ["Lorde", "Paladino"])
                displayedBuilds = displayedBuilds.filter(b => classGroup.includes(b.class || ''));
                title = classGroup.length > 1 ? `Builds de ${selectedClassFilter}` : `Builds de ${classGroup[0]}`;
            } else {
                // Direct class filter
                displayedBuilds = displayedBuilds.filter(b => b.class === selectedClassFilter);
                title = `Builds de ${selectedClassFilter}`;
            }
        }

        // Filter by Search Term (Input)
        if (searchTerm) {
          displayedBuilds = displayedBuilds.filter(b => 
            b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.class?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
          );
          if (!selectedClassFilter) title = `Resultados para "${searchTerm}"`;
        }

        return (
          <div className="pt-24 min-h-screen bg-geki-paper dark:bg-geki-black transition-colors duration-300">
             <div className="max-w-7xl mx-auto px-4 mb-8">
                <button
                    onClick={() => setCurrentPage(PageView.HOME)}
                    className="reveal mb-4 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-geki-red transition-colors flex items-center gap-1"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                    Voltar para Início
                </button>
                <h1 className="reveal text-4xl md:text-5xl font-display font-black text-geki-black dark:text-white mb-4 tracking-tight text-center" style={{transitionDelay: '100ms'}}>
                   {selectedClassFilter ? (
                       <>GUIA DE CLASSE: <span className="text-geki-red">{title.replace('Builds de ', '').toUpperCase()}</span></>
                   ) : searchTerm ? (
                       <>BUSCA: <span className="text-geki-red">{searchTerm.toUpperCase()}</span></>
                   ) : (
                       <>OTIMIZE SEU TEMPO, <br/><span className="text-geki-red">MAXIMIZE SUA DIVERSÃO</span></>
                   )}
                </h1>
                <p className="reveal text-slate-600 dark:text-slate-400 font-sans max-w-2xl mx-auto mb-8 text-center" style={{transitionDelay: '200ms'}}>
                  {selectedClassFilter 
                    ? `Explore as melhores estratégias e equipamentos para dominar com seu ${selectedClassFilter}.`
                    : "Encontre a build perfeita filtrando por nome ou classe abaixo."
                  }
                </p>

                {/* SEARCH BAR COMPONENT */}
                <div className="max-w-md mx-auto mb-12 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Busque por classe, nome da build..."
                    className="block w-full pl-10 pr-3 py-3 border border-slate-300 dark:border-gray-700 rounded-lg leading-5 bg-white dark:bg-gray-800 text-slate-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-geki-red focus:border-geki-red sm:text-sm transition duration-150 ease-in-out shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <div className="absolute top-full left-0 right-0 mt-2 text-xs text-slate-500 dark:text-slate-400 font-bold text-center animate-fade-in">
                       Encontrados {displayedBuilds.length} resultados
                    </div>
                  )}
                </div>

             </div>
             
             {/* We use forcedBuilds here to show exactly what we filtered */}
             <BuildGrid 
                builds={[]} // Not used in forced mode
                forcedBuilds={displayedBuilds} 
                customTitle={title}
             /> 
          </div>
        );
      case PageView.ABOUT:
         return (
          <div className="pt-28 pb-20 min-h-screen bg-slate-50 dark:bg-geki-black transition-colors duration-300 px-4">
            <div className="max-w-4xl mx-auto">
              {/* Back button */}
              <button
                onClick={() => setCurrentPage(PageView.HOME)}
                className="reveal mb-8 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-geki-red transition-colors flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
                Voltar para Início
              </button>

              <div className="reveal-scale bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl rounded-3xl p-10 md:p-14 border border-white/50 dark:border-white/10 shadow-xl">
                <div className="inline-block px-3 py-1 mb-4 border border-geki-red/30 rounded-full">
                  <span className="text-geki-red text-[10px] font-bold uppercase tracking-[0.2em]">Quem somos</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-display font-black text-geki-black dark:text-white mb-8 tracking-tight">
                  Sobre a <span className="text-geki-red">GekiGaming</span>
                </h1>
                <div className="space-y-6 text-slate-700 dark:text-slate-300 leading-relaxed font-sans text-lg">
                  <p>
                    <strong className="text-geki-black dark:text-white">Gekigaming</strong> é um projeto de <strong className="text-geki-black dark:text-white">José Façanha</strong>, que iniciou sua trajetória nos MMORPGs com o Tibia em meados dos anos 2000, jogador de Ragnarok Online desde o lançamento no Brasil em 2002, fã de MMORPGs e apaixonado por games no geral, pai de uma linda menina e Especialista em Design de Produto.
                  </p>
                  <p>
                    O canal começou e parou diversas vezes nesse tópico, até finalmente "engrenar" com os conteúdos do <strong className="text-geki-black dark:text-white">RagnaTales</strong>, um servidor privado de Ragnarok Online. Hoje, mais de 150 vídeos depois, somos uma comunidade de jogadores e pais de família, aprendendo, nos divertindo e compartilhando conhecimento com a galerinha do nosso universo gamer.
                  </p>
                </div>

                {/* Links */}
                <div className="mt-10 flex flex-col sm:flex-row gap-4">
                  <a
                    href="https://www.youtube.com/@gekigaming"
                    target="_blank"
                    rel="noreferrer"
                    className="px-8 py-4 bg-geki-red text-white font-display font-black text-sm uppercase tracking-widest hover:bg-red-700 transition-all text-center skew-x-[-10deg]"
                  >
                    <span className="skew-x-[10deg] block">Canal do YouTube</span>
                  </a>
                  <a
                    href="https://discord.gg/d27B88MgJx"
                    target="_blank"
                    rel="noreferrer"
                    className="px-8 py-4 bg-transparent border border-slate-300 dark:border-white/20 text-geki-black dark:text-white font-display font-bold text-sm uppercase tracking-widest hover:border-geki-red hover:text-geki-red transition-all text-center skew-x-[-10deg]"
                  >
                    <span className="skew-x-[10deg] block">Discord</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        );
      case PageView.HOME:
      default:
        return (
          <div className="bg-slate-50 dark:bg-geki-black transition-colors duration-300">
            <Hero onCtaClick={handleViewAllBuilds} />
            
            {/* Vitrine de Builds por Classe logo após o Hero */}
            <ExpandingGallery
                items={GALLERY_ITEMS}
                onClassSelect={handleClassSelect}
                onViewAll={handleViewAllBuilds}
            />

            {/* Content categories below gallery */}
            <div className="pt-10">
                <BuildGrid
                    builds={LATEST_BUILDS}
                    categories={['Do Zero ao RMT - Ragnatales', 'Pai de Família', 'Guias Essenciais', 'Patch Notes']}
                />
            </div>

            <div className="reveal">
              <YoutubeCta />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900 dark:text-slate-50 selection:bg-geki-red selection:text-white bg-slate-50 dark:bg-geki-black">
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onSearch={handleSearch}
        searchHints={searchHints}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
      />
      <main className="flex-grow">
        {renderContent()}
      </main>
      <Footer onNavigate={handleNavigate} />

      {/* Botão Voltar ao Topo */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[100] px-4 py-3 bg-geki-red text-white shadow-lg hover:bg-red-700 transition-all duration-300 skew-x-[-10deg] ${
          showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        aria-label="Voltar ao topo"
      >
        <div className="skew-x-[10deg]">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </div>
      </button>
    </div>
  );
}

export default App;
