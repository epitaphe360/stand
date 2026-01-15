// Store Zustand pour gérer l'état du Stand Studio
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { PlacedModule, StandConfiguration, DesignHistoryItem, ModuleBase } from '@/types/modules';
import { io, Socket } from 'socket.io-client';

interface StudioState {
  // Collaboration
  socket: Socket | null;
  roomId: string | null;
  connectCollaboration: (roomId: string) => void;
  disconnectCollaboration: () => void;

  // Configuration actuelle
  currentConfiguration: StandConfiguration;
  
  // Modules placés
  placedModules: PlacedModule[];
  selectedModuleId: string | null;
  hoveredModuleId: string | null;
  
  // Historique pour undo/redo
  history: DesignHistoryItem[];
  historyIndex: number;
  
  // Mode d'édition
  editMode: 'select' | 'move' | 'rotate' | 'scale';
  snapToGrid: boolean;
  gridSize: number;
  
  // Caméra et vue
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
  
  // UI State
  isAIAssistantOpen: boolean;
  isModuleLibraryOpen: boolean;
  isPropertiesPanelOpen: boolean;
  environmentPreset: 'city' | 'studio' | 'apartment' | 'lobby' | 'night' | 'warehouse' | 'forest';
  
  // Actions
  addModule: (module: ModuleBase, position?: { x: number; y: number; z: number }) => void;
  removeModule: (instanceId: string) => void;
  updateModule: (instanceId: string, updates: Partial<PlacedModule>) => void;
  selectModule: (instanceId: string | null) => void;
  hoverModule: (instanceId: string | null) => void;
  duplicateModule: (instanceId: string) => void;
  clearModules: () => void;
  
  // Configuration
  updateConfiguration: (updates: Partial<StandConfiguration>) => void;
  loadConfiguration: (config: StandConfiguration) => void;
  resetConfiguration: () => void;
  
  // Historique
  undo: () => void;
  redo: () => void;
  addToHistory: (action: string, description: string) => void;
  
  // Mode d'édition
  setEditMode: (mode: 'select' | 'move' | 'rotate' | 'scale') => void;
  toggleSnapToGrid: () => void;
  setGridSize: (size: number) => void;
  
  // UI
  toggleAIAssistant: () => void;
  toggleModuleLibrary: () => void;
  togglePropertiesPanel: () => void;
  
  // Caméra
  setCameraPosition: (position: [number, number, number]) => void;
  setCameraTarget: (target: [number, number, number]) => void;
  resetCamera: () => void;
  setEnvironmentPreset: (preset: 'city' | 'studio' | 'apartment' | 'lobby' | 'night' | 'warehouse' | 'forest') => void;
  
  // Prix total
  getTotalPrice: () => number;
}

const defaultConfiguration: StandConfiguration = {
  name: 'Nouveau Stand',
  description: '',
  dimensions: { width: 6, depth: 3 },
  modules: [],
  backgroundColor: '#f5f5f5',
  floorMaterial: { type: 'color', value: '#e8e8e8' },
  style: 'modern',
  totalPrice: 0
};

export const useStudioStore = create<StudioState>()(
  devtools(
    persist(
      (set, get) => ({
        // État initial
        currentConfiguration: defaultConfiguration,
        placedModules: [],
        selectedModuleId: null,
        hoveredModuleId: null,
        history: [],
        historyIndex: -1,
        editMode: 'select',
        snapToGrid: true,
        gridSize: 0.5,
        cameraPosition: [8, 8, 8],
        cameraTarget: [0, 0, 0],
        isAIAssistantOpen: false,
        isModuleLibraryOpen: true,
        isPropertiesPanelOpen: true,
        environmentPreset: 'studio',
        socket: null,
        roomId: null,

        connectCollaboration: (roomId) => {
          const socket = io(window.location.origin);
          socket.emit('join-room', roomId);

          socket.on('module-updated', (data) => {
            set((state) => ({
              placedModules: state.placedModules.map(m =>
                m.instanceId === data.instanceId ? { ...m, ...data.updates } : m
              )
            }));
          });

          socket.on('module-added', (data) => {
            set((state) => ({
              placedModules: [...state.placedModules, data.module]
            }));
          });

          socket.on('module-removed', (data) => {
            set((state) => ({
              placedModules: state.placedModules.filter(m => m.instanceId !== data.instanceId)
            }));
          });

          set({ socket, roomId });
        },

        disconnectCollaboration: () => {
          const { socket } = get();
          if (socket) socket.disconnect();
          set({ socket: null, roomId: null });
        },

        setEnvironmentPreset: (preset: any) => set({ environmentPreset: preset }),

        // Ajouter un module
        addModule: (module, position) => {
          const instanceId = `${module.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          
          const placedModule: PlacedModule = {
            ...module,
            instanceId,
            position: position || { x: 0, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
            material: module.defaultMaterial,
            isSelected: false,
            isLocked: false
          };

          set((state) => ({
            placedModules: [...state.placedModules, placedModule],
            selectedModuleId: instanceId
          }));

          const { socket, roomId } = get();
          if (socket && roomId) {
            socket.emit('add-module', { roomId, module: placedModule });
          }

          get().addToHistory('add', `Ajout de ${module.name}`);
        },

        // Supprimer un module
        removeModule: (instanceId) => {
          const module = get().placedModules.find(m => m.instanceId === instanceId);
          if (!module) return;

          set((state) => ({
            placedModules: state.placedModules.filter(m => m.instanceId !== instanceId),
            selectedModuleId: state.selectedModuleId === instanceId ? null : state.selectedModuleId
          }));

          const { socket, roomId } = get();
          if (socket && roomId) {
            socket.emit('remove-module', { roomId, instanceId });
          }

          get().addToHistory('remove', `Suppression de ${module.name}`);
        },

        // Mettre à jour un module
        updateModule: (instanceId, updates) => {
          set((state) => ({
            placedModules: state.placedModules.map(m =>
              m.instanceId === instanceId ? { ...m, ...updates } : m
            )
          }));

          const { socket, roomId } = get();
          if (socket && roomId) {
            socket.emit('update-module', { roomId, instanceId, updates });
          }
        },

        // Sélectionner un module
        selectModule: (instanceId) => {
          set({ selectedModuleId: instanceId });
        },

        // Survoler un module
        hoverModule: (instanceId) => {
          set({ hoveredModuleId: instanceId });
        },

        // Dupliquer un module
        duplicateModule: (instanceId) => {
          const module = get().placedModules.find(m => m.instanceId === instanceId);
          if (!module) return;

          const newInstanceId = `${module.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          const duplicatedModule: PlacedModule = {
            ...module,
            instanceId: newInstanceId,
            position: {
              x: module.position.x + 1,
              y: module.position.y,
              z: module.position.z + 1
            },
            isSelected: false
          };

          set((state) => ({
            placedModules: [...state.placedModules, duplicatedModule],
            selectedModuleId: newInstanceId
          }));

          get().addToHistory('add', `Duplication de ${module.name}`);
        },

        // Vider tous les modules
        clearModules: () => {
          set({
            placedModules: [],
            selectedModuleId: null,
            hoveredModuleId: null
          });
          get().addToHistory('clear', 'Effacement de tous les modules');
        },

        // Mettre à jour la configuration
        updateConfiguration: (updates) => {
          set((state) => ({
            currentConfiguration: {
              ...state.currentConfiguration,
              ...updates,
              updatedAt: new Date()
            }
          }));
        },

        // Charger une configuration
        loadConfiguration: (config) => {
          set({
            currentConfiguration: config,
            placedModules: config.modules,
            selectedModuleId: null,
            history: [],
            historyIndex: -1
          });
        },

        // Réinitialiser la configuration
        resetConfiguration: () => {
          set({
            currentConfiguration: defaultConfiguration,
            placedModules: [],
            selectedModuleId: null,
            hoveredModuleId: null,
            history: [],
            historyIndex: -1
          });
        },

        // Ajouter à l'historique
        addToHistory: (action, description) => {
          const state = get();
          const historyItem: DesignHistoryItem = {
            id: `history-${Date.now()}`,
            timestamp: new Date(),
            action: action as any,
            description,
            configuration: {
              ...state.currentConfiguration,
              modules: state.placedModules
            }
          };

          const newHistory = state.history.slice(0, state.historyIndex + 1);
          newHistory.push(historyItem);

          // Limiter l'historique à 50 éléments
          if (newHistory.length > 50) {
            newHistory.shift();
          }

          set({
            history: newHistory,
            historyIndex: newHistory.length - 1
          });
        },

        // Annuler (Undo)
        undo: () => {
          const state = get();
          if (state.historyIndex <= 0) return;

          const newIndex = state.historyIndex - 1;
          const previousState = state.history[newIndex];

          set({
            currentConfiguration: previousState.configuration,
            placedModules: previousState.configuration.modules,
            historyIndex: newIndex,
            selectedModuleId: null
          });
        },

        // Refaire (Redo)
        redo: () => {
          const state = get();
          if (state.historyIndex >= state.history.length - 1) return;

          const newIndex = state.historyIndex + 1;
          const nextState = state.history[newIndex];

          set({
            currentConfiguration: nextState.configuration,
            placedModules: nextState.configuration.modules,
            historyIndex: newIndex,
            selectedModuleId: null
          });
        },

        // Mode d'édition
        setEditMode: (mode) => {
          set({ editMode: mode });
        },

        toggleSnapToGrid: () => {
          set((state) => ({ snapToGrid: !state.snapToGrid }));
        },

        setGridSize: (size) => {
          set({ gridSize: size });
        },

        // UI
        toggleAIAssistant: () => {
          set((state) => ({ isAIAssistantOpen: !state.isAIAssistantOpen }));
        },

        toggleModuleLibrary: () => {
          set((state) => ({ isModuleLibraryOpen: !state.isModuleLibraryOpen }));
        },

        togglePropertiesPanel: () => {
          set((state) => ({ isPropertiesPanelOpen: !state.isPropertiesPanelOpen }));
        },

        // Caméra
        setCameraPosition: (position) => {
          set({ cameraPosition: position });
        },

        setCameraTarget: (target) => {
          set({ cameraTarget: target });
        },

        resetCamera: () => {
          set({
            cameraPosition: [8, 8, 8],
            cameraTarget: [0, 0, 0]
          });
        },

        // Calculer le prix total
        getTotalPrice: () => {
          const modules = get().placedModules;
          return modules.reduce((total, module) => total + module.price, 0);
        }
      }),
      {
        name: 'stand-studio-storage',
        partialize: (state) => ({
          currentConfiguration: state.currentConfiguration,
          placedModules: state.placedModules,
          snapToGrid: state.snapToGrid,
          gridSize: state.gridSize
        })
      }
    )
  )
);
