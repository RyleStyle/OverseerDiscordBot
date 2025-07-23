const {
    SlashCommandBuilder
} = require("@discordjs/builders")
const {
    IntegrationExpireBehavior
} = require("discord-api-types/v10")
const {
    MessageEmbed,
    Collection
} = require("discord.js")
const {
    fs, readdir
} = require("fs")
module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Help command.'),
    async execute(interaction) {


        const {
            readdirSync
        } = require("fs")


        /*
        Public Commands
        */

        const mainFiles = readdirSync("./Commands/main").filter(file => file.endsWith(".js"))

        let mainEmbed = new MessageEmbed()
            .setAuthor({
                name: "Main Commands",
                iconURL: interaction.member.displayAvatarURL()
            })
            .setDescription(`[Support Server](${process.env.DISCORD_SUPPORT_SERVER})`)
            .setColor("#228B22")

        for (let file of mainFiles) {
            const command = require(`../../Commands/main/${file}`);

            let desc

            if (command.description) {
                // If there is a detailed description to be used.
            desc = command.description
            } else {
                desc = command.data.description
            }

            mainEmbed.addField(`/${command.data.name}`, desc)

        }


        // Game Stats

        const gameFiles = readdirSync("./Commands/game-stats").filter(file => file.endsWith(".js"))

        let gameEmbed = new MessageEmbed()
            .setAuthor({
                name: "Stat Commands",
                iconURL: interaction.member.displayAvatarURL()
            })
            .setDescription(`Get stats for supported games! More coming soon.`)
            .setColor("#228B22")

        for (let file of gameFiles) {
            const command = require(`../../Commands/game-stats/${file}`);

            if (command.description) {
                // If there is a detailed description to be used.
            desc = command.description
            } else {
                desc = command.data.description
            }

            gameEmbed.addField(`/${command.data.name}`, desc)

        }

        /*
        const contestFiles = readdirSync("./Commands/contest").filter(file => file.endsWith(".js"))

        let contestEmbed = new MessageEmbed()
            .setAuthor({
                name: "Contest Commands",
                iconURL: interaction.member.displayAvatarURL()
            })
            .setDescription(`Contest commands are used for the call contest.\n\nA call contest is a feature with this bot where you can set up a contest for how long people can stay in a voice call(s). The last one standing wins!`)
            .setColor("#228B22")

        for (let file of contestFiles) {
            const command = require(`../../Commands/contest/${file}`);

            if (command.description) {
                // If there is a detailed description to be used.
            desc = command.description
            } else {
                desc = command.data.description
            }

            contestEmbed.addField(`/${command.data.name}`, desc)

        }
        */ 
        await interaction.reply({
            embeds: [mainEmbed, gameEmbed],
            ephemeral: false
        })



        /*
        Dev Commands
        

        if (interaction.user.id === '') {

            const devFiles = readdirSync("./Commands/dev").filter(file => file.endsWith(".js"))

            let devEmbed = new MessageEmbed()
                .setAuthor({
                    name: "Dev Commands",
                    iconURL: interaction.member.displayAvatarURL()
                })
                .setDescription(`[You can only use these commands in the dev server.](${process.env.DISCORD_DEV_SERVER})`)
                .setColor("#228B22")

            for (let file of devFiles) {
                const command = require(`../../Commands/dev/${file}`);

                console.log(command.data.name)

                devEmbed.addField(`/${command.data.name}`, command.data.description)

            }
            await interaction.followUp({
                embeds: [devEmbed],
                ephemeral: true
            })
        }*/
    }

}