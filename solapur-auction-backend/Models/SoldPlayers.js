const mongoose = require("mongoose");

const soldPlayerSchema = new mongoose.Schema({
    playerID: {
        type: Number,
        unique: true,
        required: true,
    },

    playerName: {
        type: String,
        required: true,
    },

    playerType: {
        type: String,
        required: true,
    },

    playerPhone: {
        type: String,
        required: true,
    },

    soldPoints: {
        type: Number,
        required: true,
    },

    soldToTeam:{
        type: String,
        required: true
    },

    playerPhoto:{
        type: String
    },

    soldOn:{
        type: Date,
        default: Date.now()
    }
});

const SoldPlayers = mongoose.model('SoldPlayers', soldPlayerSchema);
module.exports = SoldPlayers;