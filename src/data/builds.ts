import { DetailedBuild } from "../types";

export const ARQUIMAGO_GRAVITACIONAL_DATA: DetailedBuild = {
  id: "ragna-6", // Matches the ID in constants_generated.ts
  slug: "campo-gravitacional",
  tldr: "Esta build foca em maximizar o dano do Campo Gravitacional através do uso de cajados de duas mãos e na redução total da conjuração variável para zero. A jogabilidade consiste em utilizar magias de área em conjunto com magias de alvo único para maximizar o DPS.",
  attributes: [
    {
      phase: "Fase Inicial (Starter)",
      items: [
        { name: "INT", value: 90, description: "Fechar múltiplos de 5" },
        { name: "DES", value: 90, description: "Ativar Bota Temporal de Destreza" },
        { name: "FOR", value: 36, description: "Capacidade de carga" },
        { name: "AGI", value: 36, description: "Velocidade de ataque" },
      ]
    },
    {
      phase: "Fase Avançada (End Game)",
      items: [
        { name: "INT", value: "90+", description: "Dano máximo" },
        { name: "DES", value: 76, description: "Ativar Runa Topázio Dualfóssil" },
        { name: "VIT", value: "Restante", description: "Ativar Runa Jade Dualfóssil (Redução de pós)" },
        { name: "FOR", value: 36, description: "Capacidade de carga" },
      ]
    }
  ],
  skills: [
    {
      name: "Campo Gravitacional",
      description: "Principal ferramenta de dano; no RagnaTales, não consome Gema Azul e causa dano massivo em área.",
      isCore: true
    },
    {
      name: "Chama de Hela",
      description: "Habilidade poderosa habilitada pelo combo Rosa do Submundo + Alma da Arcana.",
      isCore: true
    },
    {
      name: "Ira de Thor",
      description: "Magia elemental de área para controle e dano massivo.",
      isCore: false
    },
    {
      name: "Escudo Mágico",
      description: "Defesa fundamental contra ataques corpo a corpo.",
      isCore: false
    }
  ],
  tips: [
    {
      type: "pro",
      content: "A Sacada do Cajado de Duas Mãos: Sempre que possível no início, use um cajado de duas mãos. Ele triplica o dano do Campo Gravitacional, o que permite dar 'overkill' sem precisar de itens caros."
    },
    {
      type: "warning",
      content: "Alerta de Switch: Ao usar a Carta Amdarais, utilize o Tails Tools para equipar o Cajado Corrompido apenas na conjuração, mantendo o de Cinzas no restante para regenerar HP/SP."
    },
    {
      type: "info",
      content: "Comando Útil: Use @cast para monitorar sua conjuração variável. O objetivo é sempre mantê-la em 0%."
    }
  ],
  stages: [
    {
      label: "Starter",
      attributes: ["INT 90", "DES 90"],
      equipment: {
        topo: "Capuz de Morpheus Ilusional (+7) [Carta Presente]",
        meio: "Lágrima de Amdarais",
        baixo: "Peixe Fresco ou CD Antiquado",
        armadura: "Vestido da Bruxa (+7) [Carta Agav]",
        arma: "Bastão da Destruição (Foco em Conjuração Variável)",
        capa: "Manto da Bruxa (+7) [Carta Antigo Livro]",
        sapatos: "Bota Temporal de Destreza",
        acessorio1: "Anel de Morpheus [Carta Mímico]",
        acessorio2: "Bracelete de Morpheus [Carta Yeti]"
      }
    },
    {
      label: "Early Game",
      attributes: ["INT 90", "DES 90"],
      equipment: {
        baixo: "CD Antiquado",
        arma: "Bastão da Aberração (+10) [2x Carta Cavaleiro Corrompido]",
      }
    },
    {
      label: "Mid Game",
      attributes: ["INT 90", "DES 90"],
      equipment: {
        topo: "Dádiva das Divindades (+10)",
        meio: "Parafusos Oxidados [Carta Presente]",
        baixo: "Rosa do Submundo",
        armadura: "Vestido da Bruxa [Carta Amdarais Selada]",
        arma: "Switch: Cajado de Cinzas (+10) / Cajado Corrompido (+10)",
        escudo: "Absorvedor de Magia (+10) [Carta Medusa/Kalitzburg]",
        capa: "Manto da Bruxa (+10) [Carta Raydrick/Antigo Livro]",
        sapatos: "Botas da Aberração [Carta Ordre]",
        acessorio1: "Anel do Abismo [Carta Mavika]",
        acessorio2: "Anel do Abismo [Carta Mula Sem Cabeça]"
      }
    },
    {
      label: "End Game",
      attributes: ["INT 90+", "DES 76", "VIT Restante"],
      equipment: {
        topo: "Dádiva das Divindades [Carta Árvore de Natal]",
        meio: "Parafusos Oxidados",
        baixo: "Cachimbo Ilusional",
        armadura: "Robe Puente Ilusional (+10) [Carta Amdarais Corrompida]",
        arma: "Cajado Corrompido [Slotado] + Switch Cinzas",
        escudo: "Vembrassa Ilusional [Carta Kalitzburg Corrompida]",
        capa: "Sobrepeliz Ilusional [Runa Topázio do Alphoccio]",
        sapatos: "Botas da Aberração [Runa Jade do Alphoccio]"
      }
    },
    {
      label: "High End",
      attributes: ["INT 90+", "DES 76", "VIT Restante"],
      equipment: {
        topo: "Chapéu de Istari (+12) [Carta Vesper Selvagem]",
        meio: "Espírito Astuto [Carta Kiel-D-01]",
        baixo: "Cachimbo Ilusional",
        armadura: "Vestes da Memória Quebrada (+12) [Carta Amdarais]",
        arma: "Cajado Corrompido [Carta Celine Kimi + Cavaleiro Corrompido]",
        escudo: "Vembrassa Ilusional",
        capa: "Sobrepeliz Ilusional (+12) [Carta Professora Célia]",
        sapatos: "Botas da Aberração [Carta Bispo Decadente Selvagem]",
        acessorio1: "Orbe do Yokai",
        acessorio2: "Lyst Brisingamen"
      }
    }
  ]
};

export const DETAILED_BUILDS = {
  [ARQUIMAGO_GRAVITACIONAL_DATA.id]: ARQUIMAGO_GRAVITACIONAL_DATA
};
