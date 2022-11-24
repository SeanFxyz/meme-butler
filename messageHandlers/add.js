const fs = require('node:fs');
const path = require('node:path');
const sqlite3 = require('sqlite3');
const { messageSigil, dbFile } = require('../config.json');


exports.names = ['add'];

exports.execute = async (message) => {
    const alias = message.content.split(messageSigil)[1].split(' ')[1];
    let sourceMessage;
    let location;

    if (message.reference) {
        sourceMessage = await message.channel.messages.fetch(message.reference.messageId);
    } else {
        sourceMessage = message;
    }

    if (sourceMessage.attachments && sourceMessage.attachments.size > 0) {
        location = Array.from(sourceMessage.attachments.values()).map((a) => a.url).join(' ');
        console.log(`got attachment url list: ${location}`);
    } else if (sourceMessage.embeds && sourceMessage.embeds.length > 0) {
        location = sourceMessage.embeds.map((e) => e.url).join(' ');
        console.log(`got embed url list: ${location}`);
    } else {
        console.log('No attachment or embed found.');
        return message.reply('No meme found in that message!');
    }

    const db = new sqlite3.Database(dbFile);
    db.get('SELECT * FROM memes WHERE alias = ?', alias, async (err, row) => {
        if (err) {
            console.error(err.message);
            return message.reply('There was an error handling that message!');
        }
        
        if (row) {
            return message.reply('That alias is already taken!');
        }

        db.run('INSERT INTO memes (alias, location) VALUES (?, ?)', [alias, location], async (err) => {
            if (err) {
                console.error(err.message);
                return message.reply('There was an error handling that message!');
            }
            
            await message.reply('Meme added to database.');
        });
    });


    db.close();
};