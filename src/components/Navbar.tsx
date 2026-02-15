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

  const useLight = !isDarkMode;

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
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${
        scrolled
          ? isDarkMode
            ? 'bg-geki-black/90 backdrop-blur-md border-white/10 py-4'
            : 'bg-white/90 backdrop-blur-md border-slate-200 py-4 shadow-sm'
          : 'bg-transparent border-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onNavigate(PageView.HOME)}>
            <div className={`h-10 w-10 flex items-center justify-center backdrop-blur-sm rounded-lg p-1 group-hover:border-geki-red/50 transition-colors ${useLight ? 'bg-geki-black/10 border border-slate-300' : 'bg-white/10 border border-white/10'}`}>
              <img
                src="https://www.gekigaming.com.br/_assets/v11/45adf06fea0b843a60fbbb4d281e70b2e769719b.svg"
                alt="GekiGaming Logo"
                className="h-full w-full object-contain rotate-180 drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]"
              />
            </div>
            <span className={`font-display font-black text-xl tracking-tight leading-none uppercase hidden sm:block ${useLight ? 'text-geki-black' : 'text-white'} ${!scrolled && !useLight ? 'drop-shadow-md' : ''}`}>
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
                      : useLight ? 'text-slate-600 hover:text-geki-black' : 'text-white/80 hover:text-white'
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
                  className={`${useLight ? 'text-slate-600 hover:text-geki-red' : 'text-white/80 hover:text-geki-red'} transition-colors z-10`}
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
                      useLight
                        ? 'bg-white border-slate-300 text-geki-black placeholder-slate-400 focus:border-geki-red'
                        : 'bg-white/10 border-white/20 text-white placeholder-white/40 focus:border-geki-red'
                    }`}
                  />
                </div>
              </form>

              {/* Suggestions Dropdown */}
              {searchOpen && showSuggestions && filteredSuggestions.length > 0 && (
                <div className={`absolute top-full right-0 mt-2 w-64 max-h-72 overflow-y-auto border shadow-xl z-50 ${
                  useLight ? 'bg-white border-slate-200' : 'bg-zinc-900 border-white/10'
                }`}>
                  {!searchValue.trim() && (
                    <div className={`px-3 py-2 text-[10px] font-bold uppercase tracking-widest ${useLight ? 'text-slate-400' : 'text-white/30'}`}>
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
                        useLight
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

            <div className={`h-6 w-[1px] ${useLight ? 'bg-slate-300' : 'bg-white/20'}`}></div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`${useLight ? 'text-slate-600 hover:text-geki-gold' : 'text-white/80 hover:text-geki-gold'} transition-colors`}
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
              className={`px-6 py-2 text-xs font-black uppercase tracking-widest hover:bg-geki-red hover:text-white transition-all skew-x-[-10deg] ${useLight ? 'bg-geki-black text-white' : 'bg-white text-geki-black'}`}
            >
              <div className="skew-x-[10deg]">Membros</div>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="-mr-2 flex md:hidden gap-4 items-center">
            <button
              onClick={toggleTheme}
              className={`p-2 ${useLight ? 'text-geki-black' : 'text-white'}`}
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`inline-flex items-center justify-center p-2 rounded-md ${useLight ? 'text-geki-black' : 'text-white'} hover:text-geki-red focus:outline-none`}
            >
              <svg className="block h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-geki-black/95 backdrop-blur-xl border-t border-white/10 shadow-xl">
          <div className="px-4 pt-4 pb-6 space-y-2">
            {/* Mobile Search */}
            <MobileSearch
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              suggestions={filteredSuggestions}
              onSearch={(term) => {
                executeSearch(term);
                setIsMenuOpen(false);
              }}
            />
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  onNavigate(item.value);
                  setIsMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-3 rounded-lg text-lg font-bold uppercase tracking-wide ${
                  currentPage === item.value
                    ? 'text-geki-red bg-white/5'
                    : 'text-slate-300'
                }`}
              >
                {item.label}
              </button>
            ))}
            <a
              href="https://www.youtube.com/@gekigaming"
              target="_blank"
              rel="noreferrer"
              className="block w-full text-center mt-6 px-4 py-4 bg-geki-red text-white font-black uppercase tracking-widest skew-x-[-10deg]"
            >
              <span className="skew-x-[10deg] block">Seja Membro</span>
            </a>
          </div>
        </div>
      )}
    </nav>
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
