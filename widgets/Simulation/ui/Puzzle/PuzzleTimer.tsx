// widgets/Simulation/ui/Puzzle/PuzzleTimer.tsx
import React from 'react';
import { formatTime } from '../../lib/utils/puzzleUtils';

interface PuzzleTimerProps {
  timerStarted: boolean;
  elapsedTime: number;
  startTimer: () => void;
}

export const PuzzleTimer: React.FC<PuzzleTimerProps> = ({
  timerStarted,
  elapsedTime,
  startTimer
}) => {
  return (
    <div className="absolute top-6 left-50 flex items-center bg-white rounded-md px-4 py-1.5 shadow">
      <span className="text-xl text-blue-600">
        Время: {timerStarted ? formatTime(elapsedTime) : "00:00"}
      </span>
      
      {!timerStarted && (
        <button
          onClick={startTimer}
          className="ml-2 text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
        >
          Старт
        </button>
      )}
    </div>
  );
};