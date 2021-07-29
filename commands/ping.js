import {Client, CommandInteraction, CommandInteractionOptionResolver} from "discord.js";
import { log } from "../utils/log.js";

/***
 * @param {Client} client - The bot instance
 * @param {CommandInteraction} command - The command
 * @param {CommandInteractionOptionResolver} args - The command's arguments
 */


export const run = async (client, command, args) => {
    command.reply({
        content: `The bot responds in ${client.ws.ping} ms`
    })
    log(client, "user ping", command.guild)
}