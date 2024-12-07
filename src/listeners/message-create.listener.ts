import { ApplyOptions } from "@sapphire/decorators";
import { Events, Listener } from "@sapphire/framework";
import type { Message } from "discord.js";

import { db } from "../lib/database";
import { UserActivityManager } from "../manager/user-activity.manager";

@ApplyOptions<Listener.Options>({
  event: Events.MessageCreate,
})
export class MessageCreateListener extends Listener {
  private readonly userActivityManager = new UserActivityManager(db);

  public override run(message: Message) {
    if (message.author.bot) return;

    this.userActivityManager.updateActivity(message.author.id);
  }
}
