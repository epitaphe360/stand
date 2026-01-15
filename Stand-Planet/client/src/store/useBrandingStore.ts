import { create } from 'zustand';

/**
 * Store pour la gestion du branding et de la personnalisation
 * Comprend: logos, couleurs, textes, matériaux personnalisés
 */

export interface BrandingConfig {
  companyName: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logoUrl?: string;
  logoScale: number; // 0.5 - 2.0
  textCustom: {
    headline: string;
    tagline: string;
    customText: string;
  };
  materials: {
    wallMaterial: 'white' | 'black' | 'custom';
    wallColor: string;
    floorMaterial: 'marble' | 'polished' | 'wood' | 'concrete' | 'carpet';
    floorColor: string;
  };
  effects: {
    enableSpotlights: boolean;
    ambientIntensity: number; // 0.5 - 1.5
    enableGlowEffect: boolean;
    enableFog: boolean;
  };
}

interface BrandingState extends BrandingConfig {
  // Actions
  setCompanyName: (name: string) => void;
  setPrimaryColor: (color: string) => void;
  setSecondaryColor: (color: string) => void;
  setAccentColor: (color: string) => void;
  setLogoUrl: (url: string) => void;
  setLogoScale: (scale: number) => void;
  setHeadline: (text: string) => void;
  setTagline: (text: string) => void;
  setCustomText: (text: string) => void;
  setWallMaterial: (material: 'white' | 'black' | 'custom') => void;
  setWallColor: (color: string) => void;
  setFloorMaterial: (material: 'marble' | 'polished' | 'wood' | 'concrete' | 'carpet') => void;
  setFloorColor: (color: string) => void;
  setAmbientIntensity: (intensity: number) => void;
  setEnableSpotlights: (enabled: boolean) => void;
  setEnableGlowEffect: (enabled: boolean) => void;
  setEnableFog: (enabled: boolean) => void;
  resetBranding: () => void;
  exportBrandingConfig: () => string;
  importBrandingConfig: (json: string) => void;
}

const DEFAULT_BRANDING: BrandingConfig = {
  companyName: 'Mon Entreprise',
  primaryColor: '#6366f1', // Indigo
  secondaryColor: '#8b5cf6', // Violet
  accentColor: '#ec4899', // Rose
  logoUrl: undefined,
  logoScale: 1.0,
  textCustom: {
    headline: 'Bienvenue sur notre Stand',
    tagline: 'Innovation et Excellence',
    customText: '',
  },
  materials: {
    wallMaterial: 'white',
    wallColor: '#ffffff',
    floorMaterial: 'polished',
    floorColor: '#e5e7eb',
  },
  effects: {
    enableSpotlights: true,
    ambientIntensity: 1.0,
    enableGlowEffect: false,
    enableFog: false,
  },
};

export const useBrandingStore = create<BrandingState>((set, get) => ({
  ...DEFAULT_BRANDING,

  setCompanyName: (name) => set({ companyName: name }),
  setPrimaryColor: (color) => set({ primaryColor: color }),
  setSecondaryColor: (color) => set({ secondaryColor: color }),
  setAccentColor: (color) => set({ accentColor: color }),
  setLogoUrl: (url) => set({ logoUrl: url }),
  setLogoScale: (scale) => set({ logoScale: Math.max(0.5, Math.min(2.0, scale)) }),

  setHeadline: (text) => set((state) => ({
    textCustom: { ...state.textCustom, headline: text },
  })),
  setTagline: (text) => set((state) => ({
    textCustom: { ...state.textCustom, tagline: text },
  })),
  setCustomText: (text) => set((state) => ({
    textCustom: { ...state.textCustom, customText: text },
  })),

  setWallMaterial: (material) => set((state) => ({
    materials: { ...state.materials, wallMaterial: material },
  })),
  setWallColor: (color) => set((state) => ({
    materials: { ...state.materials, wallColor: color },
  })),
  setFloorMaterial: (material) => set((state) => ({
    materials: { ...state.materials, floorMaterial: material },
  })),
  setFloorColor: (color) => set((state) => ({
    materials: { ...state.materials, floorColor: color },
  })),

  setAmbientIntensity: (intensity) => set((state) => ({
    effects: { ...state.effects, ambientIntensity: Math.max(0.5, Math.min(1.5, intensity)) },
  })),
  setEnableSpotlights: (enabled) => set((state) => ({
    effects: { ...state.effects, enableSpotlights: enabled },
  })),
  setEnableGlowEffect: (enabled) => set((state) => ({
    effects: { ...state.effects, enableGlowEffect: enabled },
  })),
  setEnableFog: (enabled) => set((state) => ({
    effects: { ...state.effects, enableFog: enabled },
  })),

  resetBranding: () => set(DEFAULT_BRANDING),

  exportBrandingConfig: (): string => {
    // Get current state manually since we can't access it directly in this context
    const state = get();
    return JSON.stringify({
      companyName: state.companyName,
      primaryColor: state.primaryColor,
      secondaryColor: state.secondaryColor,
      accentColor: state.accentColor,
      logoScale: state.logoScale,
      textCustom: state.textCustom,
      materials: state.materials,
      effects: state.effects,
    }, null, 2);
  },

  importBrandingConfig: (json: string) => {
    try {
      const config = JSON.parse(json) as Partial<BrandingConfig>;
      set((state) => ({
        ...state,
        ...config,
      }));
    } catch (error) {
      console.error('Invalid branding config JSON:', error);
    }
  },
}));
