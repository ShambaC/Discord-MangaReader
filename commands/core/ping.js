const ms = require('ms');

module.exports = {
    name: 'ping',
    aliases: [],
    category: 'Core',
    utilisation: '{prefix}ping',
    description: `Check the ping of the BOT`,

    execute(client, message) {
        message.channel.send(`Last heartbeat calculated ${ms(Date.now() - client.ws.shards.first().lastPingTimestamp, { long: true })} ago **${client.ws.ping}ms** 🛰️`);
    },
};