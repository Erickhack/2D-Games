// widgets/Simulation/ui/Puzzle/PuzzleStats.tsx
import React from 'react';

interface PuzzleStatsProps {
  completedCount: number;
  totalPieces: number;
  hintsUsed: number;
  onShowHint: () => void;
  onReset: () => void;
}

export const PuzzleStats: React.FC<PuzzleStatsProps> = ({
  completedCount,
  totalPieces,
  hintsUsed,
  onShowHint,
  onReset
}) => {
  return (
    <div className="flex flex-col gap-4 absolute top-6 right-6">
      <div className="bg-white rounded-md px-4 py-1.5 shadow">
        <span className="text-xl text-blue-600">
          Прогресс: {completedCount}/{totalPieces}
        </span>
      </div>
      
      <div className="bg-white rounded-md px-4 py-1.5 shadow">
        <span className="text-xl text-blue-600">
          Подсказки: {hintsUsed}
        </span>
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={onShowHint}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Подсказка
        </button>
        
        <button
          onClick={onReset}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
        >
          Сбросить
        </button>
      </div>
    </div>
  );
};