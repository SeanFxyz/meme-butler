# Meme Butler
The Meme Butler is a Discord bot to recall and post the links to your favorite
memes posted in Discord, using aliases assigned by the users in your server.

## Interaction
Due to certain limitations of slash commands, the preferred method of
interaction with a meme butler is to use regular messages starting with a
particular prefix character or characters.
The default prefix is `$`.
Directly after the prefix, provide one of the following commands:

- `meme ALIAS` or `get ALIAS`: Posts the meme assigned to `ALIAS`, if it exists.
- `add ALIAS`: Assigns to `ALIAS` all attachments and embeds in this message or the message being replied to.
- `delete ALIAS` or `del ALIAS`: Deletes the entry for `ALIAS`
- `invite`: Posts the invite link for the bot.
- `list`: Lists all memes in the database.
- `dump`: Posts a JSON file containing all memes for the guild.
- `load`: Imports attached JSON files of the format produced by `dump`.
- `help`: Prints this command list.