/*
    /;    ;\
                                  __  \\____//
                                 /{_\_/   `'\____
                                 \___   (o)  (o  }
      _____________________________/          :--'
  ,-,'`@@@@@@@@       @@@@@@         \_    `__\
 ;:(  @@@@@@@@@        @@@             \___(o'o)
 :: )  @@@@          @@@@@@        ,'@@(  `===='
 :: : @@@@@:          @@@@         `@@@:
 :: \  @@@@@:       @@@@@@@)    (  '@@@'
 ;; /\      /`,    @@@@@@@@@\   :@@@@@)
 ::/  )    {_----------------:  :~`,~~;
;;'`; :   )                  :  / `; ;
;;;; : :   ;                  :  ;  ; :
`'`' / :  :                   :  :  : :
   )_ \__;      ";"          :_ ;  \_\       `,','
   :__\  \    * `,'*         \  \  :  \   *  8`;'*
       `^'     \ :/           `^'  `-^-'   \v/ :
*/


const mongoose = require("mongoose")
//const overwatch = require("overwatch-api");
require("dotenv").config()



const {
    testingValue
} = require('./config.json');

let token = '';


if (testingValue) {
    token = process.env.testToken
} else {
    token = process.env.mainToken
}

const {
    Client,
    Collection,
    ReactionCollector,
    Message,
    MessageEmbed,
    MessageAttachment,
    Intents,
    Options,
    ActivityFlags,
    NewsChannel
} = require('discord.js');


// Used for DM functions below

const ryleID = '';
// Makes it easier to retrieve IDs and Users

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.GUILD_INVITES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_VOICE_STATES
    ],
    makeCache: Options.cacheWithLimits({
        MessageManager: 200, // This is default
        PresenceManager: 0,
        // Add more class names here
    })
});

const fs = require("fs");
const {
    get
} = require('http');
const {
    type,
    getPriority
} = require('os');
const listeningSchema = require("./schemas/listening-schema");
const streamingSchema = require("./schemas/streaming-schema");
const gamingSchema = require("./schemas/gaming-schema");
const gamesSchema = require("./schemas/games-schema")
const contestSchema = require("./schemas/contest-schema")
const owSchema = require("./schemas/overwatch-schema")
const {
    REST
} = require("@discordjs/rest");
const {
    Routes
} = require("discord-api-types/v9");
const {
    triggerAsyncId
} = require("async_hooks");
//const lock = require("./Commands/contest/lock");



/*
Main Commands
*/

const mainFiles = fs.readdirSync("./Commands/main").filter(file => file.endsWith(".js"))
//const contestFiles = fs.readdirSync("./Commands/contest").filter(file => file.endsWith(".js"))
const commands = [];
client.commands = new Collection();

for (const file of mainFiles) {
    const command = require(`./Commands/main/${file}`);
    commands.push(command.data.toJSON());
    client.commands.set(command.data.name, command);
}
/*
for (const file of contestFiles) {
    const command = require(`./Commands/contest/${file}`);
    commands.push(command.data.toJSON());
    client.commands.set(command.data.name, command);
}*/







const devCommands = [];
client.devCommands = new Collection();

const devFiles = fs.readdirSync(`./Commands/dev`).filter(file => file.endsWith(".js"))

for (const file of devFiles) {

    const command = require(`./Commands/dev/${file}`);
    devCommands.push(command.data.toJSON());
    client.devCommands.set(command.data.name, command);
}
/*
    const mainFiles = fs.readdirSync(`./Commands/main`).filter(file => file.endsWith(".js"))

    for (const file of mainFiles) {

        const devCommand = require(`./Commands/main/${file}`);
        console.log(devCommand.data.name)
        devCommands.push(devCommand.data.toJSON());
        client.devCommands.set(devCommand.data.name, devCommand);
    }
*/


// need to push

/*
// Top gg

const Topgg = require("@top-gg/sdk")
const express = require("express")

const app = express()

const webhook = new Topgg.Webhook(webhookAuth)


app.post("/topgg", webhook.listener(vote => {

    const voteGuild = client.guilds.cache.get('')
    const voteChannel = voteGuild.channels.cache.get('')
    const voteUser = client.users.cache.get(vote.user)

    let voteEmbed = new MessageEmbed()
    .setDescription(`[A user has voted for Overseer! Vote here.](https://top.gg/bot/${process.env.BOT_CLIENT_ID}/vote)\n\nThank you for voting ${voteUser.tag}!`)
    .setFooter({ text: `Perks for voting may come out in the near future.`})
    .setColor("#228B22")
    
    let msg = "";
    if (voteUser) {
        msg = voteUser.toString()
        voteEmbed.setThumbnail(voteUser.displayAvatarURL())
    }

    voteChannel.send({ content: msg, embeds: [voteEmbed] })
    console.log(`${vote.user} just voted.`)

}))

app.listen(process.env.PORT || 3000)
*/
const {
    AutoPoster
} = require('topgg-autoposter');

const ap = AutoPoster(process.env.topggToken, client)

ap.on('posted', () => {
    console.log('Posted stats to Top.gg!')
})







let connectedToDB = false;

client.once('ready', async () => {

    const mainGuild = client.guilds.cache.get(process.env.MAIN_GUILD_ID || "")
    const testGuild = client.guilds.cache.get(process.env.TEST_GUILD_ID || "")
    const devGuild = client.guilds.cache.get(process.env.DEV_GUILD_ID || "")

    //testGuild.commands.set([])
    //client.application.commands.set([])
    //devGuild.devCommands.set([])



    await mongoose.connect(
        process.env.mongoToken, {
        })

    connectedToDB = true;


    let statusArray = ['over Discord', 'your status', 'many people', 'always...']
    let randomNumber = Math.floor(Math.random() * statusArray.length)
    let randomStatus = statusArray[randomNumber]

    let totalGuilds = client.guilds.cache.size;
    let totalUsers = client.users.cache.filter(u => !u.bot).size;

    client.user.setActivity({
        name: `statuses`,
        type: 'WATCHING'
    });

    setInterval(() => {

        let totalGuilds = client.guilds.cache.size;
        let totalUsers = client.users.cache.filter(u => !u.bot).size;

        client.user.setActivity({
            name: `statuses`,
            type: 'WATCHING'
        });

    }, 10 * (1000 * 60)); // 10 minutes



    // Load commands.

    const clientID = client.user.id;
    const rest = new REST({
        version: "9"
    }).setToken(token);

    (async () => {
        try {

            if (testingValue) {

                // Bot is on it's testing account.
                // Writing to the test guild.


                console.log(commands)

                console.log('Writing to GUILD.')
                await rest.put(
                    Routes.applicationGuildCommands(clientID, process.env.TEST_GUILD_ID || ''), {
                        body: devCommands
                    },
                );

                /*
                await rest.put(
                    Routes.applicationGuildCommands(clientID, ''), {
                        body: devCommands
                    },
                );*/


            } else {

                // Bot is on it's main account.

                console.log('Writing to CLIENT.')
                await rest.put(
                    Routes.applicationCommands(clientID), {
                        body: commands
                    },
                );



                // Dev Server
                console.log('Writing to DEV GUILD.')
                await rest.put(
                    Routes.applicationGuildCommands(clientID, process.env.DEV_GUILD_ID || ''), {
                        body: devCommands
                    },
                );
            }
        } catch (error) {
            console.error(error);
        }
    })();





    let today = new Date()

    let currentHoursMilitary = today.getHours()
    let suffix = currentHoursMilitary >= 12 ? "PM" : "AM";

    let currentHours = ((currentHoursMilitary + 11) % 12 + 1)


    let currentMinutes = today.getMinutes()


    if (currentMinutes.toString().length === 1) {
        let currentMinutesSingle = "0" + currentMinutes

        // Hours are over 12, so it's been subtracted. Minute length is 1 character.
        console.log(`[${currentHours}:${currentMinutesSingle} ${suffix}] Online.`)
    } else {

        // Hours are over 12, so it's been subtracted. Minute length is 2 characters.
        console.log(`[${currentHours}:${currentMinutes} ${suffix}] Online.`)
    }


});

// This is for the funny overwatch thing at the bottom of this event.
let statusCheck = new Set()

client.on('presenceUpdate', async (oldPresence, newPresence) => {


    if (newPresence.user.bot) return;

    let listeningStatus = false;
    let streamingStatus = false;
    let gamingStatus = false;
    let knownGame = false;
    let currentStatus
    // Just defining for later.

    const gamesDB = (await gamesSchema.findOne({
        guildID: newPresence.guild.id
    }))

    for (let i = 0; i < newPresence.activities.length; i++) {


        if (newPresence.activities[i].type === 'LISTENING') {
            listeningStatus = true;
        }
        if (newPresence.activities[i].type === 'STREAMING') {
            streamingStatus = true;
        }
        if (newPresence.activities[i].type === 'PLAYING') {

            gamingStatus = true;
        }

    }


    // Listening Role

    const listeningDB = (await listeningSchema.findOne({
        guildID: newPresence.guild.id
    }))


    if (listeningDB) {
        let listeningRoleID = listeningDB.roleID;
        let listeningRole = newPresence.guild.roles.cache.get(listeningRoleID)

        if (listeningRole) {
            // If there's a listening role.
            if (listeningStatus) {
                // If there's a listening status.
                newPresence.member.roles.add(listeningRole).catch(e => {
                    // If the bot runs into an error. (most likely can't manage role)
                    console.log(`Cannot manage role: ${listeningRole.name} in ${newPresence.member.guild.name}`)
                })

                if (!newPresence.guild.members.cache.has(process.env.OWNER_USER_ID || "")) {
                    // If Ryan is NOT in the server...

                    console.log(`Listening Role Given: ${newPresence.guild.name}`)
                }
            } else {
                // If there's no listening role, stop.

                if (newPresence.member.roles.cache.has(listeningRoleID)) {
                    // If the user has the listening role.

                    newPresence.member.roles.remove(listeningRole).catch(e => {
                        // If the bot runs into an error. (most likely can't manage role)
                        console.log(`Cannot manage role: ${listeningRole.name} in ${newPresence.member.guild.name}`)
                    })
                    if (!newPresence.guild.members.cache.has(process.env.OWNER_USER_ID || "")) {
                        // If Ryan is NOT in the server...

                        console.log(`Listening Role Removed: ${newPresence.guild.name}`)
                    }
                }
            }
        }
    }









    // Streaming Role

    const streamingDB = (await streamingSchema.findOne({
        guildID: newPresence.guild.id
    }))

    if (streamingDB) {
        let streamingRoleID = streamingDB.roleID;
        let streamingRole = newPresence.guild.roles.cache.get(streamingRoleID)

        if (streamingRole) {
            // If there's a streaming role.
            if (streamingStatus) {
                // If there's a streaming status.
                newPresence.member.roles.add(streamingRole).catch(e => {
                    // If the bot runs into an error. (most likely can't manage role)
                    console.log(`Cannot manage role: ${streamingRole.name} in ${newPresence.member.guild.name}`)
                })
                if (!newPresence.guild.members.cache.has(process.env.OWNER_USER_ID || "")) {
                    // If Ryan is NOT in the server...

                    console.log(`Streaming Role Given: ${newPresence.guild.name}`)
                }
            } else {
                // If there's no streaming status, stop.

                if (newPresence.member.roles.cache.has(streamingRoleID)) {
                    // If the user has the streaming role.

                    newPresence.member.roles.remove(streamingRole).catch(e => {
                        // If the bot runs into an error. (most likely can't manage role)
                        console.log(`Cannot manage role: ${streamingRole.name} in ${newPresence.member.guild.name}`)
                    })
                    if (!newPresence.guild.members.cache.has(process.env.OWNER_USER_ID || "")) {
                        // If Ryan is NOT in the server...

                        console.log(`Streaming Role Removed: ${newPresence.guild.name}`)
                    }
                }
            }
        }
    }





    // Gaming Role
    const gamingDB = (await gamingSchema.findOne({
        guildID: newPresence.guild.id
    }))

    if (gamingDB && gamesDB) {
        let gamingRoleID = gamingDB.roleID;
        let gamingRole = newPresence.guild.roles.cache.get(gamingRoleID)
        let specificCheck = gamesDB.specific


        if (gamingRole) {
            // If there's a gaming role.

            if (specificCheck) {
                //true
                if (gamingStatus && knownGame) {
                    // If there's a gaming status.

                    newPresence.member.roles.add(gamingRole).catch(e => {
                        // If the bot runs into an error. (most likely can't manage role)
                        console.log(`Cannot manage role: ${gamingRole.name} in ${newPresence.member.guild.name}`)
                    })
                    if (!newPresence.guild.members.cache.has(process.env.ADMIN_USER_ID)) {
                        // If Ryan is NOT in the server...

                        console.log(`Gaming Role Given: ${newPresence.guild.name}`)
                    }
                } else {
                    // If there's no gaming role, stop.

                    if (newPresence.member.roles.cache.has(gamingRoleID)) {
                        // If the user has the gaming role.

                        newPresence.member.roles.remove(gamingRole).catch(e => {
                            // If the bot runs into an error. (most likely can't manage role)
                            console.log(`Cannot manage role: ${gamingRole.name} in ${newPresence.member.guild.name}`)
                        })
                        if (!newPresence.guild.members.cache.has(process.env.ADMIN_USER_ID)) {
                            // If Ryan is NOT in the server...

                            console.log(`Gaming Role Removed: ${newPresence.guild.name}`)
                        }
                    }
                }
            } else {

                if (gamingStatus) {
                    newPresence.member.roles.add(gamingRole).catch(e => {
                        // If the bot runs into an error. (most likely can't manage role)
                        console.log(`Cannot manage role: ${gamingRole.name} in ${newPresence.member.guild.name}`)
                    })
                    if (!newPresence.guild.members.cache.has(process.env.ADMIN_USER_ID)) {
                        // If Ryan is NOT in the server...

                        console.log(`Gaming Role Given: ${newPresence.guild.name}`)
                    }
                } else {
                    if (newPresence.member.roles.cache.has(gamingRoleID)) {
                        // If the user has the gaming role.

                        newPresence.member.roles.remove(gamingRole).catch(e => {
                            // If the bot runs into an error. (most likely can't manage role)
                            console.log(`Cannot manage role: ${gamingRole.name} in ${newPresence.member.guild.name}`)
                        })
                        if (!newPresence.guild.members.cache.has(process.env.ADMIN_USER_ID)) {
                            // If Ryan is NOT in the server...

                            console.log(`Gaming Role Removed: ${newPresence.guild.name}`)
                        }
                    }
                }
            }


        }
    }







    // Alex is ____
    if (!testingValue) {
        // Not on the test bot lol.


        function sendMsg(servID, chanID, msg) {
            // Function to send a message to a channel.

            let serverToSend = client.guilds.cache.get(servID)
            let channelToSend = serverToSend.channels.cache.get(chanID)
            channelToSend.send(msg)
        }

        function createEmbed(content) {
            let embed = new MessageEmbed()
                .setImage(content)

            return embed
        }

        // Defining the set for if the user is already playing so it doesn't spam.

        // Defining the server that it's going to be used in so we can ignore users who aren't in it.
        let doggoPalace = client.guilds.cache.get("")
        let editChan = doggoPalace.channels.cache.get("")
        let editMsg = await editChan.messages.fetch("")

        if (newPresence.user.id === '') { // User is Alex

            if (statusCheck.has(newPresence.status)) {
                // User is already playing and it's been ackowledged.
                // Do nothing.
            } else {

                statusCheck.delete("online")
                statusCheck.delete("idle")
                statusCheck.delete("dnd")
                statusCheck.delete("offline")
                // User is playing but it has not been acknowledged.
                // Do something.

                // Add the user to the already playing set for next time.
                statusCheck.add(newPresence.status)

                console.log(editMsg.content)

                if (statusCheck.has("online")) {
                    // Alex is online gif.
                    editMsg.edit({
                        embeds: [createEmbed(process.env.ONLINE_GIF)]
                    })
                }

                if (statusCheck.has("idle")) {
                    // Alex is idle gif.
                    editMsg.edit({
                        embeds: [createEmbed(process.env.IDLE_GIF)]
                    })
                }

                if (statusCheck.has("dnd")) {
                    // Alex is on do not disturb gif.
                    editMsg.edit({
                        embeds: [createEmbed(process.env.DND_GIF)]
                    })
                }

                if (statusCheck.has("offline")) {
                    // Alex is offline gif.
                    editMsg.edit({
                        embeds: [createEmbed(process.env.OFFLINE_GIF)]
                    })
                }

            }
        }

    }
})

let cmdCooldown = new Set() // Used for command cooldowns later

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName) || client.devCommands.get(interaction.commandName)

    if (!command) return;


    console.log(`Command Run ${interaction.guild.name}`)
    await command.execute(interaction, client, cmdCooldown)

});
client.on('guildCreate', async guild => {

    let guildID = '';
    let logChanID = '';
    let msgEditID = '';
    let guildUpdateChannel = '';

    if (testingValue) {
        // Bot testing in progress.
        guildID = '';
        logChanID = '';
        msgEditID = '';
    } else {
        // Bot is being hosted on heroku.
        guildID = '';
        logChanID = '';
        msgEditID = '';
        guildUpdateChannel = client.guilds.cache.get(guildID).channels.cache.get('')
    }

    let guildEdit = client.guilds.cache.get(guildID)
    let logChannel = guildEdit.channels.cache.get(logChanID)
    let msgToEdit = await logChannel.messages.fetch(msgEditID)
    let memCount = guild.members.cache.filter(m => !m.user.bot).size;
    let guildMap = client.guilds.cache.map(g => g)






    if (!testingValue) {
        // Bot is running on heroku.

        let guildEmbed = new MessageEmbed()
            .setAuthor({
                name: "Added to Guild",
                iconURL: guild.iconURL()
            })
            .setDescription(`**${guild.name}** with **${memCount}** members.`)
            .setColor("#008000")

        guildUpdateChannel.send({
            embeds: [guildEmbed]
        })
    }




    let embedEdit = new MessageEmbed()
        .setAuthor({
            name: "Guild Stats",
            iconURL: ""
        })
        .setDescription(`Guilds: **${guildMap.length}**\n\nNewest: **${guild.name}** with **${memCount}** members`)

    msgToEdit.edit({
        embeds: [embedEdit]
    })

})
client.on('guildDelete', async guild => {

    if (connectedToDB === true) {

        let listenDelete = (await listeningSchema.deleteMany({
            guildID: guild.id
        }))
        let streamDelete = (await streamingSchema.deleteMany({
            guildID: guild.id
        }))
        let gameDelete = (await gamingSchema.deleteMany({
            guildID: guild.id
        }))
        let gamesDelete = (await gamesSchema.deleteMany({
            guildID: guild.id
        }))
        let contestDelete = (await contestSchema.deleteMany({
            guildID: guild.id
        }))

        // Logging

        let guildID = '';
        let logChanID = '';
        let msgEditID = '';
        let guildUpdateChannel = '';

        if (testingValue) {
            // Bot testing in progress.
            guildID = '';
            logChanID = '';
            msgEditID = '';
        } else {
            // Bot is being hosted on heroku.
            guildID = '';
            logChanID = '';
            msgEditID = '';
            guildUpdateChannel = client.guilds.cache.get(guildID).channels.cache.get('')
        }

        let guildEdit = client.guilds.cache.get(guildID)
        let logChannel = guildEdit.channels.cache.get(logChanID)
        let msgToEdit = await logChannel.messages.fetch(msgEditID)
        let memCount = guild.members.cache.filter(m => !m.user.bot).size;
        let guildMap = client.guilds.cache.map(g => `**${g.name}** with **${g.members.cache.filter(m => !m.user.bot).size}** members.`)
        let newestGuild = guildMap[guildMap.length - 1]

        console.log(guildMap)





        if (!testingValue) {
            // Bot is running on heroku.

            let guildEmbed = new MessageEmbed()
                .setAuthor({
                    name: "Removed from Guild",
                    iconURL: guild.iconURL()
                })
                .setDescription(`**${guild.name}** with **${memCount}** members.`)
                .setColor("#880808")

            guildUpdateChannel.send({
                embeds: [guildEmbed]
            })
        }





        let embedEdit = new MessageEmbed()
            .setAuthor({
                name: "Guild Stats",
                iconURL: ""
            })
            .setDescription(`Guilds: **${guildMap.length}**\n\nNewest: ${newestGuild}`)

        msgToEdit.edit({
            embeds: [embedEdit]
        })

    }
});
/*
client.on('rateLimit', async (rateLimitInfo) => {

    const logGuild = client.guilds.cache.get('')
    const normalLogs = logGuild.channels.cache.get('')


    console.log(`Rate Limit Breach!\n\nInfo: ${rateLimitInfo}\nLimit: ${rateLimitInfo.limit}\nTime Difference: ${rateLimitInfo.timeDifference}\nPath: ${rateLimitInfo.path}\nMethod: ${rateLimitInfo.method}`)

    console.log('\n\n\n')

    let rateLimitEmbed = new MessageEmbed()
        .setAuthor({
            name: "Rate Limit",
            iconURL: ""
        })
        .addField(`Info`, rateLimitInfo.toString())
        .addField(`Limit`, rateLimitInfo.limit.toString())
        .addField(`Time Difference`, rateLimitInfo.timeDifference.toString())
        .addField(`Path`, rateLimitInfo.path.toString())
        .addField(`Method`, rateLimitInfo.path.toString())
        .addField(`Route`, rateLimitInfo.route.toString())
        .addField(`Timeout`, rateLimitInfo.timeout.toString())

    normalLogs.send({
        embeds: [rateLimitEmbed]
    })
});
*/

/*
client.on('voiceStateUpdate', async (oldState, newState) => {

    const contestSchema = require("./schemas/contest-schema")

    const contestDB = (await contestSchema.findOne({
        guildID: oldState.guild.id
    }))

    if (!contestDB) return;

    let currentlyPlaying = contestDB.currentlyPlaying;

    if (oldState.member.user.bot) return;
    if (!currentlyPlaying) return console.log(`${oldState.guild.name} is not playing.`)

    if (!oldState.guild.me.permissions.has("MANAGE_ROLES") || !oldState.guild.me.permissions.has("MANAGE_CHANNELS") || !oldState.guild.me.permissions.has("MENTION_EVERYONE")) {

    }

    let contestCategoryID = contestDB.contestCategory;
    let updateChannel = oldState.guild.channels.cache.get(contestDB.updateChannel)
    let contestRole = oldState.guild.roles.cache.get(contestDB.contestRole)
    let voiceUser = oldState.member.user

    // If the update channel exists it'll send the error there and if it doesn't it'll dm the user.
    if (!updateChannel) return;
    if (!contestCategoryID || !contestRole) return updateChannel.send(`**You deleted something you weren't supposed to (contest category, contestant role, or update channel)! You're going to need to restart the contest. If you're trying to end the contest use /end**`)


    let voiceGuild = client.guilds.cache.get(oldState.guild.id)

    // The user joined a channel
    if (newState.channel) {

        // The channel is a contest channel!
        if (newState.channel.parent.id === contestCategoryID) {

            // If the user already has the role...
            if (!newState.member.roles.cache.has(contestRole.id)) {

                let lockCheck = contestDB.locked;

                if (!lockCheck) {

                    newState.member.roles.add(contestRole.id)

                } else {
                    console.log('Channel is locked!')
                }

            }
        }

    }

    // The user left a contest channel either by leaving completely or switching to a diff channel.
    if (!newState.channel || newState.channel.parent.id !== contestCategoryID) {


        // User does not have contestant role.
        if (!newState.member.roles.cache.has(contestRole.id)) return console.log("Doesn't have contest role.")

        let oldChannel = voiceGuild.channels.cache.get(oldState.channel.id)

        // The user left a contest channel.
        if (oldChannel.parent.id === contestCategoryID) {

            let dcEmbed = new MessageEmbed()
                .setAuthor({
                    name: `${oldState.guild.name}'s Call Contest`,
                    iconURL: oldState.guild.iconURL()
                })
                .setColor("#FF0000")

            dcEmbed.setDescription(`You have left ${oldChannel}! Reconnect to any contest channel within 15 seconds to avoid being disqualified.`)
            newState.member.user.send({
                embeds: [dcEmbed]
            })

            setTimeout(async () => {

                // The user is not in any contest channel. DISQUALIFIED
                if (!newState.channel || newState.channel.parent.id !== contestCategoryID) {
                    // The above statement checks for the "!newState.channel" FIRST so that way the second one doesn't send an error.


                    let contestantsLeft = contestRole.members.size - 1
                    // Subtract 1 because one of the contestants is the person being disqualified.
                    // I tried to put this after I remove the role but the result is the same.

                    newState.member.roles.remove(contestRole.id)


                    dcEmbed.setDescription(`You have been disqualified.`)
                    newState.member.user.send({
                        embeds: [dcEmbed]
                    })
                    updateChannel.send(`**${voiceUser}** has been disqualified! There are \`${contestantsLeft}\` contestants left.`)

                    let winner = "";

                    // Winna winna chicken dinna
                    if (contestantsLeft === 1) {
                        contestRole.members.filter(m => m.user.id !== newState.member.id).forEach(contestant => {
                            // The filter is there so the person who left is not included
                            winner = winner + contestant.user.toString()

                            let congratsEmbed = new MessageEmbed()
                                .setDescription(`You have won the contest! Congratulations.`)
                            contestant.send({
                                embeds: [congratsEmbed]
                            })
                        });

                        // Fancy embed for the winner.

                        let winnerEmbed = new MessageEmbed()
                            .setDescription(`${winner} has won the contest!\n\nNext: Use /end to end the contest.`)
                        updateChannel.send({
                            content: contestRole.toString(),
                            embeds: [winnerEmbed]
                        })

                        let contestUpdate = await contestSchema.findOneAndUpdate({
                            guildID: oldState.guild.id
                        }, {
                            guildName: oldState.guild.name,
                            currentlyPlaying: false,
                            locked: false,
                            contestRole: "N/A",
                            updateChannel: "N/A",
                            contestCategory: "N/A"
                        }, {
                            //upsert: true
                        })
                    }

                    // The user rejoined! Still in the game.
                } else {

                    let stillInEmbed = new MessageEmbed()
                        .setAuthor({
                            name: `${oldState.guild.name}'s Call Contest`,
                            iconURL: oldState.guild.iconURL()
                        })
                        .setDescription("You rejoined a contestant channel. You have not been disqualified.")
                        .setColor("#00FF00")
                    newState.member.user.send({
                        embeds: [stillInEmbed]
                    })
                }
            }, 15 * 1000); // 15 seconds.
        }
    }
}) 
*/
client.on('guildMemberAdd', async member => {

    let supportGuild = client.guilds.cache.get("")
    if (member.guild !== supportGuild) return;

    let welcomeChannel = supportGuild.channels.cache.get("")
    let supportChannel = supportGuild.channels.cache.get("")

    let welcomeEmbed = new MessageEmbed()
        .setDescription(`Welcome to ${member.guild.name} ${member}!\n\nIf you have any questions please use ${supportChannel}.\nYou can now add up to 30 games using /setup for being here!`)
        .setThumbnail(member.displayAvatarURL)
        .setColor("#228B22")

    welcomeChannel.send({
        text: member.toString(),
        embeds: [welcomeEmbed]
    })
})
client.login(token)