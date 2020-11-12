const Discord = require('discord.js');
const logger = require('winston');

const client = new Discord.Client();
const prefix = '.'

client.login(process.env.DISCORD_TOKEN);

logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

client.on('ready', function (event) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(client.username + ' - (' + client.id + ')');
});

client.on('message', function (message) {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    logger.info('message');

    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();

    switch (command) {
        case 'ping':
            const timeTaken = Date.now() - message.createdTimestamp;
            message.send(`Pong! I had a latency of ${timeTaken}ms.`)
    }
});