import React from 'react';

export const NumberPad = ({
  remainingNumbers,
  onInputNumber
}) => {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className="numpad-container">
      <div className="numpad-grid" role="group" aria-label="Sudoku number pad">
        {numbers.map((num) => {
          const count = remainingNumbers[num] || 0;
          const isCompleted = count === 0;

          return (
            <button
              key={num}
              type="button"
              className={`numpad-btn ${isCompleted ? 'numpad-btn-completed' : ''}`}
              onClick={() => onInputNumber(num)}
              disabled={isCompleted}
              aria-label={`Digit ${num}, ${count} remaining`}
            >
              <span className="numpad-digit">{num}</span>
              {!isCompleted ? (
                <span className="numpad-count">{count}</span>
              ) : (
                <span className="numpad-check">✓</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
