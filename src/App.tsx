import React, { useState, useEffect, useMemo } from 'react';
import { Routes, Route, Navigate, useNavigate, useParams, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ExpandingGallery } from './components/ExpandingGallery';
import { BuildGrid } from './components/BuildGrid';
import { YoutubeCta } from './components/YoutubeCta';
import { Footer } from './components/Footer';
import { ArticlesPage } from './components/ArticlesPage';
import { BuildModal } from './components/BuildModal';
import { BuildDetails } from './components/BuildDetails';
import { AboutPage } from './components/AboutPage';
import { GALLERY_ITEMS, LATEST_BUILDS, CLASS_GROUPS } from './constants';
import { DETAILED_BUILDS } from './data/builds';
import { PageView, BuildGuide, ContentCategory } from './types';
import { useReveal } from './hooks/useReveal';
import { slugify } from './utils/stringUtils';

function App() {
  // Inject detailed data into builds and promote builds with text guides
  const enhancedBuilds = useMemo(() => {
    return LATEST_BUILDS.map(build => {
      const detailedData = DETAILED_BUILDS[build.id as keyof typeof DETAILED_BUILDS];
      // Prefer explicit slug from detailed data, or generate from title
      const slug = detailedData?.slug || build.slug || slugify(build.title);

      return {
        ...build,
        // Remove forced category promotion to keep original categorization logic
        // category: detailedData ? 'MMO para o Pai de Família' as ContentCategory : build.category,
        detailedData,
        slug
      };
    });
  }, []);

  const navigate = useNavigate();
  const location = useLocation();
  const [selectedBuild, setSelectedBuild] = useState<BuildGuide | null>(null);
  
  // Defaulting to Light Mode as requested ("fundo branco")
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Determine current page view based on path for Navbar active state
  const currentPage = useMemo(() => {
    if (location.pathname === '/') return PageView.HOME;
    if (location.pathname.startsWith('/builds') || location.pathname.startsWith('/build/')) return PageView.BUILDS;
    if (location.pathname.startsWith('/sobre')) return PageView.ABOUT;
    return PageView.HOME;
  }, [location.pathname]);

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
  }, [location.pathname]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleNavigate = (page: PageView) => {
    switch (page) {
      case PageView.HOME: navigate('/'); break;
      case PageView.BUILDS: navigate('/builds'); break;
      case PageView.ABOUT: navigate('/sobre'); break;
      default: navigate('/');
    }
  };

  const handleSearch = (term: string) => {
    navigate(`/builds?search=${encodeURIComponent(term)}`);
  };

  const handleViewCategory = (category: string) => {
    navigate(`/builds?category=${encodeURIComponent(category)}`);
  };

  useReveal();

  // Build search hints from builds data
  const searchHints = useMemo(() => {
    // Only show hints for common labels
    const hints = new Set<string>();
    enhancedBuilds.forEach(b => {
      if (b.category === 'Builds' || b.category === 'MMO para o Pai de Família' || b.category === 'Guias Essenciais') {
        hints.add(b.title);
        if (b.class) hints.add(b.class);
        b.tags.forEach(tag => hints.add(tag));
      }
    });
    return Array.from(hints);
  }, [enhancedBuilds]);

  const handleViewAllBuilds = () => {
    navigate('/builds');
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans text-slate-900 dark:text-slate-50 selection:bg-geki-red selection:text-white ${isDarkMode ? 'dark bg-geki-black' : 'bg-slate-50'}`}>
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onSearch={handleSearch}
        searchHints={searchHints}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
      />
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={
            <div className="bg-slate-50 dark:bg-geki-black transition-colors duration-300">
              <Hero onCtaClick={handleViewAllBuilds} />
              
              <ExpandingGallery
                  items={GALLERY_ITEMS}
                  onClassSelect={(className) => navigate(`/builds/${className.toLowerCase()}`)}
                  onViewAll={handleViewAllBuilds}
              />

              <div className="pt-10">
                  <BuildGrid
                      builds={enhancedBuilds}
                      categories={['MMO para o Pai de Família', 'Do Zero ao RMT - Ragnatales', 'Guias Essenciais', 'Builds', 'Patch Notes']}
                      onViewCategory={handleViewCategory}
                      onSelectBuild={(build) => navigate(`/build/${build.id}`)}
                  />
              </div>

              <div className="reveal">
                <YoutubeCta />
              </div>
            </div>
          } />

          <Route path="/builds" element={<ArticlesRoute />} />
          <Route path="/builds/:classId" element={<ClassArchive builds={enhancedBuilds} />} />
          <Route path="/build/:classSlug/:buildSlug" element={<BuildPage builds={enhancedBuilds} />} />
          <Route path="/build/:buildId" element={<BuildPage builds={enhancedBuilds} />} />
          <Route path="/sobre" element={<AboutPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer onNavigate={handleNavigate} />

      {/* Legacy Modal Support - for manual selection if needed or fallback */}
      {selectedBuild && (
        <BuildModal build={selectedBuild} onClose={() => setSelectedBuild(null)} />
      )}

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

// Component helper for the Articles page (formerly BuildsArchive)
const ArticlesRoute: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const category = searchParams.get('category');

  const handleSetCategory = (cat: string | null) => {
    if (cat) {
       navigate(`/builds?category=${encodeURIComponent(cat)}`);
    } else {
       navigate('/builds');
    }
  };

  return (
    <ArticlesPage 
      initialCategory={null}
      selectedCategory={category}
      setSelectedCategory={handleSetCategory}
      onNavigateHome={() => navigate('/')}
      onSelectBuild={(build) => {
          const classSlug = slugify(build.class || 'geral');
          const buildSlug = build.slug || slugify(build.title);
          navigate(`/build/${classSlug}/${buildSlug}`);
      }}
    />
  );
};


// Archive for Class filtering with Hierarchy
const ClassArchive: React.FC<{ builds: BuildGuide[] }> = ({ builds }) => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { featured, standard } = useMemo(() => {
    let result = builds;
    
    if (classId) {
      const classGroup = CLASS_GROUPS[classId.charAt(0).toUpperCase() + classId.slice(1)];
      if (classGroup) {
        result = result.filter(b => classGroup.includes(b.class || ''));
      } else {
        result = result.filter(b => b.class?.toLowerCase() === classId.toLowerCase());
      }
    }

    // Sort: Detailed guides first (although we separate them anyway)
    return {
        featured: result.filter(b => b.detailedData || b.category === 'MMO para o Pai de Família'),
        standard: result.filter(b => !b.detailedData && b.category !== 'MMO para o Pai de Família')
    };
  }, [builds, classId]);

  const title = classId 
    ? `Builds de ${classId.charAt(0).toUpperCase() + classId.slice(1)}`
    : 'Todas as Builds';

  return (
    <div className="pt-24 min-h-screen bg-geki-paper dark:bg-geki-black transition-colors duration-300">
       <div className="max-w-7xl mx-auto px-4 py-12">
          
          <div className="mb-12">
             <button
              onClick={() => navigate('/builds')}
              className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-geki-red transition-colors flex items-center gap-1"
            >
              ← Voltar para Portal
            </button>
            <h1 className="text-4xl md:text-5xl font-display font-black text-geki-black dark:text-white uppercase tracking-tighter">
              {title}
            </h1>
          </div>

          {/* Featured Articles Section */}
          {featured.length > 0 && (
            <div className="mb-16">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-geki-red uppercase tracking-widest">
                <span className="w-8 h-1 bg-geki-red block"></span>
                Artigos em Destaque
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 {featured.map(build => (
                    <div 
                      key={build.id}
                      onClick={() => {
                        const classSlug = slugify(build.class || 'geral');
                        const buildSlug = build.slug || slugify(build.title);
                        navigate(`/build/${classSlug}/${buildSlug}`);
                      }}
                      className="group relative h-[400px] rounded-3xl overflow-hidden cursor-pointer shadow-2xl shadow-geki-red/10 border-2 border-transparent hover:border-geki-red/50 transition-all duration-500"
                    >
                       <img src={build.imageUrl} alt={build.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                       <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90" />
                       <div className="absolute bottom-0 left-0 p-8">
                          <span className="bg-geki-red text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-4 inline-block">
                             Guia Completo
                          </span>
                          <h3 className="text-3xl font-display font-black text-white mb-2 leading-none group-hover:text-geki-red transition-colors">
                            {build.title}
                          </h3>
                          <p className="text-slate-300 text-sm line-clamp-2 mb-4 max-w-lg">
                            {build.description}
                          </p>
                          <div className="flex items-center gap-2 text-geki-red font-bold text-xs uppercase tracking-widest">
                             Ler Artigo <span className="group-hover:translate-x-1 transition-transform">→</span>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
            </div>
          )}

          {/* Standard Videos Section */}
          {standard.length > 0 && (
             <div>
               <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-400 uppercase tracking-widest">
                  <span className="w-8 h-1 bg-slate-400 block"></span>
                  Vídeos de Apoio & Gameplay
               </h2>
               <BuildGrid 
                 builds={[]} 
                 forcedBuilds={standard} 
                 onSelectBuild={(build) => {
                    const classSlug = slugify(build.class || 'geral');
                    const buildSlug = build.slug || slugify(build.title);
                    navigate(`/build/${classSlug}/${buildSlug}`);
                 }}
               /> 
             </div>
          )}
       </div>
    </div>
  );
};


// Component helper for the Detailed Build page
const BuildPage: React.FC<{ builds: BuildGuide[] }> = ({ builds }) => {

  const { buildId, buildSlug } = useParams();
  const navigate = useNavigate();
  
  const build = useMemo(() => 
    builds.find(b => b.id === buildId || b.slug === buildSlug),
  [builds, buildId, buildSlug]);

  if (!build) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-geki-black text-white">
        <div className="text-center">
          <h1 className="text-4xl font-black mb-4">Build Não Encontrada</h1>
          <button 
             onClick={() => navigate('/builds')}
             className="text-geki-red hover:underline font-bold"
          >
            Voltar para a lista
          </button>
        </div>
      </div>
    );
  }

  // If we have detailed data, use the new premium layout
  if (build.detailedData) {
    return (
      <BuildDetails 
        build={build} 
        detailedData={build.detailedData} 
        onBack={() => {
           // Smart back: Go to class archive if possible, else generic list
           if (build.class) {
             navigate(`/builds/${slugify(build.class)}`);
           } else {
             navigate('/builds');
           }
        }} 
      />
    );
  }

  // Fallback for video-only builds (Video Page view)
  return (
      <div className="pt-24 min-h-screen bg-geki-paper dark:bg-geki-black transition-colors duration-300">
         <div className="max-w-4xl mx-auto px-4 py-8">
            <button
              onClick={() => navigate(-1)}
              className="mb-6 text-sm font-bold text-slate-500 hover:text-geki-red flex items-center gap-2"
            >
              ← Voltar
            </button>
            <h1 className="text-3xl md:text-5xl font-display font-black mb-6 text-geki-black dark:text-white">
              {build.title}
            </h1>
            <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-2xl bg-black mb-8">
               {build.videoUrl ? (
                   <iframe 
                     src={build.videoUrl.replace('watch?v=', 'embed/')} 
                     className="w-full h-full" 
                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                     allowFullScreen
                     title={build.title}
                   />
               ) : (
                   <div className="flex items-center justify-center h-full text-slate-500">Video indisponível</div>
               )}
            </div>
            
            {/* Simple description if available */}
            <div className="prose dark:prose-invert max-w-none p-6 bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10">
               <h3 className="font-bold mb-2">Descrição</h3>
               <p>{build.description || "Sem descrição disponível."}</p>
            </div>
         </div>
      </div>
  );
};

export default App;
