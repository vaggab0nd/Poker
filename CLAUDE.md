# CLAUDE.md

## Project Overview

Heads-up No-Limit Texas Hold'em poker game — single-page React app deployed to Firebase Hosting.

## Commands

- `npm run dev` — Start Vite dev server
- `npm run build` — Production build to `dist/`
- `npm run lint` — Run ESLint
- `npm run preview` — Preview production build locally
- `firebase deploy` — Deploy to Firebase (run `npm run build` first)

## Architecture

- **Game engine** (`src/engine/`): Pure functions implementing game state machine. `gameState.js` is the core — handles phases (IDLE → PREFLOP → FLOP → TURN → RIVER → SHOWDOWN), blinds, betting, AI decisions, and showdown evaluation. State is immutable; each action returns a new state object.
- **Components** (`src/components/`): React presentation components. `PokerTable.jsx` is the main table layout. `BettingConsole.jsx` handles user input actions.
- **App.jsx**: Connects engine to UI via `useState`/`useCallback`. Human is always player index 0, AI is player index 1.

## Key Patterns

- State is managed with React `useState` — no external state library
- Game engine is pure functional (no side effects, no mutation)
- AI runs synchronously within `applyAction` when `currentPlayerIndex === 1`
- Hand evaluation delegates to the `pokersolver` npm package
- Tailwind CSS v4 with custom theme tokens (ftp-* colors) defined in `index.css`

## Heads-Up Rules

- Dealer posts small blind, non-dealer posts big blind
- Preflop: dealer (SB) acts first
- Post-flop: non-dealer (BB) acts first
- Starting stacks: 1000 chips, blinds 10/20
