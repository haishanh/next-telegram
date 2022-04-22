import type { NextApiRequest, NextApiResponse } from "next";
import { HttpException } from "@lib/error";
import * as config from "@lib/config";
import { seq } from "@lib/utils/common.util";
import type { SeqHandlerInput } from "@lib/utils/common.util";
import * as jwt from "@lib/seqs/jwt.seq";
import * as telegram from "@lib/seqs/telegram.seq";

function validate(input: SeqHandlerInput<{ botId?: string }>) {
  const { req } = input;

  // botId
  const botId = req.query?.id;
  if (typeof botId !== "string") {
    console.log("missing botId");
    throw new HttpException(400, "Parameters Error");
  }
  // hookId
  const hookId = req.query?.hook;
  if (typeof hookId !== "string") {
    console.log("missing hookId");
    throw new HttpException(400, "Parameters Error");
  }

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
