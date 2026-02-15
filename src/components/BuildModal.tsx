
import React, { useState } from 'react';
import { BuildGuide, BuildStage } from '../types';

interface BuildModalProps {
  build: BuildGuide;
  onClose: () => void;
}

export const BuildModal: React.FC<BuildModalProps> = ({ build, onClose }) => {
  const [activeStageIndex, setActiveStageIndex] = useState(0);

  if (!build.stages || build.stages.length === 0) return null;

  const activeStage: BuildStage = build.stages[activeStageIndex];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-geki-black/90 backdrop-blur-md animate-fade-in" 
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-scale-up">
        
        {/* Header */}
        <div className="bg-geki-black p-6 border-b border-white/10 flex items-start justify-between relative overflow-hidden">
            {/* Background Texture */}
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>
             
             <div className="relative z-10">
                 <div className="flex items-center gap-3 mb-2">
                    <span className="bg-geki-red text-white text-xs font-black uppercase tracking-widest px-2 py-1 rounded-sm">
                        {build.class}
                    </span>
                    <h2 className="text-2xl md:text-3xl font-display font-black text-white uppercase tracking-tight">
                        {build.title}
                    </h2>
                 </div>
                 <p className="text-slate-400 text-sm max-w-2xl">{build.description}</p>
             </div>

             <button 
                onClick={onClose}
                className="text-slate-400 hover:text-white transition-colors z-10"
             >
                 <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                 </svg>
             </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto bg-black/20 border-b border-white/5 scrollbar-hide">
            {build.stages.map((stage, idx) => (
                <button
                    key={idx}
                    onClick={() => setActiveStageIndex(idx)}
                    className={`px-6 py-4 text-sm font-bold uppercase tracking-widest whitespace-nowrap transition-all relative ${
                        idx === activeStageIndex 
                        ? 'text-white bg-white/5' 
                        : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                    }`}
                >
                    {stage.label}
                    {idx === activeStageIndex && (
                        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-geki-red"></div>
                    )}
                </button>
            ))}
        </div>

        {/* Scrollable Content */}
        <div className="flex-grow overflow-y-auto p-6 md:p-8 bg-zinc-900/50">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                
                {/* Left Column: Attributes & Pet */}
                <div className="md:col-span-4 space-y-8">
                    
                    {/* Attributes */}
                    <div className="bg-black/40 rounded-xl p-6 border border-white/5">
                        <h3 className="text-geki-gold font-bold uppercase tracking-widest text-sm mb-4 border-b border-white/10 pb-2">
                            Atributos
                        </h3>
                        <ul className="space-y-3">
                            {activeStage.attributes.map((attr, i) => (
                                <li key={i} className="flex items-center justify-between text-white font-mono text-sm">
                                    <span className="opacity-80">{attr.split(' ')[0]}</span>
                                    <span className="font-bold text-geki-red">{attr.split(' ').slice(1).join(' ')}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Pets */}
                    {activeStage.pet && (
                        <div className="bg-black/40 rounded-xl p-6 border border-white/5">
                            <h3 className="text-geki-gold font-bold uppercase tracking-widest text-sm mb-4 border-b border-white/10 pb-2">
                                Mascotes
                            </h3>
                            <ul className="space-y-2">
                                {activeStage.pet.map((p, i) => (
                                    <li key={i} className="text-white text-sm flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-geki-red"></div>
                                        {p}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Right Column: Equipment Grid */}
                <div className="md:col-span-8">
                    <h3 className="text-geki-gold font-bold uppercase tracking-widest text-sm mb-4">
                        Equipamentos
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         {Object.entries(activeStage.equipment).map(([slot, item]) => (
                             <div key={slot} className="bg-white/5 p-4 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                                 <span className="block text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">
                                     {slot}
                                 </span>
                                 <span className="text-sm text-slate-200 font-medium leading-tight block">
                                     {item}
                                 </span>
                             </div>
                         ))}
                    </div>
                </div>

            </div>
        </div>

        {/* Footer actions */}
        <div className="bg-geki-black/50 p-4 border-t border-white/10 flex justify-end">
            <button 
                onClick={onClose}
                className="px-6 py-2 bg-white text-geki-black font-bold uppercase tracking-wide rounded hover:bg-slate-200 transition-colors"
            >
                Fechar
            </button>
        </div>

      </div>
    </div>
  );
};
