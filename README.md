# Heads Up Poker

A browser-based heads-up (1v1) No-Limit Texas Hold'em poker game with a Full Tilt Poker-inspired UI. Play against an AI opponent directly in your browser.

**Live:** https://poker-joe.web.app/

## Features

- Full heads-up NL Hold'em rules (blinds, preflop through river, showdown)
- AI opponent with randomized decision-making and pot-odds awareness
- Hand evaluation powered by [pokersolver](https://www.npmjs.com/package/pokersolver)
- Betting console with fold, check, call, raise slider, and all-in
- Real-time hand log sidebar
- Responsive dark-themed UI built with Tailwind CSS

## Tech Stack

- **React 19** — UI components
- **Vite 7** — Build tooling and dev server
- **Tailwind CSS 4** — Styling
- **pokersolver** — Hand evaluation and comparison
- **Firebase Hosting** — Deployment

## Getting Started

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

## Deploy to Firebase

```bash
npm run build
firebase deploy
```

Make sure `firebase.json` has `"public": "dist"`.

## Project Structure

```
src/
├── App.jsx                  # Root component, game loop
├── main.jsx                 # Entry point
├── index.css                # Tailwind + custom theme
├── engine/
│   ├── deck.js              # Card creation, shuffle, display
│   ├── evaluator.js         # Hand comparison (pokersolver wrapper)
│   └── gameState.js         # Game state machine, AI logic, actions
└── components/
    ├── PokerTable.jsx       # Table layout with player seats and community cards
    ├── PlayerSeat.jsx       # Player chip count, hole cards, status
    ├── Card.jsx             # Individual card rendering
    ├── CommunityCards.jsx   # Board cards display
    ├── DealerButton.jsx     # Dealer button indicator
    ├── BettingConsole.jsx   # Action buttons and raise slider
    └── LogWindow.jsx        # Hand history sidebar
```
