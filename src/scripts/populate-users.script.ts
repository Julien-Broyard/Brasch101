import { readFileSync } from "node:fs";
import { parse } from "csv-parse/sync";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

import { Rank } from "../config";
import { db } from "../db/database";
import { runMigrations } from "../db/migrate";
import { user } from "../db/schemas/user.schema";

// Add this near the top of the file
dayjs.extend(customParseFormat);

async function populateUsers() {
  try {
    // Run migrations first
    await runMigrations();

    // Read CSV file
    const fileContent = readFileSync("1DIV - Effectif - Effectif.csv", "utf-8");

    // Parse CSV (skip header row)
    const records = parse(fileContent, {
      delimiter: ",",
      from_line: 2, // Skip header
      relax_quotes: true, // Handle quotes in identifiers
      skip_empty_lines: true,
    });

    // Process each record
    const users = records.map((record: string[]) => {
      // Extract username, handling parentheses format
      const identifier = record[0];
      const username = identifier.includes("(")
        ? identifier.split("(")[0].trim()
        : identifier;

      return {
        // Map to user schema
        active: !record[8], // If "Date cryo" is empty, user is active
        actualRank: formatRank(record[12]), // GRADE ACTUEL column
        arrivalDate: formatDate(record[1]), // Date d'arrivée
        discordId: null, // Discord ID not present in CSV
        username, // Add the username field
      };
    });

    // Insert into database using Drizzle's batch API
    console.log(`Inserting ${users.length} users...`);

    await db.batch([db.insert(user).values(users)]);

    console.log("Database populated successfully!");
  } catch (error) {
    console.error("Error populating database:", error);
  }
}

// Helper to format dates from DD/MM/YY to YYYY-MM-DD
function formatDate(dateStr: string): string {
  return dayjs(dateStr, "DD/MM/YY").format("YYYY-MM-DD");
}

function formatRank(rankString: string): Rank {
  // Extract just the rank code (everything before the first space)
  const rankCode = rankString.split(" ")[0];

  if (Object.values(Rank).includes(rankCode as Rank)) {
    return rankCode as Rank;
  }

  throw new Error(`Invalid rank: ${rankString}`);
}

// Run the script
populateUsers();
