// widgets/Simulation/lib/hooks/usePuzzleHints.ts
import { useState, useCallback } from 'react';
import {
  HINT_DURATION,
  MESSAGES,
} from '../../model/constants/puzzle.constants';
import type { PuzzlePiece } from '../../model/types/puzzle.types';
import { getCompletionMessage } from '../utils/puzzleUtils';

interface UsePuzzleHintsProps {
  puzzlePieces: PuzzlePiece[];
  completedCount: number;
  elapsedTime: number;
  scrollToSlide?: (index: number) => void;
}

export const usePuzzleHints = ({
  puzzlePieces,
  completedCount,
  elapsedTime,
  scrollToSlide,
}: UsePuzzleHintsProps) => {
  // Состояния для подсказок
  const [hintsUsed, setHintsUsed] = useState<number>(0);
  const [activeHint, setActiveHint] = useState<number | null>(null);
  const [showHintPanel, setShowHintPanel] = useState<boolean>(false);
  const [hintMessage, setHintMessage] = useState<string>('');

  // Функция для показа подсказки
  const showHint = useCallback(() => {
    // Если уже есть активная подсказка, не показываем новую
    if (activeHint !== null) return;

    // Находим случайный неразмещенный кусочек
    const unplacedPieces = puzzlePieces.filter((piece) => !piece.placed);

    if (unplacedPieces.length === 0) return;

    const randomPiece =
      unplacedPieces[Math.floor(Math.random() * unplacedPieces.length)];

    // Устанавливаем активную подсказку
    setActiveHint(randomPiece.id);

    // Увеличиваем счетчик использованных подсказок
    setHintsUsed((prev) => prev + 1);

    // Показываем сообщение с подсказкой
    setHintMessage(randomPiece.inSwiper ? MESSAGES.HINT : MESSAGES.HINT_PLACED);

    setShowHintPanel(true);

    // Если кусочек в свайпере, прокручиваем к нему
    if (randomPiece.inSwiper && scrollToSlide) {
      const swiperIndex = puzzlePieces
        .filter((p) => p.inSwiper)
        .findIndex((p) => p.id === randomPiece.id);

      if (swiperIndex !== -1) {
        scrollToSlide(swiperIndex);
      }
    }

    // Автоматически скрываем подсказку через определенное время
    setTimeout(() => {
      setActiveHint(null);
      setShowHintPanel(false);
    }, HINT_DURATION);
  }, [activeHint, puzzlePieces, scrollToSlide]);

  // Функция для показа сообщения о завершении
  const showCompletionMessage = useCallback(() => {
    const message = getCompletionMessage(elapsedTime, hintsUsed);
    setHintMessage(message);
    setShowHintPanel(true);
  }, [elapsedTime, hintsUsed]);

  // Функция для сброса подсказок
  const resetHints = useCallback(() => {
    setHintsUsed(0);
    setActiveHint(null);
    setShowHintPanel(false);
    setHintMessage('');
  }, []);

  return {
    hintsUsed,
    activeHint,
    showHintPanel,
    hintMessage,
    showHint,
    showCompletionMessage,
    resetHints,
    setHintMessage,
    setShowHintPanel,
  };
};
