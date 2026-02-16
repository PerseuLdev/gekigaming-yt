import React from 'react';
import { useReveal } from '../hooks/useReveal';

export const AboutPage: React.FC = () => {
  useReveal();

  return (
    <div className="pt-32 pb-20 min-h-screen bg-slate-50 dark:bg-geki-black transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4">
        <div className="reveal">
          <h1 className="text-4xl md:text-6xl font-display font-black text-geki-black dark:text-white uppercase tracking-tighter mb-8 leading-none">
            SOBRE O <span className="text-geki-red">GEKIGAMING</span>
          </h1>
          
          <div className="prose prose-lg dark:prose-invert max-w-none font-sans">
            <p className="text-xl text-slate-600 dark:text-slate-300 font-medium mb-6">
              O maior portal de Ragnarok Online da atualidade, focado em trazer o melhor conteúdo, guias e estratégias para a comunidade.
            </p>
            
            <figure className="my-10 rounded-2xl overflow-hidden shadow-2xl">
               <img 
                 src="https://img.youtube.com/vi/gWc5hluERLM/maxresdefault.jpg" 
                 alt="GekiGaming Setup" 
                 className="w-full h-auto object-cover"
               />
               <figcaption className="text-center text-sm text-slate-500 mt-2">Setup do QG GekiGaming</figcaption>
            </figure>

            <h3 className="text-2xl font-display font-bold uppercase text-geki-black dark:text-white mt-12 mb-4">
              Nossa Missão
            </h3>
            <p>
              Simplificar o complexo. Ragnarok é um jogo profundo e muitas vezes intimidador para novos jogadores (e veteranos retornando). 
              Nossa missão é desmistificar mecânicas, testar builds exaustivamente e entregar o veredito final do que realmente funciona.
            </p>

            <h3 className="text-2xl font-display font-bold uppercase text-geki-black dark:text-white mt-12 mb-4">
              Quem Somos
            </h3>
            <p>
              Liderado por Geki, um vetarano com mais de 15 anos de experiência em Ragnarok Online. 
              Somos apaixonados por theorycrafting, min-maxing e, acima de tudo, pela comunidade que mantém esse jogo vivo há décadas.
            </p>

            <div className="bg-slate-100 dark:bg-white/5 p-8 rounded-2xl mt-12 border border-slate-200 dark:border-white/10">
              <h4 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-geki-red">✉️</span> Contato & Parcerias
              </h4>
              <p className="text-base mb-0">
                Para propostas comerciais, dúvidas ou sugestões: <br/>
                <a href="mailto:contato@gekigaming.com" className="text-geki-red hover:underline font-bold">contato@gekigaming.com</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
