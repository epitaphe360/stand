// Générateur de design basé sur IA
import { AIGenerationRequest, StandConfiguration, PlacedModule } from '@/types/modules';
import { getModuleById } from '@/lib/3d/modules';

// Interface pour la réponse de l'IA
interface AIDesignResponse {
  name: string;
  description: string;
  modules: Array<{
    moduleId: string;
    position: { x: number; y: number; z: number };
    rotation?: { x: number; y: number; z: number };
    customizations?: {
      color?: string;
      material?: string;
    };
  }>;
  explanation: string;
}

// Fonction pour générer un design à partir d'un prompt
export async function generateDesignFromPrompt(
  request: AIGenerationRequest,
  apiKey: string
): Promise<StandConfiguration[]> {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: getSystemPrompt()
          },
          {
            role: 'user',
            content: buildGenerationPrompt(request)
          }
        ],
        temperature: 0.8,
        max_tokens: 2000,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la génération du design');
    }

    const data = await response.json();
    const aiResponse: AIDesignResponse = JSON.parse(data.choices[0].message.content);

    // Convertir la réponse IA en configuration
    const configuration = convertAIResponseToConfiguration(aiResponse, request);
    
    // Générer 2 variations supplémentaires
    const variations = await generateVariations(configuration, apiKey);

    return [configuration, ...variations];
  } catch (error) {
    // Retourner un design par défaut en cas d'erreur
    if (process.env.NODE_ENV === 'development') {
      console.error('Erreur génération IA:', error);
    }
    return [getDefaultDesign(request)];
  }
}

// Convertir la réponse de l'IA en configuration complète
function convertAIResponseToConfiguration(
  aiResponse: AIDesignResponse,
  request: AIGenerationRequest
): StandConfiguration {
  const placedModules: PlacedModule[] = aiResponse.modules
    .map((moduleData, index) => {
      const module = getModuleById(moduleData.moduleId);
      if (!module) return null;

      const instanceId = `${module.id}-${Date.now()}-${index}`;
      
      return {
        ...module,
        instanceId,
        position: moduleData.position,
        rotation: moduleData.rotation || { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        material: moduleData.customizations?.color
          ? { type: 'color' as const, value: moduleData.customizations.color }
          : module.defaultMaterial,
        isSelected: false,
        isLocked: false
      };
    })
    .filter(Boolean) as PlacedModule[];

  return {
    name: aiResponse.name,
    description: aiResponse.description + '\n\n' + aiResponse.explanation,
    dimensions: request.dimensions || { width: 6, depth: 3 },
    modules: placedModules,
    backgroundColor: '#f5f5f5',
    floorMaterial: { type: 'color', value: '#e8e8e8' },
    style: request.style as any || 'modern',
    industry: request.industry,
    totalPrice: placedModules.reduce((sum, m) => sum + m.price, 0),
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

// Générer des variations du design
async function generateVariations(
  baseConfig: StandConfiguration,
  apiKey: string
): Promise<StandConfiguration[]> {
  // Variation 1: Version minimaliste (moins de modules)
  const variation1: StandConfiguration = {
    ...baseConfig,
    name: baseConfig.name + ' - Version Minimaliste',
    description: 'Version épurée et minimaliste du design',
    modules: baseConfig.modules.filter((_, index) => index % 2 === 0), // Garder 1 module sur 2
    backgroundColor: '#fafafa',
    floorMaterial: { type: 'color', value: '#ffffff' },
    style: 'minimal'
  };

  // Recalculer le prix
  variation1.totalPrice = variation1.modules.reduce((sum, m) => sum + m.price, 0);

  // Variation 2: Version enrichie (dupliquer certains éléments)
  const enrichedModules = [...baseConfig.modules];

  // Ajouter des modules de décoration supplémentaires
  const decoModule = baseConfig.modules.find(m => m.id.startsWith('deco-'));
  if (decoModule && baseConfig.dimensions) {
    const { width, depth } = baseConfig.dimensions;
    enrichedModules.push({
      ...decoModule,
      instanceId: `${decoModule.id}-enriched-${Date.now()}`,
      position: { x: -width/3, y: 0, z: depth/4 },
      rotation: { x: 0, y: Math.PI / 4, z: 0 }
    });
  }

  // Ajouter éclairage supplémentaire
  const lightModule = baseConfig.modules.find(m => m.id.startsWith('light-'));
  if (lightModule && baseConfig.dimensions) {
    enrichedModules.push({
      ...lightModule,
      instanceId: `${lightModule.id}-enriched-${Date.now()}`,
      position: { x: 0, y: 2.8, z: 0 }
    });
  }

  const variation2: StandConfiguration = {
    ...baseConfig,
    name: baseConfig.name + ' - Version Premium',
    description: 'Version enrichie avec éclairage et décoration supplémentaires',
    modules: enrichedModules,
    backgroundColor: '#f0f0f0',
    style: 'luxury'
  };

  // Recalculer le prix
  variation2.totalPrice = variation2.modules.reduce((sum, m) => sum + m.price, 0);

  return [variation1, variation2];
}

// Design par défaut si l'IA échoue
function getDefaultDesign(request: AIGenerationRequest): StandConfiguration {
  const dimensions = request.dimensions || { width: 6, depth: 3 };
  const { width, depth } = dimensions;

  // Créer une configuration de base fonctionnelle avec des modules réels
  const placedModules: PlacedModule[] = [];

  // Structure de base
  const baseModule = getModuleById('struct-002');
  if (baseModule) {
    placedModules.push({
      ...baseModule,
      instanceId: `struct-002-${Date.now()}-0`,
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
      material: baseModule.defaultMaterial,
      isSelected: false,
      isLocked: false
    });
  }

  // Mur arrière
  const wallModule = getModuleById('wall-001');
  if (wallModule) {
    placedModules.push({
      ...wallModule,
      instanceId: `wall-001-${Date.now()}-1`,
      position: { x: 0, y: 0, z: -depth/2 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
      material: { type: 'color', value: '#ffffff' },
      isSelected: false,
      isLocked: false
    });
  }

  // Comptoir d'accueil
  const counterModule = getModuleById('furn-001');
  if (counterModule) {
    placedModules.push({
      ...counterModule,
      instanceId: `furn-001-${Date.now()}-2`,
      position: { x: -width/4, y: 0, z: depth/4 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
      material: counterModule.defaultMaterial,
      isSelected: false,
      isLocked: false
    });
  }

  // Éclairage spots
  const lightModule = getModuleById('light-001');
  if (lightModule) {
    // Spot 1
    placedModules.push({
      ...lightModule,
      instanceId: `light-001-${Date.now()}-3`,
      position: { x: -width/3, y: 2.5, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
      material: lightModule.defaultMaterial,
      isSelected: false,
      isLocked: false
    });

    // Spot 2
    placedModules.push({
      ...lightModule,
      instanceId: `light-001-${Date.now()}-4`,
      position: { x: width/3, y: 2.5, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
      material: lightModule.defaultMaterial,
      isSelected: false,
      isLocked: false
    });
  }

  // Plante décorative
  const plantModule = getModuleById('deco-006');
  if (plantModule) {
    placedModules.push({
      ...plantModule,
      instanceId: `deco-006-${Date.now()}-5`,
      position: { x: width/3, y: 0, z: -depth/3 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
      material: plantModule.defaultMaterial,
      isSelected: false,
      isLocked: false
    });
  }

  const totalPrice = placedModules.reduce((sum, m) => sum + m.price, 0);

  return {
    name: 'Stand Standard',
    description: 'Configuration de base professionnelle avec structure, comptoir d\'accueil, éclairage et décoration. Un excellent point de départ pour votre stand.',
    dimensions,
    modules: placedModules,
    backgroundColor: '#f5f5f5',
    floorMaterial: { type: 'color', value: '#e8e8e8' },
    style: request.style as any || 'modern',
    industry: request.industry,
    totalPrice,
    createdAt: new Date(),
    updatedAt: new Date()
  };
}

// Prompt système pour l'IA
function getSystemPrompt(): string {
  return `Tu es un assistant IA expert en conception de stands d'exposition de classe mondiale.
  
Tu dois créer des configurations optimisées en tenant compte de :
- L'ergonomie et le flux de visiteurs (zones d'accueil, démo, VIP)
- L'esthétique et la cohérence du design (moderne, luxe, industriel, éco-responsable)
- Le budget et les contraintes techniques (dimensions, poids, empilage)
- Les besoins spécifiques du secteur (Tech, Luxe, Écologie, Industrie)
- L'éco-responsabilité : privilégie les matériaux naturels et les structures réutilisables si demandé.
  
Réponds TOUJOURS au format JSON valide avec la structure exacte demandée.`;
}

// Construire le prompt de génération
function buildGenerationPrompt(request: AIGenerationRequest): string {
  const { prompt, dimensions, budget, industry, style, requirements } = request;

  return `Génère une configuration de stand d'exposition professionnelle.

**Demande client :** ${prompt}
${industry ? `**Secteur :** ${industry}` : ''}
${dimensions ? `**Dimensions :** ${dimensions.width}m x ${dimensions.depth}m` : ''}
${budget ? `**Budget maximum :** ${budget}€` : ''}
${style ? `**Style souhaité :** ${style}` : ''}
${requirements && requirements.length > 0 ? `**Exigences :** ${requirements.join(', ')}` : ''}

**Modules disponibles :**
- struct-001 à 004 : Structures de base (3x3m, 6x3m, 9x3m, îlot 6x6m)
- wall-001 à 004 : Murs (plein, vitré, LED, courbe)
- furn-001 à 006 : Mobilier (comptoir, vitrine, tables, canapés, étagères)
- light-001 à 004 : Éclairage (spots, bandeaux LED, suspensions)
- multi-001 à 005 : Multimédia (écrans, bornes tactiles, audio)
- deco-001 à 005 : Décoration (plantes, kakémonos, tapis, art)
- floor-001 à 003 : Revêtements de sol

Réponds au format JSON :
{
  "name": "Nom attractif du stand",
  "description": "Description courte (2-3 lignes)",
  "modules": [
    {
      "moduleId": "id-du-module",
      "position": {"x": 0, "y": 0, "z": 0},
      "rotation": {"x": 0, "y": 0, "z": 0},
      "customizations": {"color": "#hexcolor"}
    }
  ],
  "explanation": "Explication détaillée des choix de design (3-4 lignes)"
}

Place les modules de manière logique :
- Structure en premier (y=0)
- Murs sur les bords si nécessaire
- Mobilier au centre de manière ergonomique
- Éclairage en hauteur (y=2.5+)
- Décoration pour compléter

Respecte les dimensions du stand et crée un design professionnel et attractif.`;
}

// Suggestions rapides prédéfinies
export const quickSuggestions = {
  'tech-moderne': {
    prompt: 'Stand moderne pour entreprise technologique avec écrans LED, éclairage dynamique et design épuré',
    industry: 'tech',
    style: 'modern',
    requirements: ['Écrans LED', 'Espace démonstration', 'Borne tactile']
  },
  'luxe': {
    prompt: 'Stand luxueux haut de gamme avec matériaux nobles et ambiance premium',
    industry: 'luxury',
    style: 'luxury',
    requirements: ['Mobilier design', 'Éclairage d\'ambiance', 'Espace VIP']
  },
  'eco': {
    prompt: 'Stand écologique et naturel avec matériaux durables et plantes',
    industry: 'eco',
    style: 'minimal',
    requirements: ['Matériaux naturels', 'Plantes', 'Éclairage doux']
  },
  'interactif': {
    prompt: 'Stand interactif avec zones de démonstration et expériences immersives',
    industry: 'general',
    style: 'creative',
    requirements: ['Bornes tactiles', 'Écrans multiples', 'Espace démo']
  }
};
