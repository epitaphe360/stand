/**
 * Helper pour charger les modèles 3D depuis Supabase Storage
 */

import { supabase } from '@/lib/supabase';

const BUCKET_NAME = import.meta.env.VITE_SUPABASE_3D_MODELS_BUCKET || '3d-models';

/**
 * Obtenir l'URL publique d'un modèle 3D depuis Supabase Storage
 * @param category - Catégorie du modèle (structures, walls, furniture, etc.)
 * @param filename - Nom du fichier (ex: struct-001.glb)
 * @returns URL publique du modèle
 */
export function get3DModelUrl(category: string, filename: string): string {
  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(`${category}/${filename}`);

  return data.publicUrl;
}

/**
 * Précharger un modèle 3D (optionnel, pour cache navigateur)
 * @param url - URL du modèle à précharger
 */
export async function preload3DModel(url: string): Promise<void> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    if (!response.ok) {
      console.warn(`⚠️ Modèle non trouvé: ${url}`);
    }
  } catch (error) {
    console.error(`❌ Erreur préchargement: ${url}`, error);
  }
}

/**
 * Mapping des IDs de modules vers chemins Supabase
 *
 * ⚠️ Ce mapping sera généré automatiquement par le script d'upload
 * Après avoir exécuté `node scripts/upload-3d-models.js`,
 * copier le contenu de `module-3d-paths-generated.ts` ici
 */
export const MODULE_3D_PATHS: Record<string, { category: string; filename: string }> = {
  // TODO: Copier le contenu généré par scripts/upload-3d-models.js
  // Exemple:
  // 'struct-001': { category: 'structures', filename: 'struct-001.glb' },
  // 'struct-002': { category: 'structures', filename: 'struct-002.glb' },
  // ...
};

/**
 * Obtenir l'URL d'un module par son ID
 * @param moduleId - ID du module (ex: 'struct-001')
 * @returns URL publique du modèle, ou chaîne vide si non trouvé
 */
export function getModuleUrl(moduleId: string): string {
  const pathInfo = MODULE_3D_PATHS[moduleId];

  if (!pathInfo) {
    console.warn(`⚠️ Module inconnu: ${moduleId}`);
    // Fallback: essayer de deviner le chemin
    // Format attendu: category-number (ex: struct-001, furn-002)
    const [category, number] = moduleId.split('-');
    if (category && number) {
      const categoryMap: Record<string, string> = {
        'struct': 'structures',
        'wall': 'walls',
        'furn': 'furniture',
        'light': 'lighting',
        'multi': 'multimedia',
        'deco': 'decoration',
        'floor': 'floors',
        'plv': 'plv',
        'level': 'levels'
      };
      const fullCategory = categoryMap[category];
      if (fullCategory) {
        return get3DModelUrl(fullCategory, `${moduleId}.glb`);
      }
    }
    return '';
  }

  return get3DModelUrl(pathInfo.category, pathInfo.filename);
}

/**
 * Vérifier si un modèle existe sur Supabase
 * @param moduleId - ID du module à vérifier
 * @returns true si le modèle existe, false sinon
 */
export async function checkModelExists(moduleId: string): Promise<boolean> {
  const url = getModuleUrl(moduleId);
  if (!url) return false;

  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Lister tous les modèles disponibles sur Supabase (admin only)
 * Nécessite le service role key
 */
export async function listAllModels(): Promise<string[]> {
  try {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .list();

    if (error) {
      console.error('Erreur listing modèles:', error);
      return [];
    }

    return data?.map(file => file.name) || [];
  } catch (error) {
    console.error('Erreur listing:', error);
    return [];
  }
}
