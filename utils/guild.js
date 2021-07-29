import {
    Guild
} from "discord.js";
import {
    readFile,
    writeFileSync
} from "fs";
/**
 * @param {Guild} guild - The used guild
 */
export const addGuild = (guild) => {
    readFile("./database/guilds.json", (e, d) => {
        if (e) return console.log(e);
        const base = JSON.parse(d);
        let channel;
        if (!guild.systemChannel) {
            channel = undefined
        } else {
            channel = guild.systemChannel?.id
        }
        if (base[guild.id]) {
            base[guild.id] = {
                "log-channel": channel,
                "settings": {
                    "MODERATION_ENABLED": false,
                    "LOGS_ENABLED": true,
                }
            }
            writeFileSync("./database/guilds.json", JSON.stringify(base, null, 2))
            console.log(`Updated guild ${guild.name} (${guild.id})`)
        } else {
            base[guild.id] = {
                "log-channel": channel,
                "settings": {
                    "MODERATION_ENABLED": false,
                    "LOGS_ENABLED": true,
                }
            }
            writeFileSync("./database/guilds.json", JSON.stringify(base, null, 2))
            console.log(`Added guild ${guild.name} (${guild.id})`)
        }
    })
}

export const removeGuild = async (guild) => {
    readFile("./database/guilds.json", async (e, d) => {
        if (e) return console.log(e);
        const base = JSON.parse(d);
        if (base[guild.id]) {
            delete base[guild.id]
            writeFileSync("./database/guilds.json", JSON.stringify(base, null, 2))
            console.log(`Deleted guild ${guild.name}`);
        }
    })
}