import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "@shared/schema-postgres";
import { config } from "dotenv";

// Load environment variables
config();

// Configuration PostgreSQL pour epitaphev1
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error(
    "DATABASE_URL environment variable is required. " +
    "Please configure .env with epitaphev1 credentials."
  );
}

// Create PostgreSQL connection pool
export const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20, // Maximum connections in pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

// Log connection status
pool.on('connect', () => {
  console.log('✅ Connected to epitaphev1 PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ PostgreSQL pool error:', err);
});

// Initialize Drizzle ORM with PostgreSQL
export const db = drizzle(pool, { schema });

// Health check function
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Database health check passed:', result.rows[0]);
    return true;
  } catch (error) {
    console.error('❌ Database health check failed:', error);
    return false;
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🔌 Closing PostgreSQL connection pool...');
  await pool.end();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🔌 Closing PostgreSQL connection pool...');
  await pool.end();
  process.exit(0);
});
