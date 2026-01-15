import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations, sql } from "drizzle-orm";

/**
 * Table pour stocker les assets uploadés (logos, images, textures)
 * Permet le branding et la personnalisation des stands
 */
export const assets = sqliteTable("assets", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull(), // Propriétaire de l'asset
  type: text("type", {
    enum: ["logo", "image", "texture", "video", "document"]
  }).notNull(),
  name: text("name").notNull(), // Nom original du fichier
  fileName: text("file_name").notNull(), // Nom du fichier sur le serveur
  filePath: text("file_path").notNull(), // Chemin complet
  fileSize: integer("file_size").notNull(), // Taille en octets
  mimeType: text("mime_type").notNull(),
  width: integer("width"), // Largeur en pixels (pour images)
  height: integer("height"), // Hauteur en pixels (pour images)
  url: text("url").notNull(), // URL d'accès au fichier
  thumbnailUrl: text("thumbnail_url"), // URL de la miniature
  metadata: text("metadata"), // JSON avec métadonnées additionnelles
  tags: text("tags"), // Tags séparés par des virgules pour recherche
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
});

/**
 * Table de liaison entre modules de stand et assets
 * Permet d'appliquer des logos/images sur des modules spécifiques
 */
export const moduleAssets = sqliteTable("module_assets", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  boothId: integer("booth_id").notNull(), // Stand concerné
  moduleInstanceId: text("module_instance_id").notNull(), // ID d'instance du module
  assetId: integer("asset_id").notNull(), // Asset appliqué
  face: text("face", {
    enum: ["front", "back", "left", "right", "top", "bottom", "all"]
  }).default("front"), // Face du module où appliquer
  position: text("position"), // JSON {x, y, width, height} pour positionnement précis
  opacity: integer("opacity").default(100), // 0-100
  repeat: text("repeat", {
    enum: ["no-repeat", "repeat", "repeat-x", "repeat-y"]
  }).default("no-repeat"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
});

// === ZOD SCHEMAS ===

export const insertAssetSchema = createInsertSchema(assets).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertModuleAssetSchema = createInsertSchema(moduleAssets).omit({
  id: true,
  createdAt: true
});

export type Asset = typeof assets.$inferSelect;
export type InsertAsset = z.infer<typeof insertAssetSchema>;

export type ModuleAsset = typeof moduleAssets.$inferSelect;
export type InsertModuleAsset = z.infer<typeof insertModuleAssetSchema>;

// Types additionnels pour l'API
export interface AssetUploadRequest {
  file: File;
  type: "logo" | "image" | "texture" | "video" | "document";
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface AssetResponse extends Asset {
  thumbnailUrl?: string;
}
