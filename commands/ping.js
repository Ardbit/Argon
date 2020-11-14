module.exports.run = async (client, message, args, logger) => {
    message.channel.send('Pinging...').then(msg => {
        msg.edit(`Ping: ${Math.round(client.ping)}ms`);
    }

}

module.exports.config = {
    name: 'ping',
    aliases: []
}