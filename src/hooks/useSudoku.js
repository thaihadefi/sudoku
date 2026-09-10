import { useState, useEffect, useCallback, useRef } from 'react';
import {
  generateSudoku,
  findConflicts,
  isBoardCompleteAndValid
} from '../utils/sudokuGenerator';
import {
  DEFAULT_DIFFICULTY,
  MAX_HINTS,
  HINT_PENALTY_SECONDS
} from '../config/gameConfig';

export const useSudoku = (initialDifficulty = DEFAULT_DIFFICULTY) => {
  const [difficulty, setDifficulty] = useState(initialDifficulty);
  const [initialBoard, setInitialBoard] = useState(() => Array(9).fill(null).map(() => Array(9).fill(0)));
  const [currentBoard, setCurrentBoard] = useState(() => Array(9).fill(null).map(() => Array(9).fill(0)));
  const [solution, setSolution] = useState(() => Array(9).fill(null).map(() => Array(9).fill(0)));
  const [notes, setNotes] = useState(() => Array(9).fill(null).map(() => Array(9).fill(null).map(() => [])));
  
  const [selectedCell, setSelectedCell] = useState(null);
  const [isNotesMode, setIsNotesMode] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [hintsRemaining, setHintsRemaining] = useState(MAX_HINTS);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [history, setHistory] = useState([]);

  const timerRef = useRef(null);

  const startNewGame = useCallback((diff = difficulty) => {
    const puzzle = generateSudoku(diff);
    setDifficulty(diff);
    setInitialBoard(puzzle.initial);
    setCurrentBoard(puzzle.initial.map(row => [...row]));
    setSolution(puzzle.solution);
    setNotes(Array(9).fill(null).map(() => Array(9).fill(null).map(() => [])));
    setSelectedCell({ row: 0, col: 0 });
    setIsNotesMode(false);
    setTimer(0);
    setIsPaused(false);
    setMistakes(0);
    setHintsRemaining(MAX_HINTS);
    setHintsUsed(0);
    setIsWon(false);
    setHistory([]);
  }, [difficulty]);

  useEffect(() => {
    startNewGame(initialDifficulty);
  }, []);

  useEffect(() => {
    if (!isPaused && !isWon) {
      timerRef.current = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isPaused, isWon]);

  const conflicts = findConflicts(currentBoard);

  const remainingNumbers = {};
  for (let num = 1; num <= 9; num++) {
    remainingNumbers[num] = 9;
  }
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const val = currentBoard[r][c];
      if (val >= 1 && val <= 9) {
        remainingNumbers[val] = Math.max(0, remainingNumbers[val] - 1);
      }
    }
  }

  const selectCell = useCallback((row, col) => {
    if (isPaused || isWon) return;
    setSelectedCell({ row, col });
  }, [isPaused, isWon]);

  const inputNumber = useCallback((num) => {
    if (isPaused || isWon || !selectedCell) return;
    const { row, col } = selectedCell;

    if (initialBoard[row][col] !== 0) return;

    setHistory(prev => [
      ...prev,
      {
        board: currentBoard.map(r => [...r]),
        notes: notes.map(r => r.map(c => [...c])),
        mistakes
      }
    ]);

    if (isNotesMode) {
      setNotes(prev => {
        const newNotes = prev.map(r => r.map(c => [...c]));
        const cellNotes = newNotes[row][col];
        if (cellNotes.includes(num)) {
          newNotes[row][col] = cellNotes.filter(n => n !== num);
        } else {
          newNotes[row][col] = [...cellNotes, num].sort((a, b) => a - b);
        }
        return newNotes;
      });
    } else {
      const isCorrect = solution[row][col] === num;
      if (!isCorrect) {
        setMistakes(m => m + 1);
      }

      const nextBoard = currentBoard.map((r, rIdx) =>
        r.map((val, cIdx) => (rIdx === row && cIdx === col ? num : val))
      );
      setCurrentBoard(nextBoard);

      setNotes(prev => {
        const newNotes = prev.map(r => r.map(c => [...c]));
        newNotes[row][col] = [];

        const startRow = Math.floor(row / 3) * 3;
        const startCol = Math.floor(col / 3) * 3;

        for (let i = 0; i < 9; i++) {
          newNotes[row][i] = newNotes[row][i].filter(n => n !== num);
          newNotes[i][col] = newNotes[i][col].filter(n => n !== num);
        }
        for (let r = startRow; r < startRow + 3; r++) {
          for (let c = startCol; c < startCol + 3; c++) {
            newNotes[r][c] = newNotes[r][c].filter(n => n !== num);
          }
        }
        return newNotes;
      });

      if (isBoardCompleteAndValid(nextBoard, solution)) {
        setIsWon(true);
      }
    }
  }, [isPaused, isWon, selectedCell, initialBoard, currentBoard, notes, mistakes, isNotesMode, solution]);

  const erase = useCallback(() => {
    if (isPaused || isWon || !selectedCell) return;
    const { row, col } = selectedCell;
    if (initialBoard[row][col] !== 0) return;

    if (currentBoard[row][col] === 0 && notes[row][col].length === 0) return;

    setHistory(prev => [
      ...prev,
      {
        board: currentBoard.map(r => [...r]),
        notes: notes.map(r => r.map(c => [...c])),
        mistakes
      }
    ]);

    setCurrentBoard(prev => {
      const next = prev.map(r => [...r]);
      next[row][col] = 0;
      return next;
    });

    setNotes(prev => {
      const next = prev.map(r => r.map(c => [...c]));
      next[row][col] = [];
      return next;
    });
  }, [isPaused, isWon, selectedCell, initialBoard, currentBoard, notes, mistakes]);

  const undo = useCallback(() => {
    if (isPaused || isWon || history.length === 0) return;

    const previousState = history[history.length - 1];
    setHistory(prev => prev.slice(0, -1));

    setCurrentBoard(previousState.board);
    setNotes(previousState.notes);
    setMistakes(previousState.mistakes);
  }, [isPaused, isWon, history]);

  const giveHint = useCallback(() => {
    if (isPaused || isWon || hintsRemaining <= 0) return;

    const candidateCells = [];
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (initialBoard[r][c] === 0 && currentBoard[r][c] !== solution[r][c]) {
          candidateCells.push({ r, c });
        }
      }
    }

    if (candidateCells.length === 0) return;

    let target = null;
    if (
      selectedCell &&
      initialBoard[selectedCell.row][selectedCell.col] === 0 &&
      currentBoard[selectedCell.row][selectedCell.col] !== solution[selectedCell.row][selectedCell.col]
    ) {
      target = { r: selectedCell.row, c: selectedCell.col };
    } else {
      target = candidateCells[Math.floor(Math.random() * candidateCells.length)];
    }

    const correctNum = solution[target.r][target.c];

    setHistory(prev => [
      ...prev,
      {
        board: currentBoard.map(r => [...r]),
        notes: notes.map(r => r.map(c => [...c])),
        mistakes
      }
    ]);

    setTimer(t => t + HINT_PENALTY_SECONDS);
    setHintsRemaining(h => Math.max(0, h - 1));
    setHintsUsed(h => h + 1);

    const nextBoard = currentBoard.map((row, rIdx) =>
      row.map((val, cIdx) => (rIdx === target.r && cIdx === target.c ? correctNum : val))
    );
    setCurrentBoard(nextBoard);
    setSelectedCell({ row: target.r, col: target.c });

    setNotes(prev => {
      const newNotes = prev.map(r => r.map(c => [...c]));
      newNotes[target.r][target.c] = [];
      for (let i = 0; i < 9; i++) {
        newNotes[target.r][i] = newNotes[target.r][i].filter(n => n !== correctNum);
        newNotes[i][target.c] = newNotes[i][target.c].filter(n => n !== correctNum);
      }
      return newNotes;
    });

    if (isBoardCompleteAndValid(nextBoard, solution)) {
      setIsWon(true);
    }
  }, [isPaused, isWon, hintsRemaining, initialBoard, currentBoard, solution, selectedCell, notes, mistakes]);

  const toggleNotesMode = useCallback(() => {
    setIsNotesMode(prev => !prev);
  }, []);

  const togglePause = useCallback(() => {
    if (isWon) return;
    setIsPaused(prev => !prev);
  }, [isWon]);

  const restartGame = useCallback(() => {
    setCurrentBoard(initialBoard.map(row => [...row]));
    setNotes(Array(9).fill(null).map(() => Array(9).fill(null).map(() => [])));
    setSelectedCell({ row: 0, col: 0 });
    setTimer(0);
    setIsPaused(false);
    setMistakes(0);
    setHintsRemaining(MAX_HINTS);
    setHintsUsed(0);
    setIsWon(false);
    setHistory([]);
  }, [initialBoard]);

  return {
    difficulty,
    initialBoard,
    currentBoard,
    solution,
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
    canUndo: history.length > 0,
    selectCell,
    inputNumber,
    erase,
    undo,
    giveHint,
    toggleNotesMode,
    togglePause,
    startNewGame,
    restartGame
  };
};
