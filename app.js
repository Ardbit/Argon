const Discord = require('discord.js');
const winston = require('winston');

const client = new Discord.Client();
const prefix = '.'

const logger = winston.createLogger({
    format: winston.format.simple(),
    transports: [
        new winston.transports.Console()
    ]
});

client.on('ready', function (event) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(client.username + ' - (' + client.id + ')');
});

client.on('guildMemberAdd', function (member) {
    const channel = member.guild.channels.cache.find(ch => ch.name === 'general')

    if (!channel) return;

    channel.send(`Welcome to the server ${member}!`)
});

client.on('message', function (message) {
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
    }
});

client.login(process.env.DISCORD_TOKEN);