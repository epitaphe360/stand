// Panneau de sélection des modules
import { useState } from 'react';
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plus, Home, Box, Armchair, Lightbulb, Monitor, Flower2, Grid3x3 } from 'lucide-react';
import {
  STRUCTURES,
  WALLS,
  FURNITURE,
  LIGHTING,
  MULTIMEDIA,
  DECORATION,
  FLOORING
} from '@/lib/3d/modules';
import { ModuleBase } from '@/types/modules';
import { useStudioStore } from '@/store/useStudioStore';

const categoryIcons = {
  structure: Home,
  wall: Box,
  furniture: Armchair,
  lighting: Lightbulb,
  multimedia: Monitor,
  decoration: Flower2,
  flooring: Grid3x3
};

const categoryLabels = {
  structure: 'Structures',
  wall: 'Murs',
  furniture: 'Mobilier',
  lighting: 'Éclairage',
  multimedia: 'Multimédia',
  decoration: 'Décoration',
  flooring: 'Sol'
};

export default function ModulePicker() {
  const [searchQuery, setSearchQuery] = useState('');
  const { addModule } = useStudioStore();

  const handleAddModule = (module: ModuleBase) => {
    addModule(module);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      structure: 'from-gray-400 to-gray-600',
      wall: 'from-blue-400 to-blue-600',
      furniture: 'from-amber-400 to-amber-600',
      lighting: 'from-yellow-300 to-yellow-500',
      multimedia: 'from-purple-400 to-purple-600',
      decoration: 'from-pink-400 to-pink-600',
      flooring: 'from-green-400 to-green-600'
    };
    return colors[category] || 'from-gray-400 to-gray-600';
  };

  const renderModuleCard = (module: ModuleBase) => {
    const Icon = categoryIcons[module.category as keyof typeof categoryIcons];
    
    return (
      <div
        key={module.id}
        className="group relative bg-white border-2 border-gray-200 hover:border-blue-400 rounded-lg p-3 hover:shadow-lg transition-all cursor-pointer"
        onClick={() => handleAddModule(module)}
      >
        {/* Thumbnail avec icône et forme 3D */}
        <div className={`w-full h-24 bg-gradient-to-br ${getCategoryColor(module.category)} rounded-md mb-2 flex items-center justify-center overflow-hidden relative`}>
          {/* Icône */}
          <Icon className="w-16 h-16 text-white opacity-90" />
          {/* Indicateur du type de mesh */}
          <div className="absolute bottom-1 right-1 bg-black/30 backdrop-blur-sm rounded px-2 py-0.5">
            <span className="text-xs text-white font-medium">
              {module.meshType === 'box' && '□'}
              {module.meshType === 'cylinder' && '○'}
              {module.meshType === 'sphere' && '●'}
            </span>
          </div>
        </div>

      {/* Info */}
      <h4 className="font-medium text-sm mb-1 line-clamp-1">{module.name}</h4>
      <p className="text-xs text-gray-500 mb-2 line-clamp-2">{module.description}</p>

      {/* Prix */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-blue-600">{module.price}€</span>
        <Button
          size="sm"
          variant="ghost"
          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            handleAddModule(module);
          }}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mt-2">
        {module.tags.slice(0, 2).map((tag) => (
          <Badge key={tag} variant="secondary" className="text-xs px-1 py-0">
            {tag}
          </Badge>
        ))}
      </div>
    </div>
    );
  };

  const filterModules = (modules: ModuleBase[]) => {
    if (!searchQuery) return modules;
    const query = searchQuery.toLowerCase();
    return modules.filter(
      (m) =>
        m.name.toLowerCase().includes(query) ||
        m.description.toLowerCase().includes(query) ||
        m.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  };

  return (
    <div className="flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b sticky top-0 bg-white z-10">
        <h2 className="font-semibold text-lg mb-3">Bibliothèque de Modules</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Rechercher un module..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Tabs par catégorie */}
      <Tabs defaultValue="structure" className="flex-1 flex flex-col">
        <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0 h-auto sticky top-[89px] bg-white z-10">
          {Object.entries(categoryLabels).map(([key, label]) => {
            const Icon = categoryIcons[key as keyof typeof categoryIcons];
            return (
              <TabsTrigger
                key={key}
                value={key}
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-blue-50 px-4 py-2 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{label}</span>
                </div>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <div className="p-4">
          <TabsContent value="structure" className="m-0">
              <div className="grid grid-cols-2 gap-3">
                {filterModules(STRUCTURES).map(renderModuleCard)}
              </div>
            </TabsContent>

            <TabsContent value="wall" className="m-0">
              <div className="grid grid-cols-2 gap-3">
                {filterModules(WALLS).map(renderModuleCard)}
              </div>
            </TabsContent>

            <TabsContent value="furniture" className="m-0">
              <div className="grid grid-cols-2 gap-3">
                {filterModules(FURNITURE).map(renderModuleCard)}
              </div>
            </TabsContent>

            <TabsContent value="lighting" className="m-0">
              <div className="grid grid-cols-2 gap-3">
                {filterModules(LIGHTING).map(renderModuleCard)}
              </div>
            </TabsContent>

            <TabsContent value="multimedia" className="m-0">
              <div className="grid grid-cols-2 gap-3">
                {filterModules(MULTIMEDIA).map(renderModuleCard)}
              </div>
            </TabsContent>

            <TabsContent value="decoration" className="m-0">
              <div className="grid grid-cols-2 gap-3">
                {filterModules(DECORATION).map(renderModuleCard)}
              </div>
            </TabsContent>

            <TabsContent value="flooring" className="m-0">
              <div className="grid grid-cols-2 gap-3">
                {filterModules(FLOORING).map(renderModuleCard)}
              </div>
            </TabsContent>
          </div>
      </Tabs>
    </div>
  );
}
