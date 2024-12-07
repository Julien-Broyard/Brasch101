import { ApplyOptions } from "@sapphire/decorators";
import { Events, Listener } from "@sapphire/framework";
import type { VoiceState } from "discord.js";

import { db } from "../lib/database";
import { UserActivityManager } from "../manager/user-activity.manager";

@ApplyOptions<Listener.Options>({
  event: Events.VoiceStateUpdate,
})
export class VoiceStateUpdateListener extends Listener {
  private readonly userActivityManager = new UserActivityManager(db);

  public override run(_oldState: VoiceState, newState: VoiceState) {
    // Early returns for invalid states
    if (!newState.channelId) return;
    if (!newState.member) return;
    if (newState.member.user.bot) return;

    this.userActivityManager.updateActivity(newState.member.id);
  }
}
