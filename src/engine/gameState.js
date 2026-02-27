import { createDeck, shuffle, cardDisplay } from './deck.js';
import { compareHands } from './evaluator.js';

/**
 * Game phases in Texas Hold'em:
 * IDLE -> PREFLOP -> FLOP -> TURN -> RIVER -> SHOWDOWN -> IDLE
 */
export const PHASE = {
  IDLE: 'IDLE',
  PREFLOP: 'PREFLOP',
  FLOP: 'FLOP',
  TURN: 'TURN',
  RIVER: 'RIVER',
  SHOWDOWN: 'SHOWDOWN',
};

const STARTING_CHIPS = 1000;
const SMALL_BLIND = 10;
const BIG_BLIND = 20;

export function createInitialState() {
  return {
    phase: PHASE.IDLE,
    players: [
      { id: 0, name: 'You', chips: STARTING_CHIPS, holeCards: [], folded: false, isHuman: true, currentBet: 0 },
      { id: 1, name: 'Villain', chips: STARTING_CHIPS, holeCards: [], folded: false, isHuman: false, currentBet: 0 },
    ],
    dealerIndex: 0, // In heads-up, dealer is also the small blind
    communityCards: [],
    pot: 0,
    deck: [],
    currentPlayerIndex: 0,
    log: [{ text: '--- Welcome to Heads Up Poker ---', type: 'system' }, { text: 'Click "Deal" to start a new hand.', type: 'system' }],
    handNumber: 0,
    smallBlind: SMALL_BLIND,
    bigBlind: BIG_BLIND,
    lastAction: null,
    minRaise: BIG_BLIND,
    currentBetToMatch: 0,
    winner: null,
    showVillainCards: false,
    betInputValue: BIG_BLIND,
    actionsThisRound: 0,
    lastAggressor: -1,
  };
}

function addLog(state, text, type = 'action') {
  return [...state.log, { text, type, timestamp: Date.now() }];
}

// In heads-up: dealer = small blind, other = big blind
function getSmallBlindIndex(state) {
  return state.dealerIndex;
}

function getBigBlindIndex(state) {
  return state.dealerIndex === 0 ? 1 : 0;
}

function otherPlayer(index) {
  return index === 0 ? 1 : 0;
}

// AI decision-making
function aiDecide(state) {
  const ai = state.players[1];
  const toCall = state.currentBetToMatch - ai.currentBet;
  const potAfterCall = state.pot + toCall;

  // Simple but non-trivial AI with some randomness
  const rand = Math.random();

  if (state.phase === PHASE.PREFLOP) {
    if (toCall === 0) {
      // Can check for free
      if (rand < 0.6) return { action: 'check' };
      if (rand < 0.85) return { action: 'raise', amount: state.bigBlind * 2 + state.currentBetToMatch };
      return { action: 'raise', amount: state.bigBlind * 3 + state.currentBetToMatch };
    }
    if (toCall <= state.bigBlind * 2) {
      if (rand < 0.7) return { action: 'call' };
      if (rand < 0.85) return { action: 'raise', amount: toCall * 2 + state.currentBetToMatch };
      return { action: 'fold' };
    }
    if (rand < 0.5) return { action: 'call' };
    if (rand < 0.7) return { action: 'fold' };
    return { action: 'raise', amount: toCall * 2 + state.currentBetToMatch };
  }

  // Post-flop
  if (toCall === 0) {
    if (rand < 0.5) return { action: 'check' };
    const betSize = Math.floor(potAfterCall * (0.33 + rand * 0.67));
    return { action: 'raise', amount: Math.max(state.bigBlind, betSize) + state.currentBetToMatch };
  }

  const potOdds = toCall / potAfterCall;
  if (potOdds < 0.3) {
    if (rand < 0.8) return { action: 'call' };
    return { action: 'raise', amount: toCall * 2 + state.currentBetToMatch };
  }
  if (potOdds < 0.5) {
    if (rand < 0.55) return { action: 'call' };
    if (rand < 0.75) return { action: 'fold' };
    return { action: 'raise', amount: toCall * 2 + state.currentBetToMatch };
  }

  if (rand < 0.35) return { action: 'call' };
  return { action: 'fold' };
}

export function dealNewHand(state) {
  // Check if a player is busted
  if (state.players[0].chips <= 0 || state.players[1].chips <= 0) {
    const winner = state.players[0].chips > 0 ? state.players[0] : state.players[1];
    return {
      ...state,
      log: addLog(state, `*** ${winner.name} wins the match! ***`, 'system'),
      phase: PHASE.IDLE,
    };
  }

  const newDealerIndex = state.handNumber === 0 ? 0 : otherPlayer(state.dealerIndex);
  const deck = shuffle(createDeck());

  const handNumber = state.handNumber + 1;
  const sbIndex = newDealerIndex; // In heads-up, dealer posts SB
  const bbIndex = otherPlayer(newDealerIndex);

  const sbAmount = Math.min(SMALL_BLIND, state.players[sbIndex].chips);
  const bbAmount = Math.min(BIG_BLIND, state.players[bbIndex].chips);

  let players = state.players.map((p, i) => ({
    ...p,
    holeCards: [deck[i * 2], deck[i * 2 + 1]],
    folded: false,
    currentBet: 0,
  }));

  // Post blinds
  players = players.map((p, i) => {
    if (i === sbIndex) return { ...p, chips: p.chips - sbAmount, currentBet: sbAmount };
    if (i === bbIndex) return { ...p, chips: p.chips - bbAmount, currentBet: bbAmount };
    return p;
  });

  const pot = sbAmount + bbAmount;

  let log = addLog(state, `--- Hand #${handNumber} ---`, 'system');
  log = [...log, { text: `${players[newDealerIndex].name} is the dealer.`, type: 'info', timestamp: Date.now() }];
  log = [...log, { text: `${players[sbIndex].name} posts small blind ($${sbAmount}).`, type: 'action', timestamp: Date.now() }];
  log = [...log, { text: `${players[bbIndex].name} posts big blind ($${bbAmount}).`, type: 'action', timestamp: Date.now() }];

  // Deal cards
  log = [...log, { text: `Dealt to You: [${players[0].holeCards.map(cardDisplay).join(' ')}]`, type: 'deal', timestamp: Date.now() }];

  const newState = {
    ...state,
    phase: PHASE.PREFLOP,
    players,
    dealerIndex: newDealerIndex,
    communityCards: [],
    pot,
    deck: deck.slice(4), // First 4 cards dealt to players
    currentPlayerIndex: sbIndex, // In heads-up, SB (dealer) acts first preflop
    log,
    handNumber,
    lastAction: null,
    minRaise: BIG_BLIND,
    currentBetToMatch: bbAmount,
    winner: null,
    showVillainCards: false,
    betInputValue: BIG_BLIND * 2,
    actionsThisRound: 0,
    lastAggressor: -1,
  };

  // If it's AI's turn preflop, they act
  if (sbIndex === 1) {
    return doAiAction(newState);
  }

  return newState;
}

function advanceToNextStreet(state) {
  let newPhase;
  let newCommunityCards = [...state.communityCards];
  let deck = [...state.deck];
  let log = state.log;

  switch (state.phase) {
    case PHASE.PREFLOP:
      newPhase = PHASE.FLOP;
      // Burn one, deal 3
      deck.shift();
      newCommunityCards = [deck.shift(), deck.shift(), deck.shift()];
      log = addLog({ log }, `*** FLOP *** [${newCommunityCards.map(cardDisplay).join(' ')}]`, 'board');
      break;
    case PHASE.FLOP:
      newPhase = PHASE.TURN;
      deck.shift();
      newCommunityCards.push(deck.shift());
      log = addLog({ log }, `*** TURN *** [${newCommunityCards.map(cardDisplay).join(' ')}]`, 'board');
      break;
    case PHASE.TURN:
      newPhase = PHASE.RIVER;
      deck.shift();
      newCommunityCards.push(deck.shift());
      log = addLog({ log }, `*** RIVER *** [${newCommunityCards.map(cardDisplay).join(' ')}]`, 'board');
      break;
    case PHASE.RIVER:
      return goToShowdown(state);
    default:
      return state;
  }

  // Post-flop: BB (non-dealer) acts first
  const firstToAct = otherPlayer(state.dealerIndex);

  // Reset bets for new street
  const players = state.players.map(p => ({ ...p, currentBet: 0 }));

  const newState = {
    ...state,
    phase: newPhase,
    communityCards: newCommunityCards,
    deck,
    log,
    players,
    currentPlayerIndex: firstToAct,
    currentBetToMatch: 0,
    minRaise: BIG_BLIND,
    actionsThisRound: 0,
    lastAggressor: -1,
    betInputValue: Math.max(BIG_BLIND, Math.floor(state.pot * 0.5)),
  };

  // If AI acts first
  if (firstToAct === 1) {
    return doAiAction(newState);
  }

  return newState;
}

function goToShowdown(state) {
  const p0 = state.players[0];
  const p1 = state.players[1];

  let log = addLog(state, `*** SHOWDOWN ***`, 'system');

  // Show villain's cards
  log = [...log, { text: `${p1.name} shows [${p1.holeCards.map(cardDisplay).join(' ')}]`, type: 'deal', timestamp: Date.now() }];

  const { result, hand1, hand2 } = compareHands(p0.holeCards, p1.holeCards, state.communityCards);

  log = [...log, { text: `${p0.name}: ${hand1.descr}`, type: 'info', timestamp: Date.now() }];
  log = [...log, { text: `${p1.name}: ${hand2.descr}`, type: 'info', timestamp: Date.now() }];

  let players = [...state.players];
  let winnerName;

  if (result === 1) {
    players[0] = { ...players[0], chips: players[0].chips + state.pot };
    winnerName = p0.name;
  } else if (result === -1) {
    players[1] = { ...players[1], chips: players[1].chips + state.pot };
    winnerName = p1.name;
  } else {
    const half = Math.floor(state.pot / 2);
    players[0] = { ...players[0], chips: players[0].chips + half };
    players[1] = { ...players[1], chips: players[1].chips + (state.pot - half) };
    winnerName = null;
  }

  if (winnerName) {
    log = [...log, { text: `${winnerName} wins pot ($${state.pot})`, type: 'win', timestamp: Date.now() }];
  } else {
    log = [...log, { text: `Split pot ($${state.pot / 2} each)`, type: 'win', timestamp: Date.now() }];
  }

  return {
    ...state,
    phase: PHASE.SHOWDOWN,
    players,
    log,
    pot: 0,
    winner: winnerName,
    showVillainCards: true,
  };
}

function handleFoldWin(state, folderIndex) {
  const winnerIndex = otherPlayer(folderIndex);
  const winner = state.players[winnerIndex];

  let players = [...state.players];
  players[winnerIndex] = { ...players[winnerIndex], chips: players[winnerIndex].chips + state.pot };
  players[folderIndex] = { ...players[folderIndex], folded: true };

  const log = addLog(state, `${winner.name} wins pot ($${state.pot}) — ${state.players[folderIndex].name} folded.`, 'win');

  return {
    ...state,
    phase: PHASE.SHOWDOWN,
    players,
    log,
    pot: 0,
    winner: winner.name,
    showVillainCards: false,
  };
}

function doAiAction(state) {
  const decision = aiDecide(state);
  return applyAction(state, 1, decision.action, decision.amount);
}

function shouldAdvanceStreet(state, playerIndex) {
  // Both players acted at least once, and bets match
  const other = otherPlayer(playerIndex);
  const p = state.players[playerIndex];
  const o = state.players[other];

  if (state.actionsThisRound < 2) return false;
  return p.currentBet === o.currentBet;
}

export function applyAction(state, playerIndex, action, amount) {
  const player = state.players[playerIndex];
  let players = state.players.map(p => ({ ...p }));
  let pot = state.pot;
  let log = state.log;
  let currentBetToMatch = state.currentBetToMatch;
  let minRaise = state.minRaise;
  let actionsThisRound = state.actionsThisRound + 1;
  let lastAggressor = state.lastAggressor;
  let betInputValue = state.betInputValue;

  switch (action) {
    case 'fold': {
      log = addLog({ log }, `${player.name} folds.`, 'action');
      return handleFoldWin({ ...state, log }, playerIndex);
    }

    case 'check': {
      log = addLog({ log }, `${player.name} checks.`, 'action');
      break;
    }

    case 'call': {
      const callAmount = Math.min(currentBetToMatch - player.currentBet, player.chips);
      players[playerIndex] = {
        ...players[playerIndex],
        chips: player.chips - callAmount,
        currentBet: player.currentBet + callAmount,
      };
      pot += callAmount;
      log = addLog({ log }, `${player.name} calls $${callAmount}.`, 'action');
      break;
    }

    case 'raise': {
      // amount is the total bet size (not the raise increment)
      let totalBet = amount || currentBetToMatch + minRaise;
      // Cap at all-in
      const maxBet = player.currentBet + player.chips;
      totalBet = Math.min(totalBet, maxBet);
      totalBet = Math.max(totalBet, currentBetToMatch); // at least a call

      const raiseBy = totalBet - currentBetToMatch;
      const chipsCost = totalBet - player.currentBet;

      players[playerIndex] = {
        ...players[playerIndex],
        chips: player.chips - chipsCost,
        currentBet: totalBet,
      };
      pot += chipsCost;

      if (totalBet === maxBet && chipsCost === player.chips) {
        log = addLog({ log }, `${player.name} goes all-in ($${chipsCost})!`, 'action');
      } else if (currentBetToMatch === 0) {
        log = addLog({ log }, `${player.name} bets $${totalBet}.`, 'action');
      } else {
        log = addLog({ log }, `${player.name} raises to $${totalBet}.`, 'action');
      }

      minRaise = Math.max(minRaise, raiseBy);
      currentBetToMatch = totalBet;
      lastAggressor = playerIndex;
      break;
    }

    case 'allin': {
      const allInAmount = player.chips;
      const totalBetAI = player.currentBet + allInAmount;
      players[playerIndex] = {
        ...players[playerIndex],
        chips: 0,
        currentBet: totalBetAI,
      };
      pot += allInAmount;
      log = addLog({ log }, `${player.name} goes all-in ($${allInAmount})!`, 'action');

      if (totalBetAI > currentBetToMatch) {
        const raiseBy = totalBetAI - currentBetToMatch;
        minRaise = Math.max(minRaise, raiseBy);
        currentBetToMatch = totalBetAI;
        lastAggressor = playerIndex;
      }
      break;
    }

    default:
      return state;
  }

  let newState = {
    ...state,
    players,
    pot,
    log,
    currentBetToMatch,
    minRaise,
    actionsThisRound,
    lastAggressor,
    betInputValue,
  };

  // Check if both players are all-in — run out the board
  const bothAllIn = players[0].chips === 0 && players[1].chips === 0;
  const oneAllInOneCalled = (players[0].chips === 0 || players[1].chips === 0) &&
    players[0].currentBet === players[1].currentBet;

  if (bothAllIn || oneAllInOneCalled) {
    // Show villain cards and run out board
    newState = { ...newState, showVillainCards: true };
    // Run out remaining streets
    while (newState.phase !== PHASE.SHOWDOWN && newState.phase !== PHASE.IDLE) {
      newState = advanceToNextStreet(newState);
    }
    return newState;
  }

  // Check if we should advance to next street
  if (shouldAdvanceStreet(newState, playerIndex)) {
    return advanceToNextStreet(newState);
  }

  // Pass to other player
  const nextPlayer = otherPlayer(playerIndex);
  newState = { ...newState, currentPlayerIndex: nextPlayer };

  // If next player is AI, execute AI action
  if (nextPlayer === 1) {
    return doAiAction(newState);
  }

  return newState;
}

export function getAvailableActions(state) {
  if (state.phase === PHASE.IDLE || state.phase === PHASE.SHOWDOWN) return [];
  if (state.currentPlayerIndex !== 0) return [];

  const player = state.players[0];
  const toCall = state.currentBetToMatch - player.currentBet;
  const actions = [];

  if (toCall === 0) {
    actions.push('check');
  } else {
    actions.push('fold');
    if (player.chips >= toCall) {
      actions.push('call');
    }
  }

  // Can raise if they have chips beyond calling
  if (player.chips > toCall) {
    actions.push('raise');
  }

  // All-in is always available
  if (player.chips > 0) {
    actions.push('allin');
  }

  return actions;
}

export function getCallAmount(state) {
  const player = state.players[0];
  return Math.min(state.currentBetToMatch - player.currentBet, player.chips);
}

export function getMinRaise(state) {
  return state.currentBetToMatch + state.minRaise;
}

export function getMaxRaise(state) {
  const player = state.players[0];
  return player.currentBet + player.chips;
}
