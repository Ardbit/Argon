const { ArgonError, ArgonSuccess } = require('../utils/messages');
const { database } = require('../utils/defaults');
const { MessageEmbed } = require('discord.js');

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

    let warnCount;

    database.connect((error, client, done) => {
        if (error) {
            logger.error(error);
            return;
        }

        let plugins;

        client.query('SELECT plugins FROM guilds WHERE id = $1', [message.guild.id], (error, result) => {
            if (error) {
                logger.error(error);
                return;
            }

            logger.info(result.rows)
            plugins = result.rows[0]['plugins'];
            done();
        });

        let newPlugins = plugins['moderation']['warns'][user.id][plugins['moderation']['warns'][user.id].length];

        newPlugins['timestamp'] = Date.now()
        newPlugins['reason'] = reason || null;

        client.query('UPDATE guilds SET plugins = $1 WHERE id = $2', [newPlugins, message.guild.id], (error, result) => {
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

        client.query('SELECT plugins FROM guilds WHERE id = $1', [message.guild.id], (error, result) => {
            if (error) {
                logger.error(error);
                return;
            }

            warnCount = result.rows[0]['plugins']['moderation']['warns'][user.id].length;
            done();
        });
    });

    ArgonSuccess(message, `Successfully warned user ${user.tag}`, true);

    message.channel.send(`<@${user.id}>\n` + new MessageEmbed()
        .setTitle('Warn')
        .setColor(0x63B0CD)
        .setDescription(`Hey ${user.tag}!\nYou have been warned by ${message.author.tag}.`)
        .addField('Reason', reason)
        .setFooter(`Warning count: ${warnCount}`)
    )
}

module.exports.config = {
    name: 'warn',
    aliases: []
}