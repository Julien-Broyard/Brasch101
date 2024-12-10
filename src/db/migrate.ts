import { migrate } from "drizzle-orm/libsql/migrator";
import { db } from "./database";

// This function will run all pending migrations
export async function runMigrations() {
  try {
    console.log("Running migrations...");
    await migrate(db, { migrationsFolder: "./drizzle" });
    console.log("Migrations completed successfully");
  } catch (error) {
    console.error("Error running migrations:", error);
    throw error;
  }
}
