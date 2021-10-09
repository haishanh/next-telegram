import { TelegramService } from "@lib/services/telegram.service";
import { config } from "@lib/config";
import type { SeqHandlerInput } from "@lib/utils/common.util";

export function setup(input: SeqHandlerInput<{ telegram?: TelegramService }>) {
  input.ctx.telegram = new TelegramService(config.botToken0);
}
