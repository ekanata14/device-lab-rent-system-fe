import Pusher from "pusher";

const appId = process.env.PUSHER_APP_ID;
const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
const secret = process.env.PUSHER_SECRET;
const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "ap1";

const rawPusher =
  appId && key && secret
    ? new Pusher({
        appId,
        key,
        secret,
        cluster,
        useTLS: true,
      })
    : null;

export const pusherServer = {
  trigger: async (channel: string, event: string, data: any) => {
    console.log(
      `🚀 [Backend] Triggering Pusher event: '${event}' on channel '${channel}'...`,
    );
    if (!rawPusher) {
      console.warn(
        "⚠️ [Backend] Pusher config missing (Check PUSHER_APP_ID in .env). Skipping realtime update.",
      );
      return;
    }

    try {
      await rawPusher.trigger(channel, event, data);
      console.log(
        `✅ [Backend] Successfully dispatched Pusher event: '${event}'`,
      );
    } catch (error) {
      console.error(`❌ [Backend] Failed to trigger Pusher event:`, error);
    }
  },
} as unknown as Pusher;
