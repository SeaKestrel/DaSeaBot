import {
    Client,
    Intents,
    MessageEmbed,
    Collection,
} from "discord.js";
let launchTime;
import * as fs from "fs";
import { addGuild, removeGuild } from "./utils/guild.js";

const bot = new Client({
    intents: [
        Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGES,
    ]
})

bot.commands = new Collection();
bot.buttons = new Collection();
export const log_enable = new Collection();

await fs.readFile("./database/guilds.json", async (e, d) => {
    if (e) return console.info(e);
    const database = JSON.parse(d)
    console.log(" ")
    let i = 0;
    await Object.keys(database).map((g) => {
        if(database[g]["log-channel"] && database[g]["settings"]) {
            if(database[g]["settings"]["LOGS_ENABLED"]) {
                if(database[g]["settings"]["LOGS_ENABLED"] === true){
                    log_enable.set(g, database[g]["log-channel"])
                    i++;
                }
            }
        }
    })
    console.log(`${i} servers were scanned !\n`)
})

await fs.readdir("./commands/", async (err, files) => {
    if (err) return console.error(err);
    let i = 0;
    await files.forEach(async file => {
        if (!file.endsWith(".js")) return;
        let props = await import("./commands/"+file);
        let commandName = file.split(".")[0];
        //console.log(`Attempting to load command ${commandName}`);
        i++;
        bot.commands.set(commandName, props);
    });
    console.log(`${i} commands are ready to be handle !\n`)
});

await fs.readdir("./buttons/", async (err, files) => {
    if(err) return console.error(err);
    let i = 0;
    await files.forEach(async file => {
        if(!file.endsWith(".js")) return;
        let props = await import(`./buttons/${file}`);
        let buttonId = file.split(".")[0];
        //console.log(`Allowing button parsing for ${buttonId}`);
        i++;
        bot.buttons.set(buttonId, props);
    })
    console.log(`${i} buttons are ready to be handle !\n`)
})

await bot.on("ready", async () => {
    console.log("bot is now online");
    launchTime = new Date();
    console.log(`lancé à ${launchTime.getHours()}:${launchTime.getMinutes()}`)
})

bot.on("guildCreate", async guild => {
    const owner = await bot.users.cache.get(guild.ownerId);
    const ownerDM = await owner.createDM()

    const startEmbed = new MessageEmbed()
    .setTitle("Thanks for adding the bot on your server !")
    .setDescription("Now, for the bot to work correctly, you will need to use the command \"start\" on your server !\nThanks again !")
    .setColor("#27ae60")

    addGuild(guild)

    ownerDM.send({
        embeds: [startEmbed]
    })
})

bot.on("messageCreate", async message => {
    if (!bot.application?.owner) await bot.application?.fetch();
    if (message.content.toLowerCase() === '!deploy') {
        const data = {
                name: 'ban',
                description: 'Used to ban people from a server',
                options: [{
                        name: "user",
                        type: "USER",
                        description: "The user you wanna ban",
                        required: true,
                    },
                    {
                        name: "reason",
                        type: "STRING",
                        description: "Why are ya banning this man",
                        required: true,
                        choices: [{
                                name: "Spam",
                                value: "spaming messages in the chat"
                            },
                            {
                                name: "Troll",
                                value: "trolling people"
                            },
                            {
                                name: "Injuring & Racism",
                                value: "injuring people or been racist"
                            },
                            {
                                name: "Other",
                                value: "other reason"
                            }
                        ]
                    }
                ],
            };
        const ping = 
        {
            name: 'ping',
            description: 'Checks the bot internet speed',
        }
        const bot_info = 
        {
            name: 'bot-info',
            description: 'See the infos of the bot'
        }
        const init = 
        {
            name: 'init',
            description: 'Don\'t.',
            defaultPermission: false,
        }
        const log_channel_command = {
            name: 'log-channel',
            description: 'Set\'s the log channel to the binded channel',
            defaultPermission: false,
            options:[{
                name: 'channel',
                type: "CHANNEL",
                description: 'The log channel',
                required: true
            }]
        }   
        const permissions = [
			{
				id: message.guild.ownerId,
				type: 'USER',
				permission: true,
			},
		];
        const settings = {
            name: "settings",
            description: "Change the settings of the bot for your server.",
            defaultPermission: false,
            options:[{
                name: "setting",
                type: "STRING",
                description: "Choose the setting",
                choices: [{
                    name: "Enable moderation",
                    value: "MODERATION_ENABLED"
                },{
                    name: "Enable logs",
                    value: "LOGS_ENABLED"
                }],
                required: true,
            },{
                name: "state",
                type: "BOOLEAN",
                description: "The state of the setting",
                required: true,
            }]
        }
        await message.guild.commands.create(data)
        await message.guild.commands.create(ping)
        await message.guild.commands.create(bot_info)
        const command = await message.guild.commands.create(settings)
        command.permissions.set({permissions})

        message.reply("commandes rajoutées")
    } else if (message.content.toLowerCase() === '!guild remove') {
        removeGuild(message.guild)
    }else if (message.content.toLowerCase() === '!guild create') {
        addGuild(message.guild)
    }
})

bot.on("interactionCreate", async interaction => {
    if (interaction.isCommand()) {

        const command = bot.commands.get(interaction.commandName)

        if(!command) return;

        command.run(bot, interaction, interaction.options)

    } else if (interaction.isButton()) {

        const button = bot.buttons.get(interaction.customId)

        if(!button) return;

        button.run(bot, interaction)

    }
})


bot.login(procen.env.TOKEN)