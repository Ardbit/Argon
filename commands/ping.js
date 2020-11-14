const { MessageEmbed } = require('discord.js');
const { client } = require('../utils/defaults');

module.exports.run = async (message, args) => {
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