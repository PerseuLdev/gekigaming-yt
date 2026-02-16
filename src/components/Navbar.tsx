import React, { useState, useEffect, useRef, useMemo } from 'react';
import { PageView } from '../types';

interface NavbarProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
  onSearch: (term: string) => void;
  searchHints?: string[];
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate, onSearch, searchHints = [], isDarkMode, toggleTheme }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
        if (!searchValue) setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchValue]);

  // Body scroll lock when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const isIntegrated = !scrolled && currentPage === PageView.HOME && !isMenuOpen;
  const navUseLight = !isDarkMode && !isIntegrated;

  const filteredSuggestions = useMemo(() => {
    if (!searchValue.trim()) return searchHints.slice(0, 6);
    const q = searchValue.toLowerCase();
    return searchHints.filter(h => h.toLowerCase().includes(q)).slice(0, 6);
  }, [searchValue, searchHints]);

  const executeSearch = (term: string) => {
    onSearch(term);
    setSearchValue('');
    setSearchOpen(false);
    setShowSuggestions(false);
  };

  const navItems = [
    { label: 'Início', value: PageView.HOME },
    { label: 'Builds & Guias', value: PageView.BUILDS },
    { label: 'Sobre', value: PageView.ABOUT },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${
          scrolled || isMenuOpen
            ? isDarkMode
              ? 'bg-geki-black/95 backdrop-blur-md border-white/10 py-4'
              : 'bg-white/95 backdrop-blur-md border-slate-200 py-4 shadow-sm'
            : 'bg-transparent border-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between">

            {/* Logo */}
            <div 
              className="flex items-center gap-3 cursor-pointer group" 
              onClick={() => {
                onNavigate(PageView.HOME);
                setIsMenuOpen(false);
              }}
            >
              <div className={`h-10 w-10 flex items-center justify-center backdrop-blur-sm rounded-lg p-1 group-hover:border-geki-red/50 transition-colors ${navUseLight ? 'bg-geki-black/10 border border-slate-300' : 'bg-white/10 border border-white/10'}`}>
                <img
                  src="https://www.gekigaming.com.br/_assets/v11/45adf06fea0b843a60fbbb4d281e70b2e769719b.svg"
                  alt="GekiGaming Logo"
                  className="h-full w-full object-contain rotate-180 drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]"
                />
              </div>
              <span className={`font-display font-black text-xl tracking-tight leading-none uppercase hidden sm:block ${navUseLight ? 'text-geki-black' : 'text-white'} ${!scrolled && !navUseLight ? 'drop-shadow-md' : ''}`}>
                Geki<span className="text-geki-red">Gaming</span>
              </span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <div className="flex items-center space-x-6">
                {navItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => onNavigate(item.value)}
                    className={`text-sm font-bold tracking-wide uppercase transition-all duration-200 relative group ${
                      currentPage === item.value
                        ? 'text-geki-red'
                        : navUseLight ? 'text-slate-600 hover:text-geki-black' : 'text-white/80 hover:text-white'
                    }`}
                  >
                    {item.label}
                    <span className={`absolute -bottom-1 left-0 h-[2px] bg-geki-red transition-all duration-300 ${currentPage === item.value ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                  </button>
                ))}
              </div>

              {/* Search */}
              <div ref={searchRef} className="relative flex items-center">
                <form
                  onSubmit={(e: React.FormEvent) => {
                    e.preventDefault();
                    if (searchValue.trim()) executeSearch(searchValue.trim());
                  }}
                  className="flex items-center"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setSearchOpen(!searchOpen);
                      if (!searchOpen) setShowSuggestions(true);
                    }}
                    className={`${navUseLight ? 'text-slate-600 hover:text-geki-red' : 'text-white/80 hover:text-geki-red'} transition-colors z-10`}
                    aria-label="Buscar"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ease-out ${searchOpen ? 'w-52 ml-2 opacity-100' : 'w-0 ml-0 opacity-0'}`}>
                    <input
                      ref={(el) => { if (el && searchOpen) el.focus(); }}
                      type="text"
                      value={searchValue}
                      onChange={(e) => {
                        setSearchValue(e.target.value);
                        setShowSuggestions(true);
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      placeholder="Buscar builds..."
                      className={`w-full px-3 py-1.5 text-sm border rounded-none outline-none transition-colors ${
                        navUseLight
                          ? 'bg-white border-slate-300 text-geki-black placeholder-slate-400 focus:border-geki-red'
                          : 'bg-white/10 border-white/20 text-white placeholder-white/40 focus:border-geki-red'
                      }`}
                    />
                  </div>
                </form>

                {/* Suggestions Dropdown */}
                {searchOpen && showSuggestions && filteredSuggestions.length > 0 && (
                  <div className={`absolute top-full right-0 mt-2 w-64 max-h-72 overflow-y-auto border shadow-xl z-50 ${
                    navUseLight ? 'bg-white border-slate-200' : 'bg-zinc-900 border-white/10'
                  }`}>
                    {!searchValue.trim() && (
                      <div className={`px-3 py-2 text-[10px] font-bold uppercase tracking-widest ${navUseLight ? 'text-slate-400' : 'text-white/30'}`}>
                        Sugestões
                      </div>
                    )}
                    {filteredSuggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => executeSearch(suggestion)}
                        className={`w-full text-left px-3 py-2.5 text-sm transition-colors flex items-center gap-2 ${
                          navUseLight
                            ? 'text-slate-700 hover:bg-slate-50 hover:text-geki-red'
                            : 'text-slate-300 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <svg className="w-3.5 h-3.5 opacity-40 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className={`h-6 w-[1px] ${navUseLight ? 'bg-slate-300' : 'bg-white/20'}`}></div>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`${navUseLight ? 'text-slate-600 hover:text-geki-gold' : 'text-white/80 hover:text-geki-gold'} transition-colors`}
                aria-label="Toggle Theme"
              >
                {isDarkMode ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>

              <a
                href="https://www.youtube.com/@gekigaming"
                target="_blank"
                rel="noreferrer"
                className={`px-6 py-2 text-xs font-black uppercase tracking-widest hover:bg-geki-red hover:text-white transition-all skew-x-[-10deg] ${navUseLight ? 'bg-geki-black text-white' : 'bg-white text-geki-black'}`}
              >
                <div className="skew-x-[10deg]">Membros</div>
              </a>
            </div>

            {/* Mobile Menu Button - Keep inside Navbar logic */}
            <div className="flex md:hidden items-center gap-4">
              <button
                onClick={toggleTheme}
                className={`p-2 transition-colors duration-300 ${navUseLight ? 'text-geki-black hover:text-geki-red' : 'text-white hover:text-geki-red'}`}
                aria-label="Alternar Tema"
              >
                {isDarkMode ? (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                )}
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`relative z-[100] inline-flex items-center justify-center p-2 transition-colors ${isMenuOpen || !navUseLight ? 'text-white' : 'text-geki-black'} hover:text-geki-red focus:outline-none`}
                aria-label="Menu"
              >
                <div className="w-8 h-8 flex flex-col justify-center items-center">
                  <span className={`block w-6 h-0.5 bg-current transition-all duration-300 ease-out ${isMenuOpen ? 'rotate-45 translate-y-0.5' : '-translate-y-1'}`}></span>
                  <span className={`block w-6 h-0.5 bg-current transition-all duration-300 ease-out my-0.5 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                  <span className={`block w-6 h-0.5 bg-current transition-all duration-300 ease-out ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : 'translate-y-1'}`}></span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Premium Lateral Mobile Menu - MOVED OUTSIDE NAV for stability */}
      <div 
        className={`fixed inset-0 z-[90] md:hidden transition-all duration-500 ease-in-out ${
          isMenuOpen ? 'visible pointer-events-auto' : 'invisible pointer-events-none'
        }`}
      >
        {/* Backdrop Overlay */}
        <div 
          className={`absolute inset-0 bg-geki-black/80 backdrop-blur-[4px] transition-opacity duration-500 ${
            isMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsMenuOpen(false)}
        />
        
        {/* Menu Panel */}
        <div 
          className={`absolute top-0 right-0 bottom-0 w-[85%] max-w-sm bg-geki-black border-l border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] flex flex-col ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Menu Header with Logo */}
          <div className="p-8 pt-10 border-b border-white/5 bg-white/5 relative">
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-8 right-6 text-white/40 hover:text-geki-red transition-colors"
              aria-label="Fechar Menu"
            >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 flex items-center justify-center bg-white/10 border border-white/10 rounded-xl p-2 drop-shadow-xl">
                <img
                  src="https://www.gekigaming.com.br/_assets/v11/45adf06fea0b843a60fbbb4d281e70b2e769719b.svg"
                  alt="GekiGaming"
                  className="h-full w-full object-contain rotate-180"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-display font-black text-2xl uppercase tracking-tighter leading-none">
                  Geki<span className="text-geki-red">Gaming</span>
                </span>
                <span className="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em] mt-1">
                  MMO para o Pai de Família
                </span>
              </div>
            </div>
          </div>

          <div className="flex-grow overflow-y-auto px-6 py-8 space-y-2 custom-scrollbar">
            {/* Mobile Search - More prominent */}
            <div className={`transition-all duration-700 delay-100 ${isMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <span className="block text-[10px] font-bold uppercase tracking-widest text-white/30 ml-4 mb-2">Busca</span>
              <MobileSearch
                searchValue={searchValue}
                setSearchValue={setSearchValue}
                suggestions={filteredSuggestions}
                onSearch={(term) => {
                  executeSearch(term);
                  setIsMenuOpen(false);
                }}
              />
            </div>

            <div className="pt-4 space-y-1">
              <span className="block text-[10px] font-bold uppercase tracking-widest text-white/30 ml-4 mb-4">Navegação</span>
              {navItems.map((item, idx) => (
                <button
                  key={item.label}
                  onClick={() => {
                    onNavigate(item.value);
                    setIsMenuOpen(false);
                  }}
                  className={`group w-full flex items-center justify-between px-4 py-4 rounded-xl transition-all duration-300 ${isMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}
                  style={{ transitionDelay: `${200 + (idx * 100)}ms` }}
                >
                  <span className={`text-xl font-display font-black uppercase tracking-wide transition-colors ${
                    currentPage === item.value ? 'text-geki-red' : 'text-slate-100 group-hover:text-geki-red'
                  }`}>
                    {item.label}
                  </span>
                  <svg className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${currentPage === item.value ? 'text-geki-red' : 'text-white/20'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"/></svg>
                </button>
              ))}
            </div>

            {/* Social Links Sub-Menu */}
            <div className={`pt-8 grid grid-cols-2 gap-4 transition-all duration-700 delay-500 ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <a 
                href="https://www.youtube.com/@gekigaming" 
                target="_blank" 
                rel="noreferrer"
                className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-geki-red transition-all group"
              >
                <svg className="w-8 h-8 text-white group-hover:text-[#FF0000] transition-colors mb-2" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                <span className="text-[10px] font-black uppercase tracking-widest text-white/60">YouTube</span>
              </a>
              <a 
                href="https://discord.gg/d27B88MgJx" 
                target="_blank" 
                rel="noreferrer"
                className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-[#5865F2] transition-all group"
              >
                <svg className="w-8 h-8 text-white group-hover:text-[#5865F2] transition-colors mb-2" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 11.721 11.721 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.078.078 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.419 0 1.334-.956 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.419 0 1.334-.946 2.419-2.157 2.419z"/></svg>
                <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Discord</span>
              </a>
            </div>
          </div>

          {/* Menu Footer */}
          <div className={`p-8 bg-white/5 border-t border-white/5 transition-all duration-700 delay-600 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}>
            <a
              href="https://www.youtube.com/@gekigaming/join"
              target="_blank"
              rel="noreferrer"
              className="group relative block w-full bg-geki-red text-white py-5 px-6 font-display font-black text-sm uppercase tracking-[0.2em] transform -skew-x-12 overflow-hidden shadow-[0_10px_30px_-10px_rgba(230,57,70,0.5)] transition-all hover:shadow-[0_15px_40px_-10px_rgba(230,57,70,0.7)] hover:-translate-y-1"
            >
              <div className="skew-x-12 flex items-center justify-center gap-2">
                <span className="relative z-10">🥇 SEJA MEMBRO</span>
                <svg className="w-5 h-5 relative z-10 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
              </div>
              
              {/* Animated Shine Effect */}
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shine" />
            </a>
            <p className="mt-6 text-center text-white/20 text-[10px] font-bold uppercase tracking-widest">
              GekiGaming © 2026
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

/* Mobile search with inline suggestions */
const MobileSearch: React.FC<{
  searchValue: string;
  setSearchValue: (v: string) => void;
  suggestions: string[];
  onSearch: (term: string) => void;
}> = ({ searchValue, setSearchValue, suggestions, onSearch }) => {
  const [focused, setFocused] = useState(false);
  const show = focused && suggestions.length > 0;

  return (
    <div className="relative mb-4">
      <form
        onSubmit={(e: React.FormEvent) => {
          e.preventDefault();
          if (searchValue.trim()) onSearch(searchValue.trim());
        }}
      >
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
          <svg className="h-5 w-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          placeholder="Buscar builds..."
          className="block w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 text-white placeholder-white/40 text-sm focus:outline-none focus:border-geki-red transition-colors"
        />
      </form>
      {show && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-zinc-900 border border-white/10 shadow-xl z-50 max-h-48 overflow-y-auto">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => onSearch(s)}
              className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors flex items-center gap-2"
            >
              <svg className="w-3.5 h-3.5 opacity-40 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
