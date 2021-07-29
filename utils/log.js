
import { Client, Guild } from "discord.js"
import { log_enable } from "../index.js"
/**
 * @param {String} message - The message to output in the console
 * @param {Client} bot - The bot client
 * @param {Guild} guild - The guild where the log will be send
 */

export const log = (bot, message, guild) => {
    if(log_enable.has(guild.id)){
        guild.channels.cache.get(log_enable.get(guild.id)).send(message)
    }
}