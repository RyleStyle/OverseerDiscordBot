const {
    SlashCommandBuilder
} = require("@discordjs/builders")
const {
    MessageEmbed,
    Message
} = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('end')
        .setDescription('End a call contest prematurely.')
        .addStringOption(option =>
            option
            .setName('delete-status')
            .setDescription('What should the bot do?')
            .setRequired(true)
            .addChoice('Delete all channels + role.', 'all')
            .addChoice('Only delete voice channels + role.', 'voice')
            .addChoice('Delete nothing.', 'none')
        ),
    async execute(interaction, client) {

        let deleteStatus = interaction.options.getString('delete-status')


        const contestSchema = require("../../schemas/contest-schema")

        const contestDB = (await contestSchema.findOne({
            guildID: interaction.guild.id
        }))

        if (!contestDB) return interaction.reply("You need to /start a contest first.")

        if (contestDB.currentlyPlaying === false) return interaction.reply("You are not currently playing.")
        let contestCategoryID = contestDB.contestCategory;
        let contestantRoleID = contestDB.contestRole;


        let updateChannel = interaction.guild.channels.cache.get(contestDB.updateChannel);

        if (!updateChannel) return interaction.reply("Seems like you've already deleted the update channel... you're on your own.")

        let processingEmbed = new MessageEmbed()
            .setDescription('Processing...')
            .setColor("#FFA500")
        interaction.reply({
            embeds: [processingEmbed]
        })

        let contestEnded = new MessageEmbed()

        let unfiltered = interaction.guild.channels.cache.filter(chan => chan.parentId === contestCategoryID)
        let filtered = interaction.guild.channels.cache.filter(chan => chan.parentId === contestCategoryID && chan.type === "GUILD_VOICE")

        if (deleteStatus === 'all') {

            // Delete everything. 

            for (let channel of unfiltered.values()) {


                if (channel.id !== updateChannel.id) {

                    channel.delete().catch(e => updateChannel.send(`Cannot delete ${channel}!`))

                } 

                if (channel.id === updateChannel.id) {
                    setTimeout(() => {

                        channel.delete().catch(e => updateChannel.send(`Cannot delete ${channel}!`))
                    }, 15 * 1000);
                }

            }

            let contestantRole = interaction.guild.roles.cache.get(contestantRoleID)
            if (contestantRole) {

                contestantRole.delete().catch(e => updateChannel.send(`Cannot delete ${contestantRole}`))

            }

            contestEnded.setDescription('Deleting all channels and roles... this channel will delete in 15 seconds.')

        }

        

        if (deleteStatus === 'voice') {

            // Delete VCs and Role


            for (let channel of filtered.values()) {

                if (channel.type === 'GUILD_VOICE') {

                    channel.delete().catch(e => updateChannel.send(`Cannot delete ${channel}!`))

                } 

            }

            let contestantRole = interaction.guild.roles.cache.get(contestantRoleID)
            if (contestantRole) {

                contestantRole.delete().catch(e => updateChannel.send(`Cannot delete ${contestantRole}`))

            }

            contestEnded.setDescription('Deleting all channels and roles... besides this one.')


        }

        

        if (deleteStatus === 'none') {

            // Delete nothing.

            contestEnded.setDescription('Contest ended. Nothing will be deleted (but if you start another contest, new channels/role will be made).')

        }

        
        let contestUpdate = await contestSchema.findOneAndUpdate({
            guildID: interaction.guild.id
        }, {
            guildName: interaction.guild.name,
            currentlyPlaying: false,
            locked: false,
            contestRole: "N/A",
            updateChannel: "N/A",
            contestCategory: "N/A"
        }, {
            //upsert: true
        })


        // edit processing embed to compelte here 

        await updateChannel.send({
            embeds: [contestEnded]
        })

    }
}