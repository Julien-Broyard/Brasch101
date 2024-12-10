import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const user = sqliteTable("user", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  actualRank: text("actual_rank").notNull(),
  arrivalDate: text("arrival_date").notNull(),
  discordId: text("discord_id").unique(),
  username: text("username").notNull().unique(),
});

// TODO put in the same table ?
