module.exports.run = async (client, message, args, logger) => {
    message.channel.send('Pinging...').then(msg => {
        msg.edit(`Ping: ${}ms`);
    });
}

module.exports.config = {
    name: 'ping',
    aliases: [
        'latency'
    ]
}