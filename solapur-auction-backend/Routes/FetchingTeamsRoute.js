const express = require("express");
const router = express.Router();
const Team = require("../Models/TeamModel");

router.get("/display", async (req, res) => {
  try {
    const teams = await Team.find();
    const formatted = {};

    teams.forEach((team) => {
      formatted[team.teamName] = {
        teamID: team.teamID,
        teamOwner: team.teamOwner,
        teamTotalPoints: team.teamTotalPoints,
        teamLogo: team.teamLogo,
        players: team.teamPlayers,
      };
    });

    res.status(200).json(formatted);
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ message: 'Failed to fetch teams', error });
  }
});

module.exports = router;