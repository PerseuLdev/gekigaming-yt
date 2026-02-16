
export type ContentCategory = 'Builds' | 'Guias Essenciais' | 'Do Zero ao RMT - Ragnatales' | 'MMO para o Pai de Família' | 'Patch Notes';

export interface BuildStage {
  label: string; // "Start", "Early Game", "Mid Game", etc.
  attributes: string[]; // ["INT 99", "DES 99"]
  equipment: {
    topo?: string;
    meio?: string;
    baixo?: string;
    armadura?: string;
    arma?: string;
    escudo?: string;
    capa?: string;
    sapatos?: string;
    acessorio1?: string;
    acessorio2?: string;
  };
  pet?: string[];
}

export interface BuildGuide {
  id: string;
  title: string;
  category: ContentCategory;
  subcategory?: string; 
  class?: string; 
  author: string;
  description: string;
  imageUrl: string;
  fallbackImageUrl?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  videoUrl?: string;
  // New detailed data
  stages?: BuildStage[];
}

export interface GalleryItem {
  id: string;
  imageUrl: string;
  imageOverride?: string; // Manual override for gallery image (takes priority over imageUrl)
  title: string;
  subtitle: string;
  hoverDescription: string;
}

export enum PageView {
  HOME = 'HOME',
  BUILDS = 'BUILDS',
  ABOUT = 'ABOUT',
  ARTICLES = 'ARTICLES'
}
