import React, { useState, useEffect } from 'react';
import CurrentPlayer from './CurrentPlayer';
import './Admin.css';

export default function Admin({ onPlayerChange }) {
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showSellModal, setShowSellModal] = useState(false);
  const [sellPoints, setSellPoints] = useState('');
  const [sellTeam, setSellTeam] = useState('');

  const teamOptions = [
    'Mumbai Warriors', 'CSK', 'RR',
    'SRH', 'RCB',
  ];

  const fetchCurrentPlayer = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:5000/api/auction/current');
      const data = await response.json();

      if (data.success) {
        setPlayer(data.data);
        if (onPlayerChange) onPlayerChange(data.data);
      } else {
        setError(data.message || 'Failed to fetch player');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateNewPlayer = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/auction/generate', {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        setPlayer(data.data);
      }
    } catch (err) {
      alert('Error generating player: ' + err.message);
    }
  };

  const sellPlayer = async () => {
    if (!sellPoints || !sellTeam || !player) return alert('Incomplete info');

    try {
      const res = await fetch('http://localhost:5000/api/sell', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerID: player.playerID,
          playerName: player.playerName,
          playerType: player.playerType,
          playerPhoto: player.playerPhoto,
          soldPoints: parseInt(sellPoints),
          soldToTeam: sellTeam,
          playerPhone: player.playerPhone
        })
      });

      const data = await res.json();
      if (data.success) {
        alert('Player sold!');
        setShowSellModal(false);
        generateNewPlayer(); // fetch next
      } else {
        alert('Error: ' + data.message);
      }
    } catch (err) {
      console.error(err);
      alert('Sell failed');
    }
  };

  const addToReauction = async () => {
  if (!player) return alert("No player selected");

  try {
    const res = await fetch('http://localhost:5000/api/reauction/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        playerID: player.playerID,
        playerName: player.playerName,
        Age: player.Age,
        playerType: player.playerType,
        battingStyle: player.battingStyle,
        bowlingStyle: player.bowlingStyle,
        playerPhone: player.playerPhone,
        playerPhoto: player.playerPhoto,
        playingFrequency: player.playingFrequency,
        previousPerformance: player.previousPerformance,
        soldPoints: player.soldPoints || 0,
        playerStatus: player.playerStatus || 'unsold',
        reason: 'Skipped/Manual',
        reAuctionStatus: 'Pending'
      })
    });

    const data = await res.json();
    if (data.success) {
      alert('Player added to re-auction');
      generateNewPlayer();
    } else {
      alert('Error: ' + data.message);
    }
  } catch (err) {
    alert('Failed to add to re-auction');
  }
};


  useEffect(() => {
    fetchCurrentPlayer();
  }, []);

  return (
    <div className="admin-page">
      <h1>Admin Control Panel</h1>

      <CurrentPlayer player={player} loading={loading} error={error} />

      <div className="admin-controls">
        <button onClick={() => setShowSellModal(true)}>💰 Sell Player</button>
        <button onClick={addToReauction}>🔁 Add to Re-Auction</button>
      </div>

      {/* Sell Player Modal */}
      {showSellModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Sell Player</h2>
            <label>Team:
              <select onChange={e => setSellTeam(e.target.value)}>
                <option value="">Select Team</option>
                {teamOptions.map(team => <option key={team} value={team}>{team}</option>)}
              </select>
            </label>
            <label>Points:
              <input type="number" value={sellPoints} onChange={e => setSellPoints(e.target.value)} />
            </label>
            <button onClick={sellPlayer}>Confirm Sell</button>
            <button onClick={() => setShowSellModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
