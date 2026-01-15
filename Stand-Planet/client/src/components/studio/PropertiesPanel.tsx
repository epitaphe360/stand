// Panneau de propriétés pour éditer les modules
import { useStudioStore } from '@/store/useStudioStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Trash2, Copy, Lock, Unlock, Box } from 'lucide-react';
import { STRUCTURES, WALLS, FURNITURE, LIGHTING, MULTIMEDIA, DECORATION } from '@/lib/3d/modules';
import { ModuleBase } from '@/types/modules';

// Fonction pour trouver un module par ID
const findModuleDefinition = (id: string): ModuleBase | undefined => {
  const allModules = [...STRUCTURES, ...WALLS, ...FURNITURE, ...LIGHTING, ...MULTIMEDIA, ...DECORATION];
  return allModules.find(m => m.id === id);
};

export default function PropertiesPanel() {
  const {
    selectedModuleId,
    placedModules,
    updateModule,
    removeModule,
    duplicateModule
  } = useStudioStore();

  const selectedModule = placedModules.find((m) => m.instanceId === selectedModuleId);
  const moduleDefinition = selectedModule ? findModuleDefinition(selectedModule.id) : undefined;

  if (!selectedModule) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center bg-white border-l">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <Box className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="font-medium text-gray-900 mb-1">Aucune sélection</h3>
        <p className="text-sm text-gray-500">
          Cliquez sur un module dans le canvas pour voir ses propriétés
        </p>
      </div>
    );
  }

  const handlePositionChange = (axis: 'x' | 'y' | 'z', value: string) => {
    const numValue = parseFloat(value) || 0;
    updateModule(selectedModule.instanceId, {
      position: { ...selectedModule.position, [axis]: numValue }
    });
  };

  const handleRotationChange = (axis: 'x' | 'y' | 'z', value: number[]) => {
    const radians = (value[0] * Math.PI) / 180;
    updateModule(selectedModule.instanceId, {
      rotation: { ...selectedModule.rotation, [axis]: radians }
    });
  };

  const handleScaleChange = (value: number[]) => {
    const scale = value[0];
    updateModule(selectedModule.instanceId, {
      scale: { x: scale, y: scale, z: scale }
    });
  };

  // Appliquer un preset de taille en respectant les proportions
  const handleSizePreset = (presetName: string) => {
    if (!moduleDefinition?.sizePresets) return;
    
    const preset = moduleDefinition.sizePresets.find(p => p.name === presetName);
    if (preset) {
      updateModule(selectedModule.instanceId, {
        dimensions: preset.dimensions
      });
    }
  };

  // Appliquer une variante (couleur, finition)
  const handleVariantChange = (variantId: string) => {
    if (!moduleDefinition?.variants) return;
    
    const variant = moduleDefinition.variants.find(v => v.id === variantId);
    if (variant) {
      updateModule(selectedModule.instanceId, {
        material: variant.material,
        price: moduleDefinition.price + variant.price
      });
    }
  };

  const handleColorChange = (color: string) => {
    if (selectedModule.material.type === 'color') {
      updateModule(selectedModule.instanceId, {
        material: { ...selectedModule.material, value: color }
      });
    }
  };

  const handleDelete = () => {
    removeModule(selectedModule.instanceId);
  };

  const handleDuplicate = () => {
    duplicateModule(selectedModule.instanceId);
  };

  const handleToggleLock = () => {
    updateModule(selectedModule.instanceId, {
      isLocked: !selectedModule.isLocked
    });
  };

  // Respecter les proportions lors du redimensionnement
  const handleWidthChange = (value: string) => {
    const width = parseFloat(value) || selectedModule.dimensions.width;
    if (moduleDefinition?.aspectRatio) {
      const ratio = moduleDefinition.aspectRatio;
      const newDimensions = {
        width,
        height: (width / ratio.width) * ratio.height,
        depth: (width / ratio.width) * ratio.depth
      };
      updateModule(selectedModule.instanceId, { dimensions: newDimensions });
    } else {
      updateModule(selectedModule.instanceId, {
        dimensions: { ...selectedModule.dimensions, width }
      });
    }
  };

  return (
    <div className="flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b sticky top-0 bg-white z-10">
        <h2 className="font-semibold text-lg mb-1">Propriétés</h2>
        <p className="text-sm text-gray-500 line-clamp-1">{selectedModule.name}</p>
      </div>

      <div className="p-4 space-y-6 overflow-y-auto">
        {/* Actions */}
        <div className="space-y-2">
          <Label>Actions</Label>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDuplicate}
              className="flex-1"
            >
              <Copy className="w-4 h-4 mr-2" />
              Dupliquer
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleLock}
              className="flex-1"
            >
              {selectedModule.isLocked ? (
                <>
                  <Unlock className="w-4 h-4 mr-2" />
                  Déverrouiller
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Verrouiller
                </>
              )}
            </Button>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            className="w-full"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Supprimer
          </Button>
        </div>

        <Separator />

        {/* Informations */}
        <div className="space-y-2">
          <Label>Informations</Label>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-500">Catégorie:</span>
              <p className="font-medium capitalize">{selectedModule.category}</p>
            </div>
            <div>
              <span className="text-gray-500">Prix:</span>
              <p className="font-medium">{selectedModule.price}€</p>
            </div>
            <div className="col-span-2">
              <span className="text-gray-500">Dimensions:</span>
              <p className="font-medium">
                {selectedModule.dimensions.width.toFixed(1)} x{' '}
                {selectedModule.dimensions.height.toFixed(1)} x{' '}
                {selectedModule.dimensions.depth.toFixed(1)} m
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Presets de Taille */}
        {moduleDefinition?.sizePresets && moduleDefinition.sizePresets.length > 0 && (
          <>
            <div className="space-y-2">
              <Label>Tailles Prédéfinies</Label>
              <p className="text-xs text-gray-500 mb-2">Sélectionner une taille standard (proportions respectées)</p>
              <div className="grid grid-cols-3 gap-2">
                {moduleDefinition.sizePresets.map((preset) => (
                  <Button
                    key={preset.name}
                    variant={
                      selectedModule.dimensions.width === preset.dimensions.width
                        ? 'default'
                        : 'outline'
                    }
                    size="sm"
                    onClick={() => handleSizePreset(preset.name)}
                    disabled={selectedModule.isLocked}
                    className="capitalize"
                  >
                    {preset.name}
                  </Button>
                ))}
              </div>
            </div>

            <Separator />
          </>
        )}

        {/* Variantes */}
        {moduleDefinition?.variants && moduleDefinition.variants.length > 0 && (
          <>
            <div className="space-y-2">
              <Label>Variantes</Label>
              <p className="text-xs text-gray-500 mb-2">Choisir une finition ou couleur</p>
              <Select
                disabled={selectedModule.isLocked}
                onValueChange={handleVariantChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une variante" />
                </SelectTrigger>
                <SelectContent>
                  {moduleDefinition.variants.map((variant) => (
                    <SelectItem key={variant.id} value={variant.id}>
                      {variant.name}
                      {variant.price > 0 && ` (+${variant.price}€)`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator />
          </>
        )}

        {/* Position */}
        <div className="space-y-3">
          <Label>Position</Label>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label className="text-xs text-gray-500">X</Label>
              <Input
                type="number"
                step="0.1"
                value={selectedModule.position.x.toFixed(2)}
                onChange={(e) => handlePositionChange('x', e.target.value)}
                disabled={selectedModule.isLocked}
              />
            </div>
            <div>
              <Label className="text-xs text-gray-500">Y</Label>
              <Input
                type="number"
                step="0.1"
                value={selectedModule.position.y.toFixed(2)}
                onChange={(e) => handlePositionChange('y', e.target.value)}
                disabled={selectedModule.isLocked}
              />
            </div>
            <div>
              <Label className="text-xs text-gray-500">Z</Label>
              <Input
                type="number"
                step="0.1"
                value={selectedModule.position.z.toFixed(2)}
                onChange={(e) => handlePositionChange('z', e.target.value)}
                disabled={selectedModule.isLocked}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Dimensions avec aspect ratio */}
        {selectedModule.customizable.dimensions && (
          <>
            <div className="space-y-3">
              <Label>Dimensions</Label>
              <p className="text-xs text-gray-500 mb-2">
                {moduleDefinition?.aspectRatio
                  ? '✓ Les proportions sont verrouillées'
                  : 'Redimensionner librement'}
              </p>
              <div className="space-y-2">
                <div>
                  <Label className="text-xs text-gray-500">Largeur (m)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={selectedModule.dimensions.width.toFixed(2)}
                    onChange={(e) => handleWidthChange(e.target.value)}
                    disabled={selectedModule.isLocked}
                  />
                </div>
                {!moduleDefinition?.aspectRatio && (
                  <>
                    <div>
                      <Label className="text-xs text-gray-500">Hauteur (m)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={selectedModule.dimensions.height.toFixed(2)}
                        onChange={(e) => updateModule(selectedModule.instanceId, {
                          dimensions: { ...selectedModule.dimensions, height: parseFloat(e.target.value) || 0 }
                        })}
                        disabled={selectedModule.isLocked}
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Profondeur (m)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        value={selectedModule.dimensions.depth.toFixed(2)}
                        onChange={(e) => updateModule(selectedModule.instanceId, {
                          dimensions: { ...selectedModule.dimensions, depth: parseFloat(e.target.value) || 0 }
                        })}
                        disabled={selectedModule.isLocked}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            <Separator />
          </>
        )}

        {/* Rotation */}
        <div className="space-y-3">
          <Label>Rotation</Label>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <Label className="text-xs text-gray-500">X</Label>
                <span className="text-xs text-gray-500">
                  {((selectedModule.rotation.x * 180) / Math.PI).toFixed(0)}°
                </span>
              </div>
              <Slider
                value={[(selectedModule.rotation.x * 180) / Math.PI]}
                onValueChange={(value) => handleRotationChange('x', value)}
                min={0}
                max={360}
                step={15}
                disabled={selectedModule.isLocked}
              />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <Label className="text-xs text-gray-500">Y</Label>
                <span className="text-xs text-gray-500">
                  {((selectedModule.rotation.y * 180) / Math.PI).toFixed(0)}°
                </span>
              </div>
              <Slider
                value={[(selectedModule.rotation.y * 180) / Math.PI]}
                onValueChange={(value) => handleRotationChange('y', value)}
                min={0}
                max={360}
                step={15}
                disabled={selectedModule.isLocked}
              />
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <Label className="text-xs text-gray-500">Z</Label>
                <span className="text-xs text-gray-500">
                  {((selectedModule.rotation.z * 180) / Math.PI).toFixed(0)}°
                </span>
              </div>
              <Slider
                value={[(selectedModule.rotation.z * 180) / Math.PI]}
                onValueChange={(value) => handleRotationChange('z', value)}
                min={0}
                max={360}
                step={15}
                disabled={selectedModule.isLocked}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Échelle */}
        <div className="space-y-3">
          <Label>Échelle</Label>
          <div className="flex justify-between mb-1">
            <span className="text-xs text-gray-500">Taille</span>
            <span className="text-xs text-gray-500">
              {(selectedModule.scale.x * 100).toFixed(0)}%
            </span>
          </div>
          <Slider
            value={[selectedModule.scale.x]}
            onValueChange={handleScaleChange}
            min={0.5}
            max={2}
            step={0.1}
            disabled={selectedModule.isLocked}
          />
        </div>

        {/* Couleur */}
        {selectedModule.customizable.color && selectedModule.material.type === 'color' && (
          <>
            <Separator />
            <div className="space-y-3">
              <Label>Couleur</Label>
              <Input
                type="color"
                value={selectedModule.material.value}
                onChange={(e) => handleColorChange(e.target.value)}
                disabled={selectedModule.isLocked}
                className="h-12"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
