const { ArgonError, ArgonSuccess } = require('../utils/messages');

module.exports.run = async (client, message, args, logger) => {
    if (!message.member.hasPermission('BAN_MEMBERS')) {
        ArgonError(message, 'Insufficient privileges.', true)
    }

    const user = message.mentions.members.first();

    if (!user) {
        ArgonError(message, 'User does not exist.', true)
    }

    const reason = args[1]
    const days = args[2] || 0;

    user.ban({ days, reason });

    ArgonSuccess(message, `Successfully banned user ${user.tag}`, true);
}

module.exports.config = {
    name: 'ban',
    aliases: []
}