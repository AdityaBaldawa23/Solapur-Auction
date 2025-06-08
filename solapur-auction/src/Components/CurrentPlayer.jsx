import React from 'react';
import './CurrentPlayer.css';

export default function CurrentPlayer({ player, loading, error }) {
  if (loading) {
    return (
      <div className="player-card loading">
        <div className="loading-spinner"></div>
        <p>Loading current auction player...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="player-card error">
        <p className="error-message">❌ {error}</p>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="player-card no-player">
        <p>🏏 No player currently up for auction</p>
      </div>
    );
  }
  console.log("cleaned photo url:", JSON.stringify(player.playerPhoto));


  return (
    <div className="player-card">
      <div className="player-header">
        <img
          src={
            player.playerPhoto?.split('\n')[0]?.trim() || '/default-player.png'
          }
          alt={player.playerName}
          className="player-photo"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/default-player.png';
          }}
        />



        <div className="player-basic-info">
          <h2 className="player-name">{player.playerName}</h2>
          <p className="player-id">ID: #{player.playerID}</p>
          <div className="player-badge">
            <span className={`badge ${player.playerType.toLowerCase()}`}>
              {player.playerType}
            </span>
          </div>
        </div>
      </div>

      <div className="player-details">
        <div className="detail-row">
          <span className="label">Age:</span>
          <span className="value">{player.Age}</span>
        </div>

        <div className="detail-row">
          <span className="label">Phone:</span>
          <span className="value">{player.playerPhone}</span>
        </div>

        <div className="detail-row">
          <span className="label">Playing Frequency:</span>
          <span className="value">{player.playingFrequency}</span>
        </div>

        <div className="detail-row">
          <span className="label">Batting Style:</span>
          <span className="value price">{player.battingStyle} </span>
        </div>

        <div className="detail-row">
          <span className="label">Bowling Style:</span>
          <span className="value price">{player.bowlingStyle} </span>
        </div>
      </div>

      {player.previousPerformance && (
        <div className="performance-section">
          <h3>Previous Performance</h3>
          <div className="performance-grid">
            <div className="performance-item">
              <span className="perf-label">Matches</span>
              <span className="perf-value">{player.previousPerformance.matchesPlayed || 0}</span>
            </div>
            <div className="performance-item">
              <span className="perf-label">Runs</span>
              <span className="perf-value">{player.previousPerformance.runs || 0}</span>
            </div>
            <div className="performance-item">
              <span className="perf-label">Wickets</span>
              <span className="perf-value">{player.previousPerformance.wickets || 0}</span>
            </div>
            <div className="performance-item">
              <span className="perf-label">Batting Average</span>
              <span className="perf-value">{player.previousPerformance.bat_avg || 0}</span>
            </div>
            <div className="performance-item1">
              <span className="perf-label">Economy</span>
              <span className="perf-value">{player.previousPerformance.Economy || 0}</span>
            </div>
          </div>
        </div>
      )}

      <div className="player-status">
        <span className={`status-badge ${player.playerStatus}`}>
          {player.playerStatus.toUpperCase()}
        </span>
      </div>
    </div>
  );
}