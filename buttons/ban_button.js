import {
    ButtonInteraction,
    Client,
    MessageEmbed,
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
    // Get the id of the user we want to ban

    const userId = button.message.mentions.users.first().id

    // Get the user from the guild member cache

    const member = button.guild.members.cache.get(userId)

    // Get the reason of the ban

    let p2 = button.message.content.split('for')[1]
    const reason = p2.substring(1, (p2.length - 2))

    // Get the user itself from the user cache

    const user = await button.client.users.cache.get(userId)

    // Go into the DM channel of the next banned user

    const channel = await user.createDM()

    // Create an embed and send it to the next banned user

    const banEmbed = new MessageEmbed()
        .setTitle('You got banned')
        .addField('from', `${button.message.guild.name}`)
        .addField('for', `${reason}`)
        .setColor('#ff0000')
        .setThumbnail(`${button.guild.iconURL()}`)

    await channel.send({
        embeds: [banEmbed]
    })

    // Ban the user
    try {
        member.ban({
            reason: reason,
        })
    } catch(e){
        console.log(e.message)
    }
    

    // Inform the user who banned the other that it's done (and send it into the console)

    button.message.reply(`${user.username} (<@${userId}>) got banned !`).then(m => {
        console.log(`user got banned from ${button.message.guild.name}`);
    })

    // Delete the message where the buttons were

    button.message.delete()


}