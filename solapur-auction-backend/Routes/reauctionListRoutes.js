const express = require('express');
const router = express.Router();
const ReAuctionPlayer = require('../Models/ReauctionModel');
const Player = require('../Models/PlayerModel');
// Add player to re-auction list
router.post('/add', async (req, res) => {
  try {
    const {
      playerID,
      playerName,
      Age,
      playerType,
      battingStyle,
      bowlingStyle,
      playerPhone,
      playerPhoto,
      playingFrequency,
      previousPerformance,
      soldPoints,
      playerStatus,
      reason
    } = req.body;

    const exists = await ReAuctionPlayer.findOne({ playerID });
    if (exists) {
      return res.status(409).json({ success: false, message: 'Player already in re-auction list' });
    }

    const reAuctionPlayer = new ReAuctionPlayer({
      playerID,
      playerName,
      Age,
      playerType,
      battingStyle,
      bowlingStyle,
      playerPhone,
      playerPhoto,
      playingFrequency,
      previousPerformance,
      soldPoints,
      playerStatus,
      reason,
      reAuctionStatus: 'Pending' // default status
    });

    await reAuctionPlayer.save();
    await Player.deleteOne({ playerID });

    res.status(201).json({ success: true, data: reAuctionPlayer });
  } catch (err) {
    console.error("Error adding to re-auction list:", err);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});


// Get all players in re-auction list
router.get('/', async (req, res) => {
  try {
    const players = await ReAuctionPlayer.find();
    res.status(200).json({ success: true, data: players });
  } catch (err) {
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// Update status of a re-auctioned player
router.patch('/markAuctioned/:playerID', async (req, res) => {
  try {
    const playerID = parseInt(req.params.playerID);
    const player = await ReAuctionPlayer.findOneAndUpdate(
      { playerID },
      { reAuctionStatus: 'Auctioned' },
      { new: true }
    );
    if (!player) {
      return res.status(404).json({ success: false, message: 'Player not found in re-auction list' });
    }
    res.status(200).json({ success: true, data: player });
  } catch (err) {
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// Optional: Remove from re-auction list
router.delete('/:playerID', async (req, res) => {
  try {
    const result = await ReAuctionPlayer.deleteOne({ playerID: parseInt(req.params.playerID) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: 'Player not found' });
    }
    res.status(200).json({ success: true, message: 'Player removed from re-auction list' });
  } catch (err) {
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

module.exports = router;
