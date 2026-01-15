import { Request, Response, NextFunction } from "express";
import multer from "multer";
import path from "path";
import { existsSync, mkdirSync } from "fs";
import sharp from "sharp";
import { db } from "./db";
import { assets } from "../shared/schema-assets";
import { randomBytes } from "crypto";

// Configuration du dossier d'upload
const UPLOAD_DIR = path.join(process.cwd(), "uploads");
const THUMBNAILS_DIR = path.join(UPLOAD_DIR, "thumbnails");

// Créer les dossiers s'ils n'existent pas
if (!existsSync(UPLOAD_DIR)) {
  mkdirSync(UPLOAD_DIR, { recursive: true });
}
if (!existsSync(THUMBNAILS_DIR)) {
  mkdirSync(THUMBNAILS_DIR, { recursive: true });
}

// Configuration de multer pour l'upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    // Génération d'un nom unique: timestamp_random_original.ext
    const uniqueSuffix = `${Date.now()}_${randomBytes(8).toString("hex")}`;
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    cb(null, `${uniqueSuffix}_${nameWithoutExt}${ext}`);
  },
});

// Filtre de fichiers : accepter seulement images, vidéos, PDFs
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = [
    // Images
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
    // Vidéos
    "video/mp4",
    "video/webm",
    // Documents
    "application/pdf",
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Type de fichier non autorisé: ${file.mimetype}`));
  }
};

// Taille max : 50 MB
const MAX_FILE_SIZE = 50 * 1024 * 1024;

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});

/**
 * Génère une miniature pour une image
 */
async function generateThumbnail(filePath: string, fileName: string): Promise<string | null> {
  try {
    const thumbnailFileName = `thumb_${fileName}`;
    const thumbnailPath = path.join(THUMBNAILS_DIR, thumbnailFileName);

    await sharp(filePath)
      .resize(300, 300, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .toFile(thumbnailPath);

    return `/uploads/thumbnails/${thumbnailFileName}`;
  } catch (error) {
    console.error("Erreur lors de la génération de la miniature:", error);
    return null;
  }
}

/**
 * Obtient les dimensions d'une image
 */
async function getImageDimensions(filePath: string): Promise<{ width: number; height: number } | null> {
  try {
    const metadata = await sharp(filePath).metadata();
    return {
      width: metadata.width || 0,
      height: metadata.height || 0,
    };
  } catch (error) {
    console.error("Erreur lors de la lecture des dimensions:", error);
    return null;
  }
}

/**
 * Détermine le type d'asset basé sur le MIME type
 */
function getAssetType(mimeType: string): "logo" | "image" | "texture" | "video" | "document" {
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType === "application/pdf") return "document";
  // Par défaut, les images sont considérées comme des images génériques
  // L'utilisateur peut spécifier "logo" ou "texture" via le formulaire
  return "image";
}

/**
 * Middleware pour gérer l'upload et la création de l'asset en BDD
 */
export async function handleAssetUpload(req: Request, res: Response) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Aucun fichier fourni" });
    }

    // @ts-ignore - userId sera ajouté par le middleware d'auth
    const userId = req.user?.id || 1; // Par défaut utilisateur 1 en dev
    const file = req.file;
    const filePath = file.path;
    const fileName = file.filename;
    const originalName = file.originalname;

    // Type d'asset (peut être spécifié dans le body)
    let assetType = req.body.type || getAssetType(file.mimetype);

    // Dimensions et miniature pour les images
    let dimensions = null;
    let thumbnailUrl = null;

    if (file.mimetype.startsWith("image/")) {
      dimensions = await getImageDimensions(filePath);
      thumbnailUrl = await generateThumbnail(filePath, fileName);
    }

    // Créer l'entrée en base de données
    const assetData = {
      userId,
      type: assetType,
      name: originalName,
      fileName,
      filePath: `/uploads/${fileName}`,
      fileSize: file.size,
      mimeType: file.mimetype,
      width: dimensions?.width || null,
      height: dimensions?.height || null,
      url: `/uploads/${fileName}`,
      thumbnailUrl,
      metadata: req.body.metadata ? JSON.stringify(req.body.metadata) : null,
      tags: req.body.tags || null,
    };

    const result = await db.insert(assets).values(assetData).returning();
    const asset = result[0];

    console.log(`✅ Asset uploadé: ${originalName} (${file.size} bytes) - ID: ${asset.id}`);

    res.status(201).json({
      success: true,
      asset,
    });
  } catch (error: any) {
    console.error("Erreur lors de l'upload:", error);
    res.status(500).json({
      error: "Erreur lors de l'upload du fichier",
      details: error.message,
    });
  }
}

/**
 * Récupérer tous les assets d'un utilisateur
 */
export async function getUserAssets(req: Request, res: Response) {
  try {
    // @ts-ignore
    const userId = req.user?.id || 1;

    const userAssets = await db.select().from(assets).where(eq(assets.userId, userId));

    res.json({
      success: true,
      assets: userAssets,
    });
  } catch (error: any) {
    console.error("Erreur lors de la récupération des assets:", error);
    res.status(500).json({
      error: "Erreur lors de la récupération des assets",
      details: error.message,
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
    const userId = req.user?.id || 1;

    // Vérifier que l'asset appartient à l'utilisateur
    const asset = await db.select().from(assets).where(and(
      eq(assets.id, assetId),
      eq(assets.userId, userId)
    )).limit(1);

    if (asset.length === 0) {
      return res.status(404).json({ error: "Asset non trouvé" });
    }

    // Supprimer le fichier physique
    const filePath = path.join(process.cwd(), asset[0].filePath);
    if (existsSync(filePath)) {
      unlinkSync(filePath);
    }

    // Supprimer la miniature si elle existe
    if (asset[0].thumbnailUrl) {
      const thumbPath = path.join(process.cwd(), asset[0].thumbnailUrl);
      if (existsSync(thumbPath)) {
        unlinkSync(thumbPath);
      }
    }

    // Supprimer de la base de données
    await db.delete(assets).where(eq(assets.id, assetId));

    res.json({
      success: true,
      message: "Asset supprimé avec succès",
    });
  } catch (error: any) {
    console.error("Erreur lors de la suppression:", error);
    res.status(500).json({
      error: "Erreur lors de la suppression de l'asset",
      details: error.message,
    });
  }
}

// Imports manquants pour les fonctions ci-dessus
import { eq, and } from "drizzle-orm";
import { unlinkSync } from "fs";
