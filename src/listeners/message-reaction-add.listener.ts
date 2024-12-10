import { ApplyOptions } from "@sapphire/decorators";
import { Events, Listener } from "@sapphire/framework";
import dayjs from "dayjs";
import type { MessageReaction, User } from "discord.js";

import { db } from "../db/database";
import { userActivity } from "../db/schemas/user-activity.schema";

@ApplyOptions<Listener.Options>({
  event: Events.MessageReactionAdd,
})
export class MessageReactionAddListener extends Listener {
  public override async run(_reaction: MessageReaction, user: User) {
    if (user.bot) return;

    await db
      .insert(userActivity)
      .values({
        userId: user.id,
        lastActivity: dayjs().valueOf(),
      })
      .onConflictDoUpdate({
        target: [userActivity.userId],
        set: {
          lastActivity: dayjs().valueOf(),
        },
      });
  }
}
