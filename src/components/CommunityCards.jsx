import Card from './Card.jsx';

export default function CommunityCards({ cards }) {
  return (
    <div className="flex gap-2 items-center justify-center">
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className="transition-all duration-300">
          {cards[i] ? (
            <Card card={cards[i]} />
          ) : (
            <div className="w-16 h-22 rounded-lg border border-ftp-border/20 bg-black/10" />
          )}
        </div>
      ))}
    </div>
  );
}
