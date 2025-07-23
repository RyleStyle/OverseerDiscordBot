const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
    .setName('vote')
    .setDescription('Vote for the bot on top.gg'),
    async execute(interaction, client) {

        let voteEmbed = new MessageEmbed()
        .setAuthor({ name: "Vote for Overseer", iconURL: client.user.displayAvatarURL()})
        .setDescription(`[Vote for the bot here!](https://top.gg/bot/${process.env.BOT_CLIENT_ID}/vote)\n\nVoting does not give perks (yet?)`)
        .setFooter({ text: "You can vote once every 12 hours." })

        interaction.reply({ embeds: [voteEmbed] })

    }
}