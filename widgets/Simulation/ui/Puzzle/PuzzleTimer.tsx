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
    <div className="absolute top-6 left-1/2 transform -translate-x-1/2 flex items-center bg-white rounded-md py-1.5 px-4 shadow">
      <span className="text-xl text-blue-500">
        Время: {timerStarted ? formatTime(elapsedTime) : "00:00"}
      </span>
      
      {!timerStarted && (
        <button
          onClick={startTimer}
          className="ml-2 text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition-colors duration-200"
        >
          Старт
        </button>
      )}
    </div>
  );
};