const {
    SlashCommandBuilder
} = require("@discordjs/builders")
const {
    MessageEmbed
} = require("discord.js");
const {
    get
} = require("express/lib/response");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Dev Command.'),
    async execute(interaction, client) {


        const warnSchema = require("../../schemas/warn-schema")

        const warnFindDB = (await warnSchema.findOne.findOne({
            guildId: message.guild.id
        }, (err, guild)))
        let user = guild.warnings.find(u => u.userId === member.id);
        if (!user) {
            user = {
                userId: member.id,
                warnings: []
            };
            guild.warnings.push(user);
        }

        const newWarning = {
            warningId: user.warnings.length + 1,
            reason: reason
        };

        user.warnings.push(newWarning);

        guild.save(err => {
            if (err) {
                console.error(err);
                return message.reply('Failed to add warning to database.');
            }

            message.channel.send(`${member.user.tag}, you have been warned for: ${reason} (Warning ID: ${newWarning.warningId})`);
        });
    }
}