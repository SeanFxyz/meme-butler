const sqlite3 = require('sqlite3');
const { maxAliasLength, maxDescriptionLength, messageSigil, dbFile } = require('../config.json');


exports.names = ['add'];
exports.usage = '% ALIAS [DESCRIPTION]';
exports.description = 'Assigns to ALIAS all attached or embedded files included with the command or in a message replied to with the command.';
exports.args = new Map(Object.entries({
    alias: { optional: false, description: 'A name by which to recall the meme.' },
    description: { optional: true, description: 'An optional description of the meme.' },
}));

exports.execute = async (message) => {
    const messageWords = message.content.split(messageSigil)[1].split(' ');
    const alias = messageWords[1];
    const description = messageWords.slice(2).join(' ');
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
        location = location += Array.from(sourceMessage.attachments.values()).map((a) => a.url).join(' ');
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
    
    if (alias.length > maxAliasLength) {
        return message.reply(`That alias is too long! The character limit is ${maxAliasLength}`);
    }
    
    if (description.length > maxDescriptionLength) {
        return message.reply(`Your description is too long! The character limit is ${maxDescriptionLength}`);
    }

    const db = new sqlite3.Database(dbFile);
    db.get('SELECT * FROM memes WHERE guild=? AND alias=?', [sourceMessage.guildId, alias], async (err, row) => {
        if (err) {
            console.error(err.message);
            return message.reply('There was an error checking for an existing alias.');
        }
        
        if (row) return message.reply('That alias is already taken!');
            
        db.run('INSERT INTO memes VALUES (?,?,?,?)', [sourceMessage.guildId, alias, location, description], async (err) => {
            if (err) {
                console.error(err.message);
                return message.reply('There was an error adding your meme to the database!');
            }
            
            return message.reply('Meme added to database.');
        });
    });


    db.close();
};