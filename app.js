const { Client, MessageEmbed } = require('discord.js');
const winston = require('winston');

const client = new Client();
const prefix = '.'

const user;
const member;

const logger = winston.createLogger({
    format: winston.format.simple(),
    transports: [
        new winston.transports.Console()
    ]
});

client.on('ready', async (event) => {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(client.username + ' - (' + client.id + ')');
});

client.on('guildMemberAdd', async (member) => {
    const channel = member.guild.channels.cache.find(ch => ch.name === 'general')

    if (!channel) return;

    channel.send(new MessageEmbed()
        .setTitle('Welcome')
        .setColor(0x27ae60)
        .setDescription(`${member} has joined the server!`)
    );
});

client.on('message', async (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    logger.info('Command: ' + message.content);

    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();

    switch (command) {
        case 'ping':
            const timeTaken = Date.now() - message.createdTimestamp;
            message.channel.send(`Pong! I had a latency of ${timeTaken}ms.`)
            break

        case 'avatar-url':
            message.channel.send(`Your avatar URL is ${message.author.displayAvatarURL()}`)
            break

        // Moderation
        case 'kick':
            user = message.mentions.users.first();

            if (!user) {
                message.channel.send('You didn\'t mention the user! Silly billy.');
                return;
            }

            member = message.guild.member(user);

            if (!member) {
                message.channel.send('The user does not exist in this server! Silly billy.')
                return;
            }

            member.kick(args[2] ? args[2] : null).then(async () => {
                message.channel.send(`Successfully kicked user ${user.tag}`)
            }).catch(async (error) => {
                message.channel.send(`Unable to kick user ${user.tag}.`)
                logger.error(`Unable to kick user ${user.tag}: ${error}`)
            })

            break

        case 'ban':
            user = message.mentions.users.first();

            if (!user) {
                message.channel.send('You didn\'t mention the user to kick! Silly billy.');
                return;
            }

            member = message.guild.member(user);

            if (!member) {
                message.channel.send('That user doesn\'t exist in this server! Silly billy.');
                return;
            }

            member.ban({
                reason: args[2] ? args[2] : 'The ban hammer has spoken!'
            }).then(async () => {
                message.channel.send(`Successfully banned ${user.tag}`);
            }).catch(async (error) => {
                message.channel.send(`Unable to ban ${user.tag}`);
                logger.error(`Unable to ban user ${user.tag}: ${error}`);
            });
    }
});

client.login(process.env.DISCORD_TOKEN);