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
  const isPuzzleCompletedMessage = true;
  // const isPuzzleCompletedMessage = puzzleCompleted;

  return (
    <div
      className={`absolute bottom-4 left-1/2 z-20 -translate-x-1/2 rounded-lg bg-white px-6 py-4 shadow-lg transition-all duration-300`}
      style={{
        maxWidth: isPuzzleCompletedMessage ? '80%' : '600px',
        minWidth: isPuzzleCompletedMessage ? '600px' : 'auto',
      }}
    >
      <div className="flex gap-3">
        <div className="font-bold text-[#047EFD]">
          {isPuzzleCompletedMessage ? 'Поздравляем!' : 'Подсказка:'}
        </div>

        <div className="text-justify text-gray-800">{hintMessage}</div>

        {!isPuzzleCompletedMessage && (
          <div>
            <button
              className="flex size-5 cursor-pointer items-center justify-center rounded-md bg-blue-500 hover:bg-blue-600"
              onClick={onClose}
            >
              <span className="text-sm">✕</span>
            </button>
          </div>
        )}
      </div>

      {isPuzzleCompletedMessage && (
        <div className="mt-4 flex justify-center gap-4">
          <Button
            onClick={onReset}
            className="w-[157px] rounded-[6px] bg-blue-500 px-6 py-2 text-white"
          >
            Начать заново
          </Button>
          <Button
            onClick={onClose}
            className="w-[157px] rounded-[6px] border border-blue-500 bg-white px-6 py-2 text-blue-500"
          >
            Закрыть
          </Button>
        </div>
      )}
    </div>
  );
};
