const mongoose = require('mongoose');

const previousPerformanceSchema = new mongoose.Schema({
    matchesPlayed:{
        type: Number,
        default: 0
    },

    runs:{
        type: Number,
        default: 0
    },

    wickets:{
        type: Number,
        default: 0
    },

    bat_avg:{
        type:Number,
        default: 0
    },

    bat_strike:{
        type:Number,
        default: 0
    },

    Economy:{
        type: Number,
        default: 0
    }
}, {_id: false});

const playerSchema = new mongoose.Schema({
    playerID:{
        type: Number,
        unique: true,
        required: true
    },

    playerName:{
        type: String,
        required: true
    },

    Age:{
        type: Number,
        required: true
    },

    playerType:{
        type: String,
        required: true
    },

    battingStyle:{
        type: String,
        required: true
    },

    bowlingStyle:{
        type: String,
        required: true
    },

    playerPhone:{
        type: String,
        required: true
    },

    playerPhoto:{
        type: String
    },

    playingFrequency:{
        type: String,
        required: true
    },

    previousPerformance:{
        type: previousPerformanceSchema
    },

    soldPoints:{
        type: Number,
        default: 0
    },

    playerStatus:{
        type: String,
        enum:["sold", "unsold"],
        default: "unsold"
    },

}, {timestamps: true});

const Player = mongoose.model('Player', playerSchema);
module.exports = Player;