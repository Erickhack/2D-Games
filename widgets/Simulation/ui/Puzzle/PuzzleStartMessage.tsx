// widgets/Simulation/ui/Puzzle/PuzzleStartMessage.tsx
import React from 'react';
import { MESSAGES } from '../../model/constants/puzzle.constants';

interface PuzzleStartMessageProps {
  timerStarted: boolean;
  completedCount: number;
  startTimer: () => void;
}

export const PuzzleStartMessage: React.FC<PuzzleStartMessageProps> = ({
  timerStarted,
  completedCount,
  startTimer
}) => {
  // Не показываем сообщение, если таймер запущен или уже размещен хотя бы один кусочек
  if (timerStarted || completedCount > 0) return null;
  
  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 bg-white bg-opacity-90 rounded-lg p-8 text-center shadow-lg">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">Готовы начать?</h2>
      <p className="text-lg text-gray-700 mb-6">
        {MESSAGES.START}
      </p>
      <div className="flex justify-center">
        <button
          onClick={startTimer}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Запустить таймер сейчас
        </button>
      </div>
    </div>
  );
};