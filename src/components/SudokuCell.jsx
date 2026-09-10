import React from 'react';

export const SudokuCell = ({
  row,
  col,
  value,
  isInitial,
  notes,
  isSelected,
  isRelated,
  isSameNumber,
  isConflict,
  onClick
}) => {
  const borderRight = (col + 1) % 3 === 0 && col !== 8 ? 'cell-border-box-right' : '';
  const borderBottom = (row + 1) % 3 === 0 && row !== 8 ? 'cell-border-box-bottom' : '';

  const cellClasses = [
    'sudoku-cell',
    borderRight,
    borderBottom,
    isSelected ? 'cell-selected' : '',
    !isSelected && isSameNumber ? 'cell-same-number' : '',
    !isSelected && !isSameNumber && isRelated ? 'cell-related' : '',
    isConflict ? 'cell-conflict' : '',
    isInitial ? 'cell-initial' : 'cell-user-input'
  ].filter(Boolean).join(' ');

  return (
    <button
      type="button"
      className={cellClasses}
      onClick={onClick}
      aria-label={`Row ${row + 1}, Column ${col + 1}${value ? `, Value ${value}` : ''}`}
      id={`cell-${row}-${col}`}
    >
      {value > 0 ? (
        <span className="cell-digit">{value}</span>
      ) : notes.length > 0 ? (
        <div className="cell-notes-grid">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <span key={num} className="note-digit">
              {notes.includes(num) ? num : ''}
            </span>
          ))}
        </div>
      ) : null}
    </button>
  );
};
