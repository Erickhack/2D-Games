// widgets/Simulation/ui/Puzzle/PuzzleHintPanel.tsx
import React from 'react';

interface PuzzleHintPanelProps {
  showHintPanel: boolean;
  hintMessage: string;
  onClose: () => void;
}

export const PuzzleHintPanel: React.FC<PuzzleHintPanelProps> = ({
  showHintPanel,
  hintMessage,
  onClose
}) => {
  if (!showHintPanel) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
        <h3 className="text-xl font-bold text-blue-600 mb-4">Подсказка</h3>
        <p className="text-gray-700 mb-6">{hintMessage}</p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Понятно
          </button>
        </div>
      </div>
    </div>
  );
};