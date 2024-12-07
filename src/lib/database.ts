import Database from "better-sqlite3";
import type { Database as DatabaseType } from "better-sqlite3";

export interface UserActivity {
  user_id: string;
  last_activity: number;
}

export const db: DatabaseType = new Database("firstdiv.sqlite");

// Run intial setup
db.exec(`
    CREATE TABLE IF NOT EXISTS user_activity (
        user_id TEXT PRIMARY KEY,
        last_activity INTEGER NOT NULL
    );
`);
