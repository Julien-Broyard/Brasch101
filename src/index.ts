import "#lib/setup";

import { container } from "@sapphire/framework";

import { BraschClient } from "#lib/BraschClient";
import { config } from "#root/config";
// import { inactivityCron } from "./crons/inactivity.cron";
// import { rankCron } from "./crons/rank.cron";

const client = new BraschClient();

const main = async () => {
  try {
    await client.login(config.DISCORD_TOKEN);
    // rankCron.start();
    // inactivityCron.start();
  } catch (error) {
    container.logger.fatal(error);
    await client.destroy();
    process.exit(1);
  }
};

void main();
