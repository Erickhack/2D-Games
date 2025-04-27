// widgets/Simulation/lib/hooks/usePuzzleHints.ts
import { useCallback } from 'react';
import type { PuzzlePiece } from '../../model/types/puzzle.types';
import { HINT_DURATION } from '../../model/constants/puzzle.constants';

export function usePuzzleHints({
  state,
  setState,
  swiperPieces,
  scrollToSlide,
  formatTime,
}: {
  state: {
    puzzlePieces: PuzzlePiece[];
    activeHint: number | null;
    hintsUsed: number;
    completedCount: number;
    elapsedTime: number;
  };
  setState: (state: any) => void;
  swiperPieces: PuzzlePiece[];
  scrollToSlide: (index: number) => void;
  formatTime: (seconds: number) => string;
}) {
  const showHintForPiece = useCallback(
    (pieceId: number): void => {
      // Если подсказка уже активна для этого кусочка, скрываем ее
      if (state.activeHint === pieceId) {
        setState((prev: any) => ({
          ...prev,
          activeHint: null,
          showHintPanel: false,
        }));
        return;
      }

      // Активируем подсказку для выбранного кусочка
      setState((prev: any) => ({ ...prev, activeHint: pieceId }));

      // Находим кусочек
      const piece = state.puzzlePieces.find((p) => p.id === pieceId);

      if (piece) {
        // Если кусочек в слайдере, прокручиваем слайдер к нему
        if (piece.inSwiper) {
          // Находим индекс слайда с этим кусочком
          const slideIndex = swiperPieces.findIndex((p) => p.id === piece.id);
          if (slideIndex !== -1) {
            // Прокручиваем к этому слайду
            scrollToSlide(slideIndex);

            // Показываем сообщение подсказки
            setState((prev: any) => ({
              ...prev,
              hintMessage: `Найдите этот кусочек в слайдере справа и перетащите его на подсвеченное место`,
              showHintPanel: true,
            }));
          }
        } else {
          // Если кусочек уже на холсте
          setState((prev: any) => ({
            ...prev,
            hintMessage: `Перетащите выделенный кусочек на подсвеченное место`,
            showHintPanel: true,
          }));
        }

        // Увеличиваем счетчик использованных подсказок
        if (!piece.placed) {
          setState((prev: any) => ({ ...prev, hintsUsed: prev.hintsUsed + 1 }));
        }

        // Автоматически скрываем подсказку через заданное время
        setTimeout(() => {
          setState((prev: any) => ({
            ...prev,
            activeHint: prev.activeHint === pieceId ? null : prev.activeHint,
            showHintPanel: false,
          }));
        }, HINT_DURATION);
      }
    },
    [state.activeHint, state.puzzlePieces, swiperPieces, setState, scrollToSlide]
  );

  const showHint = useCallback(() => {
    // Находим первый неразмещенный кусочек
    const unplacedPiece = state.puzzlePieces.find((p) => !p.placed);
    if (unplacedPiece) {
      showHintForPiece(unplacedPiece.id);
    }
  }, [state.puzzlePieces, showHintForPiece]);

  const getCompletionMessage = useCallback(
    (timeSpent: number): string => {
      const timeFormatted = formatTime(timeSpent);

      let rating = '';
      if (state.hintsUsed === 0) {
        rating = 'Отлично! Вы справились без подсказок!';
      } else if (state.hintsUsed <= 3) {
        rating = 'Хороший результат! Вы использовали минимум подсказок.';
      } else {
        rating =
          'Неплохо! В следующий раз попробуйте использовать меньше подсказок.';
      }

      return `Пазл собран! Время: ${timeFormatted}. Использовано подсказок: ${state.hintsUsed}. ${rating}`;
    },
    [state.hintsUsed, formatTime]
  );

  const showCompletionMessage = useCallback(() => {
    const message = getCompletionMessage(state.elapsedTime);
    setState((prev: any) => ({
      ...prev,
      hintMessage: message,
      showHintPanel: true,
    }));
  }, [state.elapsedTime, setState, getCompletionMessage]);

  return {
    showHintForPiece,
    showHint,
    showCompletionMessage,
  };
}