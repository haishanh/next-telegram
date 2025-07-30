import { TgProxyService } from "@/lib/services/tgproxy.service";
import * as config from "@/lib/config";
import type { SeqHandlerInput } from "@/lib/utils/common.util";
import assert from "node:assert";

export function setup(
  input: SeqHandlerInput<{
    tgproxy?: TgProxyService;
    claims?: { botId: string };
  }>,
) {
  assert(input.ctx.claims);

  const botId = input.ctx.claims.botId || "0";

  console.log({ botId });

  const botToken = config.get(["BOT_TOKEN", botId]);
  assert(botToken, ["BOT_TOKEN", botId, "not configed"].join(" "));
  input.ctx.tgproxy = new TgProxyService(botToken);
}
