import { StandConfiguration, PlacedModule } from '@/types/modules';
import { v4 as uuidv4 } from 'uuid';

/**
 * Templates de stands professionnels pré-configurés
 * Inspirés de stands réels comme CIMAT
 */

// Helper pour créer un module placé
function createPlacedModule(
  moduleId: string,
  position: { x: number; y: number; z: number },
  options: Partial<PlacedModule> = {}
): Partial<PlacedModule> {
  return {
    id: moduleId,
    instanceId: uuidv4(),
    position,
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
    isSelected: false,
    isLocked: false,
    ...options,
  };
}

/**
 * Template inspiré du stand CIMAT
 * Multi-niveaux, éclairage LED, écrans, branding
 */
export const CIMAT_STYLE_TEMPLATE: Omit<StandConfiguration, 'id' | 'userId' | 'createdAt' | 'updatedAt'> = {
  name: 'Stand Tech Multi-Niveaux',
  description: 'Stand moderne inspiré du style CIMAT avec plateforme surélevée, éclairage LED RGB et écrans multimédias',
  dimensions: { width: 9, height: 3, depth: 6 },
  tags: ['tech', 'multi-niveaux', 'premium', 'moderne'],

  modules: [
    // === STRUCTURE DE BASE ===
    createPlacedModule('struct-003', { x: 0, y: 0, z: 0 }), // Base 9x3m

    // === PLATEFORME SURÉLEVÉE (côté gauche) ===
    createPlacedModule('level-001', { x: -3, y: 0, z: 0 }), // Plateforme 3x3m H=1m

    // === ESCALIER D'ACCÈS ===
    createPlacedModule('level-002', { x: -3, y: 0, z: 2 }), // Escalier devant

    // === GARDE-CORPS ===
    createPlacedModule('level-003', { x: -3, y: 1, z: -1.5 }, { // Arrière plateforme
      rotation: { x: 0, y: Math.PI / 2, z: 0 }
    }),
    createPlacedModule('level-003', { x: -1.5, y: 1, z: 0 }, { // Droite plateforme
      rotation: { x: 0, y: 0, z: 0 }
    }),

    // === MURS & CLOISONS ===
    createPlacedModule('wall-001', { x: 0, y: 0, z: -3 }), // Mur arrière centre
    createPlacedModule('wall-001', { x: 3, y: 0, z: -3 }), // Mur arrière droite
    createPlacedModule('wall-002', { x: 4.5, y: 0, z: -1.5 }, { // Mur vitré côté
      rotation: { x: 0, y: Math.PI / 2, z: 0 }
    }),

    // === ÉCLAIRAGE LED RGB (bandes bleues comme CIMAT) ===
    createPlacedModule('light-002', { x: 0, y: 2.8, z: -3 }), // Bande LED haut mur arrière
    createPlacedModule('light-002', { x: 3, y: 2.8, z: -3 }), // Bande LED haut mur droite
    createPlacedModule('light-006', { x: -3, y: 1.5, z: 1.5 }), // Néon sur plateforme
    createPlacedModule('light-003', { x: 0, y: 0, z: 3 }, { // Panneau LED rétroéclairé devant
      dimensions: { width: 2, height: 2.5, depth: 0.05 }
    }),

    // === ÉCLAIRAGE D'ACCENTUATION ===
    createPlacedModule('light-001', { x: -2, y: 2.5, z: 1 }), // Spot sur plateforme
    createPlacedModule('light-001', { x: 2, y: 2.5, z: -2 }), // Spot zone produits
    createPlacedModule('light-007', { x: 1, y: 1.5, z: 2 }), // Accentuation vitrine

    // === ÉCRANS MULTIMÉDIA (4 écrans comme dans la photo) ===
    createPlacedModule('multi-001', { x: -3, y: 1.8, z: -1.4 }), // Écran sur plateforme
    createPlacedModule('multi-002', { x: 0, y: 1.5, z: -2.9 }), // Écran mural arrière
    createPlacedModule('multi-001', { x: 3, y: 1.5, z: -2.9 }), // Écran mural droite
    createPlacedModule('multi-003', { x: 2, y: 0.5, z: 2 }), // Borne tactile

    // === MOBILIER ===
    createPlacedModule('furn-001', { x: 0, y: 0, z: 2.5 }), // Comptoir accueil
    createPlacedModule('furn-002', { x: -2, y: 0, z: 1 }), // Table basse lounge
    createPlacedModule('furn-004', { x: -2.5, y: 0, z: 1 }), // Chaise
    createPlacedModule('furn-004', { x: -1.5, y: 0, z: 1 }), // Chaise
    createPlacedModule('furn-007', { x: 2, y: 0, z: -1 }), // Présentoir produits

    // === PLV & SIGNALÉTIQUE ===
    createPlacedModule('plv-001', { x: -4, y: 0, z: 2.5 }), // Kakemono entrée gauche
    createPlacedModule('plv-001', { x: 4, y: 0, z: 2.5 }), // Kakemono entrée droite
    createPlacedModule('plv-003', { x: 0, y: 0, z: -2.9 }), // Totem publicitaire

    // === DÉCORATION ===
    createPlacedModule('deco-006', { x: -3, y: 1, z: 0.5 }), // Plante sur plateforme
    createPlacedModule('deco-006', { x: -1, y: 0, z: -2 }), // Plante au sol

    // === SOL ===
    createPlacedModule('floor-001', { x: 0, y: -0.01, z: 0 }), // Moquette premium
  ] as PlacedModule[],

  estimatedPrice: 15000,
  carbonFootprint: 450,
  metadata: {
    style: 'tech-moderne',
    targetSectors: ['technologie', 'innovation', 'digital'],
    difficulty: 'avancé',
    setupTime: '6-8 heures',
    requiredCrew: 4,
    electricalNeeds: '32A triphasé',
    specialFeatures: ['multi-niveaux', 'éclairage-rgb', 'multimédia', 'interactif']
  }
};

/**
 * Template Stand Minimaliste Luxe
 */
export const MINIMALIST_LUXURY_TEMPLATE: Omit<StandConfiguration, 'id' | 'userId' | 'createdAt' | 'updatedAt'> = {
  name: 'Stand Minimaliste Luxe',
  description: 'Stand épuré avec matériaux premium, éclairage subtil et design minimaliste',
  dimensions: { width: 6, height: 2.5, depth: 3 },
  tags: ['luxe', 'minimaliste', 'premium', 'élégant'],

  modules: [
    // Base
    createPlacedModule('struct-002', { x: 0, y: 0, z: 0 }),

    // Murs
    createPlacedModule('wall-002', { x: 0, y: 0, z: -1.5 }), // Mur vitré
    createPlacedModule('wall-001', { x: -3, y: 0, z: 0 }, {
      rotation: { x: 0, y: Math.PI / 2, z: 0 },
      material: { type: 'color', value: '#ffffff' }
    }),

    // Éclairage subtil
    createPlacedModule('light-004', { x: -2, y: 2.5, z: 0 }),
    createPlacedModule('light-004', { x: 0, y: 2.5, z: 0 }),
    createPlacedModule('light-004', { x: 2, y: 2.5, z: 0 }),
    createPlacedModule('light-010', { x: 0, y: 2.4, z: -1.4 }), // Rampe LED

    // Mobilier design
    createPlacedModule('furn-008', { x: 0, y: 0, z: 0 }), // Table design
    createPlacedModule('furn-009', { x: -1, y: 0, z: 0 }), // Chaise Barcelona
    createPlacedModule('furn-009', { x: 1, y: 0, z: 0 }),
    createPlacedModule('light-009', { x: 0, y: 0, z: -1 }), // Lustre luxe

    // Décoration minimale
    createPlacedModule('deco-007', { x: -2.5, y: 1, z: -1.4 }), // Œuvre d'art
    createPlacedModule('plv-005', { x: 2.5, y: 0, z: 0 }), // Totem minimaliste

    // Sol premium
    createPlacedModule('floor-003', { x: 0, y: -0.01, z: 0 }),
  ] as PlacedModule[],

  estimatedPrice: 8500,
  carbonFootprint: 280,
  metadata: {
    style: 'minimaliste-luxe',
    targetSectors: ['luxe', 'design', 'mode', 'bijouterie'],
    difficulty: 'intermédiaire',
    setupTime: '3-4 heures',
    requiredCrew: 2,
    specialFeatures: ['matériaux-premium', 'éclairage-subtil']
  }
};

/**
 * Template Stand Éco-Responsable
 */
export const ECO_FRIENDLY_TEMPLATE: Omit<StandConfiguration, 'id' | 'userId' | 'createdAt' | 'updatedAt'> = {
  name: 'Stand Éco-Responsable',
  description: 'Stand 100% matériaux certifiés FSC/PEFC, design naturel, faible empreinte carbone',
  dimensions: { width: 6, height: 2.5, depth: 3 },
  tags: ['écologique', 'durable', 'naturel', 'certifié'],

  modules: [
    // Base
    createPlacedModule('struct-002', { x: 0, y: 0, z: 0 }),

    // Murs bois certifié
    createPlacedModule('wall-001', { x: 0, y: 0, z: -1.5 }, {
      material: { type: 'certified', certifiedMaterialId: 'mat-001' } // Bois FSC
    }),

    // Mur végétal
    createPlacedModule('deco-006', { x: -3, y: 1.25, z: 0 }, {
      scale: { x: 1, y: 2, z: 1 }
    }),

    // Éclairage basse consommation
    createPlacedModule('light-004', { x: -1.5, y: 2.4, z: 0 }),
    createPlacedModule('light-004', { x: 1.5, y: 2.4, z: 0 }),

    // Mobilier bois recyclé
    createPlacedModule('furn-001', { x: 0, y: 0, z: 1 }, {
      material: { type: 'certified', certifiedMaterialId: 'mat-003' } // Bois PEFC
    }),
    createPlacedModule('furn-002', { x: -1, y: 0, z: -0.5 }),

    // PLV recyclable
    createPlacedModule('plv-002', { x: -2.5, y: 0, z: 1.2 }),
    createPlacedModule('plv-003', { x: 2.5, y: 0, z: 0 }),

    // Plantes nombreuses
    createPlacedModule('deco-006', { x: -2, y: 0, z: -1 }),
    createPlacedModule('deco-006', { x: 2, y: 0, z: -1 }),
    createPlacedModule('deco-006', { x: 1, y: 0, z: 1 }),

    // Sol naturel
    createPlacedModule('floor-002', { x: 0, y: -0.01, z: 0 }),
  ] as PlacedModule[],

  estimatedPrice: 5500,
  carbonFootprint: 120, // Très faible !
  metadata: {
    style: 'éco-responsable',
    targetSectors: ['environnement', 'bio', 'développement-durable'],
    difficulty: 'facile',
    setupTime: '2-3 heures',
    requiredCrew: 2,
    certifications: ['FSC', 'PEFC', 'M1'],
    specialFeatures: ['carbone-neutre', 'matériaux-certifiés', 'recyclable']
  }
};

/**
 * Liste de tous les templates disponibles
 */
export const PROFESSIONAL_TEMPLATES = [
  CIMAT_STYLE_TEMPLATE,
  MINIMALIST_LUXURY_TEMPLATE,
  ECO_FRIENDLY_TEMPLATE,
];

/**
 * Obtenir un template par nom
 */
export function getTemplateByName(name: string): typeof CIMAT_STYLE_TEMPLATE | undefined {
  return PROFESSIONAL_TEMPLATES.find(t => t.name === name);
}
