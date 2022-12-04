const sqlite3 = require('sqlite3');
const { dbFile } = require('../config.json');

exports.names = ['list'];
exports.usage = '%';
exports.description = 'Posts a list of this server\'s meme aliases and corresponding descriptions.';
exports.execute = async (message) => {
    const db = new sqlite3.Database(dbFile);
    
    db.all('SELECT alias, description FROM memes WHERE guild=?', message.guildId, (err, rows) => {
        if (err) { console.error(err); return; }
        
        if (!rows.length) return message.reply('No memes to list!');
        
        let responseStr = '```\n';
        for (let r of rows) {
            responseStr += `${r.alias} - ${r.description}\n`;
        }
        responseStr += '```';
        message.reply(responseStr);
    });
    
    db.close();
};