import React, { useState, useEffect } from 'react';
import './TeamsOverview.css';
import CurrentPlayer from '../Components/CurrentPlayer';
import UnsoldPlayers from '../Components/UnsoldPLayers';

export default function TeamsOverview({ refreshTrigger }) {
    const [teamsData, setTeamsData] = useState({});
    const [loadingTeams, setLoadingTeams] = useState(true);
    const [loadingPlayer, setLoadingPlayer] = useState(true);
    const [errorTeams, setErrorTeams] = useState('');
    const [errorPlayer, setErrorPlayer] = useState('');

    const [player, setPlayer] = useState(null);

    const fetchTeams = async () => {
        setLoadingTeams(true);
        setErrorTeams('');

        try {
            const response = await fetch('http://localhost:5000/api/display');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setTeamsData(data);
        } catch (err) {
            setErrorTeams('Failed to fetch teams: ' + err.message);
            console.error('Teams fetch error:', err);
        } finally {
            setLoadingTeams(false);
        }
    };

    const fetchCurrentPlayer = async () => {
        setLoadingPlayer(true);
        setErrorPlayer('');
        try {
            const response = await fetch('http://localhost:5000/api/auction/current');
            const data = await response.json();

            if (data.success) {
                setPlayer(data.data);
            } else {
                setErrorPlayer(data.message || 'Failed to fetch player');
            }
        } catch (err) {
            setErrorPlayer('Network error: ' + err.message);
        } finally {
            setLoadingPlayer(false);
        }
    };

    useEffect(() => {
        fetchCurrentPlayer();
        fetchTeams();
    }, [refreshTrigger]); // Re-fetch when refreshTrigger changes

    // Auto-refresh every 60 seconds
    // Auto-refresh both teams and current player every 30 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            fetchTeams();
            fetchCurrentPlayer(); // added this line
        }, 30000);

        return () => clearInterval(interval);
    }, []);


    if (loadingTeams) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading teams...</p>
            </div>
        );
    }

    if (errorTeams) {
        return (
            <div className="error-container">
                <p className="error-message">❌ {errorTeams}</p>
                <button onClick={fetchTeams} className="retry-btn">
                    🔄 Retry
                </button>
            </div>
        );
    }

    return (
        <>
            <CurrentPlayer player={player} loading={loadingPlayer} error={errorPlayer} />
            <section className="teams-overview">
                <h2 className="section-title">🏏 Team Overview</h2>

                <div className="teams-grid">
                    {Object.entries(teamsData).map(([teamName, team]) => {
                        const totalUsed = team.players.reduce((sum, p) => sum + (p.soldPoints || 0), 0);
                        const totalRemaining = team.teamTotalPoints - totalUsed;
                        const playersCount = team.players.length;
                        const maxBid = Math.max(0, totalRemaining - (11 - playersCount) * 1000);

                        return (
                            <div key={teamName} className="team-card">
                                <div className="team-header">
                                    <img
                                        src={team.teamLogo}
                                        alt={`${teamName} logo`}
                                        className="team-logo"
                                        onError={(e) => {
                                            e.target.src = '/default-team-logo.png';
                                        }}
                                    />
                                    <div className="team-info">
                                        <h3 className="team-name">{teamName}</h3>
                                        <p className="team-owner">Owner: {team.teamOwner}</p>
                                    </div>
                                </div>

                                <div className="team-stats">
                                    <div className="stat-item">
                                        <span className="stat-label">Players</span>
                                        <span className="stat-value">{playersCount}/11</span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-label">Used</span>
                                        <span className="stat-value used">{totalUsed.toLocaleString()}</span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-label">Remaining</span>
                                        <span className="stat-value remaining">{totalRemaining.toLocaleString()}</span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-label">Max Bid</span>
                                        <span className={`stat-value max-bid ${maxBid <= 0 ? 'zero' : ''}`}>
                                            {maxBid.toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                {playersCount > 0 && (
                                    <div className="players-section">
                                        <h4 className="players-title">Squad</h4>
                                        <div className="players-table-container">
                                            <table className="players-table">
                                                <thead>
                                                    <tr>
                                                        <th>Player</th>
                                                        <th>Type</th>
                                                        <th>Points</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {team.players.map((player, idx) => (
                                                        <tr key={`${player.playerID}-${idx}`}>
                                                            <td className="player-name1">{player.playerName}</td>
                                                            <td>
                                                                <span className={`player-type-badge ${player.playerType.toLowerCase()}`}>
                                                                    {player.playerType}
                                                                </span>
                                                            </td>
                                                            <td className="player-points">{player.soldPoints?.toLocaleString()}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                {playersCount === 0 && (
                                    <div className="no-players">
                                        <p>No players acquired yet</p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {Object.keys(teamsData).length === 0 && !loadingTeams && (
                    <div className="no-teams">
                        <p>No teams found</p>
                    </div>
                )}
            </section>

            <UnsoldPlayers />
        </>
    );
}