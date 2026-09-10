import React from 'react';
import { DIFFICULTIES, MAX_HINTS } from '../config/gameConfig';

export const WinModal = ({
  isOpen,
  difficulty,
  timer,
  mistakes,
  hintsUsed = 0,
  onPlayAgain
}) => {
  if (!isOpen) return null;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content win-card" role="dialog" aria-modal="true">
        <div className="win-trophy-glow">
          <svg className="win-trophy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
            <path d="M4 22h16" />
            <path d="M10 14.66V17c0 .55-.45 1-1 1H7" />
            <path d="M14 14.66V17c0 .55.45 1 1 1h2" />
            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
          </svg>
        </div>

        <h2 className="win-title">Victory!</h2>
        <p className="win-subtitle">You solved the puzzle with great logic!</p>

        <div className="win-stats-grid">
          <div className="win-stat-box">
            <span className="win-stat-label">Difficulty</span>
            <span className="win-stat-val">{DIFFICULTIES[difficulty]?.name}</span>
          </div>
          <div className="win-stat-box">
            <span className="win-stat-label">Time</span>
            <span className="win-stat-val">{formatTime(timer)}</span>
          </div>
          <div className="win-stat-box">
            <span className="win-stat-label">Mistakes</span>
            <span className="win-stat-val">{mistakes}</span>
          </div>
          <div className="win-stat-box">
            <span className="win-stat-label">Hints</span>
            <span className="win-stat-val">{hintsUsed}/{MAX_HINTS}</span>
          </div>
        </div>

        <div className="win-actions">
          <button
            type="button"
            className="btn btn-primary btn-large win-btn"
            onClick={() => onPlayAgain(difficulty)}
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
};
