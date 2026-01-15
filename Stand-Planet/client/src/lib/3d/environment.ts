/**
 * Système d'environnement HDRI pour éclairage réaliste
 */

export interface EnvironmentPreset {
  name: string;
  description: string;
  hdriUrl?: string; // URL vers fichier .hdr
  backgroundColor: string;
  ambientIntensity: number;
  sunlight: {
    enabled: boolean;
    color: string;
    intensity: number;
    position: [number, number, number];
    castShadow: boolean;
  };
  fillLight: {
    enabled: boolean;
    color: string;
    intensity: number;
    position: [number, number, number];
  };
}

export const ENVIRONMENT_PRESETS: Record<string, EnvironmentPreset> = {
  studio: {
    name: 'Studio Professionnel',
    description: 'Éclairage de studio 3 points classique',
    backgroundColor: '#1a1a1a',
    ambientIntensity: 0.3,
    sunlight: {
      enabled: true,
      color: '#ffffff',
      intensity: 1.5,
      position: [10, 15, 10],
      castShadow: true,
    },
    fillLight: {
      enabled: true,
      color: '#b3d9ff',
      intensity: 0.5,
      position: [-10, 10, -10],
    },
  },

  outdoor: {
    name: 'Extérieur Jour',
    description: 'Lumière naturelle extérieure (journée ensoleillée)',
    backgroundColor: '#87CEEB',
    ambientIntensity: 0.6,
    sunlight: {
      enabled: true,
      color: '#fff5e6',
      intensity: 2.0,
      position: [15, 20, 5],
      castShadow: true,
    },
    fillLight: {
      enabled: true,
      color: '#b3d9ff',
      intensity: 0.4,
      position: [-5, 10, -15],
    },
  },

  indoor: {
    name: 'Intérieur Salle',
    description: 'Éclairage intérieur de salle d\'exposition',
    backgroundColor: '#2c2c2c',
    ambientIntensity: 0.5,
    sunlight: {
      enabled: true,
      color: '#ffefd5',
      intensity: 1.2,
      position: [8, 12, 8],
      castShadow: true,
    },
    fillLight: {
      enabled: true,
      color: '#ffd9b3',
      intensity: 0.6,
      position: [-8, 8, -8],
    },
  },

  sunset: {
    name: 'Coucher de Soleil',
    description: 'Lumière chaude de fin de journée',
    backgroundColor: '#ff9966',
    ambientIntensity: 0.4,
    sunlight: {
      enabled: true,
      color: '#ff7f50',
      intensity: 1.8,
      position: [20, 5, 0],
      castShadow: true,
    },
    fillLight: {
      enabled: true,
      color: '#ffb347',
      intensity: 0.5,
      position: [-10, 8, 10],
    },
  },

  night: {
    name: 'Nuit / Événement',
    description: 'Éclairage nocturne avec lumières artificielles',
    backgroundColor: '#0a0a0a',
    ambientIntensity: 0.2,
    sunlight: {
      enabled: false,
      color: '#ffffff',
      intensity: 0,
      position: [0, 10, 0],
      castShadow: false,
    },
    fillLight: {
      enabled: true,
      color: '#6495ed',
      intensity: 0.8,
      position: [0, 12, 0],
    },
  },

  dramatic: {
    name: 'Dramatique',
    description: 'Éclairage contrasté et dramatique',
    backgroundColor: '#000000',
    ambientIntensity: 0.1,
    sunlight: {
      enabled: true,
      color: '#ffffff',
      intensity: 3.0,
      position: [15, 10, -15],
      castShadow: true,
    },
    fillLight: {
      enabled: true,
      color: '#1e90ff',
      intensity: 0.3,
      position: [-15, 5, 15],
    },
  },

  soft: {
    name: 'Doux / Minimaliste',
    description: 'Éclairage doux et uniforme',
    backgroundColor: '#f5f5f5',
    ambientIntensity: 0.8,
    sunlight: {
      enabled: true,
      color: '#ffffff',
      intensity: 0.8,
      position: [5, 15, 5],
      castShadow: false,
    },
    fillLight: {
      enabled: true,
      color: '#ffffff',
      intensity: 0.6,
      position: [-5, 10, -5],
    },
  },

  warm: {
    name: 'Chaleureux',
    description: 'Ambiance chaleureuse et accueillante',
    backgroundColor: '#f4e4c1',
    ambientIntensity: 0.5,
    sunlight: {
      enabled: true,
      color: '#ffe4b5',
      intensity: 1.3,
      position: [10, 12, 8],
      castShadow: true,
    },
    fillLight: {
      enabled: true,
      color: '#ffd9b3',
      intensity: 0.7,
      position: [-8, 10, -8],
    },
  },

  cool: {
    name: 'Froid / Technologique',
    description: 'Ambiance froide et technologique',
    backgroundColor: '#d0e8f2',
    ambientIntensity: 0.4,
    sunlight: {
      enabled: true,
      color: '#e6f3ff',
      intensity: 1.5,
      position: [12, 15, 10],
      castShadow: true,
    },
    fillLight: {
      enabled: true,
      color: '#b3d9ff',
      intensity: 0.5,
      position: [-10, 10, -12],
    },
  },
};

/**
 * Obtenir un preset d'environnement par nom
 */
export function getEnvironmentPreset(name: string): EnvironmentPreset {
  return ENVIRONMENT_PRESETS[name] || ENVIRONMENT_PRESETS.studio;
}

/**
 * Liste de tous les presets disponibles
 */
export function getAllEnvironmentPresets(): Array<{ key: string; preset: EnvironmentPreset }> {
  return Object.entries(ENVIRONMENT_PRESETS).map(([key, preset]) => ({ key, preset }));
}
