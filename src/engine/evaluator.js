import { Hand } from 'pokersolver';

/**
 * Evaluate the best 5-card hand from hole cards + community cards.
 * pokersolver handles the heavy lifting of hand ranking.
 *
 * @param {string[]} holeCards - Player's 2 hole cards (e.g. ['Ah', 'Kd'])
 * @param {string[]} communityCards - Board cards (e.g. ['Ts', '9c', '8h', '2d', '5s'])
 * @returns {{ name: string, descr: string, rank: number, cards: string[] }}
 */
export function evaluateHand(holeCards, communityCards) {
  const allCards = [...holeCards, ...communityCards];
  const hand = Hand.solve(allCards);
  return hand;
}

/**
 * Compare two hands and determine the winner.
 * Returns: 1 if hand1 wins, -1 if hand2 wins, 0 if tie.
 */
export function compareHands(hand1Cards, hand2Cards, communityCards) {
  const h1 = evaluateHand(hand1Cards, communityCards);
  const h2 = evaluateHand(hand2Cards, communityCards);

  const winners = Hand.winners([h1, h2]);

  if (winners.length === 2) return { result: 0, hand1: h1, hand2: h2 };
  if (winners[0] === h1) return { result: 1, hand1: h1, hand2: h2 };
  return { result: -1, hand1: h1, hand2: h2 };
}
