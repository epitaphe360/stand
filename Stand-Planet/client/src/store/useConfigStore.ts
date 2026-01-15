import { create } from 'zustand';

export interface BoothObject {
  id: string;
  type: 'table' | 'chair' | 'banner' | 'plant';
  position: [number, number, number];
  rotation: [number, number, number];
  color?: string;
}

interface ConfigState {
  dimensions: { width: number; depth: number };
  objects: BoothObject[];
  wallColor: string;
  floorTexture: string;
  
  // Actions
  setDimensions: (width: number, depth: number) => void;
  addObject: (obj: Omit<BoothObject, 'id'>) => void;
  updateObject: (id: string, updates: Partial<BoothObject>) => void;
  removeObject: (id: string) => void;
  setWallColor: (color: string) => void;
  setFloorTexture: (texture: string) => void;
  resetConfig: () => void;
}

export const useConfigStore = create<ConfigState>((set) => ({
  dimensions: { width: 3, depth: 3 },
  objects: [],
  wallColor: '#ffffff',
  floorTexture: 'wood',

  setDimensions: (width, depth) => set({ dimensions: { width, depth } }),
  
  addObject: (obj) => set((state) => ({
    objects: [...state.objects, { ...obj, id: Math.random().toString(36).substr(2, 9) }]
  })),

  updateObject: (id, updates) => set((state) => ({
    objects: state.objects.map((obj) => obj.id === id ? { ...obj, ...updates } : obj)
  })),

  removeObject: (id) => set((state) => ({
    objects: state.objects.filter((obj) => obj.id !== id)
  })),

  setWallColor: (color) => set({ wallColor: color }),
  
  setFloorTexture: (texture) => set({ floorTexture: texture }),
  
  resetConfig: () => set({
    dimensions: { width: 3, depth: 3 },
    objects: [],
    wallColor: '#ffffff',
    floorTexture: 'wood'
  })
}));
