const sqlite3 = require('sqlite3');
const { messageSigil, dbFile } = require('../config.json');


exports.names = ['add'];

exports.execute = async (message) => {
    const alias = message.content.split(messageSigil)[1].split(' ')[1].toLowerCase();
    let sourceMessage;
    let location = '';
    let memeFound = false;

    if (message.reference) {
        sourceMessage = await message.channel.messages.fetch(message.reference.messageId);
    } else {
        sourceMessage = message;
    }

    if (sourceMessage.attachments && sourceMessage.attachments.size > 0) {
        memeFound = true;
        location = [location, Array.from(sourceMessage.attachments.values()).map((a) => a.url).join(' ')].join(' ');
        console.log(`got attachment url list: ${location}`);
    }
    
    if (sourceMessage.embeds && sourceMessage.embeds.length > 0) {
        memeFound = true;
        location = [location, sourceMessage.embeds.map((e) => e.url).join(' ')].join(' ');
        console.log(`got embed url list: ${location}`);
    }

    if (!memeFound) {
        console.log('No attachment or embed found.');
        return message.reply('No meme found in that message!');
    }

    const db = new sqlite3.Database(dbFile);
    db.get('SELECT * FROM memes WHERE guild=? AND alias=?', [sourceMessage.guildId, alias],
        async (err, row) => {
            if (err) {
                console.error(err.message);
                return message.reply('There was an error handling that message!');
            }
        
            if (row) {
                return message.reply('That alias is already taken!');
            }

            db.run('INSERT INTO memes VALUES (?, ?, ?)', [message.guildId, alias, location], async (err) => {
                if (err) {
                    console.error(err.message);
                    return message.reply('There was an error handling that message!');
                }
            
                return message.reply('Meme added to database.');
            });
        });


    db.close();
};