const { ArgonError, ArgonSuccess } = require('../utils/messages');
const { database, logger } = require('../utils/defaults');
const { MessageEmbed } = require('discord.js');
const defaults = require('../utils/defaults');

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

            client.query('INSERT INTO guilds (id, config, plugins) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING', [message.guild.id, defaults.CONFIG_JSON_DB, defaults.PLUGIN_JSON_DB], (error, result) => {
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

            let warn = client.query('SELECT plugins FROM guilds WHERE id = $1', [message.guild.id], (error, result) => {
                if (error) {
                    logger.error(error);
                    return;
                }

                return result.rows[0]['plugins']['moderation']['warns'];
                done();
            });

            return warn;
        });

        //warn[user.id][warn[user.id].length || 0] = {
        //    timestamp: Date.now(),
        //    reason: reason || null,
        //    issuer: message.member.id || null
        //}

        database.connect((error, client, done) => {
            if (error) {
                logger.error(error)
                return
            }

            if (warn == null || warn.length <= 0) {
                logger.error('Warn is null or less than 0');
                return;
            }

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

            done();
        })

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
        logger.error(error)
        ArgonError(message, 'Something went wrong.')
    }
}

module.exports.config = {
    name: 'warn',
    aliases: []
}