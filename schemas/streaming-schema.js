const mongoose = require("mongoose")
const { schema } = require("./listening-schema")

const typeString = {
    type: String,
    required: true
}

const streamingSchema = new mongoose.Schema({
    guildID: typeString,
    guildName: typeString,
    roleID: typeString
})

module.exports = mongoose.model('streamingRole', streamingSchema)
