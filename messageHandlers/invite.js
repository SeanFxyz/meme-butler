const { inviteLink } = require('../config.json');

exports.names = ['invite'];

exports.execute = async (message) => {
    return message.reply(`Invite link for this instance: ${inviteLink}`);
};