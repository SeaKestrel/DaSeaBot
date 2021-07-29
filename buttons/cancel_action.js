import {
    ButtonInteraction,
    Client,
} from "discord.js"
/**
 * 
 * @param {Client} bot 
 * @param {ButtonInteraction} button 
 */
export const run = async (bot, button) => {
    // Disable buttons (on the message)
    button.message.components[0].components.forEach(async b => {
        await b.setDisabled(true)
    });
    // Update buttons (send the update "message" to the api)
    button.update({
        components: button.message.components
    })
    setTimeout(() => button.message.delete(), 3000)
}