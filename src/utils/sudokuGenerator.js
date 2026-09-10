import { DIFFICULTIES } from '../config/gameConfig';

export { DIFFICULTIES };

export const isValid = (board, row, col, num) => {
  for (let i = 0; i < 9; i++) {
    if (i !== col && board[row][i] === num) return false;
    if (i !== row && board[i][col] === num) return false;

    const boxRow = 3 * Math.floor(row / 3) + Math.floor(i / 3);
    const boxCol = 3 * Math.floor(col / 3) + (i % 3);
    if ((boxRow !== row || boxCol !== col) && board[boxRow][boxCol] === num) return false;
  }
  return true;
};

const shuffle = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

export const generateCompleteBoard = () => {
  const board = Array(9).fill(null).map(() => Array(9).fill(0));

  const solve = () => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          const numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
          for (const num of numbers) {
            if (isValid(board, row, col, num)) {
              board[row][col] = num;
              if (solve()) return true;
              board[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  };

  solve();
  return board;
};

export const solveBoard = (inputBoard) => {
  const board = inputBoard.map(row => [...row]);

  const solve = () => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isValid(board, row, col, num)) {
              board[row][col] = num;
              if (solve()) return true;
              board[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  };

  return solve() ? board : null;
};

const countSolutions = (board, count = { value: 0 }) => {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num;
            countSolutions(board, count);
            board[row][col] = 0;
            if (count.value >= 2) return count.value;
          }
        }
        return count.value;
      }
    }
  }
  count.value++;
  return count.value;
};

export const generateSudoku = (difficulty = 'medium') => {
  const targetClues = DIFFICULTIES[difficulty]?.clues || 32;
  const completeBoard = generateCompleteBoard();
  const puzzle = completeBoard.map(row => [...row]);

  const cells = [];
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      cells.push([r, c]);
    }
  }
  const shuffledCells = shuffle(cells);

  let remainingClues = 81;

  for (const [r, c] of shuffledCells) {
    if (remainingClues <= targetClues) break;

    const backup = puzzle[r][c];
    puzzle[r][c] = 0;

    const testBoard = puzzle.map(row => [...row]);
    const solCount = countSolutions(testBoard, { value: 0 });

    if (solCount !== 1) {
      puzzle[r][c] = backup;
    } else {
      remainingClues--;
    }
  }

  return {
    initial: puzzle.map(row => [...row]),
    solution: completeBoard
  };
};

export const findConflicts = (board) => {
  const conflicts = new Set();

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const val = board[r][c];
      if (val === 0) continue;

      for (let col = 0; col < 9; col++) {
        if (col !== c && board[r][col] === val) {
          conflicts.add(`${r}-${c}`);
          conflicts.add(`${r}-${col}`);
        }
      }

      for (let row = 0; row < 9; row++) {
        if (row !== r && board[row][c] === val) {
          conflicts.add(`${r}-${c}`);
          conflicts.add(`${row}-${c}`);
        }
      }

      const startRow = Math.floor(r / 3) * 3;
      const startCol = Math.floor(c / 3) * 3;
      for (let row = startRow; row < startRow + 3; row++) {
        for (let col = startCol; col < startCol + 3; col++) {
          if ((row !== r || col !== c) && board[row][col] === val) {
            conflicts.add(`${r}-${c}`);
            conflicts.add(`${row}-${col}`);
          }
        }
      }
    }
  }

  return conflicts;
};

export const isBoardCompleteAndValid = (board, solution) => {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (board[r][c] === 0 || board[r][c] !== solution[r][c]) {
        return false;
      }
    }
  }
  return true;
};
