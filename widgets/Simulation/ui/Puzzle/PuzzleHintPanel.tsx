// widgets/Simulation/ui/Puzzle/PuzzleHintPanel.tsx
import React from 'react';
import Button from 'shared/buttons/ui/Button';

interface PuzzleHintPanelProps {
  showHintPanel: boolean;
  hintMessage: string;
  puzzleCompleted: boolean;
  onClose: () => void;
  onReset: () => void;
}

export const PuzzleHintPanel: React.FC<PuzzleHintPanelProps> = ({
  showHintPanel,
  hintMessage,
  puzzleCompleted,
  onClose,
  onReset,
}) => {
  if (!showHintPanel) return null;

  // Определяем стиль в зависимости от типа сообщения
  const isPuzzleCompletedMessage = puzzleCompleted;

  return (
    <div
      className={`absolute bottom-4 left-1/2 z-20 -translate-x-1/2 rounded-lg px-6 py-4 shadow-lg transition-all duration-300 ${
        isPuzzleCompletedMessage
          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
          : 'bg-white'
      }`}
      style={{
        maxWidth: isPuzzleCompletedMessage ? '80%' : '600px',
        minWidth: isPuzzleCompletedMessage ? '600px' : 'auto',
      }}
    >
      <div className="flex items-center gap-3">
        {isPuzzleCompletedMessage && <div className="mr-2 text-2xl">🎉</div>}

        <div
          className={`text-lg font-medium ${isPuzzleCompletedMessage ? 'text-white' : 'text-[#047EFD]'}`}
        >
          {isPuzzleCompletedMessage ? 'Поздравляем!' : 'Подсказка:'}
        </div>

        <div
          className={`text-base ${isPuzzleCompletedMessage ? 'text-white' : 'text-gray-800'}`}
        >
          {hintMessage}
        </div>

        {!isPuzzleCompletedMessage && (
          <button
            className="ml-4 rounded-full bg-gray-200 p-1 hover:bg-gray-300"
            onClick={onClose}
          >
            <span className="text-sm">✕</span>
          </button>
        )}
      </div>

      {isPuzzleCompletedMessage && (
        <div className="mt-4 flex justify-center gap-4">
          <Button
            onClick={onReset}
            className="rounded-[6px] bg-white px-6 py-2 text-blue-500 hover:bg-gray-100"
          >
            Начать заново
          </Button>
          <Button
            onClick={onClose}
            className="rounded-[6px] border border-white bg-transparent px-6 py-2 text-white hover:bg-white/10"
          >
            Закрыть
          </Button>
        </div>
      )}
    </div>
  );
};