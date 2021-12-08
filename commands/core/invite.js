const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'invite',
    aliases: [],
    category: 'Core',
    utilisation: '{prefix}invite',
    description: 'Invite link for the bot',

    execute(client, message, args) {
        const embed = new MessageEmbed();

        embed.setColor('BLUE');
        embed.setAuthor(client.user.username, client.user.displayAvatarURL({ size: 1024, dynamic: true }));

        embed.setDescription('Invite');
        embed.addField('Wanna Invite the bot to your server ?', '[Invite the bot here](Invite link here)', false);

        embed.setTimestamp();
        embed.setFooter('Made with heart by ShambaC ❤️', message.author.avatarURL({ dynamic: true }));

        message.channel.send({ embeds: [embed] });
    },
};