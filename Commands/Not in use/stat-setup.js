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
        .setName('stat-setup')
        .setDescription('Assign your Battle.net account to the bot.')
        .addSubcommand(subcommand =>
            subcommand
            .setName('overwatch')
            .setDescription('Set up Overwatch stats.')
            .addStringOption(option =>
                option
                .setName('platform')
                .setDescription('What platform do you play on?')
                .setRequired(true)
                .addChoice('PC', 'pc')
                .addChoice('Xbox', 'xbl')
                .addChoice('PlayStation', 'psn'))
            .addStringOption(option =>
                option
                .setName('region')
                .setDescription('What region are you in?')
                .setRequired(true)
                .addChoice('US', 'us')
                .addChoice('China', 'cn')
                .addChoice('EU', 'eu')
                .addChoice('Global', 'global')
                .addChoice('Korea', 'kr'))
            .addStringOption(option =>
                option
                .setName('tag')
                .setDescription('What is your BLIZZARD tag?')
                .setRequired(true))
        ),
    async execute(interaction, client, cmdCooldown) {

        if (cmdCooldown.has(interaction.user.id)) {

            interaction.reply("This command has a 60 second cooldown!")
            return;
        }

        cmdCooldown.add(interaction.user.id)
        setTimeout(() => {

            cmdCooldown.delete(interaction.user.id)

        }, 60 * 1000); // 30 second timer.

        let owCmd = interaction.options.getSubcommand() === 'overwatch';

        let owPlatform = interaction.options.getString('platform')
        let owRegion = interaction.options.getString('region')
        let owTag = interaction.options.getString('tag')

        let replaceTag = owTag.replace('#', '-')

        const owSchema = require("../../schemas/overwatch-schema")

        const owFindDB = (await owSchema.findOne({
            userID: interaction.user.id
        }))

        if (!owFindDB) {


            await new owSchema({
                userID: interaction.user.id,
                platform: owPlatform,
                region: owRegion,
                tag: replaceTag
            }).save()

            interaction.reply('Added your profile to the stats command. Use `/ow-stats`.')
        } else {

            const updateDB = await owSchema.findOneAndUpdate({
                userID: interaction.user.id
            }, {
                platform: owPlatform,
                region: owRegion,
                tag: replaceTag
            })

            interaction.reply('Updated your stats.')
        }


    }

}