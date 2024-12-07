import { ApplyOptions } from "@sapphire/decorators";
import { Events, Listener } from "@sapphire/framework";
import type { MessageReaction, User } from "discord.js";

import { db } from "../lib/database";
import { UserActivityManager } from "../manager/user-activity.manager";

@ApplyOptions<Listener.Options>({
  event: Events.MessageReactionAdd,
})
export class MessageReactionAddListener extends Listener {
  private readonly userActivityManager = new UserActivityManager(db);

  public override run(_reaction: MessageReaction, user: User) {
    if (user.bot) return;

    this.userActivityManager.updateActivity(user.id);
  }
}
