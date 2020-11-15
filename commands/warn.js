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

    await database.connect((error, client, done) => {
        if (error) {
            logger.error(error);
            return;
        }

        let warn;

        client.query('SELECT plugins FROM guilds WHERE id = $1 RETURNING plugins', [message.guild.id], (error, result) => {
            if (error) {
                logger.error(error);
                return;
            }

            warn = result.rows[0]['plugins'];
            done();
        });

        warn['moderation']['warns'][user.id][warn['moderation']['warns'][user.id].length]['timestamp'] = Date.now()
        warn['moderation']['warns'][user.id][warn['moderation']['warns'][user.id].length]['reason'] = reason || null;

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

        client.query('SELECT plugins FROM guilds WHERE id = $1', [message.guild.id], (error, result) => {
            if (error) {
                logger.error(error);
                return;
            }

            warnCount = result.rows[0]['plugins']['moderation']['warns'][user.id].length;
            done();
        });
    });

    warnCount = 10;

    ArgonSuccess(message, `Successfully warned user ${user.tag}`, true);

    message.channel.send(`<@${user.id}>\n`)
    message.channel.send(new MessageEmbed()
        .setTitle(`Hey, ${user}!`)
        .setColor(0x63B0CD)
        .setDescription(`You have been warned by ${message.author.tag}.`)
        .addField('Reason', reason || 'None')
        .setFooter(`Warning count: ${warnCount}`)
    )
}

module.exports.config = {
    name: 'warn',
    aliases: []
}