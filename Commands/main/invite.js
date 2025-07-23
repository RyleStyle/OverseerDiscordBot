const {
    SlashCommandBuilder
} = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("invite")
        .setDescription("Get the invite link for the bot."),
    async execute(interaction, client) {

        const { MessageEmbed } = require("discord.js")

        let inviteEmbed = new MessageEmbed()
            .setAuthor({
                name: "Invite Overseer",
                iconURL: client.user.displayAvatarURL()
            })
            .setDescription("Invite Link")
            .addFields(
                {
                    name: "• Bot Invite",
                    value: `[Click here](https://discord.com/api/oauth2/authorize?client_id=${process.env.BOT_CLIENT_ID}&permissions=${process.env.BOT_PERMISSIONS}&scope=bot%20applications.commands)`,
                    inline: false
                }
            )
            .setFooter({
                text: "You can vote once every 12 hours."
            })

        interaction.reply({
            embeds: [inviteEmbed]
        })
    }
}