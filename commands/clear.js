const { ArgonError, ArgonSuccess } = require('../utils/messages')

module.exports.run = async (client, message, args, logger) => {
    if (!message.member.hasPermission('MANAGE_MESSAGES')) {
        ArgonError(message, 'Insufficient privileges.', true)
    }

    let deleteCount = parseInt(args[0], 10);

    if (!deleteCount) {
        deleteCount = 1;
    } else if (deleteCount < 1) {
        ArgonError(message, 'Delete count cannot be less than 1.', true)
    } else if (deleteCount > 100) {
        ArgonError(message, 'Delete count cannot be greater than 100.', true)
    }

    message.channel.bulkDelete(1) // Fix over 100 messages error.

    message.channel.bulkDelete(deleteCount).then(msg => {
        ArgonSuccess(message, `Successfully deleted ${deleteCount} messages.`, true)
    })
        .catch(error => ArgonError(message, `Unable to delete messages:\n${error}`));
}

module.exports.config = {
    name: 'clear',
    aliases: [
        'delete'
    ]
}