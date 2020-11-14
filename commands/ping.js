const { MessageEmbed } = require('discord.js');

module.exports.run = async (client, message, args, logger) => {
    message.channel.send(new MessageEmbed()
        .setTitle(':ping_pong: **Pong!**')
        .setColor(0x31CB00)
        .setDescription('**Pinging...**')
        .setFooter('Argon')
    ).then(msg => {
        msg.edit(new MessageEmbed()
            .setTitle(':ping_pong: **Pong!**')
            .setColor(0x31CB00)
            .setDescription(`**Latency**\n${message.createdTimestamp - Date.now()}\n\n**API**\n${client.ws.ping}`)
            .setFooter('Argon')
        );
    });
}

module.exports.config = {
    name: 'ping',
    aliases: [
        'latency'
    ]
}