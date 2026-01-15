import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "@shared/schema-sqlite";
import { readFileSync, writeFileSync, existsSync } from "fs";

// Utilise SQLite pour le développement local
const dbPath = process.env.DATABASE_PATH || "./standplanet.db";

// Créer la base de données si elle n'existe pas
if (!existsSync(dbPath)) {
  console.log("Création de la base de données SQLite...");
  writeFileSync(dbPath, "");
}

const sqlite = new Database(dbPath);

// Activer les foreign keys dans SQLite
sqlite.pragma("foreign_keys = ON");

export const db = drizzle(sqlite, { schema });

// Pour compatibilité avec l'ancien code PostgreSQL
export const pool = {
  query: async (...args: any[]) => {
    console.warn("pool.query appelé mais non implémenté pour SQLite");
    return { rows: [] };
  }
};
