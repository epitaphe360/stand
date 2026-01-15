// Interface principale du Stand Studio
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, Save, Download, Undo, Redo, Grid3x3, Eye, Settings,
  Maximize2, PanelLeftClose, PanelRightClose, Play, Home
} from 'lucide-react';
import { useLocation } from 'wouter';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import DragDropCanvas from '@/components/3d/DragDropCanvas';
import ModulePicker from './ModulePicker';
import PropertiesPanel from './PropertiesPanel';
import AIAssistant from '@/components/ai/AIAssistant';
import { useStudioStore } from '@/store/useStudioStore';
import { Badge } from '@/components/ui/badge';

export default function StandStudio() {
  const [, setLocation] = useLocation();
  const {
    currentConfiguration,
    isAIAssistantOpen,
    isModuleLibraryOpen,
    isPropertiesPanelOpen,
    toggleAIAssistant,
    toggleModuleLibrary,
    togglePropertiesPanel,
    snapToGrid,
    toggleSnapToGrid,
    undo,
    redo,
    history,
    historyIndex,
    getTotalPrice,
    placedModules
  } = useStudioStore();

  const [isFullscreen, setIsFullscreen] = useState(false);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;
  const totalPrice = getTotalPrice();

  const handleSave = () => {
    // TODO: Sauvegarder dans la base de données
    alert('Stand sauvegardé ! (Fonctionnalité à implémenter)');
  };

  const handleExport = () => {
    // TODO: Exporter en PDF/Images
    alert('Export en cours... (Fonctionnalité à implémenter)');
  };

  const handlePreview = () => {
    // TODO: Mode prévisualisation réaliste
    alert('Mode prévisualisation (Fonctionnalité à implémenter)');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Top Toolbar */}
      <div className="bg-white border-b shadow-sm z-10">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setLocation('/')}
              className="hover:bg-gray-100"
            >
              <Home className="w-5 h-5 text-gray-600" />
            </Button>

            <div className="h-8 w-px bg-gray-200" />

            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Stand Studio
              </h1>
              <p className="text-xs text-gray-500">{currentConfiguration.name}</p>
            </div>

            <div className="h-8 w-px bg-gray-200" />

            {/* Actions principales */}
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={undo}
                      disabled={!canUndo}
                    >
                      <Undo className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{canUndo ? 'Annuler la dernière action' : 'Aucune action à annuler'}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={redo}
                      disabled={!canRedo}
                    >
                      <Redo className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{canRedo ? 'Rétablir l\'action' : 'Aucune action à rétablir'}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <div className="h-8 w-px bg-gray-200" />

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={snapToGrid ? 'default' : 'outline'}
                      size="sm"
                      onClick={toggleSnapToGrid}
                    >
                      <Grid3x3 className="w-4 h-4 mr-2" />
                      Grille
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{snapToGrid ? 'Désactiver l\'aimantation à la grille' : 'Activer l\'aimantation à la grille'}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm" onClick={handlePreview}>
                      <Eye className="w-4 h-4 mr-2" />
                      Aperçu
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Mode aperçu réaliste (bientôt disponible)</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Center Section - Stats */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Modules:</span>
              <Badge variant="secondary">{placedModules.length}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Dimensions:</span>
              <Badge variant="secondary">
                {currentConfiguration.dimensions.width}m x {currentConfiguration.dimensions.depth}m
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Prix total:</span>
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                {totalPrice.toLocaleString('fr-FR')}€
              </Badge>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleAIAssistant}
                    className={isAIAssistantOpen ? 'bg-purple-50 border-purple-300' : ''}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Assistant IA
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Ouvrir l'assistant IA pour générer des designs</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={handleExport}>
                    <Download className="w-4 h-4 mr-2" />
                    Exporter
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Exporter en PDF/Images (bientôt disponible)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="sm" onClick={handleSave} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                    <Save className="w-4 h-4 mr-2" />
                    Sauvegarder
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Sauvegarder votre configuration</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Module Library */}
        {isModuleLibraryOpen && (
          <div className="w-80 flex-shrink-0 relative overflow-y-auto bg-white border-r">
            <ModulePicker />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleModuleLibrary}
                    className="absolute top-2 right-2 h-8 w-8 p-0 z-10"
                  >
                    <PanelLeftClose className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Fermer la bibliothèque</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}

        {/* Center - 3D Canvas */}
        <div className="flex-1 relative">
          {!isModuleLibraryOpen && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleModuleLibrary}
                    className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm hover:bg-white"
                  >
                    <PanelLeftClose className="w-4 h-4 rotate-180 mr-2" />
                    Modules
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Ouvrir la bibliothèque de modules</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          <DragDropCanvas />

          {/* Floating Controls */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border border-gray-200 p-2 flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Paramètres (bientôt disponible)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div className="h-6 w-px bg-gray-200" />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsFullscreen(!isFullscreen)}
                  >
                    <Maximize2 className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isFullscreen ? 'Quitter le plein écran' : 'Mode plein écran'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Helper Text */}
          {placedModules.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border-2 border-purple-200 p-8 max-w-md pointer-events-auto">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Commencez à créer
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Utilisez l'assistant IA pour générer un design automatiquement,
                  ou glissez-déposez des modules depuis la bibliothèque.
                </p>
                
                {/* Boutons d'action rapide */}
                <div className="flex gap-3 justify-center mb-4">
                  <Button 
                    size="sm" 
                    onClick={toggleAIAssistant}
                    className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Lancer l'IA
                  </Button>
                  {!isModuleLibraryOpen && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={toggleModuleLibrary}
                      className="border-blue-300 text-blue-700 hover:bg-blue-50"
                    >
                      <PanelLeftClose className="w-4 h-4 rotate-180 mr-2" />
                      Ouvrir Modules
                    </Button>
                  )}
                </div>
                
                <div className="flex gap-2 justify-center flex-wrap">
                  <Badge variant="outline" className="text-xs border-purple-300 text-purple-700">
                    🤖 IA Générative
                  </Badge>
                  <Badge variant="outline" className="text-xs border-blue-300 text-blue-700">
                    🎯 Drag & Drop
                  </Badge>
                  <Badge variant="outline" className="text-xs border-green-300 text-green-700">
                    📋 Templates
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Properties or AI */}
        {(isPropertiesPanelOpen || isAIAssistantOpen) && (
          <div className="w-80 flex-shrink-0 relative overflow-y-auto bg-white border-l">
            {isAIAssistantOpen ? (
              <AIAssistant />
            ) : (
              <>
                <PropertiesPanel />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={togglePropertiesPanel}
                  className="absolute top-2 left-2 h-8 w-8 p-0 z-10"
                >
                  <PanelRightClose className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        )}

        {!isPropertiesPanelOpen && !isAIAssistantOpen && (
          <Button
            variant="outline"
            size="sm"
            onClick={togglePropertiesPanel}
            className="absolute top-4 right-4 z-10"
          >
            Propriétés
            <PanelRightClose className="w-4 h-4 rotate-180 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}
