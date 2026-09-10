import React, { useEffect } from 'react';
import { useSudoku } from './hooks/useSudoku';
import { GameHeader } from './components/GameHeader';
import { SudokuBoard } from './components/SudokuBoard';
import { Controls } from './components/Controls';
import { NumberPad } from './components/NumberPad';
import { WinModal } from './components/WinModal';
import './styles/sudoku.css';

export function App() {
  const {
    difficulty,
    initialBoard,
    currentBoard,
    notes,
    selectedCell,
    isNotesMode,
    timer,
    isPaused,
    mistakes,
    hintsRemaining,
    hintsUsed,
    isWon,
    conflicts,
    remainingNumbers,
    canUndo,
    selectCell,
    inputNumber,
    erase,
    undo,
    giveHint,
    toggleNotesMode,
    togglePause,
    startNewGame,
    restartGame
  } = useSudoku();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', 'W', 'A', 'S', 'D'].includes(e.key)) {
        e.preventDefault();
        const currentRow = selectedCell ? selectedCell.row : 0;
        const currentCol = selectedCell ? selectedCell.col : 0;

        let nextRow = currentRow;
        let nextCol = currentCol;

        if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
          nextRow = Math.max(0, currentRow - 1);
        } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
          nextRow = Math.min(8, currentRow + 1);
        } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
          nextCol = Math.max(0, currentCol - 1);
        } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
          nextCol = Math.min(8, currentCol + 1);
        }

        selectCell(nextRow, nextCol);
        return;
      }

      if (/^[1-9]$/.test(e.key)) {
        inputNumber(parseInt(e.key, 10));
        return;
      }

      if (e.key === 'Backspace' || e.key === 'Delete') {
        erase();
        return;
      }

      if (e.key === 'n' || e.key === 'N') {
        toggleNotesMode();
      } else if (e.key === 'u' || e.key === 'U') {
        undo();
      } else if (e.key === 'h' || e.key === 'H') {
        giveHint();
      } else if (e.key === ' ') {
        e.preventDefault();
        togglePause();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCell, selectCell, inputNumber, erase, toggleNotesMode, undo, giveHint, togglePause]);

  return (
    <div className="app-container">
      <GameHeader
        difficulty={difficulty}
        timer={timer}
        isPaused={isPaused}
        mistakes={mistakes}
        onDifficultyChange={startNewGame}
        onTogglePause={togglePause}
        onNewGame={startNewGame}
      />

      <main className="sudoku-layout">
        <SudokuBoard
          currentBoard={currentBoard}
          initialBoard={initialBoard}
          notes={notes}
          selectedCell={selectedCell}
          conflicts={conflicts}
          isPaused={isPaused}
          onSelectCell={selectCell}
          onResume={togglePause}
        />

        <div className="sudoku-panel">
          <Controls
            canUndo={canUndo}
            isNotesMode={isNotesMode}
            hintsRemaining={hintsRemaining}
            onUndo={undo}
            onErase={erase}
            onToggleNotes={toggleNotesMode}
            onHint={giveHint}
            onRestart={restartGame}
          />

          <NumberPad
            remainingNumbers={remainingNumbers}
            onInputNumber={inputNumber}
          />

          <div className="keyboard-hints">
            <span className="keyboard-hints-title">Keyboard Shortcuts</span>
            <div className="hints-row">
              <span>Navigate</span>
              <span><kbd>Arrows</kbd> / <kbd>WASD</kbd></span>
            </div>
            <div className="hints-row">
              <span>Input / Erase</span>
              <span><kbd>1-9</kbd> / <kbd>Delete</kbd></span>
            </div>
            <div className="hints-row">
              <span>Pencil Notes</span>
              <span><kbd>N</kbd></span>
            </div>
            <div className="hints-row">
              <span>Undo / Hint</span>
              <span><kbd>U</kbd> / <kbd>H</kbd></span>
            </div>
          </div>
        </div>
      </main>

      <WinModal
        isOpen={isWon}
        difficulty={difficulty}
        timer={timer}
        mistakes={mistakes}
        hintsUsed={hintsUsed}
        onPlayAgain={startNewGame}
      />
    </div>
  );
}

export default App;
