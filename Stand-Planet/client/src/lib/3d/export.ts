import { PlacedModule, StandConfiguration } from '@/types/modules';

/**
 * Génère une nomenclature (Bill of Materials) détaillée
 */
export const generateBOM = (config: StandConfiguration) => {
  const summary: Record<string, { name: string; count: number; price: number; total: number }> = {};

  config.modules.forEach((module) => {
    if (!summary[module.id]) {
      summary[module.id] = {
        name: module.name,
        count: 0,
        price: module.price,
        total: 0
      };
    }
    summary[module.id].count += 1;
    summary[module.id].total += module.price;
  });

  return Object.values(summary);
};

/**
 * Génère un fichier CSV pour la nomenclature
 */
export const downloadBOMCSV = (config: StandConfiguration) => {
  const bom = generateBOM(config);
  let csvContent = "ID;Nom;Quantité;Prix Unitaire;Total\n";
  
  bom.forEach((item) => {
    csvContent += `${item.name};${item.count};${item.price}€;${item.total}€\n`;
  });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `BOM_${config.name.replace(/\s+/g, '_')}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Génère un plan de fabrication simplifié (SVG) pour la découpe CNC (vue de dessus)
 */
export const downloadCNCPlanSVG = (config: StandConfiguration) => {
  const scale = 100; // 1m = 100px
  const padding = 50;
  const width = config.dimensions.width * scale + padding * 2;
  const depth = config.dimensions.depth * scale + padding * 2;

  let svgContent = `<svg width="${width}" height="${depth}" xmlns="http://www.w3.org/2000/svg">`;
  svgContent += `<rect width="100%" height="100%" fill="white" />`;
  
  // Dessiner le contour du stand
  svgContent += `<rect x="${padding}" y="${padding}" width="${config.dimensions.width * scale}" height="${config.dimensions.depth * scale}" fill="none" stroke="black" stroke-width="2" stroke-dasharray="5,5" />`;

  // Dessiner chaque module
  config.modules.forEach((module) => {
    const x = (module.position.x + config.dimensions.width / 2) * scale + padding - (module.dimensions.width / 2 * scale);
    const z = (module.position.z + config.dimensions.depth / 2) * scale + padding - (module.dimensions.depth / 2 * scale);
    const w = module.dimensions.width * scale;
    const d = module.dimensions.depth * scale;

    svgContent += `
      <g>
        <rect x="${x}" y="${z}" width="${w}" height="${d}" fill="rgba(59, 130, 246, 0.2)" stroke="blue" stroke-width="1" />
        <text x="${x + 5}" y="${z + 15}" font-size="10" fill="black">${module.name}</text>
        <text x="${x + 5}" y="${z + 25}" font-size="8" fill="gray">${module.dimensions.width}x${module.dimensions.depth}m</text>
      </g>
    `;
  });

  svgContent += `</svg>`;

  const blob = new Blob([svgContent], { type: 'image/svg+xml' });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `CNC_PLAN_${config.name.replace(/\s+/g, '_')}.svg`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
