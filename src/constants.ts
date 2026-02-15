
import { GalleryItem } from "./types";
import { RAGNATALES_BUILDS } from "./constants_generated";

// Re-export builds from auto-generated data
export const LATEST_BUILDS = RAGNATALES_BUILDS;

// Class groups for gallery filtering
export const CLASS_GROUPS: Record<string, string[]> = {
  'Atirador de Elite': ['Atirador de Elite'],
  'Arquimago': ['Arquimago'],
  'Espadachim': ['Lorde', 'Paladino'],
  'Mercador': ['Criador', 'Mestre-Ferreiro'],
  'Noviço': ['Sumo Sacerdote', 'Mestre'],
  'Gatuno': ['Algoz', 'Desordeiro'],
  'Expandidas': ['Professor', 'Mestre Taekwon', 'Cigana', 'Menestrel', 'Espiritualista', 'Ninja', 'Justiceiro', 'Super Novice'],
};

// Gallery items - imageUrl uses YouTube thumbnails by default.
// To override an image manually, set imageOverride to a custom URL.
export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'sniper-gallery',
    imageUrl: 'https://img.youtube.com/vi/gWc5hluERLM/maxresdefault.jpg',
    // imageOverride: '', // Uncomment and set to override with custom image
    title: 'Atirador de Elite',
    subtitle: 'Dano & Distância',
    hoverDescription: 'Mestres do arco, capazes de dizimar alvos à longa distância com precisão letal e armadilhas estratégicas.'
  },
  {
    id: 'mage-gallery',
    imageUrl: 'https://img.youtube.com/vi/G2s0qzSVBMo/maxresdefault.jpg',
    title: 'Arquimago',
    subtitle: 'Magia & Controle',
    hoverDescription: 'Controladores dos elementos. Use o poder do fogo, gelo e trovão para aniquilar exércitos inteiros.'
  },
  {
    id: 'sword-gallery',
    imageUrl: 'https://img.youtube.com/vi/9-M_icMx8CY/maxresdefault.jpg',
    title: 'Espadachim',
    subtitle: 'Lorde & Paladino',
    hoverDescription: 'A vanguarda de qualquer grupo. Lordes com força bruta e Paladinos com poder sagrado dominam a linha de frente.'
  },
  {
    id: 'merchant-gallery',
    imageUrl: 'https://img.youtube.com/vi/DDKxq3_RGlg/maxresdefault.jpg',
    title: 'Mercador',
    subtitle: 'Criador & Ferreiro',
    hoverDescription: 'Transforme dinheiro em poder. Criadores com ácido devastador e Ferreiros com martelos de forja dominam o campo.'
  },
  {
    id: 'acolyte-gallery',
    imageUrl: 'https://img.youtube.com/vi/WPI5--IZLuw/maxresdefault.jpg',
    title: 'Noviço',
    subtitle: 'Sacerdote & Mestre',
    hoverDescription: 'A espinha dorsal do grupo. Sumo Sacerdotes curam e buffam, enquanto Mestres destroem com Asura Strike.'
  },
  {
    id: 'thief-gallery',
    imageUrl: 'https://img.youtube.com/vi/gGDmNk86XQw/maxresdefault.jpg',
    title: 'Gatuno',
    subtitle: 'Algoz & Desordeiro',
    hoverDescription: 'Sombras mortais. Algozes com crits letais e Desordeiros com arcos furtivos dominam o combate PvP.'
  },
  {
    id: 'expanded-gallery',
    imageUrl: 'https://img.youtube.com/vi/0BWHb6jyUnU/maxresdefault.jpg',
    title: 'Expandidas',
    subtitle: 'Cigana, Menestrel & Mais',
    hoverDescription: 'Estilos únicos de combate. Ciganas, Menestréis, Ninjas, Justiceiros e mais trazem mecânicas exóticas para o campo.'
  }
];
