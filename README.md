# Sudoku

A minimalist, responsive web Sudoku game built with React and Vite.

## Features

- **Puzzle Generation**: Generates 9x9 boards using a backtracking algorithm with a guaranteed unique solution.
- **4 Difficulty Levels**: Easy, Medium, Hard, and Expert.
- **Conflict Detection**: Highlights duplicate numbers in rows, columns, and 3x3 blocks.
- **Pencil Notes**: Jot down candidate numbers with automatic pruning on placement.
- **Game Controls**: Undo, erase, and contextual hints (+30s penalty).
- **Keyboard & Touch Controls**: Full keyboard navigation (Arrows/WASD, 1-9, Backspace, N, U, H, Space) and touch keypad.
- **Timer & Pause**: Elapsed time tracking with pause overlay.

## Tech Stack

- React 19
- Vite
- Vanilla CSS

## Getting Started

### Prerequisites

- Node.js (`>=20.19.0`)
- Yarn or npm

### Installation & Run

```bash
# Clone the repository
git clone https://github.com/thaihadefi/sudoku.git
cd sudoku

# Install dependencies
yarn install

# Start development server
yarn dev
```

### Production Build

```bash
yarn build
yarn preview
```

## License

[MIT](LICENSE)
