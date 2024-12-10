import { ApplyOptions } from "@sapphire/decorators";
import { Events, Listener } from "@sapphire/framework";
import dayjs from "dayjs";
import type { Message } from "discord.js";

import { db } from "../db/database";
import { userActivity } from "../db/schemas/user-activity.schema";

@ApplyOptions<Listener.Options>({
  event: Events.MessageCreate,
})
export class MessageCreateListener extends Listener {
  public override async run(message: Message) {
    if (message.author.bot) return;

    await db
      .insert(userActivity)
      .values({
        userId: message.author.id,
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
