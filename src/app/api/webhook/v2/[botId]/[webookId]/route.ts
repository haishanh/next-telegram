import * as config from "@/lib/config";
import * as telegram from "@/lib/seqs/telegram.seq";
import * as jwt from "@/lib/seqs/jwt.seq";
import { SeqHandlerInput } from "@/lib/utils/common.util";
import { seq } from "@/lib/utils/common.util";
import { type NextRequest } from "next/server";
import { HttpException } from "@/lib/error";

type Ctx = {
  botId: string;
  webhookId: string;
  jwt?: jwt.Jwt;
};

function validate(input: SeqHandlerInput<Ctx>) {
  const { ctx } = input;

  // botId
  const botId = ctx.botId;
  if (typeof botId !== "string") {
    console.log("missing botId");
    throw new HttpException(400, "Parameters Error");
  }
  // hookId
  const hookId = ctx.webhookId;
  if (typeof hookId !== "string") {
    console.log("missing hookId");
    throw new HttpException(400, "Parameters Error");
  }

  const expected = config.get(["WEBHOOK_ID", botId]);
  if (hookId !== expected) throw new HttpException(400, "Parameters Error");
}

function ok() {
  return Response.json({ ok: 1 });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ botId: string; webhookId: string }> },
) {
  const { botId, webhookId } = await params;
  const deal = seq<Ctx>(
    validate,
    jwt.setup,
    telegram.setup,
    telegram.webhook,
    ok,
  );
  return await deal({ req, ctx: { botId, webhookId } });
}
