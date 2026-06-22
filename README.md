# TTKRZ-V2-VERIFY

Flat Discord verify bot. No folders inside folders.

## Railway Variables

Copy and paste this into Railway `Variables` > `Raw Editor`:

```env
DISCORD_TOKEN=PASTE_YOUR_DISCORD_BOT_TOKEN_HERE
VERIFY_CHANNEL_ID=PASTE_YOUR_VERIFY_CHANNEL_ID_HERE
VERIFY_ROLE_ID=PASTE_YOUR_VERIFY_ROLE_ID_HERE
```

Then press **Update Variables** and **Deploy**.

## Discord Developer Portal

Bot permissions needed:
- Send Messages
- Embed Links
- Attach Files
- Use External Emojis
- Manage Roles

Move the bot role above the verify role in your server role list.

## Start Command

Railway should use:

```bash
npm start
```