const fs = require('node:fs');
const path = require('node:path');
const sqlite3 = require('sqlite3');
const { messageSigil } = require('../config.json');

module.exports = {
    name: 'add',
    execute: async (message) => {
        const messageWords = message.content.split(messageSigil)[1].split(' ');
        const alias = messageWords[1]
        let sourceMessage;
        let location;

        if (message.reference) {
            sourceMessage = await message.channel.messages.fetch(message.reference.messageId);
        } else {
            sourceMessage = message;
        }

        if (sourceMessage.attachments && sourceMessage.attachments.size > 0) {
            // location = sourceMessage.attachments[0].url;
            location = Array.from(sourceMessage.attachments.values()).map((a) => a.url).join(' ');
            console.log(`got attachment url list: ${location}`);
        } else if (sourceMessage.embeds && sourceMessage.embeds.length > 0) {
            // location = sourceMessage.embeds[0].url;
            location = sourceMessage.embeds.map((e) => e.url).join(' ');
            console.log(`got embed url list: ${location}`);
        } else {
            console.log('No attachment or embed found.');
            return message.reply('No meme found in that message!');
        }

        const db = new sqlite3.Database('database.db');
        db.serialize(() => {
            db.run('INSERT INTO memes (alias, location) VALUES (?, ?)', [alias, location], async (err, row) => {
                if (err) {
                    console.error(err.message);
                    return message.reply('There was an error handling that message!');
                }
                
                await message.reply('Meme added to database.');
            });
        });

        db.close();
    }
}