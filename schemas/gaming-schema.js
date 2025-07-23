const mongoose = require("mongoose")

const typeString = {
    type: String,
    required: true
}

const gamingSchema = new mongoose.Schema({
    guildID: typeString,
    guildName: typeString,
    roleID: typeString
})

module.exports = mongoose.model('gamingRole', gamingSchema)
