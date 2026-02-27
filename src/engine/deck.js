const SUITS = ['h', 'd', 'c', 's'];
const VALUES = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];

const SUIT_SYMBOLS = {
  h: '\u2665',
  d: '\u2666',
  c: '\u2663',
  s: '\u2660',
};

const SUIT_NAMES = {
  h: 'Hearts',
  d: 'Diamonds',
  c: 'Clubs',
  s: 'Spades',
};

const VALUE_NAMES = {
  '2': '2', '3': '3', '4': '4', '5': '5', '6': '6',
  '7': '7', '8': '8', '9': '9', 'T': '10',
  'J': 'Jack', 'Q': 'Queen', 'K': 'King', 'A': 'Ace',
};

const VALUE_SHORT = {
  '2': '2', '3': '3', '4': '4', '5': '5', '6': '6',
  '7': '7', '8': '8', '9': '9', 'T': '10',
  'J': 'J', 'Q': 'Q', 'K': 'K', 'A': 'A',
};

export function createDeck() {
  const deck = [];
  for (const suit of SUITS) {
    for (const value of VALUES) {
      deck.push(value + suit);
    }
  }
  return deck;
}

export function shuffle(deck) {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function cardSuit(card) {
  return card[card.length - 1];
}

export function cardValue(card) {
  return card.slice(0, -1);
}

export function cardDisplay(card) {
  const suit = cardSuit(card);
  const value = cardValue(card);
  return VALUE_SHORT[value] + SUIT_SYMBOLS[suit];
}

export function cardName(card) {
  const suit = cardSuit(card);
  const value = cardValue(card);
  return `${VALUE_NAMES[value]} of ${SUIT_NAMES[suit]}`;
}

export function isRed(card) {
  const suit = cardSuit(card);
  return suit === 'h' || suit === 'd';
}

export { SUITS, VALUES, SUIT_SYMBOLS, SUIT_NAMES, VALUE_NAMES, VALUE_SHORT };
