const {
    SlashCommandBuilder
} = require("@discordjs/builders")

const {
    MessageEmbed
} = require("discord.js")
const {
    json
} = require("express/lib/response")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ow-stats')
        .setDescription('Get the stats for someone on Overwatch.'),
    async execute(interaction, client, cmdCooldown) {

        interaction.reply("This command has broken with the release of OW2.")
        return;

        if (cmdCooldown.has(interaction.user.id)) {

            interaction.reply("This command has a 30 second cooldown!")
            return;
        }

        cmdCooldown.add(interaction.user.id)
        setTimeout(() => {
            
            cmdCooldown.delete(interaction.user.id)

        }, 30 * 1000); // 30 second timer.



        interaction.reply("Fetching stats...")

        const owSchema = require("../../schemas/overwatch-schema")

        const owFindDB = (await owSchema.findOne({
            userID: interaction.user.id
        }))

        if (!owFindDB) {

            await interaction.editReply('You need to use `/stat-setup` first!')
            
        } else {

            let userPlatform = owFindDB.platform
            let userRegion = owFindDB.region
            let userTag = owFindDB.tag

            const overwatch = require("overwatch-api")

            overwatch.getProfile(userPlatform, userRegion, userTag, (err, json) => {


                if (err) {
                    interaction.editReply(`Your data could not be fetched. This means you either need to connect your account with \`/stat-setup\`, you entered your data wrong, or you have a private profile.`)
                } else {

                    const privateCheck = json.private;

                    if (privateCheck) {
                        interaction.reply('Profile is private!')

                    } else {

                        const playerName = json.username;
                        const playerLevel = json.level;
                        const playerIcon = json.portrait

                        const quickplayTime = json.playtime.quickplay;
                        const quickplayPlayed = json.games.quickplay.played;

                        const competitivePlayed = json.games.competitive.played;
                        const competitiveTime = json.playtime.competitive;

                        const tankRank = json.competitive.tank.rank;
                        const dpsRank = json.competitive.damage.rank;
                        const supportRank = json.competitive.support.rank;

                        let tankCompare
                        let dpsCompare
                        let supportCompare

                        if (Number.isNaN(tankRank)) {
                            tankCompare = 0
                        } else {
                            tankCompare = tankRank
                        }

                        if (Number.isNaN(dpsRank)) {
                            dpsCompare = 0
                        } else {
                            dpsCompare = dpsRank
                        }

                        if (Number.isNaN(supportRank)) {
                            supportCompare = 0
                        } else {
                            supportCompare = supportRank
                        }

                        let highestRank = Math.max(tankCompare, dpsCompare, supportCompare)
                        let highestClass
                        let rankIcon

                        if (tankCompare === highestRank) {
                            highestClass = "Tank"
                            rankIcon = json.competitive.tank.rank_img
                        }

                        if (dpsCompare === highestRank) {
                            highestClass = "Damage"
                            rankIcon = json.competitive.damage.rank_img
                        }

                        if (supportCompare === highestRank) {
                            highestClass = "Support"
                            rankIcon = json.competitive.support.rank_img
                        }

                        let profileEmbed = new MessageEmbed()
                            .setTitle(`${playerName}'s Stats`)
                            .setDescription(`Level: ${playerLevel}`)
                            .addField("Quickplay", `Playtime: ${quickplayTime}\n\nGames Played: ${quickplayPlayed}`)
                            .addField("Competitive", `Playtime: ${competitiveTime}\n\nGames Played: ${competitivePlayed}`)
                            .setThumbnail(playerIcon)
                        let competitiveEmbed = new MessageEmbed()
                            .setTitle(`Competitive Stats`)
                            .setDescription("*Only applies for the current Overwatch competitive season.*")
                            .setThumbnail(rankIcon)




                        if (Number.isNaN(tankRank)) {
                            competitiveEmbed.addField("Tank", `Not placed.`)
                        } else {
                            competitiveEmbed.addField("Tank", tankRank.toString())
                        }

                        if (Number.isNaN(dpsRank)) {
                            competitiveEmbed.addField("Damage", `Not placed.`)
                        } else {
                            competitiveEmbed.addField("Damage", dpsRank.toString())
                        }

                        if (Number.isNaN(supportRank)) {
                            competitiveEmbed.addField("Support", `Not placed.`)
                        } else {
                            competitiveEmbed.addField("Support", supportRank.toString())
                        }

                        interaction.editReply({
                            embeds: [profileEmbed, competitiveEmbed]
                        })
                    }
                }


            })
        }

    }

}