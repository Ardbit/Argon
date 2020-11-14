const { ArgonError, ArgonSuccess } = require('../utils/messages');

module.exports.run = async (message, args) => {
    if (!message.member.hasPermission('KICK_MEMBERS')) {
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

    user.kick(reason);

    ArgonSuccess(message, `Successfully kicked user ${user.tag}`, true);
}

module.exports.config = {
    name: 'kick',
    aliases: []
}