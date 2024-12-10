import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const userActivity = sqliteTable("user_activity", {
  userId: text("user_id").primaryKey(),
  lastActivity: integer("last_activity").notNull(),
});
