// Galerie de templates prédéfinis
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Search, Star, TrendingUp } from 'lucide-react';
import { ModuleTemplate } from '@/types/modules';
import { useStudioStore } from '@/store/useStudioStore';

// Templates prédéfinis
const TEMPLATES: ModuleTemplate[] = [
  {
    id: 'temp-001',
    name: 'Stand Tech Moderne',
    description: 'Stand moderne pour entreprise technologique avec écrans LED et design épuré',
    thumbnailUrl: '/templates/tech-modern.jpg',
    category: 'complete',
    industry: ['tech', 'software', 'innovation'],
    style: ['modern', 'minimal'],
    configuration: {
      name: 'Stand Tech Moderne',
      description: 'Configuration optimisée pour les entreprises tech',
      dimensions: { width: 6, depth: 3 },
      modules: [],
      backgroundColor: '#f5f5f5',
      floorMaterial: { type: 'color', value: '#2c3e50' },
      style: 'modern'
    },
    tags: ['tech', 'moderne', 'LED', 'écrans'],
    popularity: 95
  },
  {
    id: 'temp-002',
    name: 'Stand Luxe Premium',
    description: 'Stand haut de gamme avec matériaux nobles et ambiance sophistiquée',
    thumbnailUrl: '/templates/luxury.jpg',
    category: 'complete',
    industry: ['luxury', 'fashion', 'jewelry'],
    style: ['luxury', 'elegant'],
    configuration: {
      name: 'Stand Luxe Premium',
      description: 'Configuration premium pour marques de luxe',
      dimensions: { width: 9, depth: 3 },
      modules: [],
      backgroundColor: '#fafafa',
      floorMaterial: { type: 'color', value: '#8b4513' },
      style: 'luxury'
    },
    tags: ['luxe', 'premium', 'élégant', 'haut de gamme'],
    popularity: 88
  },
  {
    id: 'temp-003',
    name: 'Stand Écologique',
    description: 'Stand éco-responsable avec matériaux naturels et plantes',
    thumbnailUrl: '/templates/eco.jpg',
    category: 'complete',
    industry: ['eco', 'bio', 'sustainable'],
    style: ['minimal', 'natural'],
    configuration: {
      name: 'Stand Écologique',
      description: 'Configuration éco-responsable',
      dimensions: { width: 6, depth: 3 },
      modules: [],
      backgroundColor: '#f9fdf7',
      floorMaterial: { type: 'color', value: '#8b4513' },
      style: 'minimal'
    },
    tags: ['écologique', 'naturel', 'bio', 'durable'],
    popularity: 75
  },
  {
    id: 'temp-004',
    name: 'Stand Interactif',
    description: 'Stand avec bornes tactiles et espaces de démonstration',
    thumbnailUrl: '/templates/interactive.jpg',
    category: 'complete',
    industry: ['tech', 'gaming', 'education'],
    style: ['creative', 'modern'],
    configuration: {
      name: 'Stand Interactif',
      description: 'Configuration interactive et immersive',
      dimensions: { width: 9, depth: 3 },
      modules: [],
      backgroundColor: '#f5f5f5',
      floorMaterial: { type: 'color', value: '#34495e' },
      style: 'creative'
    },
    tags: ['interactif', 'tactile', 'démonstration', 'gaming'],
    popularity: 82
  },
  {
    id: 'temp-005',
    name: 'Stand Îlot 360°',
    description: 'Stand îlot accessible sur tous les côtés, idéal pour grande visibilité',
    thumbnailUrl: '/templates/island.jpg',
    category: 'complete',
    industry: ['all'],
    style: ['modern'],
    configuration: {
      name: 'Stand Îlot 360°',
      description: 'Configuration îlot pour maximum de visibilité',
      dimensions: { width: 6, depth: 6 },
      modules: [],
      backgroundColor: '#f5f5f5',
      floorMaterial: { type: 'color', value: '#e8e8e8' },
      style: 'modern'
    },
    tags: ['îlot', '360', 'grande surface', 'visibilité'],
    popularity: 90
  },
  {
    id: 'temp-006',
    name: 'Stand Minimaliste',
    description: 'Design épuré et minimaliste, focus sur le produit',
    thumbnailUrl: '/templates/minimal.jpg',
    category: 'complete',
    industry: ['design', 'art', 'luxury'],
    style: ['minimal'],
    configuration: {
      name: 'Stand Minimaliste',
      description: 'Configuration minimaliste et épurée',
      dimensions: { width: 3, depth: 3 },
      modules: [],
      backgroundColor: '#ffffff',
      floorMaterial: { type: 'color', value: '#f8f8f8' },
      style: 'minimal'
    },
    tags: ['minimaliste', 'épuré', 'simple', 'élégant'],
    popularity: 78
  }
];

export default function TemplateGallery() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const { loadConfiguration } = useStudioStore();

  const filteredTemplates = TEMPLATES.filter((template) => {
    const matchesSearch = !searchQuery || 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesIndustry = !selectedIndustry || 
      template.industry.includes(selectedIndustry) ||
      template.industry.includes('all');

    return matchesSearch && matchesIndustry;
  });

  const handleSelectTemplate = (template: ModuleTemplate) => {
    loadConfiguration(template.configuration);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b bg-white">
        <h2 className="text-2xl font-bold mb-2">Galerie de Templates</h2>
        <p className="text-gray-600 mb-4">
          Démarrez rapidement avec nos templates professionnels prédéfinis
        </p>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Rechercher un template..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Industry Filters */}
        <div className="flex gap-2 mt-4 flex-wrap">
          <Badge
            variant={selectedIndustry === null ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setSelectedIndustry(null)}
          >
            Tous
          </Badge>
          {['tech', 'luxury', 'eco', 'design'].map((industry) => (
            <Badge
              key={industry}
              variant={selectedIndustry === industry ? 'default' : 'outline'}
              className="cursor-pointer capitalize"
              onClick={() => setSelectedIndustry(industry)}
            >
              {industry}
            </Badge>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <ScrollArea className="flex-1">
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <Card
              key={template.id}
              className="group overflow-hidden hover:shadow-xl transition-all cursor-pointer"
              onClick={() => handleSelectTemplate(template)}
            >
              {/* Thumbnail */}
              <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-20">
                  🏗️
                </div>
                
                {/* Popularity Badge */}
                <div className="absolute top-2 right-2">
                  <Badge className="bg-white text-gray-900">
                    <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                    {template.popularity}
                  </Badge>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <Button className="w-full" variant="secondary">
                    Utiliser ce template
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1">{template.name}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {template.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {template.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Dimensions */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>
                    {template.configuration.dimensions.width}m x{' '}
                    {template.configuration.dimensions.depth}m
                  </span>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>Populaire</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-gray-500 mb-2">Aucun template trouvé</p>
              <Button variant="outline" size="sm" onClick={() => setSearchQuery('')}>
                Réinitialiser la recherche
              </Button>
            </div>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
