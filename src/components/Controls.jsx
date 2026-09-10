import React from 'react';
import { MAX_HINTS } from '../config/gameConfig';

export const Controls = ({
  canUndo,
  isNotesMode,
  hintsRemaining = MAX_HINTS,
  onUndo,
  onErase,
  onToggleNotes,
  onHint,
  onRestart
}) => {
  return (
    <div className="game-controls">
      <button
        type="button"
        className="control-btn"
        onClick={onUndo}
        disabled={!canUndo}
        title="Undo last move (U)"
      >
        <div className="control-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 7v6h6M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
          </svg>
        </div>
        <span className="control-label">Undo</span>
      </button>

      <button
        type="button"
        className="control-btn"
        onClick={onErase}
        title="Erase cell (Backspace / Delete)"
      >
        <div className="control-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 20H7L2 14l5-6h13a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2Z" />
            <line x1="18" y1="9" x2="12" y2="15" />
            <line x1="12" y1="9" x2="18" y2="15" />
          </svg>
        </div>
        <span className="control-label">Erase</span>
      </button>

      <button
        type="button"
        className={`control-btn ${isNotesMode ? 'control-btn-active' : ''}`}
        onClick={onToggleNotes}
        title="Toggle pencil notes (N)"
      >
        <div className="control-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
          </svg>
          <span className={`notes-badge ${isNotesMode ? 'badge-on' : 'badge-off'}`}>
            {isNotesMode ? 'ON' : 'OFF'}
          </span>
        </div>
        <span className="control-label">Notes</span>
      </button>

      <button
        type="button"
        className="control-btn"
        onClick={onHint}
        disabled={hintsRemaining <= 0}
        title={`Get a hint (+30s penalty) (H) - ${hintsRemaining} remaining`}
      >
        <div className="control-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7z" />
          </svg>
          <span className="notes-badge badge-on">
            {hintsRemaining}
          </span>
        </div>
        <span className="control-label">Hint</span>
      </button>

      <button
        type="button"
        className="control-btn"
        onClick={onRestart}
        title="Reset current board"
      >
        <div className="control-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 4v6h6M23 20v-6h-6" />
            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
          </svg>
        </div>
        <span className="control-label">Restart</span>
      </button>
    </div>
  );
};
