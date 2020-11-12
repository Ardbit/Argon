var Discord = require('discord.io');
var logger = require('winston');

logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

var bot = new Discord.Client({
    token: process.env.DISCORD_TOKEN,
    autorun: true
});

bot.on('ready', function (event) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});

bot.on('message', function (user, userID, channelID, message, event) {
    logger.info('msg');
    bot.sendMessage({
        to: channelID,
        message: 'I am a bot'
    });
});