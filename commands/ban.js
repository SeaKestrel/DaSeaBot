import {
    Client,
    CommandInteraction,
    MessageActionRow,
    MessageButton,Permissions,
} from "discord.js";

/**
 * @param {Client} client 
 * @param {CommandInteraction} command 
 * @param {ReadonlyArray<import("discord.js").CommandInteractionOptionResolver>} args 
 */
export const run = async (client, command, args) => {
    if (args.length <= 0 || args === null || args === undefined) {
        command.reply("You've send bad arguments.")
    } else {
        const {
            user
        } = args.get('user');

        const botMember = command.guild.members.cache.get(client.user.id);
        if (!botMember.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
            command.reply("I can't ban this man cuz I haven't the ban permissions")
        } else {


            const member = command.guild.members.cache.get(user.id)
            if(member=== undefined){
                command.reply("This man isn't here !")
            } else if (user.id === client.user.id) {
                command.reply("I can't ban this man cuz it's myself")
            } else {

                const botRolePos = botMember.roles.highest.position
                const bannedRolePos = member.roles.highest.position

                if (!(botRolePos > bannedRolePos) || !member.bannable) {
                    command.reply("This man is ma superior, I can't ban him")
                } else {
                    const {
                        value: string
                    } = args.get('reason');

                    const row = new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                            .setCustomId('cancel_action')
                            .setLabel('Don\'t')
                            .setStyle('DANGER')
                            .setEmoji("⚔️")
                        ).addComponents(
                            new MessageButton()
                            .setCustomId('ban_button')
                            .setLabel('Ban')
                            .setStyle('SUCCESS')
                            .setEmoji("🔨")
                        );
                    await command.reply({
                        content: `Do you wanna ban <@${user.id}> for ${string} ?`,
                        components: [row]
                    });
                }
            }
        }
    }
}