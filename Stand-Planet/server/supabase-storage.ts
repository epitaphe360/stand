import { createClient } from '@supabase/supabase-js';
import type { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

/**
 * Système de stockage Supabase Storage
 *
 * MIGRATION SUPABASE:
 * - Upload vers Supabase Storage au lieu du disque local
 * - Organisation par buckets: public (images), private (documents)
 * - Génération d'URLs publiques automatique
 * - Support images et vidéos
 */

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Initialiser le client Supabase avec le service role key (pas la anon key)
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Configuration Multer pour upload temporaire en mémoire
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'video/mp4',
      'video/webm',
      'application/pdf',
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images, videos, and PDFs are allowed.'));
    }
  },
});

/**
 * Upload un fichier vers Supabase Storage
 */
export async function handleAssetUpload(req: Request, res: Response) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // @ts-ignore - req.user est ajouté par requireAuth middleware
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const file = req.file;
    const fileExt = path.extname(file.originalname);
    const fileName = `${crypto.randomBytes(16).toString('hex')}${fileExt}`;

    // Déterminer le bucket en fonction du type de fichier
    const isPublic = file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/');
    const bucketName = isPublic ? 'public' : 'private';

    // Créer le path avec le userId pour organiser les fichiers
    const filePath = `${userId}/${fileName}`;

    // Upload vers Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      console.error('Supabase Storage upload error:', error);
      return res.status(500).json({
        message: 'Failed to upload file',
        error: error.message,
      });
    }

    // Récupérer l'URL publique
    let url: string;

    if (isPublic) {
      const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);
      url = publicUrlData.publicUrl;
    } else {
      // Pour les fichiers privés, créer une URL signée valide 1 an
      const { data: signedUrlData, error: signedError } = await supabase.storage
        .from(bucketName)
        .createSignedUrl(filePath, 365 * 24 * 60 * 60); // 1 an

      if (signedError) {
        console.error('Error creating signed URL:', signedError);
        return res.status(500).json({
          message: 'Failed to generate download URL',
        });
      }

      url = signedUrlData.signedUrl;
    }

    // Sauvegarder les métadonnées dans la base de données
    const { db } = await import('./db');
    const { assets } = await import('@shared/schema-sqlite');

    const [asset] = await db
      .insert(assets)
      .values({
        userId: parseInt(userId), // Convertir en number si nécessaire
        name: file.originalname,
        type: file.mimetype.startsWith('image/')
          ? 'image'
          : file.mimetype.startsWith('video/')
          ? 'video'
          : 'document',
        url,
        size: file.size,
        metadata: JSON.stringify({
          originalName: file.originalname,
          mimeType: file.mimetype,
          bucket: bucketName,
          path: filePath,
        }),
      })
      .returning();

    res.status(201).json({
      asset,
      message: 'File uploaded successfully to Supabase Storage',
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    res.status(500).json({
      message: 'Internal server error during upload',
      error: error.message,
    });
  }
}

/**
 * Récupérer les assets d'un utilisateur
 */
export async function getUserAssets(req: Request, res: Response) {
  try {
    // @ts-ignore
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { db } = await import('./db');
    const { assets } = await import('@shared/schema-sqlite');
    const { eq } = await import('drizzle-orm');

    const userAssets = await db
      .select()
      .from(assets)
      .where(eq(assets.userId, parseInt(userId)));

    res.json({ assets: userAssets });
  } catch (error: any) {
    console.error('Error fetching assets:', error);
    res.status(500).json({
      message: 'Failed to fetch assets',
      error: error.message,
    });
  }
}

/**
 * Supprimer un asset
 */
export async function deleteAsset(req: Request, res: Response) {
  try {
    const assetId = parseInt(req.params.id);
    // @ts-ignore
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { db } = await import('./db');
    const { assets } = await import('@shared/schema-sqlite');
    const { eq, and } = await import('drizzle-orm');

    // Récupérer l'asset pour vérifier la propriété et obtenir le path
    const [asset] = await db
      .select()
      .from(assets)
      .where(and(eq(assets.id, assetId), eq(assets.userId, parseInt(userId))));

    if (!asset) {
      return res.status(404).json({ message: 'Asset not found' });
    }

    // Extraire les métadonnées
    const metadata = typeof asset.metadata === 'string'
      ? JSON.parse(asset.metadata)
      : asset.metadata;

    // Supprimer de Supabase Storage
    if (metadata?.bucket && metadata?.path) {
      const { error: deleteError } = await supabase.storage
        .from(metadata.bucket)
        .remove([metadata.path]);

      if (deleteError) {
        console.error('Error deleting from Supabase Storage:', deleteError);
        // Continue quand même pour supprimer de la DB
      }
    }

    // Supprimer de la base de données
    await db.delete(assets).where(eq(assets.id, assetId));

    res.json({
      success: true,
      message: 'Asset deleted successfully from Supabase Storage',
    });
  } catch (error: any) {
    console.error('Error deleting asset:', error);
    res.status(500).json({
      message: 'Failed to delete asset',
      error: error.message,
    });
  }
}

/**
 * Helper: Obtenir l'URL publique d'un fichier Supabase Storage
 */
export function getSupabasePublicUrl(bucket: string, path: string): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Helper: Créer une URL signée pour un fichier privé
 */
export async function createSignedUrl(
  bucket: string,
  path: string,
  expiresIn: number = 3600 // 1 heure par défaut
): Promise<string | null> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn);

  if (error) {
    console.error('Error creating signed URL:', error);
    return null;
  }

  return data.signedUrl;
}
