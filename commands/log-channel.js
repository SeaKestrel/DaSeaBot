import {Channel, Client, CommandInteraction, CommandInteractionOptionResolver, MessageActionRow, MessageButton} from "discord.js";
import * as fs from "fs";
import { log } from "../utils/log.js";

/***
 * @param {Client} client - The bot instance
 * @param {CommandInteraction} command - The command
 * @param {CommandInteractionOptionResolver} args - The command's arguments
 * @param {Channel} channel - The log channel
 */


export const run = async (client, command, args) => {
    const { channel } = args.get('channel', true)
    const guild = channel.guild
    fs.readFile("./database/guilds.json", async (err, data) => {
        if(err) return console.log(err)
        let base = await JSON.parse(data);
        if (!base[guild.id]) {
            base[guild.id] = {
                "log-channel": channel.id
            }
            await fs.writeFileSync("./database/guilds.json", JSON.stringify(base, null, 2))
            await command.reply(`Your log channel is now in <#${channel.id}>`)
            log(`Changed log channel on ${guild.name} (${guild.id})`)
        } else if (!base[guild.id]["log-channel"]) {
            base[guild.id]["log-channel"] = channel.id
            await fs.writeFileSync("./database/guilds.json", JSON.stringify(base, null, 2))
            await command.reply(`Your log channel is now in <#${channel.id}>`)
            log(`Changed log channel on ${guild.name} (${guild.id})`)
        } else {
            if(channel.id.toString() === base[guild.id]["log-channel"]) {
                await command.reply("This is the same channel ! ")
                setTimeout(() => {command.deleteReply()}, 3000)
            } else {
                const row = new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                .setCustomId('cancel_action')
                                .setLabel('Cancel')
                                .setStyle('DANGER')
                            ).addComponents(
                                new MessageButton()
                                .setCustomId('change_log_channel_button')
                                .setLabel('Change')
                                .setStyle('SUCCESS')
                            );
                        await command.reply({
                            content: `Do you wanna change the old log channel (<#${base[guild.id]["log-channel"]}>) for <#${channel.id}> ?`,
                            components: [row]
                        });
            }
        }
    })
}