const fs = require('node:fs');
const path = require('node:path');
const sqlite3 = require('sqlite3');
const { messageSigil, dbFile } = require('../config.json');


exports.names = ['meme', 'get'];

exports.execute = async (message) => {
    const alias = message.content.split(messageSigil)[1].split(' ')[1];
    const db = new sqlite3.Database(dbFile);

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

    db.close();
}