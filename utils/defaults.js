const { Client } = require('discord.js');
const winston = require('winston');
const { Pool } = require('pg');

modules.exports = {
    'PLUGIN_JSON': {
        'moderation': {
            'warns': {},
            'kicks': {},
            'bans': {}
        }
    },
}

module.exports.client = new Client();
module.exports.database = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
});
module.exports.logger = winston.createLogger({
    format: winston.format.simple(),
    transports: [
        new winston.transports.Console()
    ]
});