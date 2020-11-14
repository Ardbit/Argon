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

client.on('guildCreate', async (guild) => {
    await db.connect((error, client, done) => {
        if (error) {
            logger.error(error);
            return;
        }

        client.query('CREATE TABLE IF NOT EXISTS guilds (id bigint, config text)', (error, result) => {
            if (error) {
                logger.error(error)
                return;
            }

            return result.rows;
        })

        client.query('INSERT INTO guilds (id, config) VALUES ($1, $2)', [guild.id, {prefix: '.'}], (error, result) => {
            done();

            if (error) {
                logger.error(error);
                return;
            }

            return result.rows;
        })
    });
});

client.on('message', async (message) => {
    if (message.author.bot) return;

    const config = await db.connect((error, client, done) => {
        if (error) {
            logger.error(error);
            return;
        }

        client.query('CREATE TABLE IF NOT EXISTS guilds (id bigint, config text)', (error, result) => {
            if (error) {
                logger.error(error)
                return;
            }

            client.query('INSERT INTO guilds (id, config) VALUES ($1, $2)', [message.guild.id, { prefix: '.' }], (error, result) => {
                done();

                if (error) {
                    logger.error(error);
                    return;
                }

                return result.rows;
            })

            return result.rows;
        })

        client.query('SELECT config FROM guilds WHERE id = $1', [message.guild.id], (error, result) => {
            done();

            if (error) {
                logger.error(error);
                return;
            }

            return result.rows[0];
        });
    });

    const messageArray = message.content.split(' ');
    const cmd = messageArray[0];
    const args = messageArray.slice(1);

    if (!message.content.startsWith(config.prefix)) return;

    const commandfile = client.commands.get(cmd.slice(prefix.length)) || client.commands.get(client.aliases.get(cmd.slice(prefix.length)));
    commandfile.run(client, message, args, logger);
});

// EOF
client.login(process.env.DISCORD_TOKEN);