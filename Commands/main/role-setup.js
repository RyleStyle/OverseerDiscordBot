const {
    CommandInteractionOptionResolver,
    MessageEmbed
} = require('discord.js')
const {
    SlashCommandBuilder
} = require("@discordjs/builders")
const {
    db
} = require('../../schemas/listening-schema')
const {
    RPCCloseEventCodes
} = require('discord-api-types/v10')

module.exports = {
    description: "With this command you can assign roles to the listening/streaming/gaming feature. You can also add specific games to the list (the bot will only give the gaming role if these games are being played) or you can even choose to not filter the games, and the bot will give the role regardless of what you are playing.",
    data: new SlashCommandBuilder()
        .setName("role-setup")
        .setDescription("Assign roles or add/remove games")
        .addSubcommand(subcommand =>
            subcommand
            .setName('assign')
            .setDescription('Assign a role to a type of status.')
            .addStringOption(option =>
                option
                .setName('role-type')
                .setDescription('Type of role to assign.')
                .setRequired(true)
                .addChoices({
                    name: "Assign a listening role.",
                    value: "listening"
                }, {
                    name: "Assign a streaming role.",
                    value: "streaming"
                }, {
                    name: "Assign a game role.",
                    value: "gaming"
                })
            )
            .addRoleOption(option =>
                option
                .setName('role-set')
                .setDescription('The role input.')
                .setRequired(true)
            )
        )
        .addSubcommand(subcommand =>
            subcommand
            .setName('game')
            .setDescription('Add/remove games from the game role.')
            .addStringOption(option =>
                option
                .setName('action')
                .setDescription('Manage what games affect the role (if any).')
                .setRequired(true)
                .addChoices({
                    name: "Add a game to the list",
                    value: "add"
                }, {
                    name: "Remove a role from the list",
                    value: "remove"
                }, {
                    name: "Make all games give the role",
                    value: "all"
                })
            )
            .addStringOption(option =>
                option
                .setName('game-name')
                .setDescription('Name of the game to add/remove.')
                .setRequired(false)
            )
        ),
    async execute(interaction, client) {

        if (!interaction.member.permissions.has('MANAGE_ROLES')) return interaction.reply({
            content: "You are missing the permission: `MANAGE_ROLES`",
            ephemeral: true
        })
        if (!interaction.guild.me.permissions.has('MANAGE_ROLES')) return interaction.reply({
            content: "I need the `MANAGE_ROLES` permission! Please give it to me and then try again.",
            ephemeral: true
        })

        let assignCmd = interaction.options.getSubcommand() === 'assign';
        let gameCmd = interaction.options.getSubcommand() === 'game';
        let contestCmd = interaction.options.getSubcommand() === 'contest';

        let gameAction = interaction.options.getString('action')
        let gameName = interaction.options.getString('game-name')
        let roleType = interaction.options.getString('role-type')
        let roleSet = interaction.options.get('role-set');

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





        // Assign Command

        if (assignCmd) {


            let assignedEmbed = new MessageEmbed()
                .setAuthor({
                    name: "Role Assigned",
                    iconURL: interaction.guild.iconURL()
                })





            // LISTENING ROLE

            if (roleType === 'listening') {

                assignedEmbed.setColor("#228b22") // Green because Spotify get it lol

                if (interaction.guild.me.roles.highest.rawPosition < roleSet.role.rawPosition) return interaction.reply({
                    content: `Cannot manage the role: ${roleSet.role}. Please move the 'Overseer' role above ${roleSet.role} and try again.`,
                    ephemeral: true
                })



                if (!listeningFindDB) {

                    await new listeningSchema({
                        guildID: interaction.guild.id,
                        guildName: interaction.guild.name,
                        roleID: roleSet.role.id
                    }).save()

                    assignedEmbed.setDescription(`It seems you haven't set up a listening role for this server before. Adding you to the database.\nRole: ${roleSet.role}`)
                    interaction.reply({
                        embeds: [assignedEmbed],
                        ephemeral: false
                    })

                } else if (listeningFindDB) {

                    const updateDB = await listeningSchema.findOneAndUpdate({
                        guildID: interaction.guild.id
                    }, {
                        guildName: interaction.guild.name,
                        roleID: roleSet.role.id
                    }, {
                        // upsert would go here
                    })

                    assignedEmbed.setDescription(`Listening role updated.\nRole: ${roleSet.role}`)
                    interaction.reply({
                        embeds: [assignedEmbed],
                        ephemeral: false
                    })

                }
            }







            // STREAMING ROLE

            if (roleType === 'streaming') {

                assignedEmbed.setColor("#79218f") // Purple because Twitch!!

                if (interaction.guild.me.roles.highest.rawPosition < roleSet.role.rawPosition) return interaction.reply({
                    content: `Cannot manage the role: ${roleSet.role}. Please move the 'Overseer' role above ${roleSet.role} and try again.`,
                    ephemeral: true
                })




                if (!streamingFindDB) {

                    await new streamingSchema({
                        guildID: interaction.guild.id,
                        guildName: interaction.guild.name,
                        roleID: roleSet.role.id
                    }).save()

                    assignedEmbed.setDescription(`It seems you haven't set up a streaming role for this server before. Adding you to the database.\nRole: ${roleSet.role}`)
                    interaction.reply({
                        embeds: [assignedEmbed],
                        ephemeral: false
                    })


                } else if (streamingFindDB) {

                    const updateDB = await streamingSchema.findOneAndUpdate({
                        guildID: interaction.guild.id
                    }, {
                        guildName: interaction.guild.name,
                        roleID: roleSet.role.id
                    }, {
                        // upsert would go here
                    })

                    assignedEmbed.setDescription(`Streaming role updated.\nRole: ${roleSet.role}`)
                    interaction.reply({
                        embeds: [assignedEmbed],
                        ephemeral: false
                    })

                }
            }







            // GAMING ROLE

            if (roleType === 'gaming') {

                assignedEmbed.setColor("#FF0000") // Red because gaming!

                if (interaction.guild.me.roles.highest.rawPosition < roleSet.role.rawPosition) return interaction.reply({
                    content: `Cannot manage the role: ${roleSet.role}. Please move the 'Overseer' role above ${roleSet.role} and try again.`,
                    ephemeral: true
                })



                if (!gamingFindDB) {

                    await new gamingSchema({
                        guildID: interaction.guild.id,
                        guildName: interaction.guild.name,
                        roleID: roleSet.role.id
                    }).save()

                    assignedEmbed.setDescription(`It seems you haven't set up a gaming role for this server before. Adding you to the database.\n${roleSet.role}`)
                    interaction.reply({
                        embeds: [assignedEmbed],
                        ephemeral: false
                    })

                } else if (gamingFindDB) {

                    const updateDB = await gamingSchema.findOneAndUpdate({
                        guildID: interaction.guild.id
                    }, {
                        guildName: interaction.guild.name,
                        roleID: roleSet.role.id
                    }, {
                        // upsert would go here
                    })

                    assignedEmbed.setDescription(`Gaming role updated.\nRole: ${roleSet.role}`)
                    interaction.reply({
                        embeds: [assignedEmbed],
                        ephemeral: false
                    })

                }
            }
        }












        // Game command.
        if (gameCmd) {

            let gamesEmbed = new MessageEmbed()
                .setAuthor({
                    name: "Game List",
                    iconURL: interaction.guild.iconURL()
                })
                .setColor("#228b22")

            // Add a game to the DB.

            if (gameAction === 'add') {

                if (!gameName) return interaction.reply('Please supply a game name!')
                /*
                if (gamingFindDB === null) return interaction.reply({
                    content: "You need to a assign a role before you can add games. `/setup assign`",
                    ephemeral: true
                })*/



                if (!gamesFindDB) {

                    let newGameArray = [gameName.toLowerCase()]

                    await new gamesSchema({
                        guildID: interaction.guild.id,
                        guildName: interaction.guild.name,
                        games: newGameArray,
                        specific: true
                    }).save()

                    gamesEmbed.setDescription(`It seems you haven't set up any games for this server before. Adding ${gameName} to the database. For a list of added games use \`/setup view\``)
                    interaction.reply({
                        embeds: [gamesEmbed],
                        ephemeral: false
                    })


                } else if (gamesFindDB) {

                    let currentGames = (await gamesSchema.findOne({
                        guildID: interaction.guild.id
                    })).games;

                    if (currentGames.includes(gameName.toLowerCase())) return interaction.reply({
                        content: "You already have added that game.",
                        ephemeral: true
                    })

                    let overseerSupport = client.guilds.cache.get('')

                    if (currentGames.length >= 3 && !overseerSupport.members.cache.get(interaction.user.id)) return interaction.reply({
                        content: "You can only have **three** games added. To be able to add 30, join the support server listed on this bot's profile.",
                        ephemeral: true
                    })

                    if (currentGames.length === 30) return interaction.reply({
                        content: "You have reached the maximum amount of games **(30)**. Please remove some before adding more.",
                        ephemeral: true
                    })

                    if (typeof currentGames !== 'object') return console.log('Err not an object.')

                    console.log(currentGames)
                    currentGames.push(gameName.toLowerCase())
                    console.log(currentGames)

                    const updateDB = await gamesSchema.findOneAndUpdate({
                        guildID: interaction.guild.id
                    }, {
                        guildName: interaction.guild.name,
                        games: currentGames,
                        specific: true
                    }, {
                        // upsert would go here
                    })

                    gamesEmbed.setDescription(`Added ${gameName} as a game. For a list of current games use \`/setup view\``)
                    interaction.reply({
                        embeds: [gamesEmbed],
                        ephemeral: false
                    })

                }

            }






            // Remove a game from the DB.

            if (gameAction === 'remove') {

                if (!gameName) return interaction.reply('Please supply a game name!')

                let currentGames = (await gamesSchema.findOne({
                    guildID: interaction.guild.id
                })).games;

                if (!currentGames.includes(gameName.toLowerCase())) return interaction.reply({
                    content: "That game is not in the database.",
                    ephemeral: true
                })

                if (!gamesFindDB) {

                    gamesEmbed.setDescription(`You don't have any games set up in this server.`)
                    interaction.reply({
                        embeds: [gamesEmbed],
                        ephemeral: true
                    })


                } else if (gamesFindDB) {

                    if (typeof currentGames !== 'object') return console.log('Err not an object.')

                    console.log(currentGames)
                    console.log(currentGames.filter(del => del !== gameName.toLowerCase()))

                    const updateDB = await gamesSchema.findOneAndUpdate({
                        guildID: interaction.guild.id
                    }, {
                        guildName: interaction.guild.name,
                        games: currentGames.filter(del => del !== gameName.toLowerCase()),
                        specific: true
                    }, {
                        // upsert would go here
                    })

                    gamesEmbed.setDescription(`Removed ${gameName} as a game. For a list of current games use \`/setup view\``)
                    interaction.reply({
                        embeds: [gamesEmbed],
                        ephemeral: false
                    })

                }
            }



            // Use all games

            if (gameAction === 'all') {


                if (!gamesFindDB) {

                    let newGameArray = []

                    await new gamesSchema({
                        guildID: interaction.guild.id,
                        guildName: interaction.guild.name,
                        games: newGameArray,
                        specific: false
                    }).save()

                    gamesEmbed.setDescription(`It seems you haven't set up any games for this server before. All games will now contribute towards adding/removing the gaming role. For a list of added games and more use \`/setup view\``)
                    interaction.reply({
                        embeds: [gamesEmbed],
                        ephemeral: false
                    })


                } else if (gamesFindDB) {

                    let currentGames = (await gamesSchema.findOne({
                        guildID: interaction.guild.id
                    })).games;

                    const updateDB = await gamesSchema.findOneAndUpdate({
                        guildID: interaction.guild.id
                    }, {
                        guildName: interaction.guild.name,
                        specific: false
                    }, {
                        // upsert would go here
                    })

                    gamesEmbed.setDescription(`You are now using ALL games. To start using the list again, simply add/remove a game from the list.`)
                    interaction.reply({
                        embeds: [gamesEmbed],
                        ephemeral: false
                    })
                }

            }

        }
    }
}