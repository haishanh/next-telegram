import { TgProxyService } from "@lib/services/tgproxy.service";
import { config } from "@lib/config";
import type { SeqHandlerInput } from "@lib/utils/common.util";

export function setup(input: SeqHandlerInput<{ tgproxy?: TgProxyService }>) {
  input.ctx.tgproxy = new TgProxyService(config.botToken0);
}
