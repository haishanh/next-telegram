## Development

```bash
pnpm dev
```

## Add a new bot

Assumed you've created a bot with the @BotFather bot, you should now have the API token for your newly created bot.

1. Add env `BOT_TOKEN_{botId}` and `WEBHOOK_ID_{botId}` to your environment variables settings. `botId` is simply a string to identify a bot in this service since it supports multi bots. You can use whatever you want or you may just use the username of your bot as`botId`. The BOT_TOKEN is the API token of your bot. And for the WEBHOOK_ID one, you should just pick a random (url friendly) string. It will be part of the bot webhook url which we will config to telegram laster.

2. Re-deploy your service, set or update the webhook url of your bot. I'm using the handy [httpie](https://github.com/httpie/httpie) here, you should have no problem to convert these commands to curl ones.

```bash
# these are example values
export bot_token="some:token"
export api_base_url="https://myapi.com"
export bot_id="myawsomebot"
export webhook_id="k2pAPrs"

# set bot webhook url
http "https://api.telegram.org/bot${bot_token}/setWebhook" url="${api_base_url}/api/webhook/v2/${bot_id}/${webhook_id}"
```

3. Talk to your bot, send `/token`. It should give you a JWT token.

```bash
http "${api_base_url}/api/tgproxy/v1/sendMessage" "Authorization:Bearer ${jwt}" text="hello"
```
