// Import config
import "#root/config";

import "dayjs/plugin/utc";
import "@sapphire/plugin-logger/register";

import {
  ApplicationCommandRegistries,
  RegisterBehavior,
} from "@sapphire/framework";

ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(
  RegisterBehavior.Overwrite,
);
