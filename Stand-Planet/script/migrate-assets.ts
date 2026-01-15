import Database from "better-sqlite3";

const dbPath = process.env.DATABASE_PATH || "./standplanet.db";
const sqlite = new Database(dbPath);

console.log("Migration: Ajout des tables assets...");

// Créer la table assets
console.log("Création de la table 'assets'...");
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS assets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id),
    type TEXT NOT NULL CHECK(type IN ('logo', 'image', 'texture', 'video', 'document')),
    name TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type TEXT NOT NULL,
    width INTEGER,
    height INTEGER,
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    metadata TEXT,
    tags TEXT,
    created_at INTEGER DEFAULT (unixepoch()),
    updated_at INTEGER DEFAULT (unixepoch())
  );
`);

// Créer la table module_assets
console.log("Création de la table 'module_assets'...");
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS module_assets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booth_id INTEGER NOT NULL REFERENCES booths(id),
    module_instance_id TEXT NOT NULL,
    asset_id INTEGER NOT NULL REFERENCES assets(id),
    face TEXT DEFAULT 'front' CHECK(face IN ('front', 'back', 'left', 'right', 'top', 'bottom', 'all')),
    position TEXT,
    opacity INTEGER DEFAULT 100,
    repeat TEXT DEFAULT 'no-repeat' CHECK(repeat IN ('no-repeat', 'repeat', 'repeat-x', 'repeat-y')),
    created_at INTEGER DEFAULT (unixepoch())
  );
`);

// Créer les index pour améliorer les performances
console.log("Création des index...");
sqlite.exec(`
  CREATE INDEX IF NOT EXISTS idx_assets_user_id ON assets(user_id);
  CREATE INDEX IF NOT EXISTS idx_assets_type ON assets(type);
  CREATE INDEX IF NOT EXISTS idx_module_assets_booth_id ON module_assets(booth_id);
  CREATE INDEX IF NOT EXISTS idx_module_assets_asset_id ON module_assets(asset_id);
`);

console.log("✅ Migration terminée avec succès !");

sqlite.close();
