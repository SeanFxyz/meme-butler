const fs = require('node:fs');
const helpText = fs.readFileSync('help.md', 'utf8');

exports.names = ['help'];
exports.usage = '%';
exports.description = 'Posts command usage guide.';
exports.execute = async (message) => {
    return message.reply(helpText);
};