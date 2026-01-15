import { PlacedModule, StandConfiguration } from '@/types/modules';
import { getCertifiedMaterialById } from './materials';
import { DXFGenerator, downloadDXF } from './dxf-generator';

/**
 * Génère une nomenclature (Bill of Materials) détaillée incluant matériaux et logistique
 */
export const generateBOM = (config: StandConfiguration) => {
  const summary: Record<string, { 
    name: string; 
    count: number; 
    price: number; 
    total: number;
    weight: number;
    carbon: number;
    materialName: string;
    certification: string;
  }> = {};

  config.modules.forEach((module) => {
    const certifiedMat = module.material.type === 'certified' && module.material.certifiedMaterialId 
      ? getCertifiedMaterialById(module.material.certifiedMaterialId) 
      : null;

    if (!summary[module.id]) {
      summary[module.id] = {
        name: module.name,
        count: 0,
        price: module.price,
        total: 0,
        weight: 0,
        carbon: 0,
        materialName: certifiedMat?.name || 'Standard',
        certification: certifiedMat?.certification || 'N/A'
      };
    }

    // Calcul précis de la surface ou du volume selon le type de module
    let quantity = 0;
    if (module.category === 'wall' || module.category === 'flooring') {
      quantity = module.dimensions.width * (module.category === 'wall' ? module.dimensions.height : module.dimensions.depth);
    } else {
      // Pour le mobilier, on utilise une approximation de surface développée ou le poids fixe
      quantity = (module.dimensions.width * module.dimensions.height * 2) + (module.dimensions.depth * module.dimensions.height * 2);
    }
    
    summary[module.id].count += 1;
    summary[module.id].total += module.price + (certifiedMat ? certifiedMat.pricePerUnit * quantity : 0);
    summary[module.id].weight += (module.weight || 0) + (certifiedMat ? certifiedMat.density * quantity : 0);
    summary[module.id].carbon += certifiedMat ? certifiedMat.carbonFootprint * quantity : 0;
  });

  return Object.values(summary);
};

/**
 * Génère un fichier CSV pour la nomenclature avec données industrielles
 */
export const downloadBOMCSV = (config: StandConfiguration) => {
  const bom = generateBOM(config);
  let csvContent = "Nom;Quantite;Materiau;Certification;Poids Total (kg);Bilan Carbone (kgCO2e);Prix Unitaire;Total\n";
  
  let totalWeight = 0;
  let totalCarbon = 0;
  let totalPrice = 0;

  bom.forEach((item) => {
    csvContent += `${item.name};${item.count};${item.materialName};${item.certification};${item.weight.toFixed(2)};${item.carbon.toFixed(2)};${item.price}€;${item.total}€\n`;
    totalWeight += item.weight;
    totalCarbon += item.carbon;
    totalPrice += item.total;
  });

  csvContent += `\nTOTAL;;;;${totalWeight.toFixed(2)} kg;${totalCarbon.toFixed(2)} kgCO2e;;${totalPrice}€\n`;

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

    const certifiedMat = module.material.type === 'certified' && module.material.certifiedMaterialId 
      ? getCertifiedMaterialById(module.material.certifiedMaterialId) 
      : null;
    
    const thicknessLabel = certifiedMat?.thickness ? ` | Ep: ${certifiedMat.thickness}mm` : '';

    svgContent += `
      <g>
        <rect x="${x}" y="${z}" width="${w}" height="${d}" fill="rgba(59, 130, 246, 0.2)" stroke="blue" stroke-width="1" />
        <text x="${x + 5}" y="${z + 15}" font-size="10" fill="black">${module.name}</text>
        <text x="${x + 5}" y="${z + 25}" font-size="8" fill="gray">${module.dimensions.width}x${module.dimensions.depth}m${thicknessLabel}</text>
        ${certifiedMat ? `<text x="${x + 5}" y="${z + 35}" font-size="7" fill="green">${certifiedMat.certification}</text>` : ''}
      </g>
    `;
  });

  svgContent += `</svg>`;

  const blob = new Blob([svgContent], { type: 'image/svg+xml' });
  const link = document.createElement("a");
  const url = URL.createObjectURL(bl  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `CNC_Plan_${config.name.replace(/\s+/g, '_')}.svg`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Génère et télécharge un plan CNC au format DXF industriel avec calques
 */
export const downloadCNC_DXF = (config: StandConfiguration) => {
  const dxf = new DXFGenerator();
  
  config.modules.forEach((module) => {
    const certifiedMat = module.material.type === 'certified' && module.material.certifiedMaterialId 
      ? getCertifiedMaterialById(module.material.certifiedMaterialId) 
      : null;

    // Position relative au centre du stand
    const x = module.position.x;
    const y = module.position.z;
    const w = module.dimensions.width;
    const h = module.dimensions.depth;

    // Calque de découpe (CUT) - Couleur Rouge (1)
    dxf.addRect({
      x, y, width: w, height: h,
      layer: "CNC_CUT",
      color: 1
    });

    // Marquage d'identification (ID) - Couleur Verte (3)
    dxf.addText(x + 0.05, y + 0.05, `${module.name} [${module.instanceId.slice(0,4)}]`, "CNC_MARK", 0.05);
    
    // Information matériau - Couleur Bleue (5)
    if (certifiedMat) {
      dxf.addText(x + 0.05, y + 0.12, `${certifiedMat.name} (${certifiedMat.thickness}mm)`, "CNC_INFO", 0.03);
    }
  });

  const content = dxf.generate();
  downloadDXF(`CNC_Industrial_${config.name.replace(/\s+/g, '_')}.dxf`, content);
};
