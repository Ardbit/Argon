const { MessageEmbed } = require('discord.js');

module.exports.run = async (client, message, args, logger) => {
    message.channel.send(new MessageEmbed()
        .setTitle(':ping_pong:   **Pong!**')
        .setColor(0x31CB00)
        .setDescription('**Pinging...**')
    ).then(msg => {
        msg.edit(new MessageEmbed()
            .setTitle(':ping_pong:   **Pong!**')
            .setColor(0x31CB00)
            .setDescription(`**Latency**\n${Date.now() - message.createdTimestamp}ms\n\n**API**\n${client.ws.ping}ms`)
        );
    });
}

module.exports.config = {
    name: 'ping',
    aliases: [
        'latency'
    ]
}