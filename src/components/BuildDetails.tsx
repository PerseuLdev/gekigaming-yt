import React, { useState, useMemo } from 'react';
import { BuildGuide, BuildStage, BuildTip } from '../types';

interface BuildDetailsProps {
  build: BuildGuide;
  detailedData: any; // Explicitly passed now
  onBack: () => void;
}

export const BuildDetails: React.FC<BuildDetailsProps> = ({ build, detailedData: data, onBack }) => {
  const [activeStage, setActiveStage] = useState(0);

  const currentStage = useMemo(() => {
     if (!data) return null;
     
     const baseStage = data.stages[activeStage] || data.stages[0];

     // Merge equipment from all previous stages up to current to implement inheritance
     // This ensures that if "End Game" doesn't specify an accessory, it keeps the one from "Mid Game"
     const inheritedEquipment = data.stages.slice(0, activeStage + 1).reduce((acc: any, stage: any) => {
        return {
           ...acc,
           ...stage.equipment
        };
     }, {});

     return {
        ...baseStage,
        equipment: inheritedEquipment
     };
  }, [data, activeStage]);

  if (!data || !currentStage) return null;

  const getTipStyles = (type: BuildTip['type']) => {
    switch (type) {
      case 'pro': return 'bg-geki-red/5 border-geki-red/20 text-geki-red';
      case 'warning': return 'bg-amber-500/5 border-amber-500/20 text-amber-500';
      default: return 'bg-sky-500/5 border-sky-500/20 text-sky-500';
    }
  };

  const getTipIcon = (type: BuildTip['type']) => {
    switch (type) {
      case 'pro': return '💡';
      case 'warning': return '⚠️';
      default: return 'ℹ️';
    }
  };

  return (
    <div className="pt-24 min-h-screen animate-fade-in bg-white dark:bg-geki-black">
      
      {/* Header & Navigation */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <button 
          onClick={onBack}
          className="group flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-slate-500 hover:text-geki-red transition-colors mb-6"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          Voltar para Lista
        </button>
        
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-8">
          <div>
             <div className="flex items-center gap-3 mb-2">
                <span className="bg-geki-red text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded">
                  {build.class}
                </span>
                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                  {build.category}
                </span>
             </div>
             <h1 className="text-3xl md:text-5xl font-display font-black text-geki-black dark:text-white leading-tight">
               {build.title}
             </h1>
          </div>
          
          <div className="flex gap-3">
             <a 
              href={build.videoUrl} 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-geki-red text-white text-xs font-bold uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-geki-red/20"
             >
               <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
               Ver no YouTube
             </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Main Content (Left) */}
        <div className="lg:col-span-8 space-y-12">
          
          {/* TL;DR */}
          <section className="reveal">
            <h3 className="text-2xl font-display font-black mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-geki-red flex items-center justify-center text-white text-sm">01</span>
              Resumo da Build
            </h3>
            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-medium pl-6 border-l-4 border-geki-red/30">
              {data.tldr}
            </p>
          </section>

          {/* Atributos */}
          <section className="reveal" style={{transitionDelay: '100ms'}}>
            <h3 className="text-2xl font-display font-black mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-geki-red flex items-center justify-center text-white text-sm">02</span>
              Atributos & Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.attributes.map((phase, idx) => (
                <div key={idx} className="bg-slate-50 dark:bg-white/5 rounded-2xl p-6 border border-slate-200 dark:border-white/10">
                  <h4 className="text-sm font-bold uppercase tracking-widest text-geki-red mb-4">{phase.phase}</h4>
                  <div className="space-y-3">
                    {phase.items.map((attr, aidx) => (
                      <div key={aidx} className="flex items-center justify-between">
                        <span className="font-bold">{attr.name}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-slate-500 text-xs italic">{attr.description}</span>
                          <span className="min-w-[40px] text-right font-display font-black text-geki-red">{attr.value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Progressão de Equipamentos (CMS Tabs) */}
          <section className="reveal" style={{transitionDelay: '200ms'}}>
             <h3 className="text-2xl font-display font-black mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-geki-red flex items-center justify-center text-white text-sm">03</span>
              Progressão de Equipamentos
            </h3>
            
            {/* Tabs Selector */}
            <div className="flex flex-wrap gap-2 mb-8 bg-slate-100 dark:bg-white/5 p-1 rounded-xl">
              {data.stages.map((stage, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveStage(idx)}
                  className={`flex-1 min-w-[120px] py-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-all rounded-lg ${
                    activeStage === idx 
                    ? 'bg-white dark:bg-geki-red text-geki-red dark:text-white shadow-md' 
                    : 'text-slate-500 hover:text-geki-red'
                  }`}
                >
                  {stage.label}
                </button>
              ))}
            </div>

            {/* Gear Layout - Modern Editorial Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-3xl p-8 shadow-xl">
              <div className="space-y-6">
                <StageItem label="Topo" value={currentStage.equipment.topo} />
                <StageItem label="Meio" value={currentStage.equipment.meio} />
                <StageItem label="Baixo" value={currentStage.equipment.baixo} />
                <StageItem label="Armadura" value={currentStage.equipment.armadura} />
                <StageItem label="Arma" value={currentStage.equipment.arma} />
              </div>
              <div className="space-y-6">
                <StageItem label="Escudo" value={currentStage.equipment.escudo} />
                <StageItem label="Capa" value={currentStage.equipment.capa} />
                <StageItem label="Sapatos" value={currentStage.equipment.sapatos} />
                <StageItem label="Acessório 1" value={currentStage.equipment.acessorio1} />
                <StageItem label="Acessório 2" value={currentStage.equipment.acessorio2} />
              </div>
            </div>
          </section>

          {/* Dicas e Alertas */}
          <section className="reveal" style={{transitionDelay: '300ms'}}>
             <h3 className="text-2xl font-display font-black mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-geki-red flex items-center justify-center text-white text-sm">04</span>
              Dicas & Notas do Geki
            </h3>
            <div className="space-y-4">
              {data.tips.map((tip, idx) => (
                <div key={idx} className={`p-6 rounded-2xl border flex gap-4 ${getTipStyles(tip.type)}`}>
                  <div className="text-2xl shrink-0">{getTipIcon(tip.type)}</div>
                  <p className="text-slate-700 dark:text-slate-200 font-medium leading-relaxed italic">
                    {tip.content}
                  </p>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Sidebar (Right) */}
        <aside className="lg:col-span-4 space-y-8">
          
          {/* Habilidades Core */}
          <div className="bg-geki-black text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-geki-red/20 blur-[80px] group-hover:bg-geki-red/30 transition-all"></div>
            <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-geki-red mb-6">Habilidades Core</h4>
            <div className="space-y-6">
              {data.skills.map((skill, idx) => (
                <div key={idx} className="relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    {skill.isCore && <span className="w-1.5 h-1.5 rounded-full bg-geki-red animate-pulse"></span>}
                    <span className="font-display font-bold">{skill.name}</span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed">
                    {skill.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Vídeo Complementar */}
          <div className="sticky top-28 space-y-6">
            <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-white/10 group">
              <div className="aspect-video relative">
                 <img 
                  src={build.imageUrl} 
                  alt={build.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                 />
                 <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                   <a 
                    href={build.videoUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-16 h-16 bg-geki-red rounded-full flex items-center justify-center text-white shadow-2xl hover:scale-110 transition-transform"
                   >
                     <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                   </a>
                 </div>
              </div>
              <div className="p-6 bg-white dark:bg-zinc-900">
                <h5 className="font-bold text-sm mb-2">Tutorial Completo em Vídeo</h5>
                <p className="text-xs text-slate-500 mb-4 italic">"Ideal para assistir enquanto você joga!"</p>
                <div className="w-full h-1 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                  <div className="w-1/3 h-full bg-geki-red"></div>
                </div>
              </div>
            </div>

            {/* CTA Final */}
            <button className="w-full py-4 bg-transparent border-2 border-geki-red text-geki-red font-display font-black text-sm uppercase tracking-widest hover:bg-geki-red hover:text-white transition-all skew-x-[-10deg]">
              <span className="skew-x-[10deg] block">Compartilhar Build</span>
            </button>
          </div>

        </aside>

      </div>
    </div>
  );
};

const StageItem: React.FC<{ label: string; value?: string }> = ({ label, value }) => (
  <div className="space-y-1">
    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</span>
    <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
      {value || <span className="text-slate-300 dark:text-white/10">N/A</span>}
    </p>
  </div>
);
