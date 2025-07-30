import { TelegramService } from "@/lib/services/telegram.service";
import { TgProxyService } from "@/lib/services/tgproxy.service";
import { seq, SeqHandlerInput } from "@/lib/utils/common.util";
import { type NextRequest } from "next/server";
import * as jwt from "@/lib/seqs/jwt.seq";
import * as tgproxy from "@/lib/seqs/tgproxy.seq";
import { HttpException } from "@/lib/error";
import assert from "node:assert";

type SeqCtx = {
  endpoint: string;
  jwt?: {
    sign: (d: string | object | Buffer) => Promise<string>;
    verify: (token: string) => Promise<{ botId: string; chatId: string }>;
  };
  claims?: { botId: string; chatId: string };
  telegram?: TelegramService;
  tgproxy?: TgProxyService;
};

function unauthorized() {
  throw new HttpException(401, "Unauthorized");
}

async function validate(input: SeqHandlerInput<SeqCtx>) {
  const { req, ctx } = input;
  const authHeader = req.headers.get("authorization") || "";
  if (!authHeader) return unauthorized();

  const capture = /Bearer\s([\S]+)/.exec(authHeader);
  if (!capture || !capture[1]) return unauthorized();

  assert(ctx.jwt);

  try {
    input.ctx.claims = await ctx.jwt.verify(capture[1]);
  } catch (e) {
    return unauthorized();
  }
}

async function handle(input: SeqHandlerInput<SeqCtx>) {
  const { req, ctx } = input;
  const { tgproxy, claims, endpoint } = ctx;
  assert(tgproxy);
  assert(claims);

  const body = await req.json();

  // inject chat_id
  if (endpoint === "sendMessage" || endpoint === "sendPhoto") {
    if (!body.chat_id) body.chat_id = claims.chatId;
  }
  const data = await tgproxy.proxy(endpoint as string, body);
  return Response.json(data);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ endpoint: string }> },
) {
  const { endpoint } = await params;
  const deal = seq<SeqCtx>(jwt.setup, validate, tgproxy.setup, handle);
  return await deal({ req, ctx: { endpoint } });
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
//       "first_name": "foo",
//       "username": "bar",
//       "type": "private"
//     },
//     "date": 1633775799,
//     "text": "helo"
//   }
// }
