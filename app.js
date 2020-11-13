const { Client, MessageEmbed } = require('discord.js');
const winston = require('winston');

const client = new Client();
const prefix = '.'

// Create Logger
const logger = winston.createLogger({
    format: winston.format.simple(),
    transports: [
        new winston.transports.Console()
    ]
});

// Create error message
function ArgonError(message) {
    return new MessageEmbed()
        .setTitle('Error')
        .setColor(0xe74c3c)
        .setDescription(message)
        .setFooter('Argon · Error')
}

// Required for other events
client.on('ready', async (event) => {
    logger.info('Connected');

    client.user.setActivity(`${client.guilds.cache.size} servers | .help`, { type: 'WATCHING' })
});

// Server user join message
client.on('guildMemberAdd', async (member) => {
    const channel = member.guild.channels.cache.find(ch => ch.name === 'general')

    if (!channel) return;

    channel.send(new MessageEmbed()
        .setTitle('Welcome')
        .setColor(0x27ae60)
        .setDescription(`${member} has joined the server!`)
        .setFooter('Argon')
    );
});

// On command
client.on('message', async (message) => {
    // Skip command if it is from a bot or doesn't start with the prefix
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    logger.info('Command: ' + message.content);

    // Command Variables
    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();

    // Placeholders
    var user = null;
    var member = null;
    var reason = null;
    var channel = null;

    // Handle command
    switch (command) {
        case 'about':
        case 'info':
            message.channel.send(new MessageEmbed()
                .setTitle('Info')
                .setFooter('Argon · Copyright © 2020 Ardbit')
                .setColor(0x9b59b6)
                .setDescription('A Versatile and Powerful discord bot for all use cases.')
                .addFields(
                    {
                        name: 'Settings',
                        inline: true,
                        value: '**Prefix:** \'.\'\n'
                    },
                    {
                        name: 'Links',
                        inline: true,
                        value: '**Support:** https://discord.io/argonsupport \n**Invite Bot:** https://discord.io/argoninvite'
                    }
                )
            )
            break

        case 'help':
        case '?':
            message.channel.send(new MessageEmbed()
                .setTitle('Help')
                .setFooter('Argon · Help')
                .setColor(0x1abc9c)
                .setDescription('Please see the help at https://argon.js.org/help.')
            )
            break

        case 'ping':
            const timeTaken = Date.now() - message.createdTimestamp;
            message.channel.send(`Pong! I had a latency of ${timeTaken}ms.`)
            break

        case 'avatar-url':
            message.channel.send(`Your avatar URL is ${message.author.displayAvatarURL()}`)
            break

        case 'send-embed':
            channel = message.mentions.channels.first();

            if (!channel) {
                message.channel.send(ArgonError('You didn\'t mention the channel to send it in.'))
                return;
            }

            if (!args > 4) {
                message.channel.send(ArgonError('You didn\'t specify all required arguments.\nThe command is: send-embed <channel> <color (hex)> <title> <description> [footer]'))
            }

            channel.send(new MessageEmbed()
                .setTitle(args[2].replace('/+/g', ' '))
                .setColor(args[1])
                .setDescription(args[3].replace('/+/g', ' '))
                .setFooter(args[4] ? args[4] : 'Argon')
            )

            message.channel.send(new MessageEmbed()
                .setTitle('Success')
                .setColor(0x2ecc71)
                .setDescription(`Successfully sent an embed in ${args[0]}`)
                .setFooter('Argon · Message Embed')
            )
            break

        // Moderation
        case 'kick':
            // Get user
            user = message.mentions.users.first();

            if (!user) {
                message.channel.send(ArgonError('You didn\'t mention the user!'));
                return;
            }

            // Get member
            member = message.guild.member(user);

            if (!member) {
                message.channel.send(ArgonError('The user does not exist in this server!'))
                return;
            }

            if (args.length > 1) {
                for (let i = 1; i < args.length - 1; i++) {
                    reason = reason + args[i]
                }
            }

            // Kick member
            member.kick(reason).then(async () => {
                message.channel.send(new MessageEmbed()
                    .setTitle('Kick User')
                    .setColor(0x2ecc71)
                    .setDescription(`Successfully kicked user ${user.tag}`)
                    .setFooter('Argon · Moderation')
                )
            }).catch(async (error) => {
                message.channel.send(ArgonError(`Unable to kick user ${user.tag}.`))
                logger.error(`Unable to kick user ${user.tag}: ${error}`)
            })

            break

        case 'ban':
            // Get user
            user = message.mentions.users.first();

            if (!user) {
                message.channel.send(ArgonError('You didn\'t mention the user to kick!'));
                return;
            }

            // Get member
            member = message.guild.member(user);

            if (!member) {
                message.channel.send(ArgonError('That user doesn\'t exist in this server!'));
                return;
            }

            if (args.length > 1) {
                for (let i = 1; i < args.length - 1; i++) {
                    reason = reason + args[i]
                }
            } else {
                reason = 'The ban hammer has spoken.'
            }

            // Ban member
            member.ban({
                reason: reason // If no reason is specified, set the reason to 'The ban hammer has spoken'.
            }).then(async () => {
                message.channel.send(new MessageEmbed()
                    .setTitle('Ban User')
                    .setColor(0xe67e22)
                    .setDescription(`Successfully banned user ${user.tag}`)
                    .setFooter('Argon · Moderation')
                );
            }).catch(async (error) => {
                message.channel.send(ArgonError(`Unable to ban ${user.tag}`));
                logger.error(`Unable to ban user ${user.tag}: ${error}`);
            });
    }
});

// Logon to discord app
client.login(process.env.DISCORD_TOKEN);