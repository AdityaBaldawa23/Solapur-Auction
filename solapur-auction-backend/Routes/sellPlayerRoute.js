const express = require("express");
const router = express.Router();
const SoldPlayer = require("../Models/SoldPlayers");
const Player = require("../Models/PlayerModel");
const Team = require("../Models/TeamModel");

router.post("/sell", async (req, res) => {
  try {
    const {
      playerID,
      playerName,
      playerType,
      playerPhoto,
      soldPoints,
      soldToTeam,
      playerPhone,
    } = req.body;

    // Validate
    if (!playerID || !soldPoints || !soldToTeam)
      return res.status(400).json({ success: false, message: "Missing required fields" });

    // Upsert sold player
    const soldPlayer = await SoldPlayer.findOneAndUpdate(
      { playerID },
      {
        playerName,
        playerPhone,
        playerType,
        playerPhoto,
        soldPoints,
        soldToTeam,
      },
      { new: true, upsert: true }
    );

    // Add to teamPlayers array of the target team
    const team = await Team.findOne({ teamName: soldToTeam });

    if (!team)
      return res.status(404).json({ success: false, message: "Target team not found" });

    const newTeamPlayer = {
      playerID,
      playerName,
      playerType,
      soldPoints,
    };

    team.teamPlayers.push(newTeamPlayer);
    team.teamTotalPoints -= soldPoints;

    await team.save();

    // Remove from main player pool
    await Player.deleteOne({ playerID });

    res.status(201).json({
      success: true,
      message: "Player sold and added to team successfully",
      data: soldPlayer,
    });
  } catch (error) {
    console.error("Error selling player:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});


module.exports = router;
