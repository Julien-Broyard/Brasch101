import { ApplyOptions } from "@sapphire/decorators";
import { Events, Listener } from "@sapphire/framework";
import dayjs from "dayjs";
import type { VoiceState } from "discord.js";

import { db } from "../db/database";
import { userActivity } from "../db/schemas/user-activity.schema";

@ApplyOptions<Listener.Options>({
  event: Events.VoiceStateUpdate,
})
export class VoiceStateUpdateListener extends Listener {
  public override async run(_oldState: VoiceState, newState: VoiceState) {
    // Early returns for invalid states
    if (!newState.channelId) return;
    if (!newState.member) return;
    if (newState.member.user.bot) return;

    await db
      .insert(userActivity)
      .values({
        userId: newState.member.user.id,
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
