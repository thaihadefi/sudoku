import React from 'react';
import { SudokuCell } from './SudokuCell';

export const SudokuBoard = ({
  currentBoard,
  initialBoard,
  notes,
  selectedCell,
  conflicts,
  isPaused,
  onSelectCell,
  onResume
}) => {
  const selectedValue =
    selectedCell && currentBoard[selectedCell.row][selectedCell.col] > 0
      ? currentBoard[selectedCell.row][selectedCell.col]
      : null;

  return (
    <div className="sudoku-board-wrapper">
      <div className="sudoku-board" role="grid" aria-label="Sudoku Grid">
        {isPaused ? (
          <div className="board-pause-overlay">
            <div className="pause-modal">
              <svg className="pause-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
              <h3>Game Paused</h3>
              <p>Take your time, the timer is stopped.</p>
              <button className="btn btn-primary" onClick={onResume}>
                Resume Game
              </button>
            </div>
          </div>
        ) : (
          currentBoard.map((row, rIdx) =>
            row.map((val, cIdx) => {
              const isSelected = selectedCell?.row === rIdx && selectedCell?.col === cIdx;
              const isSameNumber = selectedValue && val === selectedValue;
              const isRelated =
                selectedCell &&
                (selectedCell.row === rIdx ||
                  selectedCell.col === cIdx ||
                  (Math.floor(selectedCell.row / 3) === Math.floor(rIdx / 3) &&
                    Math.floor(selectedCell.col / 3) === Math.floor(cIdx / 3)));
              const isConflict = conflicts.has(`${rIdx}-${cIdx}`);
              const isInitial = initialBoard[rIdx][cIdx] !== 0;

              return (
                <SudokuCell
                  key={`${rIdx}-${cIdx}`}
                  row={rIdx}
                  col={cIdx}
                  value={val}
                  isInitial={isInitial}
                  notes={notes[rIdx][cIdx]}
                  isSelected={isSelected}
                  isRelated={isRelated}
                  isSameNumber={isSameNumber}
                  isConflict={isConflict}
                  onClick={() => onSelectCell(rIdx, cIdx)}
                />
              );
            })
          )
        )}
      </div>
    </div>
  );
};
