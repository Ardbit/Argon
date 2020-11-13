const { Client, Collection } = require('discord.js');
const winston = require('winston');
const { Pool } = require('pg');

const { loadCommands } = require('./utils/loadCommands');

const logger = winston.createLogger({
    format: winston.format.simple(),
    transports: [
        new winston.transports.Console()
    ]
});

// Setup variables
const client = new Client();
const db = new Pool({
    connectionString: process.env.DATABASE_URI,
    ssl: {
        rejectUnauthorized: false,
    },
});

// Commands
client.commands = new Collection();
client.aliases = new Collection();

loadCommands(client);

// Listeners
client.on('ready', async () => {
    logger.info(`Connected as ${client.user.tag}`)

    client.user.setActivity(`${client.guilds.cache.size} servers | argon.js.org`, { type: 'WATCHING' })
        .then(presence => console.log(`Activity set to ${presence.activities[0].name}`))
        .catch(console.error);
});

client.on('guildCreate', async () => {

})

client.on('message', async (message) => {
    if (message.author.bot) return;

    const prefix = await db.connect((error, client, done) => {
        const shouldAbort = error, client, done => {
            if (error) {
                logger.error(`Error in transaction`);
                client.query('ROLLBACK', error => {
                    if (error) {
                        logger.error(`Error when rolling back client: ${error.stack}`)
                    }

                    done()
                })
            }

            return !!error;
        }

        client.query('BEGIN', error => {
            if (shouldAbort(error, client, done)) return

            client.query('SELECT prefix FROM guilds WHERE guildId = $1 RETURNING prefix', message.guild.id, (error, res) => {
                if (shouldAbort(error, client, done)) return;

                if (!res.row[0].prefix) {
                    return '.';
                } else {
                    return res.rows[0].prefix;
                }

                done()
            })
        })
    })

    const messageArray = message.content.split(' ');
    const cmd = messageArray[0];
    const args = messageArray.slice(1);

    if (!message.content.startsWith(prefix)) return;

    const commandfile = client.commands.get(cmd.slice(prefix.length)) || client.commands.get(client.aliases.get(cmd.slice(prefix.length)));
    commandfile.run(client, message, args, logger);
});

// EOF
client.login(process.env.DISCORD_TOKEN);