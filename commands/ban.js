const { ArgonError, ArgonSuccess } = require('../utils/messages');

module.exports.run = async (message, args) => {
    if (!message.member.hasPermission('BAN_MEMBERS')) {
        ArgonError(message, 'Insufficient privileges.', true)
    }

    const user = message.mentions.members.first();

    if (!user) {
        ArgonError(message, 'User does not exist.', true)
    }

    let reason = ' ';

    for (let i = 1; i < args.length; i++) {
        reason = reason + args[i] + ' '
    }

    user.ban({ reason });

    ArgonSuccess(message, `Successfully banned user ${user.tag}`, true);
}

module.exports.config = {
    name: 'ban',
    aliases: []
}