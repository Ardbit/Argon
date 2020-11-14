const { ArgonError, ArgonSuccess } = require('../utils/messages');

module.exports.run = async (client, message, args, logger) => {
    if (!message.member.hasPermission('KICK_MEMBERS')) {
        ArgonError(message, 'Insufficient privileges.', true)
    }

    const user = message.mentions.users.first();

    if (!user) {
        ArgonError(message, 'User does not exist.', true)
    }

    const reason = args[1];

    user.kick(reason);

    ArgonSuccess(message, `Successfully kicked user ${user.tag}`, true);
}

module.exports.config = {
    name: 'kick',
    aliases: []
}