import { container } from "@sapphire/framework";
import dayjs from "dayjs";
import cron from "node-cron";

import { type UserActivity, db } from "../lib/database";

export const inactivityCron = cron.schedule("*/15 * * * * *", async () => {
  container.logger.info("Running inactivity check...");

  try {
    const oneMinuteAgo = dayjs().subtract(15, "seconds").valueOf();

    // Fetch both active and inactive users in a single query
    const users = db
      .prepare<number, UserActivity & { is_inactive: number }>(`
        SELECT user_id, last_activity <= ? as is_inactive
        FROM user_activity
      `)
      .all(oneMinuteAgo);

    const inactiveUsers = users.filter((u) => u.is_inactive);
    const activeUsers = users.filter((u) => !u.is_inactive);

    const guildId = process.env.DISCORD_GUILD_ID;
    const roleId = process.env.INACTIVE_ROLE_ID;

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
      ...inactiveUsers.map((u) => processUser(u.user_id, true)),
      ...activeUsers.map((u) => processUser(u.user_id, false)),
    ]);

    container.logger.info(
      `Processed ${inactiveUsers.length} inactive users and ${activeUsers.length} active users`,
    );
  } catch (error) {
    container.logger.error("Error during inactivity check:", error);
  }
});
