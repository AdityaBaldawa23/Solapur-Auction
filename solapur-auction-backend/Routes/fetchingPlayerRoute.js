const express = require("express");
const router = express.Router();
const Player = require("../Models/PlayerModel");
const ReauctionModel = require("../Models/ReauctionModel");

// In-memory storage for current auction player (in production, use Redis or database)
let currentAuctionPlayer = null;
let reauction = false;

// Get current auction player
router.get("/current", async (req, res) => {
  try {
    if (!currentAuctionPlayer) {
      // If no current player, generate one
      await generateNewAuctionPlayer();
    }

    res.status(200).json({
      success: true,
      data: currentAuctionPlayer,
    });
  } catch (error) {
    console.error("Error fetching current auction player:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
});

// Generate new auction player (Admin only)
router.post("/generate", async (req, res) => {
  try {
    const newPlayer = await generateNewAuctionPlayer();

    if (!newPlayer) {
      return res.status(404).json({
        success: false,
        message: "No players available for auction",
      });
    }

    res.status(200).json({
      success: true,
      data: newPlayer,
      message: "New auction player generated",
    });
  } catch (error) {
    console.error("Error generating new auction player:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
});

// Helper function to generate new auction player
async function generateNewAuctionPlayer() {
  try {

    let unsoldPlayers;

    if (!reauction) {
      unsoldPlayers = await Player.find({ playerStatus: "unsold" });

      if (unsoldPlayers.length === 0) {
        reauction = true;
      }
    }

    if(reauction)
    {
      console.log('Starting Reauction');
      unsoldPlayers = await ReauctionModel.find({playerStatus: "unsold"});

      if(unsoldPlayers.length === 0){
        currentAuctionPlayer = null;
        return null
      }
    }

    const randomIndex = Math.floor(Math.random() * unsoldPlayers.length);
    currentAuctionPlayer = unsoldPlayers[randomIndex];

    return currentAuctionPlayer;
  } catch (error) {
    console.error("Error in generateNewAuctionPlayer:", error);
    throw error;
  }
}

router.get("/unsold", async (req, res) => {
  try {
    const remaining = await Player.find({});
    res.status(200).json({ success: true, data: remaining });
  } catch (error) {
    console.error("Error fetching unsold players:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch unsold players" });
  }
});

module.exports = router;
