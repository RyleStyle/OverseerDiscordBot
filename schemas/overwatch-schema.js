const mongoose = require("mongoose")

const typeString = {
    type: String,
    required: true
}

const owStats = new mongoose.Schema({
    userID: typeString,
    platform: typeString,
    region: typeString,
    tag: typeString
})

module.exports = mongoose.model('owStats', owStats)