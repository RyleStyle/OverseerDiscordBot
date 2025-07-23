const { type } = require("express/lib/response")
const mongoose = require("mongoose")

const typeString = {
    type: String,
    required: true
}

const typeBoolean = {
    type: Boolean,
    required: true
}

const contestSchema = new mongoose.Schema({
    guildID: typeString,
    currentlyPlaying: typeBoolean,
    locked: typeBoolean,
    guildName: typeString,
    contestRole: typeString,
    updateChannel: typeString,
    contestCategory: typeString
})

module.exports = mongoose.model('contest', contestSchema)
