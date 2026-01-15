import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "@shared/schema-sqlite";

const sqlite = new Database("./standplanet.db");
export const db = drizzle(sqlite, { schema });

// Pour compatibilité avec l'ancien code
export const pool = {
  query: async (...args: any[]) => {
    console.warn("pool.query appelé mais non implémenté pour SQLite");
    return { rows: [] };
  }
};
