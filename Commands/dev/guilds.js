const {
    SlashCommandBuilder
} = require("@discordjs/builders")
const {
    MessageEmbed
} = require("discord.js");
module.exports = {
    data: new SlashCommandBuilder()
        .setName('guilds')
        .setDescription('Dev Command.'),
    async execute(interaction, client) {

        
        if (interaction.user.id !== process.env.ADMIN_USER_ID) return interaction.reply({ content: "You are not permitted to use this command.", ephemeral: true })

        let guildSort = client.guilds.cache.sort((a, b) => b.members.cache.filter(m => !m.user.bot).size - a.members.cache.filter(m => !m.user.bot).size)
        let guildMap = guildSort.map(g => `\`${g.name}\`: \`${g.members.cache.filter(m => !m.user.bot).size}\`\n`)

        
        let gText = guildMap[0];
        let guildCount = client.guilds.cache.map(g => g).length;

        for (let i = 1; i < guildCount; i++) {

            gText = gText + guildMap[i]
        }

        let totalUsers = 0;
        client.guilds.cache.forEach(g => {

            console.log(g.members.cache.filter(m => !m.user.bot).size)
            totalUsers += g.members.cache.filter(m => !m.user.bot).size
        });
        let allGuilds = new MessageEmbed()
        .setAuthor({ name: `Total Users: ${totalUsers}`, iconURL: client.user.displayAvatarURL()})
        .setDescription(`Guild Count: **${guildCount}**\n\n${gText}`)
        .setColor("#228B22")

        interaction.reply({ embeds: [allGuilds], ephemeral: true })
        

    }
}

