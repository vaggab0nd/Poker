import PlayerSeat from './PlayerSeat.jsx';
import CommunityCards from './CommunityCards.jsx';
import { PHASE } from '../engine/gameState.js';

export default function PokerTable({ state }) {
  const { players, dealerIndex, communityCards, pot, phase, currentPlayerIndex, showVillainCards } = state;

  const villain = players[1];
  const hero = players[0];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 relative">
      {/* Table felt */}
      <div className="
        relative w-full max-w-[700px] h-[420px]
        bg-gradient-to-b from-felt-green via-felt-dark to-felt-green
        rounded-[50%] border-[8px] border-amber-900/80
        shadow-[inset_0_0_60px_rgba(0,0,0,0.4),0_0_40px_rgba(0,0,0,0.5)]
        flex flex-col items-center justify-between
        py-8 px-12
      "
        style={{
          backgroundImage: `
            radial-gradient(ellipse at center, rgba(30,120,60,0.3) 0%, transparent 70%),
            linear-gradient(to bottom, #1a6b3c, #0d5a2a, #1a6b3c)
          `
        }}
      >
        {/* Rail */}
        <div className="absolute inset-0 rounded-[50%] border-[12px] border-amber-800/60 pointer-events-none"
          style={{
            boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.4)'
          }}
        />

        {/* Villain (top) */}
        <div className="z-10 -mt-4">
          <PlayerSeat
            player={villain}
            isDealer={dealerIndex === 1}
            isActive={phase !== PHASE.IDLE && phase !== PHASE.SHOWDOWN && currentPlayerIndex === 1}
            showCards={showVillainCards}
            position="top"
          />
        </div>

        {/* Center area: community cards + pot */}
        <div className="z-10 flex flex-col items-center gap-3">
          <CommunityCards cards={communityCards} />
          {(pot > 0 || phase === PHASE.SHOWDOWN) && (
            <div className="
              px-4 py-1.5 rounded-full
              bg-black/40 backdrop-blur-sm
              border border-ftp-gold/30
            ">
              <span className="text-sm font-bold text-ftp-gold">
                Pot: ${pot.toLocaleString()}
              </span>
            </div>
          )}
          {phase === PHASE.SHOWDOWN && state.winner && (
            <div className="
              px-4 py-1.5 rounded-full
              bg-ftp-gold/20 backdrop-blur-sm
              border border-ftp-gold/50
              animate-pulse
            ">
              <span className="text-sm font-bold text-ftp-gold">
                {state.winner} wins!
              </span>
            </div>
          )}
        </div>

        {/* Hero (bottom) */}
        <div className="z-10 -mb-4">
          <PlayerSeat
            player={hero}
            isDealer={dealerIndex === 0}
            isActive={phase !== PHASE.IDLE && phase !== PHASE.SHOWDOWN && currentPlayerIndex === 0}
            showCards={true}
            position="bottom"
          />
        </div>
      </div>
    </div>
  );
}
