import React from 'react';
import { DIFFICULTIES } from '../config/gameConfig';

export const GameHeader = ({
  difficulty,
  timer,
  isPaused,
  mistakes,
  onDifficultyChange,
  onTogglePause,
  onNewGame
}) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <header className="game-header">
      <div className="header-top">
        <div className="brand-group">
          <div className="brand-logo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
            </svg>
          </div>
          <div>
            <h1 className="brand-title">Sudoku</h1>
          </div>
        </div>

        <div className="difficulty-pills">
          {Object.entries(DIFFICULTIES).map(([key, info]) => (
            <button
              key={key}
              type="button"
              className={`pill-btn ${difficulty === key ? 'pill-active' : ''}`}
              onClick={() => onDifficultyChange(key)}
            >
              {info.name}
            </button>
          ))}
        </div>
      </div>

      <div className="header-stats-bar">
        <div className="stat-card">
          <span className="stat-label">Difficulty</span>
          <span className="stat-value highlight-difficulty">
            {DIFFICULTIES[difficulty]?.name}
          </span>
        </div>

        <div className="stat-card">
          <span className="stat-label">Mistakes</span>
          <span className={`stat-value ${mistakes > 0 ? 'stat-mistake' : ''}`}>
            {mistakes}
          </span>
        </div>

        <div className="stat-card stat-timer-card">
          <span className="stat-label">Time</span>
          <div className="timer-wrapper">
            <span className="stat-value timer-text">{formatTime(timer)}</span>
            <button
              type="button"
              className="btn-icon timer-toggle"
              onClick={onTogglePause}
              title={isPaused ? 'Resume Game' : 'Pause Game'}
              aria-label={isPaused ? 'Resume Game' : 'Pause Game'}
            >
              {isPaused ? (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <button
          type="button"
          className="btn btn-secondary new-game-header-btn"
          onClick={() => onNewGame(difficulty)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
          </svg>
          New Game
        </button>
      </div>
    </header>
  );
};
