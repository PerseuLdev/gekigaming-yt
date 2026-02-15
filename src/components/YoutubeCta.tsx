import React, { useState, useEffect } from 'react';

const CHANNEL_ID = 'UCjkmc3kM9zNyUiLTicT04vA';
const FALLBACK_VIDEO_ID = 'ZRvLaRVOH4Y';

interface Tier {
  name: string;
  price: string;
  benefits: string[];
}

const TIERS: Tier[] = [
  {
    name: 'Tier 1 Novo',
    price: 'R$ 2,99/mês',
    benefits: [
      'Selos de fidelidade ao lado do seu nome',
      'Emojis personalizados no chat e comentários',
      'Visual exclusivo do Tier 1 no RagnaTales',
    ],
  },
  {
    name: 'Tier 1 Legado',
    price: 'R$ 4,99/mês',
    benefits: [
      'Tudo do Tier 1 Novo',
      'Menção honrosa nos vídeos',
      'Visual exclusivo "Boina do Geki" no RagnaTales',
    ],
  },
  {
    name: 'Tier 2 Novo',
    price: 'R$ 7,99/mês',
    benefits: [
      'Tudo do Tier 1 Legado',
      'Acesso antecipado a novos vídeos',
      'Visual exclusivo do Tier 2 no RagnaTales',
    ],
  },
  {
    name: 'Tier 2',
    price: 'R$ 14,99/mês',
    benefits: [
      'Tudo do Tier 2 Novo',
      'Acesso antecipado a novos vídeos',
    ],
  },
  {
    name: 'Tier 3',
    price: 'R$ 39,99/mês',
    benefits: [
      'Tudo do Tier 2',
      'Vídeos exclusivos para membros',
      'Visual exclusivo do Tier 3 no RagnaTales',
    ],
  },
  {
    name: 'Tier 4',
    price: 'R$ 79,99/mês',
    benefits: [
      'Tudo do Tier 3',
      'Mentoria 1x1 com o Gekigaming',
      'Visual exclusivo do Tier 4 no RagnaTales',
    ],
  },
];

const TierDropdown: React.FC<{ tier: Tier }> = ({ tier }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-white/10 bg-white/5 backdrop-blur-sm">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-white font-bold text-sm">{tier.name}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-geki-gold font-display font-black text-sm">{tier.price}</span>
          <svg
            className={`w-4 h-4 text-white/50 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>
      {open && (
        <div className="px-5 pb-4 pt-1 border-t border-white/5">
          <ul className="space-y-2">
            {tier.benefits.map((benefit, idx) => (
              <li key={idx} className="flex items-start gap-2 text-slate-300 text-sm">
                <span className="text-geki-red mt-0.5">+</span>
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export const YoutubeCta: React.FC = () => {
  const [latestVideoId, setLatestVideoId] = useState<string>(FALLBACK_VIDEO_ID);

  useEffect(() => {
    fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`)
      .then(res => res.text())
      .then(xml => {
        const match = xml.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
        if (match) setLatestVideoId(match[1]);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-geki-black z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-geki-darkRed to-geki-black opacity-60"></div>
        <div className="absolute -right-20 -bottom-40 w-96 h-96 bg-geki-red rounded-full blur-[128px] opacity-40"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="reveal text-center mb-16">
          <div className="inline-block px-3 py-1 mb-4 border border-geki-gold/50 rounded-full">
            <span className="text-geki-gold text-xs font-bold uppercase tracking-[0.2em]">Membros do Canal</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-display font-black text-white mb-4 leading-none tracking-tight">
            VEM COM A <span className="text-transparent bg-clip-text bg-gradient-to-r from-geki-red to-orange-500">GENTE</span>
          </h2>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">
            Se o conteúdo te ajuda, considere apoiar o canal. Cada membro faz diferença e recebe uns mimos legais em troca.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Tiers */}
          <div className="reveal-left">
            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-4 opacity-60">Escolha seu plano</h3>
            <div className="space-y-1">
              {TIERS.map((tier) => (
                <TierDropdown key={tier.name} tier={tier} />
              ))}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 items-start">
              <a
                href="https://www.youtube.com/@gekigaming/join"
                target="_blank"
                rel="noreferrer"
                className="px-8 py-4 bg-white text-geki-black font-display font-black text-lg uppercase tracking-widest hover:bg-geki-red hover:text-white transition-all text-center shadow-[0_0_20px_rgba(255,255,255,0.3)] skew-x-[-10deg]"
              >
                <span className="skew-x-[10deg] block">Seja Membro</span>
              </a>
              <span className="text-white/50 text-sm italic self-center">A partir de R$ 2,99/mês</span>
            </div>
          </div>

          {/* YouTube Embed */}
          <div className="reveal-right relative h-[400px] lg:h-[500px] overflow-hidden border-4 border-white/10 shadow-2xl">
            <iframe
              src={`https://www.youtube.com/embed/${latestVideoId}`}
              title="GekiGaming - Último vídeo"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
};
