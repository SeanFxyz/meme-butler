const fs = require('node:fs');
const path = require('node:path');
const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');
const { commandBlacklist, token, messageSigil } = require('./config.json');
const sqlite3 = require('sqlite3');


if (!token) {
    console.error('Error: no token specified in config.json');
    return 1;
}


// Initialize database
if (!fs.existsSync(path.join(__dirname, 'database.db'))) {
    const db = new sqlite3.Database('database.db');
    db.run('CREATE TABLE memes (guild TEXT, alias TEXT, location TEXT, description TEXT, PRIMARY KEY (guild, alias))');
    db.close();
    console.log('Initialized database.');
}


// Create tmp directory for attachment files
if (!fs.existsSync(path.join(__dirname, 'tmp'))) fs.mkdirSync('tmp');


const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
]});


client.once(Events.ClientReady, (c) => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
});


// Load message handlers
client.messageHandlers = new Collection();

const handlersPath = path.join(__dirname, 'messageHandlers');
const handlerFiles = fs.readdirSync(handlersPath).filter((file) => file.endsWith('.js'));

for (const file of handlerFiles) {
    const filePath = path.join(handlersPath, file);
    const handler = require(filePath);
    if ('names' in handler && 'execute' in handler) {
        handler.names.forEach((n) => { client.messageHandlers.set(n, handler); });
    }
}


// Add callback to receive messages and send them to the appropriate handlers.
client.on('messageCreate', async (message) => {
    if (message.content.startsWith(messageSigil)) {
        const messageCommand = message.content.split(messageSigil)[1].split(' ')[0].toLowerCase();
        const handler = message.client.messageHandlers.get(messageCommand);

        if (!handler) {
            console.error(`No message handler matching message command ${messageCommand} was found.`);
            return;
        }

        for (let n of handler.names) {
            if (commandBlacklist.includes(n)) {
                return message.reply('This command is disabled on this bot instance!');
            }
        }
        
        console.log('Received command message:');
        console.log(message);
        
        try {
            await handler.execute(message);
        } catch (error) {
            console.error(error);
            await message.reply('There was an error processing this message!');
        }
    }
});


// Log in to Discord with client token.
client.login(token);