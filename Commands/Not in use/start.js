const {
    SlashCommandBuilder
} = require("@discordjs/builders");
const {
    IntegrationExpireBehavior
} = require("discord-api-types/v10");
const {
    MessageEmbed
} = require("discord.js");

module.exports = {
    description: "Start a \"Last in Call\" contest. When you use this command, the bot will create a category, channel, and role for the contest. Further instructions will be posted by the bot and it will walk you through the process.",
    data: new SlashCommandBuilder()
        .setName('start')
        .setDescription('Sets up a "Last in Call" contest.'),
    async execute(interaction, client) {

        if (!interaction.member.permissions.has("MANAGE_CHANNELS") || !interaction.member.permissions.has("MANAGE_ROLES")) return interaction.reply("You can't use this command, you need the `MANAGE_CHANNELS` and `MANAGE_ROLES` permissions!")

        let permReasons = new MessageEmbed()
            .setAuthor({
                name: "I'm missing some permissions..."
            })
            .setDescription("I need the `MANAGE_CHANNELS`, `MANAGE_ROLES`, and `MENTION_EVERYONE` permissions. Please try this command again once I have these permissions.")
            .addFields({
                name: "MANAGE_CHANNELS",
                value: "I need this permission to create the contest category/channels."
            }, {
                name: "MANAGE_ROLES",
                value: "I need this permission to create the contest role, and add/remove it from users."
            }, {
                name: "MENTION_EVERYONE",
                value: "I need this permission to mention the contestants role for updates."
            })
            .setColor("#FF0000")


        if (!interaction.guild.me.permissions.has("MANAGE_CHANNELS") || !interaction.guild.me.permissions.has("MANAGE_ROLES") || !interaction.guild.me.permissions.has("MENTION_EVERYONE")) return interaction.reply({
            embeds: [permReasons]
        })
        let creatingEmbed = new MessageEmbed()
            .setDescription(`Working...`)
            .setColor("#FFA500")
        await interaction.reply({
            embeds: [creatingEmbed]
        })

        let contestantRole
        interaction.guild.roles.create({
            name: "Contestant",
            color: "aaa1db",
            hoist: true
        }).then(r => {
            contestantRole = r
        })

        let contestCategory
        interaction.guild.channels.create("Contest", {
            type: "GUILD_CATEGORY",
            permissionOverwrites: [{
                    id: interaction.guild.id,
                    allow: ["VIEW_CHANNEL", "CONNECT"],
                    deny: ["SEND_MESSAGES"]
                },
                {
                    id: client.user.id,
                    allow: ["SEND_MESSAGES", "MANAGE_CHANNELS", "MENTION_EVERYONE", "VIEW_CHANNEL", "CONNECT"]
                }
            ]
        }).then(async category => {
            contestCategory = category;

        })

        let updateChannel
        interaction.guild.channels.create("updates", {
            type: "GUILD_TEXT",
            topic: "Updates for the contest.",
        }).then(async chan => {

            updateChannel = chan
            chan.setParent(contestCategory.id)

            creatingEmbed.setDescription(`Initial setup completed. Please check ${updateChannel} for further instructions.`)
            creatingEmbed.setColor("#00FF00")
            await interaction.editReply({
                embeds: [creatingEmbed]
            })

            let instructionsEmbed = new MessageEmbed()
                .setAuthor({
                    name: "Further Instructions"
                })
                .setDescription(`The bot has created this category, channel, and role (${contestantRole}) for the call contest. You can change the names/position/color/etc of these if you'd like, but do not delete them!\n\nIf you ever need to end the contest, use \`/end\``)
                .addFields({
                    name: "Where are the voice channels?",
                    value: `You need to create the voice channels. As long as they are in this category, \`${contestCategory.name}\`, they will count towards the contest.`,
                    inline: true
                }, {
                    name: "What do I do once I've created the channels?",
                    value: "Get all of your contestants in the voice channels. Once they're all in, use the \`/lock\` command to lock the channels and __start the contest__.",
                    inline: true
                }, {
                    name: "What does the /lock command do?",
                    value: "The lock command will prevent any more users from joining the channels. Users already in the channels with the contest role will be able to move around in the channels freely until they are disqualified.",
                    inline: true
                }, )
                .setThumbnail(interaction.guild.iconURL())
                .setColor("#00FF00")
            chan.send({
                content: `${interaction.user}`,
                embeds: [instructionsEmbed]
            })
            interaction.user.send('Very important note: Do NOT move the contestant role above the "Overseer" role or else I will not be able to manage it!')


            const contestSchema = require("../../schemas/contest-schema")

            const contestFindDB = (await contestSchema.findOne({
                guildID: interaction.guild.id
            }))

            if (!contestFindDB) {

                await new contestSchema({
                    guildID: interaction.guild.id,
                    currentlyPlaying: true,
                    locked: false,
                    guildName: interaction.guild.name,
                    contestRole: contestantRole.id,
                    updateChannel: updateChannel.id,
                    contestCategory: contestCategory.id
                }).save()

            } else if (contestFindDB) {


                const contestUpdate = await contestSchema.findOneAndUpdate({
                    guildID: interaction.guild.id
                }, {
                    guildName: interaction.guild.name,
                    currentlyPlaying: true,
                    locked: false,
                    contestRole: contestantRole.id,
                    updateChannel: updateChannel.id,
                    contestCategory: contestCategory.id
                }, {
                    //upsert: true
                })


            }
        })
    }
}