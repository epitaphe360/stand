import { CERTIFIED_MATERIALS } from '@/lib/3d/materials';
import { useStudioStore } from '@/store/useStudioStore';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Leaf, Weight, Euro, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function MaterialSelector() {
  const { selectedModuleId, placedModules, updateModule } = useStudioStore();
  const selectedModule = placedModules.find(m => m.instanceId === selectedModuleId);

  if (!selectedModule) return null;

  const handleSelectMaterial = (materialId: string) => {
    updateModule(selectedModuleId!, {
      material: {
        type: 'certified',
        value: materialId,
        certifiedMaterialId: materialId
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">Matériaux Certifiés</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="w-4 h-4 text-gray-400" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs text-xs">Sélectionnez un matériau réel pour mettre à jour automatiquement le poids, le prix et l'éco-score de votre stand.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {CERTIFIED_MATERIALS.map((mat) => {
          const isSelected = selectedModule.material.certifiedMaterialId === mat.id;
          
          return (
            <Card 
              key={mat.id}
              className={`cursor-pointer transition-all hover:border-blue-400 ${isSelected ? 'border-blue-500 ring-1 ring-blue-500 bg-blue-50/30' : 'border-gray-200'}`}
              onClick={() => handleSelectMaterial(mat.id)}
            >
              <CardContent className="p-3">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-bold text-sm">{mat.name}</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider">{mat.certification}</p>
                  </div>
                  <div 
                    className="w-4 h-4 rounded-full border border-gray-200" 
                    style={{ backgroundColor: mat.pbr.color }}
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 mt-3">
                  <div className="flex flex-col items-center p-1.5 bg-white rounded border border-gray-100">
                    <Euro className="w-3 h-3 text-green-600 mb-1" />
                    <span className="text-[10px] font-medium">{mat.pricePerUnit}€/{mat.unit}</span>
                  </div>
                  <div className="flex flex-col items-center p-1.5 bg-white rounded border border-gray-100">
                    <Weight className="w-3 h-3 text-blue-600 mb-1" />
                    <span className="text-[10px] font-medium">{mat.density}kg/{mat.unit}</span>
                  </div>
                  <div className="flex flex-col items-center p-1.5 bg-white rounded border border-gray-100">
                    <Leaf className="w-3 h-3 text-emerald-600 mb-1" />
                    <span className="text-[10px] font-medium">{mat.carbonFootprint} CO2</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
