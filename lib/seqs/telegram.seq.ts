import { TelegramService } from "@lib/services/telegram.service";
import * as config from "@lib/config";
import type { SeqHandlerInput } from "@lib/utils/common.util";
import assert from "assert";

type SeqCtx = { jwt?: any; botId?: string; telegram?: TelegramService };

export function setup(input: SeqHandlerInput<{ telegram?: TelegramService; botId?: string }>) {
  const botId = input.ctx.botId || "0";
  const botToken = config.get(["BOT_TOKEN", botId]);
  assert(botToken, ["BOT_TOKEN", botId, "not configed"].join(" "));
  input.ctx.telegram = new TelegramService(botToken);
}

export async function webhook(input: SeqHandlerInput<SeqCtx>) {
  const { jwt, telegram } = input.ctx;
  assert(jwt);
  assert(telegram);
  const botId = input.ctx.botId || "0";

  const { body } = input.req;
  const { chat, text } = body.message;

  console.log(`message.text=${text}`);

  const t = text?.trim();

  switch (t) {
    case "/token":
      const token: string = await jwt.sign({ chatId: chat.id, botId });
      await telegram.sendMessage({
        chat_id: chat.id,
        text: `\`${token}\``,
      });
      await telegram.sendMessage({
        chat_id: chat.id,
        text: "The above string is your notification token",
      });
      break;
    default:
      await telegram.sendMessage({
        chat_id: chat.id,
        text: "😢\n\nHey, I don't konw what to do with this command\n\nPlease send me something that I know\n\n🍬🍬🍬",
        reply_markup: {
          resize_keyboard: true,
          keyboard: [[{ text: "/token" }]],
        },
      });
  }
}
