/**
 * Utilitaire de génération de fichiers DXF (Drawing Exchange Format)
 * Format ASCII standard pour les machines CNC
 */

interface DXFPoint {
  x: number;
  y: number;
}

interface DXFEntity {
  layer: string;
  color: number; // DXF Color Index (1=Red, 3=Green, 5=Blue)
}

interface DXFRect extends DXFEntity {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class DXFGenerator {
  private content: string[] = [];

  constructor() {
    this.header();
  }

  private header() {
    this.content.push("  0\nSECTION\n  2\nHEADER\n  0\nENDSEC");
    this.content.push("  0\nSECTION\n  2\nTABLES\n  0\nENDSEC");
    this.content.push("  0\nSECTION\n  2\nBLOCKS\n  0\nENDSEC");
    this.content.push("  0\nSECTION\n  2\nENTITIES");
  }

  public addRect(rect: DXFRect) {
    const { x, y, width, height, layer, color } = rect;
    // Un rectangle en DXF est une polyligne fermée (LWPOLYLINE)
    this.content.push("  0\nLWPOLYLINE");
    this.content.push(`  8\n${layer}`); // Layer name
    this.content.push(` 62\n${color}`); // Color
    this.content.push(" 90\n  4"); // Number of vertices
    this.content.push(" 70\n  1"); // Closed polyline

    // Vertex 1
    this.content.push(` 10\n${x}\n 20\n${y}`);
    // Vertex 2
    this.content.push(` 10\n${x + width}\n 20\n${y}`);
    // Vertex 3
    this.content.push(` 10\n${x + width}\n 20\n${y + height}`);
    // Vertex 4
    this.content.push(` 10\n${x}\n 20\n${y + height}`);
  }

  public addText(x: number, y: number, text: string, layer: string, height: number = 0.1) {
    this.content.push("  0\nTEXT");
    this.content.push(`  8\n${layer}`);
    this.content.push(` 10\n${x}\n 20\n${y}\n 30\n0.0`); // Position
    this.content.push(` 40\n${height}`); // Text height
    this.content.push(`  1\n${text}`); // Text value
  }

  public generate(): string {
    this.content.push("  0\nENDSEC\n  0\nEOF");
    return this.content.join("\n");
  }
}

/**
 * Télécharge le fichier DXF généré
 */
export const downloadDXF = (filename: string, content: string) => {
  const blob = new Blob([content], { type: 'application/dxf' });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
