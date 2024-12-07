import { container } from "@sapphire/framework";
import type { Database } from "better-sqlite3";
import dayjs from "dayjs";

export class UserActivityManager {
  private readonly updateActivityStmt;

  constructor(db: Database) {
    this.updateActivityStmt = db.prepare(`
      INSERT INTO user_activity (user_id, last_activity)
      VALUES (?, ?)
      ON CONFLICT(user_id) DO UPDATE SET last_activity = excluded.last_activity
    `);
  }

  /**
   * Updates the last activity timestamp for a user.
   * @param userId - The ID of the user to update.
   */
  public updateActivity(userId: string): void {
    try {
      this.updateActivityStmt.run(userId, dayjs().valueOf());
    } catch (error) {
      container.logger.error(`Failed to update user activity: ${error}`);
    }
  }
}
