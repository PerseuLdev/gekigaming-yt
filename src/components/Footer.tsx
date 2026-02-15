import React from 'react';
import { PageView } from '../types';

interface FooterProps {
  onNavigate?: (page: PageView) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleNav = (page: PageView) => (e: React.MouseEvent) => {
    e.preventDefault();
    onNavigate?.(page);
  };

  return (
    <footer className="bg-slate-100 dark:bg-geki-black border-t border-slate-200 dark:border-white/10 pt-16 pb-8 transition-colors duration-300">
      <div className="reveal max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top: Logo + Nav + Parceiro */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">

          {/* Brand */}
          <div className="md:col-span-4">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-10 h-10 flex items-center justify-center">
                <img
                  src="https://www.gekigaming.com.br/_assets/v11/45adf06fea0b843a60fbbb4d281e70b2e769719b.svg"
                  alt="GekiGaming Logo"
                  className="w-full h-full object-contain rotate-180"
                />
              </div>
              <span className="text-geki-black dark:text-white font-display font-bold text-xl tracking-tight uppercase">
                Geki<span className="text-geki-red">Gaming</span>
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6 max-w-xs">
              Conteúdo de Ragnarok Online feito com carinho, para quem joga no seu ritmo.
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.youtube.com/@gekigaming"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 flex items-center justify-center bg-slate-200 dark:bg-white/5 border border-slate-300 dark:border-white/10 hover:bg-geki-red dark:hover:bg-geki-red hover:border-geki-red dark:hover:border-geki-red transition-all text-slate-500 dark:text-slate-400 hover:text-white dark:hover:text-white"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" /></svg>
              </a>
              <a
                href="https://discord.gg/d27B88MgJx"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 flex items-center justify-center bg-slate-200 dark:bg-white/5 border border-slate-300 dark:border-white/10 hover:bg-indigo-600 dark:hover:bg-indigo-600 hover:border-indigo-600 dark:hover:border-indigo-600 transition-all text-slate-500 dark:text-slate-400 hover:text-white dark:hover:text-white"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" /></svg>
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="md:col-span-2">
            <h4 className="text-geki-black dark:text-white font-bold uppercase tracking-widest mb-5 text-xs">Navegação</h4>
            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400 font-medium">
              <li>
                <a href="#" onClick={handleNav(PageView.HOME)} className="hover:text-geki-red dark:hover:text-white transition-colors">Início</a>
              </li>
              <li>
                <a href="#" onClick={handleNav(PageView.BUILDS)} className="hover:text-geki-red dark:hover:text-white transition-colors">Builds & Guias</a>
              </li>
              <li>
                <a href="#" onClick={handleNav(PageView.ABOUT)} className="hover:text-geki-red dark:hover:text-white transition-colors">Sobre</a>
              </li>
            </ul>
          </div>

          {/* Links Úteis */}
          <div className="md:col-span-3">
            <h4 className="text-geki-black dark:text-white font-bold uppercase tracking-widest mb-5 text-xs">Comunidade</h4>
            <ul className="space-y-3 text-sm text-slate-500 dark:text-slate-400 font-medium">
              <li>
                <a href="https://www.youtube.com/@gekigaming/join" target="_blank" rel="noreferrer" className="hover:text-geki-red dark:hover:text-white transition-colors">Seja Membro</a>
              </li>
              <li>
                <a href="https://discord.gg/d27B88MgJx" target="_blank" rel="noreferrer" className="hover:text-geki-red dark:hover:text-white transition-colors">Discord</a>
              </li>
              <li>
                <a href="https://www.youtube.com/@gekigaming" target="_blank" rel="noreferrer" className="hover:text-geki-red dark:hover:text-white transition-colors">Canal do YouTube</a>
              </li>
            </ul>
          </div>

          {/* Parceiros */}
          <div className="md:col-span-3">
            <h4 className="text-geki-black dark:text-white font-bold uppercase tracking-widest mb-5 text-xs">Parceiros</h4>
            <a
              href="https://ragnatales.com.br/"
              target="_blank"
              rel="noreferrer"
              className="inline-block bg-slate-200 dark:bg-white/5 border border-slate-300 dark:border-white/10 hover:border-geki-red dark:hover:border-white/30 transition-all p-4 rounded-lg group"
            >
              <img
                src="https://www.gekigaming.com.br/_assets/v11/cdd87cb794070b0eddd8235b1792582a8c32a427.png"
                alt="RagnaTales"
                className="h-10 object-contain opacity-70 group-hover:opacity-100 transition-opacity"
              />
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-200 dark:border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 dark:text-slate-500 text-xs text-center md:text-left">
            © {new Date().getFullYear()} GekiGaming. Ragnarok Online is a trademark of Gravity Co., Ltd.
            <br />Site feito de fã para fã.
          </p>
          <div className="text-xs text-slate-400 dark:text-slate-500">
            Desenvolvido por <a href="https://persedigital.com" target="_blank" rel="noreferrer" className="text-geki-gold font-bold hover:text-geki-red transition-colors">Perse Digital</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
