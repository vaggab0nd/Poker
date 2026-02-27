import { useEffect, useRef } from 'react';

const typeColors = {
  system: 'text-yellow-400',
  action: 'text-gray-300',
  info: 'text-cyan-400',
  deal: 'text-green-400',
  board: 'text-fuchsia-400',
  win: 'text-amber-300 font-bold',
};

export default function LogWindow({ log }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [log]);

  return (
    <div className="flex flex-col h-full bg-ftp-darker border border-ftp-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-3 py-2 bg-gradient-to-r from-ftp-panel to-ftp-panel-light border-b border-ftp-border">
        <span className="text-xs font-bold uppercase tracking-widest text-ftp-text-dim">
          Hand History
        </span>
      </div>

      {/* Log entries */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-3 log-scroll"
        style={{ maxHeight: '100%' }}
      >
        <div className="flex flex-col gap-0.5">
          {log.map((entry, i) => (
            <div
              key={i}
              className={`text-xs font-mono leading-relaxed ${typeColors[entry.type] || 'text-gray-400'}`}
            >
              {entry.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
