import type { NextApiRequest, NextApiResponse } from "next";

import { seq } from "@lib/utils/common.util";
import * as jwt from "@lib/seqs/jwt.seq";
import * as tgproxy from "@lib/seqs/tgproxy.seq";
import type { SeqHandlerInput } from "@lib/utils/common.util";
import { TelegramService } from "@lib/services/telegram.service";
import { TgProxyService } from "@lib/services/tgproxy.service";
import assert from "assert";
import { HttpException } from "@lib/error";

type SeqCtx = {
  jwt?: any;
  claims?: { botId: string };
  telegram?: TelegramService;
  tgproxy?: TgProxyService;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const deal = seq<SeqCtx>(jwt.setup, validate, tgproxy.setup, handle);
  await deal({ req, res, ctx: {} });
}

function unauthorized() {
  throw new HttpException(401, "Unauthorized");
}

async function validate(input: SeqHandlerInput<SeqCtx>) {
  const { req, ctx } = input;
  const authorizationHeader = req.headers.authorization || "";
  if (!authorizationHeader) {
    return unauthorized();
  }
  const capture = /Bearer\s([\S]+)/.exec(authorizationHeader);
  if (!capture || !capture[1]) {
    return unauthorized();
  }
  const { jwt } = ctx;
  try {
    input.ctx.claims = await jwt.verify(capture[1]);
  } catch (e) {
    return unauthorized();
  }
}

async function handle(input: SeqHandlerInput<SeqCtx>) {
  const { req, res, ctx } = input;
  const { tgproxy } = ctx;
  assert(tgproxy);
  const endpoint = req.query?.endpoint;
  await tgproxy.proxy(endpoint as string, req.body);
  res.json({ ok: 1 });
  return true;
}

// sendMessage response
//
// {
//   "ok": true,
//   "result": {
//     "message_id": 764,
//     "from": {
//       "id": 1382039162,
//       "is_bot": true,
//       "first_name": "GitHub Actions Notification",
//       "username": "ghactionsbot"
//     },
//     "chat": {
//       "id": 54307919,
//       "first_name": "Haishan",
//       "username": "haishanh",
//       "type": "private"
//     },
//     "date": 1633775799,
//     "text": "helo"
//   }
// }
