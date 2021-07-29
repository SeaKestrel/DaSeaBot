import {Client, CommandInteraction, CommandInteractionOptionResolver, MessageEmbed} from "discord.js";

/***
 * @param {Client} client - The bot instance
 * @param {CommandInteraction} command - The command
 * @param {CommandInteractionOptionResolver} args - The command's arguments
 */


export const run = async (client, command, args) => {

    const uptime = new Date(client.uptime)

    const infosEmbed = new MessageEmbed()
    .setTitle("Infos of the bot")
    .setThumbnail(client.user.displayAvatarURL())
    .addField("Creator", "SeaKestrel", false)
    .addField("Support server", "https://discord.gg/M5Q8tuXUyx")
    .addField("Icon by", "Freepik on https://www.flaticon.com/", true)
    .addField("Uptime", `${uptime.getHours() - 1}:${uptime.getMinutes()}:${uptime.getSeconds()}`, true)
    .setColor("#2980b9")
    .setFooter("First release on : * | Version : bêta", client.user.avatarURL())

    command.reply({
        embeds: [infosEmbed]
    })
}