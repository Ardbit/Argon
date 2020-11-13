module.exports.run = async (client, message, args) => {
    const latency = Date.now() - message.createdTimestamp()
    message.channel.send(`Pong! I had a latency of ${latency}ms`)
}

module.exports.config = {
    name: "ping",
    aliases: []
}