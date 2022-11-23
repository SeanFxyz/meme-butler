const { SlashCommandBuilder } = require("discord.js");
const sqlite3 = require('sqlite3');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('meme')
        .setDescription('Sends meme assigned to provided alias.')
        .addStringOption((option) =>
            option.setName('alias').setDescription('Alias of the meme to fetch.').setRequired(true)),
    execute: async (interaction) => {
        const alias = interaction.options.getString('alias');
        const db = new sqlite3.Database('database.db');
        db.serialize(() => {
            db.get('SELECT location FROM memes WHERE alias = ?', alias, async (err, row) => {
                if (err) {
                    console.error(err.message);
                    return interaction.reply('There was an error running that command!');
                }
                
                if (!row) {
                    console.log("No matching meme found!.");
                    return interaction.reply('No meme with that alias was found!');
                }
                
                await interaction.reply(row.location);
            });
        });

        db.close();
    }
}