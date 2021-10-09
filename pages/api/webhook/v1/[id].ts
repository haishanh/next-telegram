import type { NextApiRequest, NextApiResponse } from "next";

import { config } from "@lib/config";
import { seq } from "@lib/utils/common.util";
import * as jwt from "@lib/seqs/jwt.seq";
import * as telegram from "@lib/seqs/telegram.seq";
import type { SeqHandlerInput } from "@lib/utils/common.util";
import { TelegramService } from "@lib/services/telegram.service";
import assert from "assert";
import { HttpException } from "@lib/error";

type Chat = {
  id: number;
  first_name: string;
  username: string;
  // private, ...
  type: string;
};

type SeqCtx = { jwt?: any; telegram?: TelegramService };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = req.query?.id;
  const configedId = config.webhookId0;

  if (id !== configedId) {
    throw new HttpException(400, "Parameters Error");
  }

  const deal = seq<SeqCtx>(jwt.setup, telegram.setup, handleWebookMessage);

  await deal({ req, res, ctx: {} });

  return res.json({ ok: 1 });
}

async function handleWebookMessage(input: SeqHandlerInput<SeqCtx>) {
  const { jwt, telegram } = input.ctx;

  assert(jwt);
  assert(telegram);

  const { body } = input.req;
  const { chat, text } = body.message;

  console.log(`message.text=${text}`);

  const t = text?.trim();

  switch (t) {
    case "/token":
      const token: string = await jwt.sign({ chatId: chat.id });
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
