const mongoose = require('mongoose');

const previousPerformanceSchema = new mongoose.Schema({
  matchesPlayed: Number,
  runs: Number,
  wickets: Number,
  bat_avg: Number,
  bat_strike: Number,
  Economy: Number
}, { _id: false });

const reauctionPlayerSchema = new mongoose.Schema({
  playerID: { type: Number, unique: true, required: true },
  playerName: String,
  Age: Number,
  playerType: String,
  battingStyle: String,
  bowlingStyle: String,
  playerPhone: String,
  playerPhoto: String,
  playingFrequency: String,
  previousPerformance: previousPerformanceSchema,
  soldPoints: Number,
  playerStatus: {
    type: String,
    enum: ["sold", "unsold"],
    default: "unsold"
  },
  reason: String,
  reAuctionStatus: {
    type: String,
    enum: ['Pending', 'Auctioned'],
    default: 'Pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('ReAuctionPlayer', reauctionPlayerSchema);
