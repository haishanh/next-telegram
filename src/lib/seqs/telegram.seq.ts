import { TelegramService } from "@/lib/services/telegram.service";
import * as config from "@/lib/config";
import type { SeqHandlerInput } from "@/lib/utils/common.util";
import assert from "assert";

type SeqCtx = { jwt?: any; botId?: string; telegram?: TelegramService };

export function setup(
  input: SeqHandlerInput<{ telegram?: TelegramService; botId?: string }>,
) {
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

  const body = await input.req.json();
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
        text: [
          "The above string is your notification token",
          "",
          "To send a message, try",
          "",
          "```bash",
          `curl "https://jizha.vercel.app/api/tgproxy/v1/sendMessage" \\`,
          `  -H "Authorization: Bearer ${token}" \\`,
          `  -H "Content-Type: application/json" \\`,
          `  -d '{"text": "hello"}'`,
          "```",
          "",
        ].join("\n"),
        parse_mode: "MarkdownV2",
      });
      break;
    default:
      const candy =
        botId === "jizha"
          ? "\u53fd\u53fd\u55b3\u55b3\u624e\u624e\u4f60\u9e21\u9e21"
          : "🍬🍬🍬";
      await telegram.sendMessage({
        chat_id: chat.id,
        text: [
          "😢",
          "Hey, I don't know what to do with this command",
          "Please send me something that I know",
          candy,
        ].join("\n\n"),
        reply_markup: {
          resize_keyboard: true,
          keyboard: [[{ text: "/token" }]],
        },
      });
  }
}
