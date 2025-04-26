// widgets/Simulation/lib/hooks/usePuzzleDrag.ts
import { useState, useCallback } from 'react';
import {
  HINT_TOLERANCE,
  CANVAS_PADDING,
} from '../../model/constants/puzzle.constants';
import type {
  MousePosition,
  DragState,
  PuzzlePiece,
} from '../../model/types/puzzle.types';
import { isPieceNearTarget } from '../utils/puzzleUtils';

interface UsePuzzleDragProps {
  puzzlePieces: PuzzlePiece[];
  setPuzzlePieces: React.Dispatch<React.SetStateAction<PuzzlePiece[]>>;
  updateBodyPosition: (pieceId: number, x: number, y: number) => void;
  onPiecePlaced: (pieceId: number) => void;
}

export const usePuzzleDrag = ({
  puzzlePieces,
  setPuzzlePieces,
  updateBodyPosition,
  onPiecePlaced,
}: UsePuzzleDragProps) => {
  // Состояние для перетаскивания
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedPieceId: null,
    dragStartX: 0,
    dragStartY: 0,
  });

  // Состояние для позиции мыши
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
  });

  // Обработчик начала перетаскивания
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = e.currentTarget;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Ищем кусочек под курсором (в обратном порядке, чтобы верхние кусочки имели приоритет)
      for (let i = puzzlePieces.length - 1; i >= 0; i--) {
        const piece = puzzlePieces[i];

        // Пропускаем уже размещенные кусочки
        if (piece.placed) continue;

        // Проверяем, находится ли курсор над кусочком
        if (
          x >= piece.x &&
          x <= piece.x + piece.width &&
          y >= piece.y &&
          y <= piece.y + piece.height
        ) {
          // Начинаем перетаскивание
          setDragState({
            isDragging: true,
            draggedPieceId: piece.id,
            dragStartX: x - piece.x,
            dragStartY: y - piece.y,
          });

          // Перемещаем выбранный кусочек в конец массива, чтобы он отрисовывался поверх других
          setPuzzlePieces((prevPieces) => {
            const newPieces = [...prevPieces];
            const index = newPieces.findIndex((p) => p.id === piece.id);
            const [draggedPiece] = newPieces.splice(index, 1);
            newPieces.push({
              ...draggedPiece,
              inSwiper: false, // Кусочек больше не в свайпере
            });
            return newPieces;
          });

          break;
        }
      }
    },
    [puzzlePieces, setPuzzlePieces],
  );

  // Обработчик перемещения мыши
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const canvas = e.currentTarget as HTMLElement;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setMousePosition({ x, y });

      // Если перетаскиваем кусочек
      if (dragState.isDragging && dragState.draggedPieceId !== null) {
        // Обновляем позицию кусочка
        const newX = x - dragState.dragStartX;
        const newY = y - dragState.dragStartY;

        setPuzzlePieces((prevPieces) =>
          prevPieces.map((piece) =>
            piece.id === dragState.draggedPieceId
              ? { ...piece, x: newX, y: newY }
              : piece,
          ),
        );

        // Обновляем позицию физического тела
        updateBodyPosition(dragState.draggedPieceId, newX, newY);
      }
    },
    [dragState, setPuzzlePieces, updateBodyPosition],
  );

  // Обработчик окончания перетаскивания
  const handleMouseUp = useCallback(() => {
    if (dragState.isDragging && dragState.draggedPieceId !== null) {
      const draggedPiece = puzzlePieces.find(
        (piece) => piece.id === dragState.draggedPieceId,
      );

      if (draggedPiece) {
        // Проверяем, находится ли кусочек рядом с целевой позицией
        if (isPieceNearTarget(draggedPiece, HINT_TOLERANCE)) {
          // Размещаем кусочек на целевой позиции
          setPuzzlePieces((prevPieces) =>
            prevPieces.map((piece) =>
              piece.id === draggedPiece.id
                ? {
                    ...piece,
                    x: piece.targetX,
                    y: piece.targetY,
                    placed: true,
                  }
                : piece,
            ),
          );

          // Обновляем позицию физического тела
          updateBodyPosition(
            draggedPiece.id,
            draggedPiece.targetX,
            draggedPiece.targetY,
          );

          // Вызываем колбэк размещения кусочка
          onPiecePlaced(draggedPiece.id);
        }
      }
    }

    // Сбрасываем состояние перетаскивания
    setDragState({
      isDragging: false,
      draggedPieceId: null,
      dragStartX: 0,
      dragStartY: 0,
    });
  }, [
    dragState,
    puzzlePieces,
    setPuzzlePieces,
    updateBodyPosition,
    onPiecePlaced,
  ]);

  return {
    dragState,
    mousePosition,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
};
