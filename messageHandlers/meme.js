const fs = require('node:fs');
const path = require('node:path');
const sqlite3 = require('sqlite3');
const { messageSigil } = require('../config.json');

module.exports = {
    name: 'meme',
    execute: async (message) => {
        const messageWords = message.content.split(messageSigil)[1].split(' ');
        const alias = messageWords[1]
        const db = new sqlite3.Database('database.db');
        db.serialize(() => {
            db.get('SELECT location FROM memes WHERE alias = ?', alias, async (err, row) => {
                if (err) {
                    console.error(err.message);
                    return message.reply('There was an error handling that message!');
                }
                if (!row) {
                    console.log("No matching meme found!.");
                    return message.reply('No meme with that alias was found!');
                }

                await message.reply(row.location);
            });
        });

        db.close();
    }
}