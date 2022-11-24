const path = require('node:path');
const sqlite3 = require('sqlite3');
const { messageSigil, dbFile } = require('../config.json');


exports.names = ['del', 'delete'];

exports.execute = async (message) => {
    const alias = message.content.split(messageSigil)[1].split(' ')[1];
    const db = new sqlite3.Database(dbFile);
    
    db.run('DELETE FROM memes WHERE alias = ?', alias, function (err, rows) {
        if (this.changes) {
            message.reply('Alias deleted.');
        } else {
            message.reply('No meme with that alias!');
        }
    });
}