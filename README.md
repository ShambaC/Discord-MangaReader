# MD Embed BOT

Complete source code for the discord BOT MangaReader.

A discord BOT for reading manga directly into discord from mangadex.

You can invite this bot to your server by clicking [here](https://discord.com/api/oauth2/authorize?client_id=916625445993209866&permissions=275414829056&scope=bot%20applications.commands).

*You can contact me at discord via ShambaC#3440 for help*

### Configuration

Open the configuration file located in the main folder `config.js`.

```js
module.exports = {
    app: {
        px: 'BOT prefix',
        token: 'BOT token here',
        playing: 'activity',
        type: 'Activity type',
    },

    MDopt: {
        Username: 'mangadex username',
        Password: 'mangadex password',
    }
};
```

Bot configuration

- `app/px`, the prefix that will be set to use the bot
- `app/token`, the token of the bot available on the [Discord Developers](https://discordapp.com/developers/applications) section
- `app/playing`, the activity of the bot
- `app/type`, type of the activity status //PLAYING, STREAMING, LISTENING, WATCHING, CUSTOM, COMPETING

Mangadex credentials configuration

- `MDopt/Username`, your mangadex username ( Account you want to use with the bot, preferably a separate one from your main account )
- `MDopt/Password`, password for the account username mentioned above

### Installation

You need [Node JS](https://nodejs.org/en/) (v16) for running this bot.

- Run the `install.bat` file to install the necessary dependencies.
- Run the `start.bat` file to start the bot.

### Credits

Made by ShambaC with ❤️