import React, { useEffect, useState } from 'react';
import './UnsoldPlayers.css'; // You can style this as needed

export default function UnsoldPlayers() {
  const [unsoldPlayers, setUnsoldPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUnsoldPlayers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:5000/api/auction/unsold');
      const data = await response.json();

      if (data.success) {
        setUnsoldPlayers(data.data);
      } else {
        setError(data.message || 'Failed to fetch unsold players');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnsoldPlayers();
  }, []);

  if (loading) {
    return <p>Loading unsold players...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>❌ {error}</p>;
  }

  return (
    <div className="unsold-players-container">
      <h2>Unsold Players</h2>
      <div className="players-grid">
        {unsoldPlayers.length === 0 ? (
          <p>No unsold players remaining!</p>
        ) : (
          unsoldPlayers.map((player) => (
            <div key={player.playerID} className="player-card1">
              <h3>{player.playerName}</h3>
              <p>Frequncy: {player.playingFrequency}</p>
              <p>Type: {player.playerType}</p>
              <p>Age: {player.Age}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
