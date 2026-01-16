import { StandConfiguration, PlacedModule } from '@/types/modules';
import { getCertifiedMaterialById } from '@/lib/3d/materials';

/**
 * Système d'exports professionnels
 * DXF pour fabrication CNC, BOM détaillée, nomenclature technique
 */

export interface BOMItem {
  id: string;
  reference: string;
  name: string;
  category: string;
  quantity: number;
  dimensions: {
    width: number;
    height: number;
    depth: number;
    unit: 'mm' | 'cm' | 'm';
  };
  material: string;
  weight: number; // kg
  surface: number; // m²
  volume: number; // m³
  unitPrice: number; // €
  totalPrice: number; // €
  supplier?: string;
  deliveryTime?: number; // jours
  certification?: string;
  carbonFootprint: number; // kg CO2e
}

export interface BillOfMaterials {
  projectName: string;
  date: Date;
  items: BOMItem[];
  summary: {
    totalModules: number;
    totalWeight: number; // kg
    totalSurface: number; // m²
    totalVolume: number; // m³
    totalPrice: number; // €
    totalCarbonFootprint: number; // kg CO2e
    byCategory: Record<string, {
      count: number;
      weight: number;
      price: number;
    }>;
  };
}

export interface DXFLayer {
  name: string;
  color: number;
  entities: DXFEntity[];
}

export interface DXFEntity {
  type: 'LINE' | 'POLYLINE' | 'CIRCLE' | 'ARC' | 'TEXT';
  points?: Array<{ x: number; y: number; z?: number }>;
  radius?: number;
  text?: string;
  layer: string;
}

export interface DXFDrawing {
  layers: DXFLayer[];
  bounds: {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
  };
  dxfContent: string;
}

/**
 * Générer une nomenclature (BOM) complète et détaillée
 */
export function generateBillOfMaterials(
  config: StandConfiguration
): BillOfMaterials {
  const items: BOMItem[] = [];
  const categoryStats: Record<string, { count: number; weight: number; price: number }> = {};

  // Regrouper les modules identiques
  const moduleGroups = new Map<string, { modules: PlacedModule[]; count: number }>();

  for (const module of config.modules) {
    const key = `${module.id}-${module.material.value}`;

    if (!moduleGroups.has(key)) {
      moduleGroups.set(key, { modules: [], count: 0 });
    }

    const group = moduleGroups.get(key)!;
    group.modules.push(module);
    group.count++;
  }

  // Créer les items BOM
  for (const [key, group] of Array.from(moduleGroups.entries())) {
    const module = group.modules[0];

    // Calculer dimensions en mm (standard fabrication)
    const dimMm = {
      width: module.dimensions.width * 1000,
      height: module.dimensions.height * 1000,
      depth: module.dimensions.depth * 1000,
    };

    // Calculer surface et volume
    const surface =
      2 * (dimMm.width * dimMm.height + dimMm.width * dimMm.depth + dimMm.height * dimMm.depth) /
      1000000; // m²

    const volume = (dimMm.width * dimMm.height * dimMm.depth) / 1000000000; // m³

    // Poids (estimation si non fourni)
    const weight = module.weight || estimateWeight(module);

    // Empreinte carbone
    let carbonFootprint = 0;

    if (module.material.type === 'certified' && module.material.certifiedMaterialId) {
      const certMaterial = getCertifiedMaterialById(module.material.certifiedMaterialId);
      if (certMaterial) {
        // Carbone = empreinte du matériau * surface
        carbonFootprint = certMaterial.carbonFootprint * surface;
      }
    } else {
      // Estimation par défaut
      carbonFootprint = estimateCarbonFootprint(module.category, weight);
    }

    const item: BOMItem = {
      id: module.id,
      reference: `${module.category.toUpperCase()}-${module.id}`,
      name: module.name,
      category: module.category,
      quantity: group.count,
      dimensions: {
        width: dimMm.width,
        height: dimMm.height,
        depth: dimMm.depth,
        unit: 'mm',
      },
      material: getMaterialDescription(module),
      weight: weight * group.count,
      surface: surface * group.count,
      volume: volume * group.count,
      unitPrice: module.price || 0,
      totalPrice: (module.price || 0) * group.count,
      carbonFootprint: carbonFootprint * group.count,
    };

    items.push(item);

    // Stats par catégorie
    if (!categoryStats[module.category]) {
      categoryStats[module.category] = { count: 0, weight: 0, price: 0 };
    }

    categoryStats[module.category].count += group.count;
    categoryStats[module.category].weight += item.weight;
    categoryStats[module.category].price += item.totalPrice;
  }

  // Calculer les totaux
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  const totalSurface = items.reduce((sum, item) => sum + item.surface, 0);
  const totalVolume = items.reduce((sum, item) => sum + item.volume, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const totalCarbonFootprint = items.reduce((sum, item) => sum + item.carbonFootprint, 0);
  const totalModules = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    projectName: config.name,
    date: new Date(),
    items: items.sort((a, b) => a.category.localeCompare(b.category)),
    summary: {
      totalModules,
      totalWeight,
      totalSurface,
      totalVolume,
      totalPrice,
      totalCarbonFootprint,
      byCategory: categoryStats,
    },
  };
}

/**
 * Estimer le poids d'un module
 */
function estimateWeight(module: PlacedModule): number {
  const volume = module.dimensions.width * module.dimensions.height * module.dimensions.depth;

  // Densités approximatives par catégorie (kg/m³)
  const densities: Record<string, number> = {
    structure: 2400, // Béton/métal
    wall: 800, // Panneaux légers
    furniture: 700, // Bois
    lighting: 200, // Aluminium + électronique
    multimedia: 150, // Plastique + électronique
    plv: 300, // Carton/plastique
    decoration: 500, // Mixte
    flooring: 1200, // Bois/composite
  };

  const density = densities[module.category] || 500;
  return volume * density;
}

/**
 * Estimer l'empreinte carbone
 */
function estimateCarbonFootprint(category: string, weight: number): number {
  // Empreintes approximatives (kg CO2e / kg de matériau)
  const carbonFactors: Record<string, number> = {
    structure: 0.15, // Béton
    wall: 0.8, // Panneaux bois
    furniture: 0.8, // Bois
    lighting: 5.0, // Aluminium
    multimedia: 3.0, // Électronique
    plv: 1.2, // Carton
    decoration: 2.0, // Mixte
    flooring: 0.9, // Bois composite
  };

  const factor = carbonFactors[category] || 1.5;
  return weight * factor;
}

/**
 * Obtenir la description du matériau
 */
function getMaterialDescription(module: PlacedModule): string {
  if (module.material.type === 'certified' && module.material.certifiedMaterialId) {
    const certMaterial = getCertifiedMaterialById(module.material.certifiedMaterialId);
    if (certMaterial) {
      return `${certMaterial.name} (${certMaterial.certification})`;
    }
  }

  // Descriptions par défaut
  const defaultMaterials: Record<string, string> = {
    structure: 'Béton armé',
    wall: 'Panneau MDF peint',
    furniture: 'Bois chêne massif',
    lighting: 'Aluminium anodisé',
    multimedia: 'ABS noir',
    plv: 'Carton alvéolaire',
    decoration: 'Résine peinte',
    flooring: 'Stratifié HPL',
  };

  return defaultMaterials[module.category] || 'Matériau standard';
}

/**
 * Générer un export DXF pour fabrication CNC
 */
export function generateDXFExport(
  config: StandConfiguration,
  view: 'top' | 'front' | 'side' = 'top'
): DXFDrawing {
  const layers: DXFLayer[] = [
    { name: 'STRUCTURE', color: 1, entities: [] },
    { name: 'WALLS', color: 2, entities: [] },
    { name: 'FURNITURE', color: 3, entities: [] },
    { name: 'DIMENSIONS', color: 7, entities: [] },
    { name: 'TEXT', color: 8, entities: [] },
  ];

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  // Générer les entités pour chaque module
  for (const module of config.modules) {
    const layerName = getLayerForCategory(module.category);
    const layer = layers.find((l) => l.name === layerName);

    if (!layer) continue;

    let x: number, y: number, width: number, height: number;

    // Projeter selon la vue
    switch (view) {
      case 'top':
        x = module.position.x - module.dimensions.width / 2;
        y = module.position.z - module.dimensions.depth / 2;
        width = module.dimensions.width;
        height = module.dimensions.depth;
        break;

      case 'front':
        x = module.position.x - module.dimensions.width / 2;
        y = module.position.y;
        width = module.dimensions.width;
        height = module.dimensions.height;
        break;

      case 'side':
        x = module.position.z - module.dimensions.depth / 2;
        y = module.position.y;
        width = module.dimensions.depth;
        height = module.dimensions.height;
        break;
    }

    // Convertir en mm (standard DXF)
    x *= 1000;
    y *= 1000;
    width *= 1000;
    height *= 1000;

    // Mettre à jour bounds
    minX = Math.min(minX, x);
    minY = Math.min(minY, y);
    maxX = Math.max(maxX, x + width);
    maxY = Math.max(maxY, y + height);

    // Rectangle (4 lignes)
    const corners = [
      { x, y },
      { x: x + width, y },
      { x: x + width, y: y + height },
      { x, y: y + height },
      { x, y }, // Fermer le rectangle
    ];

    for (let i = 0; i < corners.length - 1; i++) {
      layer.entities.push({
        type: 'LINE',
        points: [corners[i], corners[i + 1]],
        layer: layerName,
      });
    }

    // Texte avec nom du module
    const textLayer = layers.find((l) => l.name === 'TEXT')!;
    textLayer.entities.push({
      type: 'TEXT',
      text: module.name,
      points: [{ x: x + width / 2, y: y + height / 2 }],
      layer: 'TEXT',
    });
  }

  // Générer le contenu DXF
  const dxfContent = generateDXFContent(layers, { minX, minY, maxX, maxY });

  return {
    layers,
    bounds: { minX, minY, maxX, maxY },
    dxfContent,
  };
}

/**
 * Obtenir le layer DXF pour une catégorie
 */
function getLayerForCategory(category: string): string {
  const layerMap: Record<string, string> = {
    structure: 'STRUCTURE',
    wall: 'WALLS',
    furniture: 'FURNITURE',
    lighting: 'FURNITURE',
    multimedia: 'FURNITURE',
    plv: 'FURNITURE',
    decoration: 'FURNITURE',
    flooring: 'STRUCTURE',
  };

  return layerMap[category] || 'STRUCTURE';
}

/**
 * Générer le contenu DXF (format texte AutoCAD)
 */
function generateDXFContent(
  layers: DXFLayer[],
  bounds: { minX: number; minY: number; maxX: number; maxY: number }
): string {
  let dxf = '';

  // Header
  dxf += '0\nSECTION\n2\nHEADER\n';
  dxf += '9\n$ACADVER\n1\nAC1015\n'; // AutoCAD 2000
  dxf += '9\n$EXTMIN\n';
  dxf += `10\n${bounds.minX}\n20\n${bounds.minY}\n30\n0\n`;
  dxf += '9\n$EXTMAX\n';
  dxf += `10\n${bounds.maxX}\n20\n${bounds.maxY}\n30\n0\n`;
  dxf += '0\nENDSEC\n';

  // Tables (layers)
  dxf += '0\nSECTION\n2\nTABLES\n';
  dxf += '0\nTABLE\n2\nLAYER\n70\n' + layers.length + '\n';

  for (const layer of layers) {
    dxf += '0\nLAYER\n';
    dxf += `2\n${layer.name}\n`;
    dxf += '70\n0\n'; // Flags
    dxf += `62\n${layer.color}\n`; // Color
    dxf += '6\nCONTINUOUS\n'; // Linetype
  }

  dxf += '0\nENDTAB\n';
  dxf += '0\nENDSEC\n';

  // Entities
  dxf += '0\nSECTION\n2\nENTITIES\n';

  for (const layer of layers) {
    for (const entity of layer.entities) {
      switch (entity.type) {
        case 'LINE':
          if (entity.points && entity.points.length >= 2) {
            dxf += '0\nLINE\n';
            dxf += `8\n${entity.layer}\n`; // Layer
            dxf += `10\n${entity.points[0].x}\n`;
            dxf += `20\n${entity.points[0].y}\n`;
            dxf += `30\n0\n`;
            dxf += `11\n${entity.points[1].x}\n`;
            dxf += `21\n${entity.points[1].y}\n`;
            dxf += `31\n0\n`;
          }
          break;

        case 'TEXT':
          if (entity.points && entity.points.length > 0 && entity.text) {
            dxf += '0\nTEXT\n';
            dxf += `8\n${entity.layer}\n`;
            dxf += `10\n${entity.points[0].x}\n`;
            dxf += `20\n${entity.points[0].y}\n`;
            dxf += `30\n0\n`;
            dxf += '40\n100\n'; // Text height
            dxf += `1\n${entity.text}\n`;
          }
          break;

        case 'CIRCLE':
          if (entity.points && entity.points.length > 0 && entity.radius) {
            dxf += '0\nCIRCLE\n';
            dxf += `8\n${entity.layer}\n`;
            dxf += `10\n${entity.points[0].x}\n`;
            dxf += `20\n${entity.points[0].y}\n`;
            dxf += `30\n0\n`;
            dxf += `40\n${entity.radius}\n`;
          }
          break;
      }
    }
  }

  dxf += '0\nENDSEC\n';
  dxf += '0\nEOF\n';

  return dxf;
}

/**
 * Exporter la BOM en CSV
 */
export function exportBOMToCSV(bom: BillOfMaterials): string {
  let csv = 'Référence,Nom,Catégorie,Quantité,Largeur (mm),Hauteur (mm),Profondeur (mm),Matériau,Poids (kg),Surface (m²),Volume (m³),Prix Unitaire (€),Prix Total (€),Empreinte Carbone (kg CO2e)\n';

  for (const item of bom.items) {
    csv += `${item.reference},"${item.name}",${item.category},${item.quantity},${item.dimensions.width.toFixed(0)},${item.dimensions.height.toFixed(0)},${item.dimensions.depth.toFixed(0)},"${item.material}",${item.weight.toFixed(2)},${item.surface.toFixed(3)},${item.volume.toFixed(4)},${item.unitPrice.toFixed(2)},${item.totalPrice.toFixed(2)},${item.carbonFootprint.toFixed(2)}\n`;
  }

  // Ligne totale
  csv += `\nTOTAL,,${bom.summary.totalModules} modules,,,,,,${bom.summary.totalWeight.toFixed(2)},${bom.summary.totalSurface.toFixed(3)},${bom.summary.totalVolume.toFixed(4)},,${bom.summary.totalPrice.toFixed(2)},${bom.summary.totalCarbonFootprint.toFixed(2)}\n`;

  return csv;
}

/**
 * Télécharger un fichier
 */
export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
