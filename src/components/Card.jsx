import { cardSuit, cardValue, isRed, SUIT_SYMBOLS, VALUE_SHORT } from '../engine/deck.js';

export default function Card({ card, faceDown = false, small = false }) {
  if (!card) return null;

  if (faceDown) {
    return (
      <div className={`
        ${small ? 'w-12 h-17' : 'w-16 h-22'}
        rounded-lg border border-gray-600 shadow-lg
        flex items-center justify-center
        select-none shrink-0
        bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950
      `}
        style={{ aspectRatio: '2.5/3.5' }}
      >
        <div className={`
          ${small ? 'w-9 h-13' : 'w-12 h-17'}
          rounded border border-blue-700
          bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800
          flex items-center justify-center
        `}>
          <div className="text-blue-300 opacity-40 text-lg font-bold">FTP</div>
        </div>
      </div>
    );
  }

  const suit = cardSuit(card);
  const value = cardValue(card);
  const red = isRed(card);
  const symbol = SUIT_SYMBOLS[suit];
  const display = VALUE_SHORT[value];

  return (
    <div className={`
      ${small ? 'w-12 h-17' : 'w-16 h-22'}
      rounded-lg shadow-lg select-none shrink-0
      bg-gradient-to-br from-white via-gray-50 to-gray-100
      border border-gray-300
      flex flex-col p-1 relative
      transition-transform duration-200 hover:scale-105
    `}
      style={{ aspectRatio: '2.5/3.5' }}
    >
      {/* Top-left corner */}
      <div className={`flex flex-col items-center leading-none ${red ? 'text-red-600' : 'text-gray-900'}`}>
        <span className={`${small ? 'text-xs' : 'text-sm'} font-bold`}>{display}</span>
        <span className={`${small ? 'text-[10px]' : 'text-xs'} -mt-0.5`}>{symbol}</span>
      </div>

      {/* Center suit */}
      <div className={`
        flex-1 flex items-center justify-center
        ${red ? 'text-red-600' : 'text-gray-900'}
        ${small ? 'text-xl' : 'text-3xl'}
      `}>
        {symbol}
      </div>

      {/* Bottom-right corner (inverted) */}
      <div className={`flex flex-col items-center leading-none self-end rotate-180 ${red ? 'text-red-600' : 'text-gray-900'}`}>
        <span className={`${small ? 'text-xs' : 'text-sm'} font-bold`}>{display}</span>
        <span className={`${small ? 'text-[10px]' : 'text-xs'} -mt-0.5`}>{symbol}</span>
      </div>
    </div>
  );
}
