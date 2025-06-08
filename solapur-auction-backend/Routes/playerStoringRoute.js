const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload'); // Adjust path as needed
const xlsx = require('xlsx');
const fs = require('fs');
const Player = require('../Models/PlayerModel');

router.post('/upload-excel', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded!" });

    const workbook = xlsx.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const players = xlsx.utils.sheet_to_json(sheet);

    const insertedPlayers = [];

    for (const player of players) {
      if (!player.playerID || !player.playerName || !player.Age || !player.playerPhone) {
        console.warn("⚠️ Skipping incomplete row:", player);
        continue;
      }

      const newPlayer = new Player({
        playerID: player.playerID,
        playerName: player.playerName,
        Age: Number(player.Age),
        playerType: player.playerType || 'unknown',
        battingStyle: player.battingStyle,
        bowlingStyle: player.bowlingStyle,
        playerPhone: String(player.playerPhone),
        playerPhoto: player.playerPhoto || "",
        playingFrequency: player.playingFrequency,
        playerCategory: player.category || 'Open',
        previousPerformance: {
          matchesPlayed: Number(player.matchesPlayed) || 0,
          runs: Number(player.runs) || 0,
          wickets: Number(player.wickets) || 0,
          bat_avg: Number(player.bat_avg) || 0,
          Economy: Number(player.Economy) || 0,
          bat_strike: Number(player.bat_strike) || 0
        }
      });

      try {
        await newPlayer.save();
        insertedPlayers.push(newPlayer);
      } catch (err) {
        console.error("❌ Error inserting player:", player.playerName, err.message);
      }
    }


    res.status(200).json({
      message: "✅ Excel Data Uploaded Successfully!",
      insertedCount: insertedPlayers.length,
      skippedCount: players.length - insertedPlayers.length
    });

  } catch (error) {
    console.error("❌ Upload error:", error.message);
    res.status(500).json({ error: "Server Error!" });
  }
});

module.exports = router;
