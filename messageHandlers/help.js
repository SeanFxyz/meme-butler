const { messageSigil, dbFile } = require('../config.json');
const fs = require('node:fs');
const path = require('node:path');
const helpText = fs.readFileSync('help.md', 'utf8');

exports.names = ['help'];

exports.execute = async (message) => {
    return message.reply(helpText);
};