const mongoose = require('mongoose');

const teamPlayer = new mongoose.Schema({
    playerName:{
        type: String,
        required: true
    },

    playerID:{
        type: Number,
        required: true
    },

    soldPoints:{
        type: Number,
        required: true
    },

    playerType:{
        type: String,
        required: true
    }
}, {_id: false});

const teamSchema = new mongoose.Schema({
    teamID:{
        type: Number,
        required: true
    },

    teamName:{
        type: String,
        required: true
    },

    teamOwner:{
        type: String,
        required: true
    },

    teamTotalPoints:{
        type: Number,
        default: 60000
    },

    teamPlayers:{
        type: [teamPlayer]
    },

    teamLogo:{
        type: String,
        required: true
    }
});

const Team = mongoose.model('Team', teamSchema);
module.exports = Team;