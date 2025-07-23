const {
    SlashCommandBuilder
} = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('view')
        .setDescription('View role/game list data for the server.'),
    async execute(interaction, client) {

        const listeningSchema = require('../../schemas/listening-schema')
        const streamingSchema = require('../../schemas/streaming-schema')
        const gamingSchema = require("../../schemas/gaming-schema")
        const gamesSchema = require("../../schemas/games-schema")
        const listeningFindDB = (await listeningSchema.findOne({
            guildID: interaction.guild.id
        }))
        const streamingFindDB = (await streamingSchema.findOne({
            guildID: interaction.guild.id
        }))
        const gamingFindDB = (await gamingSchema.findOne({
            guildID: interaction.guild.id
        }))
        const gamesFindDB = (await gamesSchema.findOne({
            guildID: interaction.guild.id
        }))


            let currentRolesEmbed = new MessageEmbed()
                .setAuthor({
                    name: "Assigned Roles",
                    iconURL: interaction.guild.iconURL()
                })
                .setColor("#228b22")

                if (listeningFindDB) {
                    let currentListening = interaction.guild.roles.cache.get(listeningFindDB.roleID)
                    let listenDisplay = currentListening ? currentListening.toString() : "Deleted Role"
                    currentRolesEmbed.addField(`Listening Role`, listenDisplay)
                } 
                if (streamingFindDB) {
                    let currentStreaming = interaction.guild.roles.cache.get(streamingFindDB.roleID)
                    let streamingDisplay = currentStreaming ? currentStreaming.toString() : "Deleted Role"
                    currentRolesEmbed.addField(`Streaming Role`, streamingDisplay)
                }
                if (gamingFindDB) {
                    let currentGaming = interaction.guild.roles.cache.get(gamingFindDB.roleID)
                    let gamingDisplay = currentGaming ? currentGaming.toString() : "Deleted Role"
                    currentRolesEmbed.addField(`Gaming Role`, gamingDisplay)
                }
                if (!listeningFindDB && !streamingFindDB && !gamingFindDB) {
                    currentRolesEmbed.addField(`No roles`, "You don't have any roles set up for the server. Get started with `/setup`")
                }
                if (gamesFindDB) {
                    let currentGames = gamesFindDB.games;
                    let specificCheck = gamesFindDB.specific;

                    let gamesMsg
                    if (specificCheck) {
                        gamesMsg = "The games in the list below are the only games that will give the gaming role in this server. To make any games give it, use `/setup game` then choose `Make all games give the role`."
                    } else {
                        gamesMsg = "The games in the list below do not matter, any game will give the gaming role in this server. To only use the list, simply add or remove a game from the list (you may have to add a random game to the list and then remove it right after if you want to use the list again without changing any games in it)."
                    }
                    let gamesMap = currentGames.map(g => ` \`${g}\``)
                    currentRolesEmbed.addField(`Current Games`, `${gamesMsg}\n\nList:\n${gamesMap.toString()}`)
                } else {
                    currentRolesEmbed.addField(`No games`, "You don't have any games set for this server. Get started with `/setup`")
                }

            interaction.reply({
                embeds: [currentRolesEmbed],
                ephemeral: false
            })

    }
}