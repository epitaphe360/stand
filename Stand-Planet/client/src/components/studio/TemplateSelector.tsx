import { useState } from 'react';
import { standTemplates, StandTemplate, getTemplate } from '@/lib/3d/standTemplates';
import { useStudioStore } from '@/store/useStudioStore';
import { getModuleById } from '@/lib/3d/modules';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface TemplateSelectorProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function TemplateSelector({ isOpen = false, onOpenChange }: TemplateSelectorProps) {
  const { addModule, clearModules } = useStudioStore();
  const [selectedTemplate, setSelectedTemplate] = useState<StandTemplate | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [sector, setSector] = useState<string | null>(null);

  const sectors = Array.from(new Set(standTemplates.map(t => t.sector))).filter(s => s !== 'universal');

  const filteredTemplates = sector 
    ? standTemplates.filter(t => t.sector === sector || t.sector === 'universal')
    : standTemplates;

  const handleLoadTemplate = (template: StandTemplate) => {
    setSelectedTemplate(template);
    setShowConfirm(true);
  };

  const confirmLoadTemplate = () => {
    if (!selectedTemplate) return;

    // Vider le canvas
    clearModules();

    // Charger tous les modules du template
    selectedTemplate.modules.forEach(module => {
      const moduleData = getModuleById(module.moduleId);
      if (moduleData) {
        addModule(moduleData, {
          x: module.position[0],
          y: module.position[1],
          z: module.position[2]
        });
        
        // Mettre à jour les propriétés du module si nécessaire
        const placedModules = useStudioStore.getState().placedModules;
        const lastModule = placedModules[placedModules.length - 1];
        if (lastModule && module.rotation) {
          useStudioStore.getState().updateModule(lastModule.instanceId, {
            rotation: {
              x: module.rotation[0] || 0,
              y: module.rotation[1] || 0,
              z: module.rotation[2] || 0
            }
          });
        }
        if (lastModule && module.scale) {
          useStudioStore.getState().updateModule(lastModule.instanceId, {
            scale: {
              x: module.scale[0] || 1,
              y: module.scale[1] || 1,
              z: module.scale[2] || 1
            }
          });
        }
      }
    });

    setShowConfirm(false);
    setSelectedTemplate(null);
    onOpenChange?.(false);
  };

  const getSectorColor = (sector: string) => {
    const colors: Record<string, string> = {
      tech: 'bg-blue-500',
      luxury: 'bg-purple-500',
      industry: 'bg-orange-500',
      services: 'bg-green-500',
      universal: 'bg-gray-500'
    };
    return colors[sector] || 'bg-gray-500';
  };

  const getSectorLabel = (sector: string) => {
    const labels: Record<string, string> = {
      tech: 'Tech & Innovation',
      luxury: 'Luxe & Premium',
      industry: 'Industrie & Produits',
      services: 'Services & Entreprises',
      universal: 'Universal'
    };
    return labels[sector] || sector;
  };

  const getSectorIcon = (sector: string) => {
    const icons: Record<string, string> = {
      tech: '💻',
      luxury: '✨',
      industry: '🏭',
      services: '💼',
      universal: '🎪'
    };
    return icons[sector] || '📦';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          📋 Charger Template
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Sélectionnez un Stand Professionnel Pré-configuré</DialogTitle>
          <DialogDescription>
            Choisissez un template clé en main inspiré des standards professionnels d'Epitaphe 360
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="all" className="w-full" onValueChange={setSector}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="all">Tous</TabsTrigger>
            {sectors.map(s => (
              <TabsTrigger key={s} value={s} className="text-xs">
                {getSectorIcon(s)} {getSectorLabel(s).split(' ')[0]}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
              {standTemplates.map(template => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onLoad={handleLoadTemplate}
                  getSectorColor={getSectorColor}
                  getSectorLabel={getSectorLabel}
                  getSectorIcon={getSectorIcon}
                />
              ))}
            </div>
          </TabsContent>

          {sectors.map(s => (
            <TabsContent key={s} value={s} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
                {filteredTemplates.map(template => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onLoad={handleLoadTemplate}
                    getSectorColor={getSectorColor}
                    getSectorLabel={getSectorLabel}
                    getSectorIcon={getSectorIcon}
                  />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Confirmation Dialog */}
        <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Charger le template ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action effacera le stand actuel et chargera le template <strong>{selectedTemplate?.name}</strong>.
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <p className="text-sm font-semibold">{selectedTemplate?.name}</p>
                  <p className="text-sm text-muted-foreground mt-2">{selectedTemplate?.description}</p>
                  <div className="mt-3 flex gap-2 flex-wrap">
                    {selectedTemplate?.features.slice(0, 3).map((feature, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {selectedTemplate && selectedTemplate.features.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{selectedTemplate.features.length - 3} autres
                      </Badge>
                    )}
                  </div>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex gap-2 justify-between">
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={confirmLoadTemplate} className="bg-blue-600 hover:bg-blue-700">
                Charger
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </DialogContent>
    </Dialog>
  );
}

// Composant pour afficher une carte template
function TemplateCard({
  template,
  onLoad,
  getSectorColor,
  getSectorLabel,
  getSectorIcon
}: {
  template: StandTemplate;
  onLoad: (template: StandTemplate) => void;
  getSectorColor: (sector: string) => string;
  getSectorLabel: (sector: string) => string;
  getSectorIcon: (sector: string) => string;
}) {
  return (
    <Card className="hover:shadow-lg transition-shadow overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1">
            <CardTitle className="text-lg">{template.name}</CardTitle>
            <CardDescription className="text-sm mt-1">{template.description}</CardDescription>
          </div>
          <Badge className={`${getSectorColor(template.sector)} text-white flex-shrink-0`}>
            {getSectorIcon(template.sector)} {getSectorLabel(template.sector)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Spécifications */}
        <div className="grid grid-cols-3 gap-2 py-2 border-y">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{template.surface}m²</p>
            <p className="text-xs text-muted-foreground">Surface</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{template.modules.length}</p>
            <p className="text-xs text-muted-foreground">Modules</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">{template.price}€</p>
            <p className="text-xs text-muted-foreground">Montage</p>
          </div>
        </div>

        {/* Dimensions */}
        <div className="text-sm text-muted-foreground">
          <span className="font-semibold">Dimensions:</span> {template.dimensions.width}m × {template.dimensions.depth}m × {template.dimensions.height}m
        </div>

        {/* Caractéristiques */}
        <div className="space-y-2">
          <p className="font-semibold text-sm">Inclus:</p>
          <div className="grid grid-cols-2 gap-2">
            {template.features.slice(0, 4).map((feature, i) => (
              <div key={i} className="flex gap-2 text-sm">
                <span className="text-green-600">✓</span>
                <span className="text-muted-foreground">{feature}</span>
              </div>
            ))}
          </div>
          {template.features.length > 4 && (
            <p className="text-xs text-gray-500 mt-1">
              +{template.features.length - 4} caractéristiques supplémentaires
            </p>
          )}
        </div>

        {/* Bouton Charger */}
        <Button
          onClick={() => onLoad(template)}
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
        >
          📦 Charger ce Stand
        </Button>
      </CardContent>
    </Card>
  );
}
