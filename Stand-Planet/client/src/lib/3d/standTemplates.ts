/**
 * Templates de stands professionnels complets
 * Configurations réalistes inspirées d'Epitaphe 360
 */

export interface StandTemplate {
  id: string;
  name: string;
  surface: number; // en m²
  dimensions: { width: number; depth: number; height: number };
  sector: 'tech' | 'luxury' | 'industry' | 'services' | 'universal';
  description: string;
  price: number;
  modules: TemplateModule[];
  features: string[];
  preview?: string;
}

export interface TemplateModule {
  moduleId: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  customization?: {
    color?: string;
    material?: string;
    branding?: {
      logo?: string;
      text?: string;
      graphics?: string;
    };
  };
}

export const standTemplates: StandTemplate[] = [
  // ========================================
  // STAND 9m² - Compact & Efficace
  // ========================================
  {
    id: 'stand-9m2-tech',
    name: 'Tech Innovation 9m²',
    surface: 9,
    dimensions: { width: 3, depth: 3, height: 2.5 },
    sector: 'tech',
    description: 'Stand compact pour startup tech. Comptoir d\'accueil, écran tactile 55", zone présentation produits, éclairage LED professionnel.',
    price: 3500,
    features: [
      'Comptoir d\'accueil avec rangements',
      'Écran tactile 55" sur pied',
      '2 Présentoirs produits lumineux',
      'Mur graphique personnalisé 3x2.5m',
      'Éclairage LED spots + bandeau',
      '2 Tabourets design',
      'Sol stratifié effet bois'
    ],
    modules: [
      // Mur de fond avec branding
      { moduleId: 'wall-001', position: [0, 1.25, -1.5], customization: { color: '#1a1a2e', material: 'printed-fabric' } },
      
      // Comptoir d'accueil (droite)
      { moduleId: 'furn-001', position: [0.8, 0.45, 0.8] },
      
      // Écran tactile 55" (gauche)
      { moduleId: 'multi-001', position: [-0.8, 0.75, 0.5] },
      
      // Présentoirs produits avec éclairage
      { moduleId: 'furn-002', position: [-0.9, 1, -1.2], scale: [0.8, 1, 0.8] },
      { moduleId: 'furn-002', position: [0.9, 1, -1.2], scale: [0.8, 1, 0.8] },
      
      // Totem publicitaire (entrée)
      { moduleId: 'plv-001', position: [-1.2, 1, 1.3] },
      
      // Spots LED orientables
      { moduleId: 'light-002', position: [-0.8, 2.3, 0], rotation: [Math.PI / 4, 0, 0] },
      { moduleId: 'light-002', position: [0.8, 2.3, 0], rotation: [Math.PI / 4, 0, 0] },
      
      // Tabourets
      { moduleId: 'furn-005', position: [0.5, 0.3, 0.3] },
      { moduleId: 'furn-005', position: [1.1, 0.3, 0.3] }
    ]
  },

  // ========================================
  // STAND 12m² - Équilibré
  // ========================================
  {
    id: 'stand-12m2-luxury',
    name: 'Prestige Luxe 12m²',
    surface: 12,
    dimensions: { width: 4, depth: 3, height: 2.5 },
    sector: 'luxury',
    description: 'Stand élégant pour marques premium. Vitrines éclairées, canapé design, comptoir laqué, ambiance feutrée avec spots LED.',
    price: 5800,
    features: [
      'Comptoir laqué avec rétroéclairage',
      '3 Vitrines avec éclairage LED',
      'Canapé 3 places + table basse',
      'Mur tissu tendu premium',
      'Sol résine effet marbre',
      'Éclairage d\'ambiance RGB',
      'Kakémono 2m suspendu'
    ],
    modules: [
      // Mur principal tissu tendu
      { moduleId: 'wall-002', position: [0, 1.25, -1.5], customization: { color: '#2c2c3e', material: 'stretched-fabric' } },
      
      // Comptoir laqué avec LED
      { moduleId: 'furn-001', position: [-1.3, 0.45, 0.9], customization: { color: '#ffffff', material: 'glossy' } },
      
      // Vitrines éclairées (3 unités)
      { moduleId: 'furn-002', position: [-1.5, 1, -1], scale: [0.7, 1, 0.7] },
      { moduleId: 'furn-002', position: [0, 1, -1], scale: [0.7, 1, 0.7] },
      { moduleId: 'furn-002', position: [1.5, 1, -1], scale: [0.7, 1, 0.7] },
      
      // Canapé design + table basse
      { moduleId: 'furn-004', position: [1, 0.4, 0.5], customization: { color: '#1a1a2e' } },
      { moduleId: 'furn-003', position: [1, 0.2, -0.3], scale: [0.6, 0.4, 0.6] },
      
      // Écran 65" sur mur
      { moduleId: 'multi-001', position: [0.5, 1.5, -1.4], scale: [1.3, 1.3, 0.5] },
      
      // Kakémono suspendu
      { moduleId: 'plv-003', position: [-1.8, 2, 0] },
      
      // Éclairage spots design (4 spots)
      { moduleId: 'light-002', position: [-1.5, 2.3, -0.5], rotation: [Math.PI / 3, 0, -Math.PI / 6] },
      { moduleId: 'light-002', position: [0, 2.3, -0.5], rotation: [Math.PI / 3, 0, 0] },
      { moduleId: 'light-002', position: [1.5, 2.3, -0.5], rotation: [Math.PI / 3, 0, Math.PI / 6] },
      { moduleId: 'light-001', position: [0, 2.4, 0.8] }
    ]
  },

  // ========================================
  // STAND 18m² - Professionnel
  // ========================================
  {
    id: 'stand-18m2-industry',
    name: 'Industrie Pro 18m²',
    surface: 18,
    dimensions: { width: 6, depth: 3, height: 3 },
    sector: 'industry',
    description: 'Stand complet pour entreprise industrielle. Zone accueil, espace démo, coin réunion privé, multiples écrans de présentation.',
    price: 9200,
    features: [
      'Zone accueil avec comptoir XXL',
      'Espace démo produits 4m²',
      'Coin réunion privé (4 places)',
      'Mur vidéo 3 écrans 55"',
      '4 Présentoirs multi-niveaux',
      'Éclairage architectural rails LED',
      'Stockage arrière-stand',
      'Sol technique surélevé'
    ],
    modules: [
      // ---- ZONE ACCUEIL (Droite) ----
      // Mur graphique accueil
      { moduleId: 'wall-001', position: [2, 1.5, -1.5], scale: [1.5, 1.2, 1], customization: { color: '#ff6b35', material: 'printed' } },
      // Comptoir accueil XXL
      { moduleId: 'furn-001', position: [2, 0.45, 0.5], scale: [1.5, 1, 1] },
      // Totem d'entrée
      { moduleId: 'plv-001', position: [1, 1.2, 1.3] },
      
      // ---- ZONE DÉMO (Centre) ----
      // Table démo
      { moduleId: 'furn-003', position: [0, 0.4, 0], scale: [1.2, 1, 1.2] },
      // Écrans tactiles démo (2x)
      { moduleId: 'multi-001', position: [-0.8, 0.75, -0.3] },
      { moduleId: 'multi-001', position: [0.8, 0.75, -0.3] },
      // Présentoirs produits
      { moduleId: 'furn-002', position: [0, 1, -1.3] },
      
      // ---- ZONE RÉUNION (Gauche) ----
      // Mur séparation
      { moduleId: 'wall-003', position: [-2.5, 1.25, 0], rotation: [0, Math.PI / 2, 0] },
      // Canapé + fauteuils
      { moduleId: 'furn-004', position: [-2.3, 0.4, -0.8], rotation: [0, Math.PI / 2, 0] },
      { moduleId: 'furn-006', position: [-2.3, 0.4, 0.5], rotation: [0, Math.PI / 2, 0] },
      { moduleId: 'furn-006', position: [-2.3, 0.4, 0.9], rotation: [0, Math.PI / 2, 0] },
      // Table basse réunion
      { moduleId: 'furn-003', position: [-2, 0.2, 0.2], scale: [0.8, 0.4, 0.8] },
      
      // ---- MUR VIDÉO (Fond) ----
      // 3 écrans 55" alignés
      { moduleId: 'multi-001', position: [-1.5, 1.5, -1.45], scale: [1, 1, 0.3] },
      { moduleId: 'multi-001', position: [0, 1.5, -1.45], scale: [1, 1, 0.3] },
      { moduleId: 'multi-001', position: [1.5, 1.5, -1.45], scale: [1, 1, 0.3] },
      
      // ---- ÉCLAIRAGE ----
      // Rails LED (6 spots)
      { moduleId: 'light-002', position: [-2, 2.8, -0.5], rotation: [Math.PI / 4, 0, 0] },
      { moduleId: 'light-002', position: [-1, 2.8, -0.5], rotation: [Math.PI / 4, 0, 0] },
      { moduleId: 'light-002', position: [0, 2.8, -0.5], rotation: [Math.PI / 4, 0, 0] },
      { moduleId: 'light-002', position: [1, 2.8, -0.5], rotation: [Math.PI / 4, 0, 0] },
      { moduleId: 'light-002', position: [2, 2.8, -0.5], rotation: [Math.PI / 4, 0, 0] },
      { moduleId: 'light-001', position: [0, 2.9, 0.8] },
      
      // ---- PLV ----
      // Roll-ups (2x)
      { moduleId: 'plv-002', position: [-2.8, 1, 1.2] },
      { moduleId: 'plv-002', position: [2.8, 1, 1.2] }
    ]
  },

  // ========================================
  // STAND 24m² - Premium
  // ========================================
  {
    id: 'stand-24m2-services',
    name: 'Services Premium 24m²',
    surface: 24,
    dimensions: { width: 6, depth: 4, height: 3 },
    sector: 'services',
    description: 'Stand haut de gamme pour entreprises de services. Bar lounge, espace networking, cabine démo privée, mur LED interactif.',
    price: 14500,
    features: [
      'Bar lounge avec comptoir lumineux',
      'Espace networking 6-8 personnes',
      'Cabine démo fermée avec écran',
      'Mur LED interactif 3x2m',
      '6 Vitrines produits éclairées',
      'Sol parquet massif',
      'Éclairage RGB programmable',
      'Borne tactile 32" catalogue',
      'Système audio intégré'
    ],
    modules: [
      // ---- BAR LOUNGE (Gauche avant) ----
      { moduleId: 'furn-001', position: [-2.2, 0.55, 1.2], scale: [1.8, 1.2, 1], customization: { color: '#ffffff', material: 'led-backlit' } },
      { moduleId: 'furn-005', position: [-2.8, 0.35, 0.6] },
      { moduleId: 'furn-005', position: [-2.4, 0.35, 0.6] },
      { moduleId: 'furn-005', position: [-2, 0.35, 0.6] },
      { moduleId: 'furn-005', position: [-1.6, 0.35, 0.6] },
      
      // ---- ESPACE NETWORKING (Centre) ----
      // Canapés en U
      { moduleId: 'furn-004', position: [0, 0.4, 0.5], scale: [1.5, 1, 1] },
      { moduleId: 'furn-004', position: [-1.2, 0.4, -0.3], rotation: [0, Math.PI / 2, 0] },
      { moduleId: 'furn-004', position: [1.2, 0.4, -0.3], rotation: [0, -Math.PI / 2, 0] },
      // Tables basses (2x)
      { moduleId: 'furn-003', position: [-0.3, 0.2, 0], scale: [0.7, 0.4, 0.7] },
      { moduleId: 'furn-003', position: [0.3, 0.2, 0], scale: [0.7, 0.4, 0.7] },
      
      // ---- CABINE DÉMO (Droite) ----
      // Murs cabine (3 côtés)
      { moduleId: 'wall-003', position: [2.5, 1.25, 0.5], rotation: [0, Math.PI / 2, 0] },
      { moduleId: 'wall-003', position: [2.5, 1.25, -0.5], rotation: [0, Math.PI / 2, 0] },
      { moduleId: 'wall-002', position: [2, 1.25, -1.5], scale: [0.7, 1, 1] },
      // Écran + chaises cabine
      { moduleId: 'multi-001', position: [2, 1.2, -1.4], scale: [1.2, 1.2, 0.3] },
      { moduleId: 'furn-006', position: [2.3, 0.4, 0] },
      { moduleId: 'furn-006', position: [1.7, 0.4, 0] },
      
      // ---- MUR LED INTERACTIF (Fond gauche) ----
      { moduleId: 'multi-003', position: [-2, 1.5, -1.95], scale: [1.5, 1, 0.3] },
      
      // ---- VITRINES PRODUITS (Fond) ----
      { moduleId: 'furn-002', position: [-1, 1.1, -1.8], scale: [0.8, 1.1, 0.6] },
      { moduleId: 'furn-002', position: [0, 1.1, -1.8], scale: [0.8, 1.1, 0.6] },
      { moduleId: 'furn-002', position: [1, 1.1, -1.8], scale: [0.8, 1.1, 0.6] },
      
      // ---- ACCUEIL (Entrée centre) ----
      { moduleId: 'furn-001', position: [0, 0.45, 1.6] },
      { moduleId: 'plv-001', position: [-1, 1.2, 1.9] },
      { moduleId: 'plv-001', position: [1, 1.2, 1.9] },
      
      // ---- BORNE TACTILE ----
      { moduleId: 'multi-002', position: [-2.8, 0.7, -0.8] },
      
      // ---- ÉCLAIRAGE ARCHITECTURAL (8 spots) ----
      { moduleId: 'light-002', position: [-2.5, 2.8, -1], rotation: [Math.PI / 3, 0, -Math.PI / 6] },
      { moduleId: 'light-002', position: [-1.5, 2.8, -1], rotation: [Math.PI / 3, 0, 0] },
      { moduleId: 'light-002', position: [-0.5, 2.8, -1], rotation: [Math.PI / 3, 0, 0] },
      { moduleId: 'light-002', position: [0.5, 2.8, -1], rotation: [Math.PI / 3, 0, 0] },
      { moduleId: 'light-002', position: [1.5, 2.8, -1], rotation: [Math.PI / 3, 0, 0] },
      { moduleId: 'light-002', position: [2.5, 2.8, -1], rotation: [Math.PI / 3, 0, Math.PI / 6] },
      { moduleId: 'light-001', position: [-1, 2.9, 1], customization: { color: '#ff4400' } },
      { moduleId: 'light-001', position: [1, 2.9, 1], customization: { color: '#0044ff' } },
      
      // ---- PLV ----
      { moduleId: 'plv-002', position: [-2.9, 1, -1.5] },
      { moduleId: 'plv-003', position: [2.9, 2, 1] }
    ]
  },

  // ========================================
  // STAND 30m² - Flagship
  // ========================================
  {
    id: 'stand-30m2-flagship',
    name: 'Flagship 30m²',
    surface: 30,
    dimensions: { width: 7.5, depth: 4, height: 3.5 },
    sector: 'universal',
    description: 'Stand flagship premium. Espace multi-zones avec réception, showroom, salle réunion fermée, bar, scène démo, stockage.',
    price: 22000,
    features: [
      'Réception design avec logo 3D rétroéclairé',
      'Showroom 10m² avec éclairage muséal',
      'Salle réunion fermée 6 places',
      'Bar lounge 4m avec éclairage RGB',
      'Scène démo surélevée + écran LED 2x1m',
      'Mur végétal stabilisé 2x3m',
      'Sol parquet + moquette zones',
      '12 Spots LED orientables',
      'Système audio/vidéo intégré',
      'Stockage arrière 3m²'
    ],
    modules: [
      // ---- RÉCEPTION (Centre entrée) ----
      { moduleId: 'furn-001', position: [0, 0.55, 1.5], scale: [2, 1.3, 1], customization: { material: 'corian-backlit' } },
      { moduleId: 'plv-001', position: [-2, 1.5, 1.9], customization: { material: 'led-3d-logo' } },
      { moduleId: 'plv-001', position: [2, 1.5, 1.9], customization: { material: 'led-3d-logo' } },
      
      // ---- SHOWROOM (Gauche) ----
      // Murs showroom
      { moduleId: 'wall-002', position: [-3, 1.75, -1.5], scale: [1.5, 1.4, 1], customization: { material: 'textured-white' } },
      { moduleId: 'wall-003', position: [-3.7, 1.25, 0.5], rotation: [0, Math.PI / 2, 0], scale: [1.5, 1, 1] },
      // Vitrines éclairage muséal (6 unités)
      { moduleId: 'furn-002', position: [-3.5, 1.2, -1.2], scale: [0.7, 1.2, 0.5] },
      { moduleId: 'furn-002', position: [-2.8, 1.2, -1.2], scale: [0.7, 1.2, 0.5] },
      { moduleId: 'furn-002', position: [-2.1, 1.2, -1.2], scale: [0.7, 1.2, 0.5] },
      { moduleId: 'furn-002', position: [-3.5, 1.2, 0], scale: [0.7, 1.2, 0.5] },
      { moduleId: 'furn-002', position: [-2.8, 1.2, 0], scale: [0.7, 1.2, 0.5] },
      { moduleId: 'furn-002', position: [-2.1, 1.2, 0], scale: [0.7, 1.2, 0.5] },
      // Spots muséaux
      { moduleId: 'light-002', position: [-3.5, 3.2, -0.6], rotation: [Math.PI / 2.5, 0, 0] },
      { moduleId: 'light-002', position: [-2.8, 3.2, -0.6], rotation: [Math.PI / 2.5, 0, 0] },
      { moduleId: 'light-002', position: [-2.1, 3.2, -0.6], rotation: [Math.PI / 2.5, 0, 0] },
      
      // ---- SALLE RÉUNION FERMÉE (Droite arrière) ----
      // Murs cabine (4 côtés)
      { moduleId: 'wall-003', position: [3.2, 1.25, -1], rotation: [0, Math.PI / 2, 0], scale: [1, 1, 1] },
      { moduleId: 'wall-003', position: [3.2, 1.25, 0], rotation: [0, Math.PI / 2, 0], scale: [1, 1, 1] },
      { moduleId: 'wall-002', position: [2.5, 1.25, -1.5], scale: [0.8, 1, 1] },
      { moduleId: 'wall-002', position: [2.5, 1.25, 0.5], scale: [0.8, 1, 1] },
      // Table réunion + 6 chaises
      { moduleId: 'furn-003', position: [2.7, 0.4, -0.5], scale: [1.2, 1, 1.8] },
      { moduleId: 'furn-006', position: [2.3, 0.4, -1.2] },
      { moduleId: 'furn-006', position: [2.7, 0.4, -1.2] },
      { moduleId: 'furn-006', position: [3.1, 0.4, -1.2] },
      { moduleId: 'furn-006', position: [2.3, 0.4, 0.2] },
      { moduleId: 'furn-006', position: [2.7, 0.4, 0.2] },
      { moduleId: 'furn-006', position: [3.1, 0.4, 0.2] },
      // Écran mural
      { moduleId: 'multi-001', position: [2.5, 1.5, -1.4], scale: [1.3, 1.3, 0.3] },
      
      // ---- BAR LOUNGE (Droite avant) ----
      { moduleId: 'furn-001', position: [2.8, 0.6, 1.2], scale: [2, 1.3, 1], customization: { material: 'glass-led' } },
      { moduleId: 'furn-005', position: [2, 0.35, 0.5] },
      { moduleId: 'furn-005', position: [2.5, 0.35, 0.5] },
      { moduleId: 'furn-005', position: [3, 0.35, 0.5] },
      { moduleId: 'furn-005', position: [3.5, 0.35, 0.5] },
      // Tables hautes bar
      { moduleId: 'furn-003', position: [2.5, 0.5, -0.3], scale: [0.5, 1.2, 0.5] },
      { moduleId: 'furn-003', position: [3.2, 0.5, -0.3], scale: [0.5, 1.2, 0.5] },
      
      // ---- SCÈNE DÉMO (Centre fond) ----
      // Podium (simulé par table large)
      { moduleId: 'furn-003', position: [0, 0.15, -1.5], scale: [2, 0.3, 1.2], customization: { material: 'black-stage' } },
      // Écran LED grand format
      { moduleId: 'multi-003', position: [0, 1.8, -1.95], scale: [2, 1, 0.2] },
      // Spots scène
      { moduleId: 'light-001', position: [-1.2, 3.3, -1], customization: { color: '#ffffff' } },
      { moduleId: 'light-001', position: [0, 3.3, -1], customization: { color: '#ffffff' } },
      { moduleId: 'light-001', position: [1.2, 3.3, -1], customization: { color: '#ffffff' } },
      
      // ---- MUR VÉGÉTAL (Centre gauche) ----
      { moduleId: 'deco-001', position: [-1.5, 1.5, 0.8], scale: [1, 1.5, 0.2] },
      
      // ---- ÉCLAIRAGE GÉNÉRAL (12 spots) ----
      { moduleId: 'light-002', position: [-3, 3.2, 1], rotation: [Math.PI / 4, 0, -Math.PI / 6] },
      { moduleId: 'light-002', position: [-1.5, 3.2, 1], rotation: [Math.PI / 4, 0, 0] },
      { moduleId: 'light-002', position: [0, 3.2, 1], rotation: [Math.PI / 4, 0, 0] },
      { moduleId: 'light-002', position: [1.5, 3.2, 1], rotation: [Math.PI / 4, 0, 0] },
      { moduleId: 'light-002', position: [3, 3.2, 1], rotation: [Math.PI / 4, 0, Math.PI / 6] },
      { moduleId: 'light-002', position: [-2.5, 3.2, -0.5], rotation: [Math.PI / 3, 0, 0] },
      { moduleId: 'light-002', position: [2.5, 3.2, -0.5], rotation: [Math.PI / 3, 0, 0] },
      
      // ---- PLV DIVERS ----
      { moduleId: 'plv-002', position: [-3.7, 1, 1.8] },
      { moduleId: 'plv-002', position: [3.7, 1, 1.8] },
      { moduleId: 'plv-003', position: [-1, 2.5, 1.9] },
      { moduleId: 'plv-003', position: [1, 2.5, 1.9] },
      
      // ---- BORNES TACTILES (2x) ----
      { moduleId: 'multi-002', position: [-0.8, 0.7, 0.8] },
      { moduleId: 'multi-002', position: [0.8, 0.7, 0.8] }
    ]
  }
];

/**
 * Recherche de templates par critères
 */
export function findTemplates(filters: {
  surface?: number;
  sector?: string;
  maxPrice?: number;
}): StandTemplate[] {
  return standTemplates.filter(template => {
    if (filters.surface && template.surface !== filters.surface) return false;
    if (filters.sector && template.sector !== filters.sector && template.sector !== 'universal') return false;
    if (filters.maxPrice && template.price > filters.maxPrice) return false;
    return true;
  });
}

/**
 * Obtenir un template par ID
 */
export function getTemplate(id: string): StandTemplate | undefined {
  return standTemplates.find(t => t.id === id);
}
