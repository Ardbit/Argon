const { MessageEmbed } = require('discord.js');
const { ArgonError, ArgonSuccess } = require('../utils/messages')

module.exports.run = async (client, message, args, logger) => {
    if (!message.author.hasPermission('MANAGE_MESSAGES')) {
        (ArgonError(message, 'Insufficient privileges.', true)
    }

    let deleteCount = parseInt(args[0], 10);

    if (!deleteCount) {
        deleteCount = 1;
    } else if (deleteCount < 1) {
        ArgonError(message, 'Delete count cannot be less than 1.')
    } else if (deleteCount > 100) {
        ArgonError(message, 'Delete count cannot be greater than 100.')
    }

    message.channel.bulkDelete(deleteCount + 1)
        .then(msg => {
            ArgonSuccess(message, `Successfully deleted ${deleteCount} messages.`)
        })
        .catch(error => ArgonError(message, `Unable to delete messages:\n${error}`));
}

modules.exports.config = {
    name: 'clear',
    aliases: [
        'delete'
    ]
}