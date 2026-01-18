import { config } from "dotenv";
import { pool, checkDatabaseConnection } from "./db";

// Load environment variables from .env
config();

async function testConnection() {
  console.log("🧪 Testing epitaphev1 PostgreSQL connection...\n");

  // Test 1: Basic connection
  try {
    console.log("Test 1: Basic query");
    const result = await pool.query("SELECT current_database(), current_user, version()");
    console.log("✅ Database:", result.rows[0].current_database);
    console.log("✅ User:", result.rows[0].current_user);
    console.log("✅ Version:", result.rows[0].version.split("\n")[0]);
  } catch (error) {
    console.error("❌ Test 1 failed:", error);
    process.exit(1);
  }

  // Test 2: Health check function
  console.log("\nTest 2: Health check function");
  const isHealthy = await checkDatabaseConnection();
  if (!isHealthy) {
    console.error("❌ Test 2 failed: Health check returned false");
    process.exit(1);
  }

  // Test 3: Check if stand_* tables exist (they shouldn't yet)
  console.log("\nTest 3: Check for stand_* tables");
  try {
    const tablesResult = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name LIKE 'stand_%'
      ORDER BY table_name
    `);

    if (tablesResult.rows.length > 0) {
      console.log("✅ Found stand_* tables:");
      tablesResult.rows.forEach(row => console.log("   -", row.table_name));
    } else {
      console.log("⚠️  No stand_* tables found yet (expected - migration not run)");
      console.log("   Next step: Run SQL migration to create tables");
    }
  } catch (error) {
    console.error("❌ Test 3 failed:", error);
  }

  // Test 4: Check auth.users (Supabase auth table)
  console.log("\nTest 4: Check Supabase auth.users table");
  try {
    const authResult = await pool.query("SELECT COUNT(*) as count FROM auth.users");
    console.log("✅ auth.users table accessible");
    console.log("   Users count:", authResult.rows[0].count);
  } catch (error) {
    console.log("⚠️  auth.users table not accessible (expected if schema not public)");
  }

  console.log("\n🎉 Connection tests completed!");
  console.log("✅ Stand-Planet is ready to connect to epitaphev1 PostgreSQL\n");

  await pool.end();
  process.exit(0);
}

testConnection();
