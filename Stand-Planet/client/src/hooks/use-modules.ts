// Hook pour gérer les modules et leur placement
import { useCallback } from 'react';
import { useStudioStore } from '@/store/useStudioStore';
import { ModuleBase } from '@/types/modules';

export function useModules() {
  const {
    placedModules,
    addModule,
    removeModule,
    updateModule,
    selectModule,
    duplicateModule,
    selectedModuleId
  } = useStudioStore();

  const selectedModule = placedModules.find(m => m.instanceId === selectedModuleId);

  const addModuleAtPosition = useCallback((
    module: ModuleBase,
    position: { x: number; y: number; z: number }
  ) => {
    addModule(module, position);
  }, [addModule]);

  const removeSelectedModule = useCallback(() => {
    if (selectedModuleId) {
      removeModule(selectedModuleId);
    }
  }, [selectedModuleId, removeModule]);

  const duplicateSelectedModule = useCallback(() => {
    if (selectedModuleId) {
      duplicateModule(selectedModuleId);
    }
  }, [selectedModuleId, duplicateModule]);

  const moveModule = useCallback((
    instanceId: string,
    delta: { x?: number; y?: number; z?: number }
  ) => {
    const module = placedModules.find(m => m.instanceId === instanceId);
    if (!module) return;

    updateModule(instanceId, {
      position: {
        x: module.position.x + (delta.x || 0),
        y: module.position.y + (delta.y || 0),
        z: module.position.z + (delta.z || 0)
      }
    });
  }, [placedModules, updateModule]);

  const rotateModule = useCallback((
    instanceId: string,
    axis: 'x' | 'y' | 'z',
    angle: number // en degrés
  ) => {
    const module = placedModules.find(m => m.instanceId === instanceId);
    if (!module) return;

    const radians = (angle * Math.PI) / 180;
    updateModule(instanceId, {
      rotation: {
        ...module.rotation,
        [axis]: module.rotation[axis] + radians
      }
    });
  }, [placedModules, updateModule]);

  const scaleModule = useCallback((
    instanceId: string,
    scaleFactor: number
  ) => {
    updateModule(instanceId, {
      scale: { x: scaleFactor, y: scaleFactor, z: scaleFactor }
    });
  }, [updateModule]);

  const changeModuleColor = useCallback((
    instanceId: string,
    color: string
  ) => {
    const module = placedModules.find(m => m.instanceId === instanceId);
    if (!module || !module.customizable.color) return;

    updateModule(instanceId, {
      material: { ...module.material, value: color }
    });
  }, [placedModules, updateModule]);

  return {
    placedModules,
    selectedModule,
    addModuleAtPosition,
    removeSelectedModule,
    duplicateSelectedModule,
    moveModule,
    rotateModule,
    scaleModule,
    changeModuleColor,
    selectModule
  };
}
