import Card from './Card.jsx';
import DealerButton from './DealerButton.jsx';

export default function PlayerSeat({
  player,
  isDealer,
  isActive,
  showCards,
  position,
}) {
  const isTop = position === 'top';

  return (
    <div className={`flex flex-col items-center gap-2 ${isTop ? '' : ''}`}>
      {/* Cards */}
      <div className={`flex gap-1.5 ${isTop ? 'order-1' : 'order-1'}`}>
        {player.holeCards.length > 0 ? (
          player.holeCards.map((card, i) => (
            <Card
              key={i}
              card={card}
              faceDown={!showCards}
            />
          ))
        ) : (
          <>
            <div className="w-16 h-22 rounded-lg border border-ftp-border/30 bg-ftp-darker/50" />
            <div className="w-16 h-22 rounded-lg border border-ftp-border/30 bg-ftp-darker/50" />
          </>
        )}
      </div>

      {/* Player info box */}
      <div className={`
        order-2 flex items-center gap-2
        ${isActive ? 'ring-2 ring-ftp-gold ring-offset-1 ring-offset-ftp-darker' : ''}
        rounded-lg overflow-hidden
        ${player.folded ? 'opacity-40' : ''}
      `}>
        {/* Dealer button */}
        {isDealer && (
          <div className="shrink-0">
            <DealerButton />
          </div>
        )}

        <div className={`
          px-4 py-2 rounded-lg
          bg-gradient-to-b from-ftp-panel-light to-ftp-panel
          border border-ftp-border
          min-w-[140px] text-center
          ${isActive ? 'shadow-lg shadow-ftp-gold/20' : 'shadow-md shadow-black/30'}
        `}>
          <div className="text-sm font-bold text-ftp-text truncate">
            {player.name}
          </div>
          <div className={`text-xs font-mono ${player.chips > 200 ? 'text-green-400' : player.chips > 0 ? 'text-yellow-400' : 'text-red-400'}`}>
            ${player.chips.toLocaleString()}
          </div>
          {player.currentBet > 0 && (
            <div className="text-[10px] text-ftp-gold mt-0.5">
              Bet: ${player.currentBet}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
