import {
    ButtonInteraction,
    Client,
} from "discord.js"
import * as fs from "fs";
import { log } from "../utils/log.js";
/**
 * 
 * @param {Client} bot 
 * @param {ButtonInteraction} button 
 */
export const run = async (bot, button) => {
    const channel = button.message.mentions.channels.last()
    const guild = button.guild
    fs.readFile("./database/guilds.json", async (err, data) => {
        if (err) return console.log(err)
        let base = await JSON.parse(data);
        base[guild.id]["log-channel"] = channel.id
        await fs.writeFileSync("./database/guilds.json", JSON.stringify(base, null, 2))
        await button.reply(`:gear: So, your log channel is now in <#${channel.id}> !`)
        log(`Changed log channel on ${guild.name} (${guild.id})`)
        await button.message.delete()
        await setTimeout(() => button.deleteReply(), 3000)
    })
}