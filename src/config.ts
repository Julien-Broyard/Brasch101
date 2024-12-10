// Read .env file
import "dotenv/config";

import { LogLevel } from "@sapphire/framework";
import { ActivityType, GatewayIntentBits, Options, Partials } from "discord.js";
import type { ClientOptions } from "discord.js";

import { minutes } from "#utils/common/times";

// Enums
export enum Role {
  CRYOGENIZED = "1314427079399313429",
  SDT = "1315368982852665377",
  "1CL" = "1315369015429824585",
}

export enum Rank {
  "1CL" = "1CL",
  "M.ARC" = "M.ARC",
  ADJ = "ADJ",
  AGT = "AGT",
  CHI = "CHI",
  CLA = "CLA",
  CLE = "CLE",
  CNE = "CNE",
  COL = "COL",
  CPL = "CPL",
  DCP = "DCP",
  LTN = "LTN",
  MAJ = "MAJ",
  OFH = "OFH",
  PSF = "PSF",
  SCH = "SCH",
  SDT = "SDT",
  SGC = "SGC",
  SGT = "SGT",
  VTR = "VTR",
}

// Constants
export const obtainableRanks = [
  Rank.SDT,
  Rank["1CL"],
  Rank.CPL,
  Rank.SGT,
  Rank.SCH,
  Rank.ADJ,
  Rank.MAJ,
] as const;

export const config = {
  CLIENT_ID: process.env.CLIENT_ID,
  DISCORD_GUILD_ID: process.env.DISCORD_GUILD_ID,
  DISCORD_TOKEN: process.env.DISCORD_TOKEN,
} as const;

// Client Options
export const CLIENT_OPTIONS: ClientOptions = {
  caseInsensitiveCommands: true,
  caseInsensitivePrefixes: true,
  loadMessageCommandListeners: true,
  makeCache: Options.cacheEverything(),
  intents: [
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel],
  presence: {
    activities: [
      { name: "Surveillance démocratique", type: ActivityType.Listening },
    ],
    status: "online",
  },
  logger: {
    level:
      process.env.NODE_ENV === "production" ? LogLevel.Info : LogLevel.Debug,
  },
  sweepers: {
    ...Options.DefaultSweeperSettings,
    messages: {
      interval: minutes.toSeconds(3),
      lifetime: minutes.toSeconds(15),
    },
  },
};
