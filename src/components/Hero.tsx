import React from 'react';

interface HeroProps {
    onCtaClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onCtaClick }) => {
  return (
    <div className="relative w-full h-screen flex flex-col justify-end overflow-hidden bg-geki-black">
      
      {/* Background Layer with Parallax-like feel */}
      <div className="absolute inset-0 z-0 select-none">
        <div className="absolute inset-0 bg-black/40 z-10"></div> {/* Base dimmer */}
        <div className="absolute inset-0 bg-gradient-to-t from-geki-black via-geki-black/60 to-transparent z-20"></div> {/* Bottom fade for text */}
        <div className="absolute inset-0 bg-gradient-to-r from-geki-black/80 via-transparent to-transparent z-20"></div> {/* Left fade for text */}
        
        <img 
            src="https://yt3.googleusercontent.com/VydiNszO9Isn1IXthRo6sdF13hzfl1GZoXJf-CPiq5loEdHq-3fLg77GfPV8EX7HswuzrBqxxV4=w1707-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj"
            alt="Ragnatales Background"
            className="w-full h-full object-cover object-center scale-105"
        />
      </div>

      {/* Content Layer - Editorial/Magazine Style */}
      <div className="relative z-30 w-full max-w-7xl mx-auto px-6 pb-20 md:pb-32 lg:px-8">
        
        {/* Floating Brand Badge */}
        <div className="mb-8 reveal">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full">
                <div className="w-2 h-2 rounded-full bg-geki-red animate-pulse"></div>
                <span className="text-white/90 text-xs font-bold uppercase tracking-widest">Parceiro Oficial Ragnatales</span>
            </div>
        </div>

        {/* Main Typography - MAXIMALIST */}
        <h1 className="reveal text-6xl md:text-8xl lg:text-[7rem] font-display font-black leading-[0.9] text-white tracking-tighter mb-6 shadow-black drop-shadow-2xl" style={{transitionDelay: '150ms'}}>
          Ragnarok pro <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-geki-red via-red-500 to-orange-500 relative">
            PAI DE FAMÍLIA
            {/* Aesthetic Glow behind text */}
            <span className="absolute inset-0 bg-geki-red/20 blur-[50px] -z-10"></span>
          </span>
        </h1>

        <div className="reveal flex flex-col md:flex-row items-start md:items-end justify-between gap-10" style={{transitionDelay: '300ms'}}>
            {/* Copy - Clean & Cozy */}
            <div className="max-w-xl">
                <p className="text-lg md:text-xl text-slate-200 font-medium leading-relaxed border-l-4 border-geki-red pl-6">
                    Sua casa no Ragnatales. Guias estratégicos feitos com carinho para você jogar no seu ritmo e aproveitar cada momento.
                </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <button 
                    onClick={onCtaClick}
                    className="group relative px-8 py-4 bg-white text-geki-black font-display font-black text-lg rounded-none skew-x-[-10deg] hover:bg-slate-200 transition-all overflow-hidden"
                >
                    <div className="skew-x-[10deg] flex items-center gap-2">
                        Explorar Builds
                        <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                    </div>
                </button>
                
                <a 
                    href="https://www.youtube.com/@gekigaming" 
                    target="_blank"
                    rel="noreferrer"
                    className="group px-8 py-4 bg-transparent border border-white/30 text-white font-display font-bold text-lg rounded-none skew-x-[-10deg] hover:bg-white/10 hover:border-white transition-all backdrop-blur-sm"
                >
                    <div className="skew-x-[10deg] flex items-center gap-2">
                        Canal do Youtube
                    </div>
                </a>
            </div>
        </div>
      </div>

      {/* Aesthetic Scroll Indicator */}
      <div className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex-col items-center gap-2 opacity-60 animate-bounce">
        <span className="text-[10px] uppercase tracking-[0.3em] text-white font-bold">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent"></div>
      </div>

      {/* Noise Texture Overlay for Aesthetic Gritty Feel */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-40 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
    </div>
  );
};