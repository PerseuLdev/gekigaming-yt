import React, { useMemo, useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BuildGuide } from '../types';
import { CLASS_GROUPS } from '../constants';
import { slugify } from '../utils/stringUtils';

interface BuildsPageProps {
  builds: BuildGuide[];
  selectedClass: string | null;
  setSelectedClass: (cls: string | null) => void;
}

const CLASS_FILTERS = Object.keys(CLASS_GROUPS);

export const BuildsPage: React.FC<BuildsPageProps> = ({
  builds,
  selectedClass,
  setSelectedClass,
}) => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredBuilds = useMemo(() => {
    if (!selectedClass) return builds;
    const group = CLASS_GROUPS[selectedClass];
    if (!group) return builds;
    return builds.filter(b => group.includes(b.class || ''));
  }, [builds, selectedClass]);

  const handleSelectBuild = (build: BuildGuide) => {
    const classSlug = slugify(build.class || 'geral');
    const buildSlug = build.slug || slugify(build.title);
    navigate(`/build/${classSlug}/${buildSlug}`);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="pt-24 min-h-screen bg-geki-paper dark:bg-geki-black transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 mb-12">

        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          className="mb-6 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-geki-red transition-colors flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
          Voltar para Início
        </button>

        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-black text-geki-black dark:text-white mb-4 tracking-tight">
            TODAS AS <span className="text-geki-red">BUILDS</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 font-sans max-w-2xl mx-auto">
            Filtre por classe e encontre a build ideal para o seu estilo de jogo.
          </p>
        </header>

        {/* Class Filter Dropdown */}
        <div className="flex justify-center mb-16">
          <div ref={dropdownRef} className="relative w-full max-w-xs">
            <button
              onClick={() => setDropdownOpen(prev => !prev)}
              className={`w-full flex items-center justify-between gap-3 px-5 py-3 border-2 text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                dropdownOpen || selectedClass
                  ? 'border-geki-red text-geki-red bg-geki-red/5 dark:bg-geki-red/10'
                  : 'border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 bg-white dark:bg-zinc-900/60 hover:border-geki-red hover:text-geki-red'
              }`}
            >
              <span>{selectedClass ?? 'Todas as Classes'}</span>
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>

            {dropdownOpen && (
              <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white dark:bg-zinc-900 border-2 border-geki-red shadow-2xl shadow-geki-red/10 overflow-hidden">
                {/* All option */}
                <button
                  onClick={() => { setSelectedClass(null); setDropdownOpen(false); }}
                  className={`w-full text-left px-5 py-3 text-xs font-black uppercase tracking-widest transition-colors duration-150 ${
                    !selectedClass
                      ? 'bg-geki-red text-white'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-geki-red/10 hover:text-geki-red'
                  }`}
                >
                  Todas as Classes
                </button>

                {/* Divider */}
                <div className="border-t border-slate-100 dark:border-white/5" />

                {/* Class options */}
                {CLASS_FILTERS.map((cls) => (
                  <button
                    key={cls}
                    onClick={() => { setSelectedClass(cls); setDropdownOpen(false); }}
                    className={`w-full text-left px-5 py-3 text-xs font-black uppercase tracking-widest transition-colors duration-150 ${
                      selectedClass === cls
                        ? 'bg-geki-red text-white'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-geki-red/10 hover:text-geki-red'
                    }`}
                  >
                    {cls}
                    <span className="ml-2 text-[10px] font-normal normal-case tracking-normal opacity-60">
                      ({CLASS_GROUPS[cls].join(', ')})
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Builds count */}
        <div className="mb-6 text-xs font-bold uppercase tracking-widest text-slate-400">
          {filteredBuilds.length} {filteredBuilds.length === 1 ? 'build encontrada' : 'builds encontradas'}
          {selectedClass ? ` para ${selectedClass}` : ''}
        </div>

        {/* Builds Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
          {filteredBuilds.length > 0 ? (
            filteredBuilds.map((build) => (
              <BuildCard key={build.id} build={build} onSelect={handleSelectBuild} />
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-white/50 dark:bg-white/5 rounded-3xl border border-dashed border-slate-300 dark:border-white/10">
              <p className="text-xl font-bold text-slate-400">Nenhuma build encontrada para esta classe.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const BuildCard: React.FC<{ build: BuildGuide; onSelect: (b: BuildGuide) => void }> = ({ build, onSelect }) => {
  const [isFocused, setIsFocused] = React.useState(false);

  const handleInteraction = (e: React.MouseEvent) => {
    const isMobile = window.innerWidth < 768;
    if (isMobile && !isFocused) {
      e.preventDefault();
      e.stopPropagation();
      setIsFocused(true);
      return;
    }
    onSelect(build);
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
      <div className="relative h-36 sm:h-48 overflow-hidden">
        <img
          src={build.imageUrl}
          alt={build.title}
          className={`w-full h-full object-cover transition-transform duration-500 ${isFocused ? 'scale-110' : 'group-hover:scale-110'}`}
        />
        <div className="absolute top-0 right-0 p-3">
          <span className="bg-geki-black/60 backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-widest px-2 py-1">
            {build.class || build.category}
          </span>
        </div>
        {build.detailedData && (
          <div className="absolute top-0 left-0 p-3">
            <span className="bg-geki-red text-white text-[9px] font-bold uppercase tracking-widest px-2 py-1">
              Guia Completo
            </span>
          </div>
        )}
      </div>
      <div className="p-4 sm:p-6 flex-1 flex flex-col">
        <h3 className={`text-base font-display font-bold mb-2 line-clamp-2 leading-tight transition-colors flex-1 ${
          isFocused ? 'text-geki-red' : 'text-geki-black dark:text-white group-hover:text-geki-red'
        }`}>
          {build.title}
        </h3>
        <p className={`text-slate-600 dark:text-slate-400 text-xs mb-3 font-sans transition-all duration-300 ${
          isFocused ? 'line-clamp-none' : 'line-clamp-2'
        }`}>
          {build.description}
        </p>
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-white/5 mt-auto">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{build.author}</span>
          <span className={`text-[10px] font-black uppercase transition-colors ${isFocused ? 'text-geki-red underline' : 'text-geki-red'}`}>
            {isFocused ? 'Abrir →' : 'Ver Build →'}
          </span>
        </div>
      </div>
    </div>
  );
};
