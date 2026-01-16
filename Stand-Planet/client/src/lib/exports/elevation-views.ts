import { PlacedModule, StandConfiguration } from '@/types/modules';
import * as THREE from 'three';

/**
 * Système de génération automatique des vues d'élévation
 * Génère les 4 vues (Face, Dos, Gauche, Droite) + Vue de dessus
 */

export type ElevationView = 'front' | 'back' | 'left' | 'right' | 'top' | 'perspective';

export interface ElevationViewport {
  camera: THREE.OrthographicCamera | THREE.PerspectiveCamera;
  position: THREE.Vector3;
  target: THREE.Vector3;
  up: THREE.Vector3;
}

export interface DimensionLine {
  start: { x: number; y: number };
  end: { x: number; y: number };
  value: number;
  label: string;
  axis: 'horizontal' | 'vertical';
}

export interface ElevationDrawing {
  view: ElevationView;
  viewport: ElevationViewport;
  dimensions: DimensionLine[];
  modules: PlacedModule[];
  svgContent: string;
  width: number;
  height: number;
}

/**
 * Configurer la caméra pour une vue d'élévation spécifique
 */
export function setupElevationCamera(
  view: ElevationView,
  standWidth: number,
  standDepth: number,
  standHeight: number
): ElevationViewport {
  const centerX = standWidth / 2;
  const centerZ = standDepth / 2;
  const centerY = standHeight / 2;

  const maxDimension = Math.max(standWidth, standDepth, standHeight);
  const distance = maxDimension * 2;

  let position: THREE.Vector3;
  let target: THREE.Vector3;
  let up: THREE.Vector3;

  switch (view) {
    case 'front':
      // Vue de face (depuis le sud, regardant vers le nord)
      position = new THREE.Vector3(centerX, centerY, -distance);
      target = new THREE.Vector3(centerX, centerY, centerZ);
      up = new THREE.Vector3(0, 1, 0);
      break;

    case 'back':
      // Vue de dos (depuis le nord, regardant vers le sud)
      position = new THREE.Vector3(centerX, centerY, standDepth + distance);
      target = new THREE.Vector3(centerX, centerY, centerZ);
      up = new THREE.Vector3(0, 1, 0);
      break;

    case 'left':
      // Vue de gauche (depuis l'ouest, regardant vers l'est)
      position = new THREE.Vector3(-distance, centerY, centerZ);
      target = new THREE.Vector3(centerX, centerY, centerZ);
      up = new THREE.Vector3(0, 1, 0);
      break;

    case 'right':
      // Vue de droite (depuis l'est, regardant vers l'ouest)
      position = new THREE.Vector3(standWidth + distance, centerY, centerZ);
      target = new THREE.Vector3(centerX, centerY, centerZ);
      up = new THREE.Vector3(0, 1, 0);
      break;

    case 'top':
      // Vue de dessus
      position = new THREE.Vector3(centerX, standHeight + distance, centerZ);
      target = new THREE.Vector3(centerX, 0, centerZ);
      up = new THREE.Vector3(0, 0, -1); // Z pointe vers le haut dans cette vue
      break;

    case 'perspective':
      // Vue perspective isométrique
      position = new THREE.Vector3(
        centerX + distance * 0.7,
        standHeight + distance * 0.5,
        centerZ + distance * 0.7
      );
      target = new THREE.Vector3(centerX, centerY, centerZ);
      up = new THREE.Vector3(0, 1, 0);
      break;

    default:
      position = new THREE.Vector3(centerX, centerY, -distance);
      target = new THREE.Vector3(centerX, centerY, centerZ);
      up = new THREE.Vector3(0, 1, 0);
  }

  // Créer la caméra orthographique pour les vues techniques
  const aspect = 1.0;
  const frustumSize = maxDimension * 1.5;

  const camera = new THREE.OrthographicCamera(
    (frustumSize * aspect) / -2,
    (frustumSize * aspect) / 2,
    frustumSize / 2,
    frustumSize / -2,
    0.1,
    distance * 3
  );

  camera.position.copy(position);
  camera.lookAt(target);
  camera.up.copy(up);

  return {
    camera,
    position,
    target,
    up,
  };
}

/**
 * Calculer les lignes de cote automatiquement pour une vue
 */
export function generateDimensionLines(
  modules: PlacedModule[],
  view: ElevationView,
  standWidth: number,
  standDepth: number,
  standHeight: number
): DimensionLine[] {
  const dimensions: DimensionLine[] = [];

  switch (view) {
    case 'front':
    case 'back':
      // Dimensions horizontales et verticales
      dimensions.push({
        start: { x: 0, y: -0.5 },
        end: { x: standWidth, y: -0.5 },
        value: standWidth,
        label: `${(standWidth * 100).toFixed(0)} cm`,
        axis: 'horizontal',
      });

      dimensions.push({
        start: { x: -0.5, y: 0 },
        end: { x: -0.5, y: standHeight },
        value: standHeight,
        label: `${(standHeight * 100).toFixed(0)} cm`,
        axis: 'vertical',
      });
      break;

    case 'left':
    case 'right':
      dimensions.push({
        start: { x: 0, y: -0.5 },
        end: { x: standDepth, y: -0.5 },
        value: standDepth,
        label: `${(standDepth * 100).toFixed(0)} cm`,
        axis: 'horizontal',
      });

      dimensions.push({
        start: { x: -0.5, y: 0 },
        end: { x: -0.5, y: standHeight },
        value: standHeight,
        label: `${(standHeight * 100).toFixed(0)} cm`,
        axis: 'vertical',
      });
      break;

    case 'top':
      dimensions.push({
        start: { x: 0, y: -0.5 },
        end: { x: standWidth, y: -0.5 },
        value: standWidth,
        label: `${(standWidth * 100).toFixed(0)} cm`,
        axis: 'horizontal',
      });

      dimensions.push({
        start: { x: -0.5, y: 0 },
        end: { x: -0.5, y: standDepth },
        value: standDepth,
        label: `${(standDepth * 100).toFixed(0)} cm`,
        axis: 'vertical',
      });
      break;
  }

  // Ajouter les cotes des modules individuels
  for (const module of modules) {
    if (view === 'front' || view === 'back') {
      // Cote de largeur du module
      const startX = module.position.x - module.dimensions.width / 2;
      const endX = module.position.x + module.dimensions.width / 2;
      const y = module.position.y + module.dimensions.height + 0.2;

      dimensions.push({
        start: { x: startX, y },
        end: { x: endX, y },
        value: module.dimensions.width,
        label: `${(module.dimensions.width * 100).toFixed(0)}`,
        axis: 'horizontal',
      });

      // Cote de hauteur du module
      const x = module.position.x + module.dimensions.width / 2 + 0.2;
      const startY = module.position.y;
      const endY = module.position.y + module.dimensions.height;

      dimensions.push({
        start: { x, y: startY },
        end: { x, y: endY },
        value: module.dimensions.height,
        label: `${(module.dimensions.height * 100).toFixed(0)}`,
        axis: 'vertical',
      });
    }
  }

  return dimensions;
}

/**
 * Générer un SVG pour une vue d'élévation
 */
export function generateElevationSVG(
  modules: PlacedModule[],
  view: ElevationView,
  standWidth: number,
  standDepth: number,
  standHeight: number,
  options: {
    showDimensions?: boolean;
    showGrid?: boolean;
    scale?: number;
    strokeWidth?: number;
  } = {}
): string {
  const {
    showDimensions = true,
    showGrid = true,
    scale = 100, // 100 pixels par mètre
    strokeWidth = 1,
  } = options;

  let viewWidth: number;
  let viewHeight: number;

  // Déterminer les dimensions de la vue
  switch (view) {
    case 'front':
    case 'back':
      viewWidth = standWidth;
      viewHeight = standHeight;
      break;
    case 'left':
    case 'right':
      viewWidth = standDepth;
      viewHeight = standHeight;
      break;
    case 'top':
      viewWidth = standWidth;
      viewHeight = standDepth;
      break;
    default:
      viewWidth = standWidth;
      viewHeight = standHeight;
  }

  const svgWidth = viewWidth * scale + 200; // Marge pour les cotes
  const svgHeight = viewHeight * scale + 200;

  let svgContent = `<svg width="${svgWidth}" height="${svgHeight}" xmlns="http://www.w3.org/2000/svg">`;

  // Définir les styles
  svgContent += `
    <defs>
      <style>
        .module-outline { fill: none; stroke: #000; stroke-width: ${strokeWidth}; }
        .module-fill { fill: #f0f0f0; stroke: #000; stroke-width: ${strokeWidth}; opacity: 0.8; }
        .dimension-line { stroke: #0066cc; stroke-width: 0.5; fill: none; }
        .dimension-text { font-family: Arial, sans-serif; font-size: 10px; fill: #0066cc; }
        .grid-line { stroke: #ddd; stroke-width: 0.5; }
        .axis-line { stroke: #666; stroke-width: 1; }
        .label { font-family: Arial, sans-serif; font-size: 12px; fill: #333; }
      </style>
    </defs>
  `;

  // Groupe principal avec transformation (origine en bas à gauche)
  const offsetX = 100;
  const offsetY = svgHeight - 100;

  svgContent += `<g transform="translate(${offsetX}, ${offsetY}) scale(1, -1)">`;

  // Grille de fond
  if (showGrid) {
    const gridStep = 1; // 1 mètre
    for (let x = 0; x <= viewWidth; x += gridStep) {
      svgContent += `<line x1="${x * scale}" y1="0" x2="${x * scale}" y2="${
        viewHeight * scale
      }" class="grid-line" />`;
    }
    for (let y = 0; y <= viewHeight; y += gridStep) {
      svgContent += `<line x1="0" y1="${y * scale}" x2="${
        viewWidth * scale
      }" y2="${y * scale}" class="grid-line" />`;
    }
  }

  // Axes de référence
  svgContent += `<line x1="0" y1="0" x2="${
    viewWidth * scale
  }" y2="0" class="axis-line" />`;
  svgContent += `<line x1="0" y1="0" x2="0" y2="${
    viewHeight * scale
  }" class="axis-line" />`;

  // Dessiner les modules
  for (const module of modules) {
    let x: number, y: number, width: number, height: number;

    switch (view) {
      case 'front':
      case 'back':
        x = (module.position.x - module.dimensions.width / 2) * scale;
        y = module.position.y * scale;
        width = module.dimensions.width * scale;
        height = module.dimensions.height * scale;
        break;

      case 'left':
      case 'right':
        x = (module.position.z - module.dimensions.depth / 2) * scale;
        y = module.position.y * scale;
        width = module.dimensions.depth * scale;
        height = module.dimensions.height * scale;
        break;

      case 'top':
        x = (module.position.x - module.dimensions.width / 2) * scale;
        y = (module.position.z - module.dimensions.depth / 2) * scale;
        width = module.dimensions.width * scale;
        height = module.dimensions.depth * scale;
        break;

      default:
        continue;
    }

    // Rectangle du module
    svgContent += `<rect x="${x}" y="${y}" width="${width}" height="${height}" class="module-fill" />`;

    // Label du module (inversé pour SVG)
    const labelX = x + width / 2;
    const labelY = y + height / 2;
    svgContent += `<text x="${labelX}" y="${labelY}" class="label" transform="scale(1, -1) translate(0, ${
      -2 * labelY
    })" text-anchor="middle">${module.name}</text>`;
  }

  svgContent += `</g>`; // Fin du groupe principal

  // Lignes de cote (hors transformation)
  if (showDimensions) {
    const dimensions = generateDimensionLines(
      modules,
      view,
      standWidth,
      standDepth,
      standHeight
    );

    for (const dim of dimensions) {
      const x1 = offsetX + dim.start.x * scale;
      const y1 = offsetY - dim.start.y * scale;
      const x2 = offsetX + dim.end.x * scale;
      const y2 = offsetY - dim.end.y * scale;

      // Ligne de cote
      svgContent += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="dimension-line" />`;

      // Flèches
      const arrowSize = 5;
      if (dim.axis === 'horizontal') {
        svgContent += `<polygon points="${x1},${y1} ${x1 + arrowSize},${
          y1 - arrowSize / 2
        } ${x1 + arrowSize},${y1 + arrowSize / 2}" fill="#0066cc" />`;
        svgContent += `<polygon points="${x2},${y2} ${x2 - arrowSize},${
          y2 - arrowSize / 2
        } ${x2 - arrowSize},${y2 + arrowSize / 2}" fill="#0066cc" />`;
      } else {
        svgContent += `<polygon points="${x1},${y1} ${x1 - arrowSize / 2},${
          y1 + arrowSize
        } ${x1 + arrowSize / 2},${y1 + arrowSize}" fill="#0066cc" />`;
        svgContent += `<polygon points="${x2},${y2} ${x2 - arrowSize / 2},${
          y2 - arrowSize
        } ${x2 + arrowSize / 2},${y2 - arrowSize}" fill="#0066cc" />`;
      }

      // Texte de cote
      const textX = (x1 + x2) / 2;
      const textY = (y1 + y2) / 2;
      svgContent += `<text x="${textX}" y="${textY}" class="dimension-text" text-anchor="middle">${dim.label}</text>`;
    }
  }

  // Titre de la vue
  const viewTitles: Record<ElevationView, string> = {
    front: 'VUE DE FACE',
    back: 'VUE DE DOS',
    left: 'VUE DE GAUCHE',
    right: 'VUE DE DROITE',
    top: 'VUE DE DESSUS',
    perspective: 'VUE PERSPECTIVE',
  };

  svgContent += `<text x="${svgWidth / 2}" y="30" style="font-family: Arial, sans-serif; font-size: 16px; font-weight: bold; fill: #000; text-anchor: middle;">${
    viewTitles[view]
  }</text>`;

  svgContent += `</svg>`;

  return svgContent;
}

/**
 * Générer toutes les vues d'élévation pour un stand
 */
export function generateAllElevationViews(
  configuration: StandConfiguration,
  options?: {
    showDimensions?: boolean;
    showGrid?: boolean;
    scale?: number;
  }
): Record<ElevationView, string> {
  const standWidth = configuration.dimensions.width;
  const standDepth = configuration.dimensions.depth;

  // Calculer la hauteur maximale
  const standHeight =
    Math.max(...configuration.modules.map((m) => m.position.y + m.dimensions.height)) ||
    3;

  const views: ElevationView[] = ['front', 'back', 'left', 'right', 'top'];
  const result: Record<string, string> = {};

  for (const view of views) {
    result[view] = generateElevationSVG(
      configuration.modules,
      view,
      standWidth,
      standDepth,
      standHeight,
      options
    );
  }

  return result as Record<ElevationView, string>;
}

/**
 * Exporter les vues en PDF (nécessite jsPDF)
 */
export async function exportElevationsToPDF(
  configuration: StandConfiguration,
  filename: string = 'elevations.pdf'
): Promise<void> {
  // Cette fonction nécessiterait jsPDF et svg2pdf.js
  // Pour l'instant, on retourne les SVG
  const views = generateAllElevationViews(configuration);

  // Dans une implémentation complète, on utiliserait jsPDF:
  // const { jsPDF } = await import('jspdf');
  // const pdf = new jsPDF('landscape', 'mm', 'a4');
  // ... ajouter chaque vue SVG au PDF
  // pdf.save(filename);

  console.log('Export PDF prévu - nécessite jsPDF');
  return Promise.resolve();
}
