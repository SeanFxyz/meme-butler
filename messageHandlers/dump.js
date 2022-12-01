const fs = require('node:fs');
const sqlite3 = require('sqlite3');
const { dbFile } = require('../config.json');

exports.names = ['dump'];

exports.execute = async (message) => {
    const db = new sqlite3.Database(dbFile);
    db.all('SELECT alias, location from memes WHERE guild=?', message.guildId, (err, rows) => {
        if (err) {
            console.error(err.message);
            return message.reply('There was an error retreiving your meme data!');
        }
        
        const attachFilename = `${message.id}.json`;
        const attachFilePath = `tmp/${attachFilename}`;
        fs.writeFileSync(attachFilePath, JSON.stringify(rows));
        
        message.reply({
            files: [
                {
                    attachment: attachFilePath,
                    name: attachFilename,
                    description: 'Database dump',
                },
            ]
        }).then(() => {fs.promises.unlink(attachFilePath);});
    });
    db.close();
};