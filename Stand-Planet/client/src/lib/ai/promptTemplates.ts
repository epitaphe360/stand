// Templates de prompts pour l'IA
export const SYSTEM_PROMPT = `Tu es un assistant IA spécialisé dans la conception de stands d'exposition. 
Tu aides les clients à créer des stands professionnels en comprenant leurs besoins et en générant des configurations 3D optimisées.

Ton rôle :
- Comprendre le secteur d'activité, le budget, les dimensions souhaitées
- Suggérer des designs adaptés et modernes
- Proposer des modules pertinents (mobilier, éclairage, multimédia)
- Optimiser l'espace et le flux de visiteurs
- Respecter les contraintes techniques et budgétaires

Réponds de manière concise et professionnelle en français.`;

export const GENERATION_PROMPT_TEMPLATE = (
  industry: string,
  dimensions: string,
  budget: number | null,
  style: string,
  requirements: string[]
) => `
Génère une configuration de stand d'exposition avec les critères suivants :

**Secteur :** ${industry}
**Dimensions :** ${dimensions}
**Budget :** ${budget ? `${budget}€` : 'Non spécifié'}
**Style :** ${style}
**Exigences spécifiques :** ${requirements.length > 0 ? requirements.join(', ') : 'Aucune'}

Fournis une réponse structurée au format JSON avec :
{
  "name": "Nom du stand",
  "description": "Description courte",
  "modules": [
    {
      "moduleId": "ID du module à utiliser",
      "position": {"x": 0, "y": 0, "z": 0},
      "rotation": {"x": 0, "y": 0, "z": 0},
      "customizations": {
        "color": "#hexcolor" (optionnel),
        "material": "nom_materiau" (optionnel)
      }
    }
  ],
  "explanation": "Explication des choix de design"
}

Modules disponibles :
- Structures : struct-001 (3x3m), struct-002 (6x3m), struct-003 (9x3m), struct-004 (6x6m îlot)
- Murs : wall-001 (plein blanc), wall-002 (vitré), wall-003 (LED), wall-004 (courbe)
- Mobilier : furn-001 (comptoir), furn-002 (vitrine), furn-003 (table bar), furn-004 (canapé), furn-005 (étagère), furn-006 (tabouret)
- Éclairage : light-001 (spot LED), light-002 (bandeau LED), light-003 (suspension), light-004 (projecteur sol)
- Multimédia : multi-001 (écran 55"), multi-002 (écran 85"), multi-003 (borne tactile), multi-004 (projecteur), multi-005 (audio)
- Décoration : deco-001 (plante haute), deco-002 (kakémono), deco-003 (tapis), deco-004 (œuvre d'art), deco-005 (sculpture)
- Sol : floor-001 (moquette grise), floor-002 (parquet bois), floor-003 (carrelage blanc)

Place les modules de manière logique et esthétique en respectant les dimensions du stand.
`;

export const QUICK_SUGGESTIONS_PROMPTS = {
  modern_tech: "Crée un stand moderne pour une entreprise tech, avec écrans LED, éclairage dynamique et design épuré",
  luxury: "Design un stand luxueux avec matériaux nobles, éclairage d'ambiance et espaces VIP",
  eco_friendly: "Propose un stand écologique avec matériaux naturels, plantes et ambiance zen",
  interactive: "Conçois un stand interactif avec bornes tactiles, zones de démonstration et espaces participatifs",
  minimalist: "Crée un stand minimaliste épuré avec lignes pures et focus sur le produit"
};

export const REFINEMENT_PROMPT = (currentConfig: string, userFeedback: string) => `
Configuration actuelle du stand :
${currentConfig}

Feedback du client :
${userFeedback}

Modifie la configuration en tenant compte du feedback. Réponds au format JSON avec les changements à apporter.
`;

export const STYLE_ANALYSIS_PROMPT = (imageDescription: string) => `
Analyse cette description d'image de stand :
${imageDescription}

Identifie :
- Le style général (moderne, classique, industriel, etc.)
- Les couleurs dominantes
- Les matériaux visibles
- L'ambiance générale

Suggère des modules pour recréer ce style.
`;
