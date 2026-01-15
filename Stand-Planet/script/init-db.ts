import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { users, events, booths, orders } from "../shared/schema-sqlite";
import { sql } from "drizzle-orm";

const dbPath = process.env.DATABASE_PATH || "./standplanet.db";
const sqlite = new Database(dbPath);
const db = drizzle(sqlite);

console.log("Initialisation de la base de données SQLite...");

// Créer les tables
console.log("Création de la table 'users'...");
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'exhibitor' CHECK(role IN ('admin', 'organizer', 'exhibitor')),
    name TEXT,
    company_name TEXT,
    created_at INTEGER DEFAULT (unixepoch())
  );
`);

console.log("Création de la table 'events'...");
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    organizer_id INTEGER NOT NULL REFERENCES users(id),
    name TEXT NOT NULL,
    description TEXT,
    start_date INTEGER NOT NULL,
    end_date INTEGER NOT NULL,
    location TEXT NOT NULL,
    floor_plan_json TEXT,
    created_at INTEGER DEFAULT (unixepoch())
  );
`);

console.log("Création de la table 'booths'...");
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS booths (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id INTEGER NOT NULL REFERENCES events(id),
    exhibitor_id INTEGER REFERENCES users(id),
    number TEXT NOT NULL,
    dimensions TEXT NOT NULL,
    position TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'available' CHECK(status IN ('available', 'reserved', 'booked')),
    price INTEGER NOT NULL,
    configuration_json TEXT,
    created_at INTEGER DEFAULT (unixepoch())
  );
`);

console.log("Création de la table 'orders'...");
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    exhibitor_id INTEGER NOT NULL REFERENCES users(id),
    booth_id INTEGER NOT NULL REFERENCES booths(id),
    amount INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'paid', 'cancelled')),
    payment_intent_id TEXT,
    created_at INTEGER DEFAULT (unixepoch())
  );
`);

// Activer les foreign keys
sqlite.pragma("foreign_keys = ON");

// Insérer des données de démo
console.log("Insertion de données de démo...");

// Utilisateur admin de démo
sqlite.exec(`
  INSERT OR IGNORE INTO users (id, email, password, role, name, company_name)
  VALUES
    (1, 'admin@epitaphe.ma', 'admin123', 'admin', 'Admin Epitaphe', 'Epitaphe'),
    (2, 'organizer@demo.com', 'demo123', 'organizer', 'Demo Organizer', 'Demo Events'),
    (3, 'exhibitor@demo.com', 'demo123', 'exhibitor', 'Demo Exhibitor', 'Demo Company');
`);

// Événement de démo
sqlite.exec(`
  INSERT OR IGNORE INTO events (id, organizer_id, name, description, start_date, end_date, location)
  VALUES (
    1,
    2,
    'Salon de l''Innovation 2026',
    'Salon professionnel de l''innovation et des nouvelles technologies',
    unixepoch('2026-06-01'),
    unixepoch('2026-06-05'),
    'Casablanca, Maroc'
  );
`);

// Stands de démo
sqlite.exec(`
  INSERT OR IGNORE INTO booths (id, event_id, exhibitor_id, number, dimensions, position, status, price)
  VALUES
    (1, 1, NULL, 'A01', '3x3', '{"x": 0, "y": 0}', 'available', 500000),
    (2, 1, NULL, 'A02', '6x3', '{"x": 3, "y": 0}', 'available', 800000),
    (3, 1, 3, 'A03', '9x3', '{"x": 9, "y": 0}', 'booked', 1200000);
`);

console.log("✅ Base de données initialisée avec succès !");
console.log("\nComptes de démo créés :");
console.log("  - Admin:     admin@epitaphe.ma / admin123");
console.log("  - Organizer: organizer@demo.com / demo123");
console.log("  - Exhibitor: exhibitor@demo.com / demo123");

sqlite.close();
