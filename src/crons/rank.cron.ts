import { container } from "@sapphire/framework";
import cron from "node-cron";

import { Rank, Role, config, obtainableRanks } from "../config";

export const rankCron = cron.schedule("*/15 * * * * *", async () => {
  container.logger.info("Running rank check...");

  try {
    const guildId = config.DISCORD_GUILD_ID;
    if (!guildId) {
      throw new Error("Missing DISCORD_GUILD_ID environment variable");
    }

    // TODO make function to check config vars

    const guild = container.client.guilds.cache.get(guildId);
    if (!guild) {
      container.logger.error("Guild not found");
      return;
    }

    // Get all members with SDT role
    const sdtRole = guild.roles.cache.find((role) => role.id === Role.SDT);
    if (!sdtRole) {
      container.logger.error("SDT role not found");
      return;
    }

    const sdtMembers = guild.members.cache.filter((member) =>
      member.roles.cache.has(sdtRole.id),
    );

    for (const member of sdtMembers.values()) {
      try {
        // Get the next rank (1CL)
        const currentRankIndex = obtainableRanks.indexOf(Rank.SDT);
        const nextRank = obtainableRanks[currentRankIndex + 1];

        // Find or create the next rank role
        const nextRankRole = guild.roles.cache.find(
          (role) => role.name === nextRank,
        );
        if (!nextRankRole) {
          container.logger.error(`${nextRank} role not found`);
          continue;
        }

        // Remove SDT role and add 1CL role
        await member.roles.remove(sdtRole);
        await member.roles.add(nextRankRole);

        // Update nickname with new rank
        const currentName = member.displayName;
        const newName = currentName.replace(/^\[.*?\]/, `[${nextRank}]`);
        await member.setNickname(newName);

        container.logger.info(`Promoted ${member.user.tag} to ${nextRank}`);
      } catch (error) {
        container.logger.error(`Failed to promote ${member.user.tag}:`, error);
      }
    }
  } catch (error) {
    container.logger.error("Error during rank check:", error);
  }
});
