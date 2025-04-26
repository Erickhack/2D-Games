// widgets/Simulation/lib/hooks/usePuzzleState.ts
import { useState, useEffect, useCallback } from 'react';
import type { PuzzlePiece } from '../../model/types/puzzle.types';
import { createInitialPieces } from '../utils/puzzleUtils';

export const usePuzzleState = () => {
  // Состояния для кусочков пазла
  const [puzzlePieces, setPuzzlePieces] = useState<PuzzlePiece[]>([]);
  const [completedCount, setCompletedCount] = useState<number>(0);
  const [puzzleCompleted, setPuzzleCompleted] = useState<boolean>(false);

  // Инициализация кусочков пазла
  useEffect(() => {
    setPuzzlePieces(createInitialPieces());
  }, []);

  // Обработчик размещения кусочка
  const handlePiecePlaced = useCallback((pieceId: number) => {
    // Обновляем состояние кусочка
    setPuzzlePieces((prevPieces) =>
      prevPieces.map((piece) =>
        piece.id === pieceId
          ? { ...piece, placed: true, inSwiper: false }
          : piece,
      ),
    );

    // Увеличиваем счетчик завершенных кусочков
    setCompletedCount((prev) => prev + 1);
  }, []);

  // Проверка завершения пазла
  useEffect(() => {
    if (
      completedCount === puzzlePieces.length &&
      puzzlePieces.length > 0 &&
      !puzzleCompleted
    ) {
      setPuzzleCompleted(true);
    }
  }, [completedCount, puzzlePieces.length, puzzleCompleted]);

  // Функция для сброса пазла
  const resetPuzzle = useCallback(() => {
    setPuzzlePieces(createInitialPieces());
    setCompletedCount(0);
    setPuzzleCompleted(false);
  }, []);

  // Получение кусочков для свайпера (неразмещенные и в свайпере)
  const getSwiperPieces = useCallback(() => {
    return puzzlePieces.filter((piece) => piece.inSwiper && !piece.placed);
  }, [puzzlePieces]);

  return {
    puzzlePieces,
    setPuzzlePieces,
    completedCount,
    setCompletedCount,
    puzzleCompleted,
    setPuzzleCompleted,
    handlePiecePlaced,
    resetPuzzle,
    getSwiperPieces,
  };
};
