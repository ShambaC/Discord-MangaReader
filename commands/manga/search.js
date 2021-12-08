const MFA = require('mangadex-full-api');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    name: 'search',
    aliases: [],
    category: 'manga',
    utilisation: '{prefix}search [manga name]',
    description: 'search to read a manga',

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

    var chosen_manga_id;

        MFA.login(MDUser, MDpass, './bin/.md_cache').then( async () => {
            const mangas = await MFA.Manga.search({
                title: args.join(' '),
                limit: 10,
            });
    
            if(!mangas[0])  return message.channel.send(`Could not find the specified manga ❌`);
    
            var manga_search_result = [];
            for( var i = 0; i < mangas.length; i++)
            {
                manga_search_result[i] = (i + 1).toString() + '. ' + mangas[i].title;
            }
    
            message.channel.send(`Here's you search result 🔎...`);
            message.channel.send(manga_search_result.join('\n'));
    
            message.channel.send('Enter your choice : ').then(() => {
                let filter = m => m.author.id === message.author.id;
                message.channel.awaitMessages({
                    filter,
                    max: 1,
                    time: 30000,
                    errors: ['time']
                })
                .then(message => {
                    message = message.first();
                    var choice = parseInt(message.content);
    
                    if(choice < 1 || choice > mangas.length)
                    {
                        return message.channel.send(`❌ Wrong choice !! Redo search !`);
                    }
                    else
                    {
                        var manga = mangas[choice - 1];
                        chosen_manga_id = manga.id;

                        message.channel.send('Which chapter do you want to read ?');

                        message.channel.awaitMessages({
                            filter,
                            max: 1,
                            time: 30000,
                            errors: ['time']
                        })
                        .then(async message => {
                            message = message.first();
                            var chapter_num_arg = parseInt(message.content);

                            const findChapter = async (manga, chapter_num_arg, offset = 0) => {
                                const chapters = await manga.getFeed({translatedLanguage: ['en'], order: { publishAt: 'desc'}, offset, limit: 100});
                                if( chapters.length === 0)  return message.channel.send('Chapter not found !');
                                for (const chap of chapters)    if (chap.chapter == chapter_num_arg)    return chap;
                                return findChapter(manga, chapter_num_arg, offset + 100);
                            }

                            const chapter = await findChapter(manga, chapter_num_arg);

                            if(typeof chapter.chapter === "undefined")   return;

                            var pages = await chapter.getReadablePages();

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
                            
                        })
                        .catch(collected => {
                            message.channel.send(`❌ Timeout ! Try again !`);
                        });
                    }
                })
                .catch(collected => {
                    message.channel.send(`❌ Timeout ! Try again !`);
                });
            })
        }).catch(console.error)

        

            
    
    }
};