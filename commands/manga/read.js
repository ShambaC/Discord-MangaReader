const MFA = require('mangadex-full-api');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    name: 'read',
    aliases: [],
    category: 'manga',
    utilisation: '{prefix}read [manga name] [chapter]',
    description: 'Read a manga',

    execute(client, message, args) {

    const backId = 'back'
    const forwardId = 'forward'
    const closeId = 'close'

    var backButton = new MessageButton({
    style: 'SECONDARY',
    label: 'Back',
    emoji: '⬅️',
    customId: backId
    })
    var forwardButton = new MessageButton({
    style: 'SECONDARY',
    label: 'Forward',
    emoji: '➡️',
    customId: forwardId
    })
    var closeButton = new MessageButton({
        style: 'SECONDARY',
        label: 'Close',
        emoji: '❌',
        customId: closeId
    })

        if (!args[0]) return message.channel.send(`Please enter a valid search ${message.author}... try again ? ❌`);

        MDUser = client.config.MDopt.Username;
        MDpass = client.config.MDopt.Password;

        const chapter_num_arg = args[args.length - 1];
        var args2 = args;
        args2.pop();


        MFA.login(MDUser, MDpass, './bin/.md_cache').then(async () => {
            const manga = await MFA.Manga.getByQuery(args2.join(' '));
            const findChapter = async (manga, chapter_num_arg, offset = 0) => {
                const chapters = await manga.getFeed({translatedLanguage: ['en'], order: { publishAt: 'desc'}, offset, limit: 100});
                if( chapters.length === 0)  return message.channel.send('Chapter not found !');
                for (const chap of chapters)    if (chap.chapter == chapter_num_arg)    return chap;
                return findChapter(manga, chapter_num_arg, offset + 100);
            }

            const chapter = await findChapter(manga, chapter_num_arg);

            if(typeof chapter.chapter === "undefined")   return;
            
            var pages;
            try {
                pages = await chapter.getReadablePages();
            }
            catch(err)
            {
                return message.channel.send(err.message);
            }

            const {author, channel} = message;
            const generateEmbed = async start => {
                return new MessageEmbed({
                    title: `${manga.title}`,
                    image: {
                        url: pages[start],                      
                    },
                    color: 'ORANGE',
                    url: 'https://mangadex.org/title/' + manga.id + '/',
                    description: 'Chapter ' + chapter.chapter,
                })
            }

            var row = new MessageActionRow().addComponents(backButton, forwardButton, closeButton);
            const embedMessage = await channel.send({
                embeds: [await generateEmbed(0)],
                components: [row]
            })

            const collector = embedMessage.createMessageComponentCollector({
                filter: ({user}) => user.id === author.id
              })

            var currentIndex = 0;
            collector.on('collect', async int => {
                if(int.customId == backId)
                {
                    currentIndex--;
                }
                else if(int.customId == forwardId)
                {
                    currentIndex++;
                }
                else if(int.customId == closeId)
                {
                    int.reply(`The manga has been closed ! ✅`);
                    return int.message.delete();
                }

                if(currentIndex < 0)
                {
                    currentIndex = 0;
                }
                if(currentIndex == pages.length)
                {
                    currentIndex = pages.length - 1;
                }               

                await int.update({
                    embeds: [await generateEmbed(currentIndex)],
                })
            })

        }).catch(console.error)
    },
};