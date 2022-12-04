const { inviteLink } = require('../config.json');

exports.names = ['invite'];
exports.usage = '%';
exports.description = 'Posts invite link for this bot.';
exports.execute = async (message) => {
    return message.reply(`Invite link for this instance: ${inviteLink}`);
};