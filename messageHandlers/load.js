const sqlite3 = require('sqlite3');
const { dbFile } = require('../config.json');


exports.names = ['load'];

exports.execute = async (message) => {
    const urls = [].concat(
        Array.from(message.attachments.values()).map((a) => a.url),
        message.embeds.map((e) => e.url)
    );

    if (!urls.length) return message.reply('No attached or embedded files found!');

    const db = new sqlite3.Database(dbFile);
    let dbError = false;
    let parseErrors = 0;
    let filesProcessed = 0;
    let duplicatesIgnored = 0;
    const fetchStatement = db.prepare('SELECT * FROM memes WHERE guild=?');
    const insertStatement = db.prepare('INSERT INTO memes VALUES (?,?,?)');
    for (let u of urls) {
        console.log(u);
        fetch(u).then(async (res) => {
            try {
                const memes = await res.json();
                if (!Array.isArray(memes)) {
                    throw 'Parsed data is not an array!';
                }

                for (let m of memes) {
                    fetchStatement.get(message.guildId, (err, row) => {
                        if (err) { console.error(err); dbError = true; }                            
                        if (row) { duplicatesIgnored++; return; }

                        insertStatement.run([message.guildId, m.alias, m.location], (err) => {
                            if (err) {
                                console.error(err);
                                dbError = true;
                            }
                        });
                    });
                }
            } catch (e) {
                console.error(e);
                message.reply('There was an error parsing an attachment or embed.');
                parseErrors++;
            }
            
            filesProcessed++;
            if (filesProcessed == urls.length) {
                fetchStatement.finalize((err) => {
                    if (err) { message.error(err); dbError = true; }

                    insertStatement.finalize((err) => {
                        if (err) { message.error(err); dbError = true; return; }
                        if (dbError) return message.reply('There was an error loading one or more items into the database!');
                        if (parseErrors) return message.reply(`Failed to parse ${parseErrors} files(s)!`);
                        message.reply(`Loaded memes into database. Ignored ${duplicatesIgnored} duplicate alias${(duplicatesIgnored == 1) ? '' : 'es'}.`);
                    });

                    db.close();
                });
            }
        });
    }

};