const fs = require('node:fs');
const sqlite3 = require('sqlite3');
const { dbFile } = require('../config.json');

exports.names = ['dump'];

exports.execute = async (message) => {
    const desiredTables = ['memes'];
    const dumpData = {};

    async function tryDump() {
        for (let table of desiredTables) {
            if ( !(table in dumpData) ) {
                return;
            }
        }

        const attachFileName = `${message.id}.json`;
        const attachFilePath = `tmp/${attachFileName}`;
        fs.writeFileSync(attachFilePath, JSON.stringify(dumpData));
        
        await message.reply({
            files: [
                {
                    attachment: attachFilePath,
                    name: attachFileName,
                    description: 'Database dump',
                },
            ],
        });
    
        fs.promises.unlink(attachFilePath);
    }

    const db = new sqlite3.Database(dbFile);
    db.all('SELECT * from memes WHERE guild=?', message.guild, (err, rows) => { dumpData.memes = rows; tryDump(); });
    db.close();
};