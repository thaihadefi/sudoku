export const GAME_CONFIG = {
  DEFAULT_DIFFICULTY: 'medium',
  MAX_HINTS: 3,
  HINT_PENALTY_SECONDS: 30,
  BOARD_SIZE: 9,
  BOX_SIZE: 3,
  DIFFICULTIES: {
    easy: { name: 'Easy', clues: 38 },
    medium: { name: 'Medium', clues: 32 },
    hard: { name: 'Hard', clues: 28 },
    expert: { name: 'Expert', clues: 24 }
  }
};

export const {
  DIFFICULTIES,
  MAX_HINTS,
  HINT_PENALTY_SECONDS,
  DEFAULT_DIFFICULTY,
  BOARD_SIZE,
  BOX_SIZE
} = GAME_CONFIG;
