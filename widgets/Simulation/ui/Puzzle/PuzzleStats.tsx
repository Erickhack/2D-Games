// widgets/Simulation/ui/Puzzle/PuzzleStats.tsx
import React from 'react';
import Button from 'shared/buttons/ui/Button';

interface PuzzleStatsProps {
  completedCount: number;
  totalPieces: number;
  onShowHint: () => void;
}

export const PuzzleStats: React.FC<PuzzleStatsProps> = ({
  completedCount,
  totalPieces,
  onShowHint,
}) => {
  return (
    <>
      <div className="absolute top-6 left-8 rounded-[6px] bg-white px-4 py-1.5">
        <span className="text-[20px]/[130%] text-[#047EFD]">
          Собрано: {completedCount}/{totalPieces}
        </span>
      </div>

      <div className="absolute top-6 right-[230px] z-10">
        <Button
          onClick={onShowHint}
          className="rounded-[6px] bg-white px-4 py-1.5 hover:bg-gray-100"
        >
          <span className="text-[16px]/[130%] text-[#047EFD]">Подсказка</span>
        </Button>
      </div>
    </>
  );
};