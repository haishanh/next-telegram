import type { NextApiRequest, NextApiResponse } from "next";

import * as config from "@lib/config";
import { seq } from "@lib/utils/common.util";
import * as jwt from "@lib/seqs/jwt.seq";
import * as telegram from "@lib/seqs/telegram.seq";
import type { SeqHandlerInput } from "@lib/utils/common.util";
import { HttpException } from "@lib/error";
// import { TelegramService } from "@lib/services/telegram.service";
// import assert from "assert";

type Chat = {
  id: number;
  first_name: string;
  username: string;
  // private, ...
  type: string;
};

function validate(input: SeqHandlerInput<{ botId?: string }>) {
  const { req } = input;

  // botId
  const botId = (req.query?.id as string) || "0";
  // hookId
  const hookId = req.query?.hook;
  if (typeof hookId !== "string") throw new HttpException(400, "Parameters Error");

  const expected = config.get(["WEBHOOK_ID", botId]);
  if (hookId !== expected) throw new HttpException(400, "Parameters Error");

  input.ctx.botId = botId;
}

function ok(input: SeqHandlerInput) {
  input.res.json({ ok: 1 });
  return true;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const deal = seq<{}>(validate, jwt.setup, telegram.setup, telegram.webhook, ok);
  await deal({ req, res, ctx: {} });
}
