
import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ExpandingGallery } from './components/ExpandingGallery';
import { BuildGrid } from './components/BuildGrid';
import { YoutubeCta } from './components/YoutubeCta';
import { Footer } from './components/Footer';
import { ArticlesPage } from './components/ArticlesPage';
import { BuildModal } from './components/BuildModal';
import { GALLERY_ITEMS, LATEST_BUILDS, CLASS_GROUPS } from './constants';
import { PageView, BuildGuide } from './types';
import { useReveal } from './hooks/useReveal';

function App() {
  const [currentPage, setCurrentPage] = useState<PageView>(PageView.HOME);
  const [selectedClassFilter, setSelectedClassFilter] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBuild, setSelectedBuild] = useState<BuildGuide | null>(null);
// ... existing states ...
  
  // Defaulting to Light Mode as requested ("fundo branco")
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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
      if (page !== PageView.ARTICLES) {
          setSelectedCategory(null);
      }
  };

  const handleViewCategory = (category: string) => {
      setSelectedCategory(category);
      setCurrentPage(PageView.ARTICLES);
      window.scrollTo(0, 0);
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
             {/* ... inside BUILDS case ... */}
             <div className="max-w-7xl mx-auto px-4 mb-8">
                {/* ... */}
             </div>
             
             <BuildGrid 
                builds={[]} 
                forcedBuilds={displayedBuilds} 
                customTitle={title}
             /> 
          </div>
        );
      case PageView.ARTICLES:
        return (
          <ArticlesPage 
            initialCategory={selectedCategory}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            onNavigateHome={() => handleNavigate(PageView.HOME)}
            onSelectBuild={setSelectedBuild}
          />
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
                    categories={['Do Zero ao RMT - Ragnatales', 'MMO para o Pai de Família', 'Guias Essenciais', 'Patch Notes']}
                    onViewCategory={handleViewCategory}
                />
            </div>

            <div className="reveal">
              <YoutubeCta />
            </div>

            {selectedBuild && (
              <BuildModal build={selectedBuild} onClose={() => setSelectedBuild(null)} />
            )}
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
