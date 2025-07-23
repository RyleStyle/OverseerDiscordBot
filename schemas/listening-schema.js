const mongoose = require("mongoose")

const typeString = {
    type: String,
    required: true
}

const listeningSchema = new mongoose.Schema({
    guildID: typeString,
    guildName: typeString,
    roleID: typeString
})

module.exports = mongoose.model('listeningRole', listeningSchema)
