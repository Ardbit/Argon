const { ArgonError, ArgonSuccess } = require('../utils/messages');
const { database, logger } = require('../utils/defaults');
const { MessageEmbed } = require('discord.js');

module.exports.run = async (message, args) => {
    try {
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

        let warn = await database.connect((error, client, done) => {
            if (error) {
                logger.error(error);
                return;
            }

            let warn = client.query('SELECT plugins FROM guilds WHERE id = $1', [message.guild.id], (error, result) => {
                if (error) {
                    logger.error(error);
                    return;
                }

                return result.rows[0]['moderation']['warns'];
                done();
            });

            client.query('UPDATE guilds SET plugins = $1 WHERE id = $2', [warn, message.guild.id], (error, result) => {
                if (error) {
                    logger.error(error);
                    return;
                }

                return result.rows;
            })

            client.query('COMMIT', (error, result) => {
                if (error) {
                    logger.error(error);
                    return;
                }

                return result.rows;
            })

            return warn;
        });

        if (!warn || warn == null) {
            ArgonError(message, 'Unable to retreive and set warnings.');
            return;
        }

        warn.set(user.id, [])
        warn[user.id].set(warn[user.id].length, defaults['plugins']['moderation']['warns']['DEFAULT_WARN_JSON_TEMPLATE']);

        warn[user.id][warn[user.id].length].set('timestamp', Date.now());
        warn[user.id][warn[user.id].length].set('reason', reason || null);
        warn[user.id][warn[user.id].length].set('issuer', message.member.id || null);

        let warnCount = warn[user.id].length + 1;

        ArgonSuccess(message, `Successfully warned user ${user.tag}`, true);

        message.channel.send(`<@${user.id}>\n`)
        message.channel.send(new MessageEmbed()
            .setTitle(`Hey, ${user}!`)
            .setColor(0x63B0CD)
            .setDescription(`You have been warned by ${message.author.tag}.`)
            .addField('Reason', reason || 'None')
            .setFooter(`Warning count: ${warnCount}`)
        )
    } catch (error) {
        ArgonError(message, 'Something went wrong.')
    }
}

module.exports.config = {
    name: 'warn',
    aliases: []
}