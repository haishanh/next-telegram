const env = process.env;

export const config = {
  webhookId0: env.WEBHOOK_ID_0 as string,
  // the format is something like:
  // 1382139262:ABF4535Sm3J12gQcUJSYv79SGbZ6_ULACrw
  botToken0: env.BOT_TOKEN_0 as string,
  jwtSecret: env.JWT_SECRET as string,
};
