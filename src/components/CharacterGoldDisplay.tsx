interface CharacterGoldDisplayProps {
  gold: number;
  className?: string;
}

export default function CharacterGoldDisplay({ gold, className = '' }: CharacterGoldDisplayProps) {
  return (
    <div className={`flex items-center gap-2 text-lg ${className}`}>
      <span className="text-gray-600 dark:text-gray-400">Your Gold:</span>
      <span className="font-semibold text-yellow-600 dark:text-yellow-400">
        {gold.toLocaleString()}
      </span>
    </div>
  );
}
