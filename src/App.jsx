import { useState, useCallback } from 'react';
import PokerTable from './components/PokerTable.jsx';
import BettingConsole from './components/BettingConsole.jsx';
import LogWindow from './components/LogWindow.jsx';
import { createInitialState, dealNewHand, applyAction, PHASE } from './engine/gameState.js';

function App() {
  const [state, setState] = useState(createInitialState);

  const handleDeal = useCallback(() => {
    setState((prev) => dealNewHand(prev));
  }, []);

  const handleAction = useCallback((action, amount) => {
    if (action === 'setBetInput') {
      setState((prev) => ({ ...prev, betInputValue: amount }));
      return;
    }
    setState((prev) => applyAction(prev, 0, action, amount));
  }, []);

  const handleNewGame = useCallback(() => {
    setState(createInitialState());
  }, []);

  const isIdle = state.phase === PHASE.IDLE;
  const isShowdown = state.phase === PHASE.SHOWDOWN;
  const isHumanTurn = state.currentPlayerIndex === 0 && !isIdle && !isShowdown;
  const gameOver = (state.players[0].chips <= 0 || state.players[1].chips <= 0) && isShowdown;

  return (
    <div className="h-screen w-screen flex flex-col bg-ftp-darker overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-2 bg-gradient-to-r from-ftp-darker via-ftp-panel to-ftp-darker border-b border-ftp-border">
        <div className="flex items-center gap-3">
          <div className="text-lg font-black tracking-wider">
            <span className="text-red-500">HEADS</span>
            <span className="text-ftp-text-dim"> UP </span>
            <span className="text-ftp-gold">POKER</span>
          </div>
          <span className="text-[10px] text-ftp-text-dim uppercase tracking-widest">NL Hold&apos;em</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-ftp-text-dim">
          <span>Blinds: ${state.smallBlind}/${state.bigBlind}</span>
          <span>Hand #{state.handNumber}</span>
        </div>
      </div>

      {/* Main area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Table area */}
        <div className="flex-1 flex flex-col">
          <PokerTable state={state} />

          {/* Betting console or deal button */}
          <div className="shrink-0">
            {isHumanTurn ? (
              <BettingConsole state={state} onAction={handleAction} />
            ) : (
              <div className="p-4 flex justify-center border-t border-ftp-border bg-ftp-panel/30">
                {isIdle && (
                  <button
                    onClick={handleDeal}
                    className="px-10 py-3 rounded-lg font-black text-lg uppercase tracking-widest
                      bg-gradient-to-b from-green-600 to-green-800 hover:from-green-500 hover:to-green-700
                      text-white shadow-lg shadow-green-900/50
                      border border-green-500/50 transition-all
                      active:scale-95"
                  >
                    Deal
                  </button>
                )}
                {isShowdown && !gameOver && (
                  <button
                    onClick={handleDeal}
                    className="px-10 py-3 rounded-lg font-black text-lg uppercase tracking-widest
                      bg-gradient-to-b from-green-600 to-green-800 hover:from-green-500 hover:to-green-700
                      text-white shadow-lg shadow-green-900/50
                      border border-green-500/50 transition-all
                      active:scale-95"
                  >
                    Next Hand
                  </button>
                )}
                {gameOver && (
                  <div className="flex flex-col items-center gap-3">
                    <div className="text-ftp-gold text-lg font-bold">
                      {state.players[0].chips > 0 ? 'You win the match!' : 'Villain wins the match!'}
                    </div>
                    <button
                      onClick={handleNewGame}
                      className="px-10 py-3 rounded-lg font-black text-lg uppercase tracking-widest
                        bg-gradient-to-b from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700
                        text-white shadow-lg shadow-amber-900/50
                        border border-amber-500/50 transition-all
                        active:scale-95"
                    >
                      New Match
                    </button>
                  </div>
                )}
                {!isIdle && !isShowdown && (
                  <div className="text-ftp-text-dim text-sm animate-pulse">
                    Villain is thinking...
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Log sidebar */}
        <div className="w-72 shrink-0 border-l border-ftp-border">
          <LogWindow log={state.log} />
        </div>
      </div>
    </div>
  );
}

export default App;
