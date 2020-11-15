const { ArgonError, ArgonSuccess } = require('../utils/messages')
const { database, logger } = require('../utils/defaults')
const defaults = require('../utils/defaults')

module.exports.run = async (message, args, logger) => {
    if (!message.member.hasPermission('KICK_MEMBERS')) {
        ArgonError(message, 'Invalid permissions.', true);
        return;
    }

    const user = message.mentions.members.first();
    const guild = message.guild;

    let reason = ' ';

    for (let i = 1; i < args.length; i++) {
        reason = reason + args[i] + ' '
    }

    if (!user) {
        ArgonError(message, 'Invalid Syntax:\nYou need to mention a user.', true)
    }

    const warnCount = await database.connect((error, client, done) => {
        if (error) {
            logger.error(error)
            ArgonError(message, 'A database error has occured.')
        }

        let warns = client.query('SELECT * FROM guilds WHERE id = $1', [guild.id], (error, result) => {
            if (error) {
                logger.error(error)
                ArgonError(message, 'A database error has occured.')
            }

            return result.rows[0].plugins.moderation.warns;
        })

        if (!warns[user.id]) {
            warns[user.id] = []
        }

        warns[user.id][warns[user.id].length] = {
            reason,
            timestamp: Date.now(),
            issuer: message.member.id
        }

        client.query('UPDATE guilds SET plugins = $1 WHERE id = $1', [warns, guild.id], (error, result) => {
            if (error) {
                logger.error(error)
                ArgonError(message, 'A database error has occured.')
            }

            return result.rows[0];
        })

        return warns
    })[user.id].length;

    ArgonSuccess(message, 'Successfully warned ' + user.tag)

    message.channel.send(`<@${user.id}>`)
    message.channel.send(new MessageEmbed()
        .setColor(0x63B0CD)
        .setTitle(`Hey, ${user.tag}`)
        .setDescription('You have been warned by a moderator.')
        .addField({ name: 'Reason', value: reason || 'None' })
        .setFooter(`Warning Given: ${warnCount}`)
    )
}

module.exports.config = {
    name: 'warn',
    aliases: []
}