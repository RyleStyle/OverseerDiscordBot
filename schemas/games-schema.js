const mongoose = require("mongoose")

const typeString = {
    type: String,
    required: true
}
const obj = {
    type: Object,
    required: true
}
const typeBoolean = {
    type: Boolean,
    required: true
}

const gameListSchema = new mongoose.Schema({
    guildID: typeString,
    guildName: typeString,
    games: obj,
    specific: typeBoolean
})

module.exports = mongoose.model('gameList', gameListSchema)
