const { SlashCommandBuilder } = require("discord.js");
const sqlite3 = require('sqlite3');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add-meme')
        .setDescription('Adds meme to the database.')
        .addStringOption((option) =>
            option.setName('alias').setDescription('Alias of the meme to add.').setRequired(true))
        .addStringOption((option) =>
            option.setName('location').setDescription('Location of the meme to add.').setRequired(true)),
    execute: async (interaction) => {
        const alias = interaction.options.getString('alias')
        const location = interaction.options.getString('location');
        const db = new sqlite3.Database('database.db');
        db.serialize(() => {
            db.run('INSERT INTO memes (alias, location) VALUES (?, ?)', [alias, location], async (err, row) => {
                if (err) {
                    console.error(err.message);
                    return interaction.reply('There was an error running that command!');
                }
                
                await interaction.reply('Meme added to database.');
            });
        });
        
        db.close();
    }
}