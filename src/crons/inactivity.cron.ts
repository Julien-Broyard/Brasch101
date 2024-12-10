import { container } from "@sapphire/framework";
import dayjs from "dayjs";
import { lte, sql } from "drizzle-orm";
import cron from "node-cron";

import { Role, config } from "../config";
import { db } from "../db/database";
import { userActivity } from "../db/schemas/user-activity.schema";

export const inactivityCron = cron.schedule("*/15 * * * * *", async () => {
  container.logger.info("Running inactivity check...");

  try {
    const oneMinuteAgo = dayjs().subtract(15, "seconds").valueOf();

    // Fetch both active and inactive users in a single query
    const users = await db
      .select({
        userId: userActivity.userId,
        lastActivity: userActivity.lastActivity,
        isInactive: sql<number>`CASE WHEN ${userActivity.lastActivity} <= ${oneMinuteAgo} THEN 1 ELSE 0 END`,
      })
      .from(userActivity)
      .where(lte(userActivity.lastActivity, oneMinuteAgo));

    const inactiveUsers = users.filter((u) => u.isInactive);
    const activeUsers = users.filter((u) => !u.isInactive);

    const guildId = config.DISCORD_GUILD_ID;
    const roleId = Role.CRYOGENIZED;

    if (!guildId || !roleId) {
      throw new Error(
        "Missing environment variables: DISCORD_GUILD_ID or INACTIVE_ROLE_ID",
      );
    }

    const guild = container.client.guilds.cache.get(guildId);
    if (!guild) {
      container.logger.error("Guild not found");
      return;
    }

    const role = guild.roles.cache.get(roleId);
    if (!role) {
      container.logger.error("Role not found");
      return;
    }

    container.logger.info(`Processing ${inactiveUsers.length} inactive users`);

    const processUser = async (userId: string, shouldHaveRole: boolean) => {
      const member = await guild.members.fetch(userId).catch(() => null);
      if (!member) return;

      if (member.id === container.client.guilds.cache.first()?.ownerId) {
        container.logger.warn(`Skipping ${userId} - owner of the guild`);
        return;
      }

      const hasRole = member.roles.cache.has(role.id);
      if (hasRole === shouldHaveRole) return;

      const botHighestRole = guild.members.me?.roles.highest.position ?? 0;
      if (botHighestRole <= (member.roles.highest.position ?? 0)) {
        container.logger.warn(
          `Cannot ${shouldHaveRole ? "add" : "remove"} inactive role ${shouldHaveRole ? "to" : "from"} ${userId} - insufficient permissions`,
        );
        return;
      }

      const roleAction = shouldHaveRole
        ? member.roles.add(role)
        : member.roles.remove(role);

      const message = shouldHaveRole
        ? "You have been cryogenized due to inactivity! Interact with the server to be unfrozen."
        : "Welcome back! You have been unfrozen due to your recent activity.";

      await roleAction
        .then(() => member.send(message))
        .catch((err) => {
          container.logger.error(
            `Failed to ${shouldHaveRole ? "add" : "remove"} role ${shouldHaveRole ? "to" : "from"} ${userId}:`,
            err,
          );
        });
    };

    // Process all users in parallel
    await Promise.all([
      ...inactiveUsers.map((u) => processUser(u.userId, true)),
      ...activeUsers.map((u) => processUser(u.userId, false)),
    ]);

    container.logger.info(
      `Processed ${inactiveUsers.length} inactive users and ${activeUsers.length} active users`,
    );
  } catch (error) {
    container.logger.error("Error during inactivity check:", error);
  }
});
