const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
    data: new SlashCommandBuilder()
    .setName('lock')
    .setDescription('Lock the contest channels. (USE /START FIRST)'),
    async execute(interaction, client) {

        if (!interaction.member.permissions.has("MANAGE_CHANNELS") || !interaction.member.permissions.has("MANAGE_ROLES")) return interaction.reply("You can't use this command, you need the `MANAGE_CHANNELS` and `MANAGE_ROLES` permissions!")

        const { MessageEmbed } = require("discord.js")

        const contestSchema = require("../../schemas/contest-schema")

        const contestDB = (await contestSchema.findOne({
            guildID: interaction.guild.id
        }))

        if (!contestDB) return interaction.reply("You need to /start a contest first. (missing contest category/role/update channel)")

        let contestCategoryID = contestDB.contestCategory;
        let contestantRoleID = contestDB.contestRole;


        let updateChannel = interaction.guild.channels.cache.get(contestDB.updateChannel);

        if (!contestCategoryID || !interaction.guild.roles.cache.get(contestantRoleID) || !updateChannel) return interaction.reply("You need to /start a contest first. (missing contest category/role/update channel)")

        let filtered = interaction.guild.channels.cache.filter(chan => chan.parentId === contestCategoryID && chan.type === "GUILD_VOICE")

        for (let channel of filtered.values()) {

            channel.permissionOverwrites.set([{
                    id: interaction.guild.id,
                    deny: ["CONNECT"],
                    allow: ["VIEW_CHANNEL"]
                },
                {
                    id: contestantRoleID,
                    allow: ["CONNECT", "VIEW_CHANNEL"]
                },
                {
                    id: client.user.id,
                    allow: ["VIEW_CHANNEL", "MANAGE_CHANNELS", "CONNECT"]
                }
            ])
        }

        interaction.reply(`Locked all channels in the contest category.`)

        let lockedEmbed = new MessageEmbed()
            .setAuthor({
                name: "LET THE GAMES BEGIN"
            })
            .setDescription(`All channels have been locked! **The contestant role will not be given out anymore.** If someone needs to join the contest for whatever reason a moderator can give them the role.`)
            .addFields({
                name: "So now what?",
                value: `Just sit in the voice channel(s). As long as you are in one of the voice channels under this category, you won't be disqualified. **If for any reason you switch to a non-contestant voice channel, leave a voice channel completely, or are disconnected for any reason, you will have 15 seconds to rejoin before being disqualified.`
            })

        updateChannel.send({ content: interaction.guild.roles.cache.get(contestantRoleID).toString(), embeds: [lockedEmbed] })

        let contestUpdate = await contestSchema.findOneAndUpdate({
            guildID: interaction.guild.id
        }, {
            guildName: interaction.guild.name,
            locked: true,
        }, {
            //upsert: true
        })

    }
}