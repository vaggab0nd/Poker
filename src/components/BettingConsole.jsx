import { getAvailableActions, getCallAmount, getMinRaise, getMaxRaise } from '../engine/gameState.js';

export default function BettingConsole({ state, onAction }) {
  const actions = getAvailableActions(state);
  const callAmount = getCallAmount(state);
  const minRaise = getMinRaise(state);
  const maxRaise = getMaxRaise(state);
  const player = state.players[0];

  if (actions.length === 0) return null;

  const canCheck = actions.includes('check');
  const canCall = actions.includes('call');
  const canRaise = actions.includes('raise');
  const canFold = actions.includes('fold');

  const handleRaise = () => {
    const val = Math.min(Math.max(state.betInputValue, minRaise), maxRaise);
    onAction('raise', val);
  };

  const handleSliderChange = (e) => {
    onAction('setBetInput', parseInt(e.target.value));
  };

  const presetBets = [
    { label: '½ Pot', value: Math.max(minRaise, Math.floor(state.pot / 2) + state.currentBetToMatch) },
    { label: '¾ Pot', value: Math.max(minRaise, Math.floor(state.pot * 0.75) + state.currentBetToMatch) },
    { label: 'Pot', value: Math.max(minRaise, state.pot + state.currentBetToMatch) },
  ].filter(p => p.value <= maxRaise);

  return (
    <div className="bg-gradient-to-t from-ftp-darker via-ftp-panel to-ftp-panel-light border-t border-ftp-border p-4">
      <div className="max-w-2xl mx-auto flex flex-col gap-3">
        {/* Raise slider and presets */}
        {canRaise && (
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              {presetBets.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => onAction('setBetInput', preset.value)}
                  className="px-2.5 py-1 text-xs rounded bg-ftp-border/50 hover:bg-ftp-border
                    text-ftp-text-dim hover:text-ftp-text transition-colors border border-ftp-border/50"
                >
                  {preset.label}
                </button>
              ))}
            </div>
            <input
              type="range"
              min={minRaise}
              max={maxRaise}
              value={Math.min(Math.max(state.betInputValue, minRaise), maxRaise)}
              onChange={handleSliderChange}
              className="flex-1 h-2 rounded-lg appearance-none cursor-pointer
                bg-ftp-border accent-ftp-gold"
            />
            <span className="text-sm font-mono text-ftp-gold min-w-[60px] text-right">
              ${Math.min(Math.max(state.betInputValue, minRaise), maxRaise)}
            </span>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2 justify-center">
          {canFold && (
            <button
              onClick={() => onAction('fold')}
              className="px-6 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wide
                bg-gradient-to-b from-red-700 to-red-900 hover:from-red-600 hover:to-red-800
                text-white shadow-lg shadow-red-900/40
                border border-red-600/50 transition-all
                active:scale-95"
            >
              Fold
            </button>
          )}

          {canCheck && (
            <button
              onClick={() => onAction('check')}
              className="px-6 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wide
                bg-gradient-to-b from-green-700 to-green-900 hover:from-green-600 hover:to-green-800
                text-white shadow-lg shadow-green-900/40
                border border-green-600/50 transition-all
                active:scale-95"
            >
              Check
            </button>
          )}

          {canCall && (
            <button
              onClick={() => onAction('call')}
              className="px-6 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wide
                bg-gradient-to-b from-green-700 to-green-900 hover:from-green-600 hover:to-green-800
                text-white shadow-lg shadow-green-900/40
                border border-green-600/50 transition-all
                active:scale-95"
            >
              Call ${callAmount}
            </button>
          )}

          {canRaise && (
            <button
              onClick={handleRaise}
              className="px-6 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wide
                bg-gradient-to-b from-amber-600 to-amber-800 hover:from-amber-500 hover:to-amber-700
                text-white shadow-lg shadow-amber-900/40
                border border-amber-500/50 transition-all
                active:scale-95"
            >
              {state.currentBetToMatch === 0 ? 'Bet' : 'Raise to'} ${Math.min(Math.max(state.betInputValue, minRaise), maxRaise)}
            </button>
          )}

          <button
            onClick={() => onAction('allin')}
            className="px-6 py-2.5 rounded-lg font-bold text-sm uppercase tracking-wide
              bg-gradient-to-b from-fuchsia-700 to-fuchsia-900 hover:from-fuchsia-600 hover:to-fuchsia-800
              text-white shadow-lg shadow-fuchsia-900/40
              border border-fuchsia-600/50 transition-all
              active:scale-95"
          >
            All-In ${player.chips}
          </button>
        </div>
      </div>
    </div>
  );
}
