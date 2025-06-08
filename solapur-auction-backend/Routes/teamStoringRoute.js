const express = require('express');
const router = express.Router();
const Team = require('../Models/TeamModel');

router.post('/create', async (req, res) => {
    try {
        const { teamID, teamName, teamOwner, teamTotalPoints, teamPlayers, teamLogo } = req.body;

        if (!teamID || !teamName || !teamOwner || !teamLogo || !teamPlayers || !Array.isArray(teamPlayers)) {
            return res.status(400).json({ message: "Missing required fields or invalid player data" });
        }

        const newTeam = new Team({
            teamID,
            teamName,
            teamOwner,
            teamTotalPoints,
            teamPlayers,
            teamLogo
        });

        await newTeam.save();
        return res.status(201).json({ message: "Team created successfully", team: newTeam });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error", error });
    }
});

module.exports = router;