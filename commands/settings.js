import {Client, CommandInteraction, CommandInteractionOptionResolver} from "discord.js";
import * as fs from "fs";

/***
 * @param {Client} client - The bot instance
 * @param {CommandInteraction} command - The command
 * @param {CommandInteractionOptionResolver} args - The command's arguments
 */


export const run = async (client, command, args) => {
    const { value: setting } = args.get("setting");
    const { value: state } = args.get("state");
    fs.readFile("./database/guilds.json", (e, d) => {
        if(e) console.log(e);
        let base = JSON.parse(d);
        if(!base[command.guild.id]) {
            base[command.guild.id] = {
                "settings": {
                    [setting]: state,
                }
            }
            fs.writeFileSync("./database/guilds.json", JSON.stringify(base, null, 2))
            command.reply(`I've just changed the ${setting} to ${state ? "enabled" : "disabled"}`)
        } else if(!base[command.guild.id]["settings"]){
            base[command.guild.id] = {
                "settings": {[setting]: state}
            }
            fs.writeFileSync("./database/guilds.json", JSON.stringify(base, null, 2))
            command.reply(`I've just changed the ${setting} to ${state ? "enabled" : "disabled"}`)
        } else if(!base[command.guild.id]["settings"][setting]) {
            base[command.guild.id]["settings"][setting] = state;
            fs.writeFileSync("./database/guilds.json", JSON.stringify(base, null, 2))
            command.reply(`I've just changed the ${setting} to ${state ? "enabled" : "disabled"}`)
        } else if (base[command.guild.id]["settings"][setting] === state){
            command.reply(`Nothing changed !`)
        } else {
            base[command.guild.id]["settings"][setting] = state;
            fs.writeFileSync("./database/guilds.json", JSON.stringify(base, null, 2))
            command.reply(`I've just changed the ${setting} to ${state ? "enabled" : "disabled"}`)
        }
    })
}