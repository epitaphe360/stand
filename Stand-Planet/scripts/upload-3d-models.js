#!/usr/bin/env node
/**
 * Script d'upload des modèles 3D vers Supabase Storage
 * Usage: node scripts/upload-3d-models.js
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration Supabase
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET_NAME = process.env.VITE_SUPABASE_3D_MODELS_BUCKET || '3d-models';

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Variables d\'environnement manquantes!');
  console.error('   Créez un fichier .env avec:');
  console.error('   VITE_SUPABASE_URL=https://xxxxx.supabase.co');
  console.error('   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...');
  process.exit(1);
}

// Initialiser client Supabase (avec service role key pour upload)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Dossier local contenant les modèles téléchargés
const MODELS_DIR = path.join(__dirname, '../temp-models');

// Mapping catégories → dossiers Supabase
const CATEGORIES = {
  'structures': 'structures',
  'walls': 'walls',
  'furniture': 'furniture',
  'lighting': 'lighting',
  'multimedia': 'multimedia',
  'decoration': 'decoration',
  'floors': 'floors',
  'plv': 'plv',
  'levels': 'levels'
};

/**
 * Upload un fichier GLB vers Supabase Storage
 */
async function uploadModel(localPath, remotePath) {
  try {
    const fileBuffer = fs.readFileSync(localPath);
    const stats = fs.statSync(localPath);
    const sizeKB = (stats.size / 1024).toFixed(2);

    console.log(`📤 Upload: ${remotePath} (${sizeKB} KB)...`);

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(remotePath, fileBuffer, {
        contentType: 'model/gltf-binary',
        cacheControl: '3600', // Cache 1 heure
        upsert: true // Écraser si existe déjà
      });

    if (error) {
      throw error;
    }

    console.log(`   ✅ ${remotePath} uploadé`);
    return { success: true, data };
  } catch (error) {
    console.error(`   ❌ Erreur upload ${remotePath}:`, error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Obtenir l'URL publique d'un fichier
 */
function getPublicUrl(filePath) {
  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);

  return data.publicUrl;
}

/**
 * Upload tous les modèles d'une catégorie
 */
async function uploadCategory(category, folderName) {
  const categoryDir = path.join(MODELS_DIR, category);

  if (!fs.existsSync(categoryDir)) {
    console.log(`⚠️  Dossier ${category} non trouvé, skip`);
    return [];
  }

  const files = fs.readdirSync(categoryDir)
    .filter(f => f.endsWith('.glb') || f.endsWith('.gltf'));

  if (files.length === 0) {
    console.log(`⚠️  Aucun fichier .glb/.gltf dans ${category}`);
    return [];
  }

  console.log(`\n📁 Catégorie: ${category} (${files.length} fichiers)`);

  const results = [];

  for (const file of files) {
    const localPath = path.join(categoryDir, file);
    const remotePath = `${folderName}/${file}`;

    const uploadResult = await uploadModel(localPath, remotePath);

    if (uploadResult.success) {
      const publicUrl = getPublicUrl(remotePath);

      results.push({
        file,
        remotePath,
        publicUrl,
        success: true
      });
    } else {
      results.push({
        file,
        remotePath,
        error: uploadResult.error,
        success: false
      });
    }
  }

  return results;
}

/**
 * Générer le code TypeScript pour MODULE_3D_PATHS
 */
function generateModulePaths(allResults) {
  let code = 'export const MODULE_3D_PATHS: Record<string, { category: string; filename: string }> = {\n';

  for (const [category, results] of Object.entries(allResults)) {
    if (results.length === 0) continue;

    code += `  // ${category.charAt(0).toUpperCase() + category.slice(1)}\n`;

    results.forEach(r => {
      if (r.success) {
        const moduleId = r.file.replace('.glb', '').replace('.gltf', '');
        code += `  '${moduleId}': { category: '${category}', filename: '${r.file}' },\n`;
      }
    });

    code += '\n';
  }

  code += '};\n';
  return code;
}

/**
 * Main: Upload tous les modèles
 */
async function main() {
  console.log('🚀 Début upload des modèles 3D vers Supabase Storage\n');
  console.log(`📍 Bucket: ${BUCKET_NAME}`);
  console.log(`📂 Source: ${MODELS_DIR}\n`);

  // Vérifier que le dossier temp-models existe
  if (!fs.existsSync(MODELS_DIR)) {
    console.error(`❌ Dossier ${MODELS_DIR} non trouvé!`);
    console.error('   Créez-le et placez-y vos modèles .glb téléchargés:');
    console.error('   mkdir -p temp-models/{structures,walls,furniture,lighting,multimedia,decoration,floors,plv,levels}');
    process.exit(1);
  }

  const allResults = {};
  let totalUploaded = 0;
  let totalErrors = 0;

  // Upload chaque catégorie
  for (const [category, folder] of Object.entries(CATEGORIES)) {
    const results = await uploadCategory(category, folder);
    allResults[category] = results;

    const success = results.filter(r => r.success).length;
    const errors = results.filter(r => !r.success).length;

    totalUploaded += success;
    totalErrors += errors;
  }

  // Rapport final
  console.log('\n' + '='.repeat(60));
  console.log('📊 RAPPORT D\'UPLOAD');
  console.log('='.repeat(60));
  console.log(`✅ Fichiers uploadés: ${totalUploaded}`);
  console.log(`❌ Erreurs: ${totalErrors}`);
  console.log(`📦 Total: ${totalUploaded + totalErrors}`);

  // Générer fichier de mapping URLs
  const urlsMapping = {};
  for (const [category, results] of Object.entries(allResults)) {
    urlsMapping[category] = {};
    results.forEach(r => {
      if (r.success) {
        const moduleId = r.file.replace('.glb', '').replace('.gltf', '');
        urlsMapping[category][moduleId] = r.publicUrl;
      }
    });
  }

  // Sauvegarder mapping JSON
  const mappingPath = path.join(__dirname, '../supabase-3d-urls.json');
  fs.writeFileSync(mappingPath, JSON.stringify(urlsMapping, null, 2));
  console.log(`\n📝 Mapping URLs sauvegardé: ${mappingPath}`);

  // Générer code TypeScript pour MODULE_3D_PATHS
  const tsCode = generateModulePaths(allResults);
  const tsPath = path.join(__dirname, '../module-3d-paths-generated.ts');
  fs.writeFileSync(tsPath, tsCode);
  console.log(`📝 Code TypeScript généré: ${tsPath}`);
  console.log('   → Copier ce code dans client/src/lib/supabase-3d-loader.ts');

  console.log('\n🎉 Upload terminé!\n');

  if (totalErrors > 0) {
    console.log('⚠️  Certains fichiers ont échoué. Vérifier les erreurs ci-dessus.');
    process.exit(1);
  }
}

// Exécuter
main().catch(error => {
  console.error('💥 Erreur fatale:', error);
  process.exit(1);
});
